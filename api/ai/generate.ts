
import { GoogleGenAI, Type } from "@google/genai";

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { prompt, config: userConfig } = await req.json();
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API_KEY não configurada no servidor Vercel.' }), { status: 500 });
    }

    const isOpenAI = apiKey.startsWith('sk-');

    if (isOpenAI) {
      // Implementação OpenAI segura no Backend
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: userConfig?.model || 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'Você é um estrategista de SEO e Redator Fitness para a academia Holy Spirit. Retorne sempre JSON puro.' },
            { role: 'user', content: prompt }
          ],
          temperature: userConfig?.temperature || 0.7,
          response_format: { type: "json_object" }
        })
      });

      const data = await response.json();
      return new Response(JSON.stringify(data.choices[0].message.content), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      // Implementação Gemini segura no Backend
      const ai = new GoogleGenAI({ apiKey });
      const modelName = userConfig?.model || 'gemini-3-flash-preview';
      
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          systemInstruction: "Você é um Estrategista de SEO e Redator Fitness para a academia Holy Spirit. Retorne OBRIGATORIAMENTE JSON puro.",
          responseMimeType: "application/json",
          temperature: userConfig?.temperature || 0.7,
          responseSchema: {
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
          }
        }
      });

      return new Response(JSON.stringify(response.text), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
