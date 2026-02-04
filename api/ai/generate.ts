
import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const body = await req.json();
    const { prompt, config: userConfig } = body;
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ 
        error: 'Chave de API não encontrada. Certifique-se de que a variável "API_KEY" está configurada nas Environment Variables da Vercel.' 
      }), { status: 500 });
    }

    const isOpenAI = apiKey.startsWith('sk-');
    const isBlogRequest = prompt.includes("Gere um artigo");

    if (isOpenAI) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: userConfig?.model || 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'Você é um estrategista de SEO Fitness. Se o usuário pedir um post, retorne JSON. Se for um teste, responda normalmente.' },
            { role: 'user', content: prompt }
          ],
          temperature: userConfig?.temperature || 0.7,
          ...(isBlogRequest ? { response_format: { type: "json_object" } } : {})
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Erro na OpenAI');
      
      return new Response(JSON.stringify(data.choices[0].message.content), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      // Configuração para Google Gemini
      const ai = new GoogleGenAI({ apiKey });
      const modelName = userConfig?.model || 'gemini-3-flash-preview';
      
      const generationConfig: any = {
        temperature: userConfig?.temperature || 0.7,
      };

      // Só aplica o Schema se for um pedido de blog para não quebrar o teste de conexão
      if (isBlogRequest) {
        generationConfig.responseMimeType = "application/json";
        generationConfig.responseSchema = {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            excerpt: { type: Type.STRING },
            content: { type: Type.STRING },
            category: { type: Type.STRING },
            seo_keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            meta_description: { type: Type.STRING },
            slug_suggestion: { type: Type.STRING }
          },
          required: ["title", "excerpt", "content", "category", "seo_keywords", "meta_description", "slug_suggestion"]
        };
      }

      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          ...generationConfig,
          systemInstruction: "Você é um especialista em fitness para a academia Holy Spirit. Se solicitado um post, use o formato JSON de blog."
        },
      });

      return new Response(JSON.stringify(response.text), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error: any) {
    console.error("Erro no Handler de IA:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
      detail: "Verifique se a API_KEY é válida para o provedor escolhido."
    }), { status: 500 });
  }
}
