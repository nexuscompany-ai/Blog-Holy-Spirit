
import { GoogleGenAI, Type } from "@google/genai";

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  // CORS Headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { prompt, config: userConfig } = body;
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      console.error("API_KEY MISSING");
      return new Response(JSON.stringify({ 
        error: 'Variável API_KEY não configurada na Vercel.' 
      }), { status: 500, headers });
    }

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt vazio' }), { status: 400, headers });
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
            { role: 'system', content: 'Você é um estrategista de SEO Fitness para a Holy Spirit.' },
            { role: 'user', content: prompt }
          ],
          temperature: userConfig?.temperature || 0.7,
          ...(isBlogRequest ? { response_format: { type: "json_object" } } : {})
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Erro na OpenAI');
      
      const content = data.choices[0].message.content;
      return new Response(JSON.stringify(content), { status: 200, headers });
    } else {
      const ai = new GoogleGenAI({ apiKey });
      const modelName = userConfig?.model || 'gemini-3-flash-preview';
      
      const generationConfig: any = {
        temperature: userConfig?.temperature || 0.7,
      };

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
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          ...generationConfig,
          systemInstruction: "Você é um especialista em fitness para a academia Holy Spirit. Responda sempre no idioma do prompt."
        },
      });

      if (!response.text) {
        throw new Error("A IA retornou uma resposta vazia.");
      }

      return new Response(JSON.stringify(response.text), { status: 200, headers });
    }
  } catch (error: any) {
    console.error("AI ROUTE ERROR:", error.message);
    return new Response(JSON.stringify({ 
      error: error.message || 'Erro interno no processamento da IA',
      status: 'error'
    }), { status: 500, headers });
  }
}
