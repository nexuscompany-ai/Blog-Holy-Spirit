
import { GoogleGenAI, Type } from "@google/genai";

export interface GeneratedPost {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  seo_keywords: string[];
  meta_description: string;
  slug_suggestion: string;
}

export const aiService = {
  /**
   * Detecta qual provedor usar com base na chave ou configuração.
   */
  getProvider(key: string) {
    if (key.startsWith('sk-')) return 'openai';
    if (key.startsWith('AIza')) return 'gemini';
    return 'unknown';
  },

  /**
   * Traduz erros de qualquer API.
   */
  handleApiError(error: any): string {
    const message = error?.message || String(error);
    if (message.includes("429") || message.includes("quota") || message.includes("limit")) {
      return "Cota Excedida: O provedor de IA limitou suas requisições. Tente trocar de chave ou aguarde um momento.";
    }
    if (message.includes("401") || message.includes("403") || message.includes("key")) {
      return "Erro de Autenticação: Verifique se sua chave de API é válida para o provedor selecionado.";
    }
    return "Erro na IA: " + message;
  },

  /**
   * Chamada genérica para provedores compatíveis com OpenAI (ChatGPT, etc).
   */
  async callOpenAI(prompt: string, config: { model: string; temperature: number; baseUrl?: string }): Promise<string> {
    const apiKey = process.env.API_KEY;
    const url = config.baseUrl || 'https://api.openai.com/v1/chat/completions';
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: config.model || 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Você é um Estrategista de SEO e Redator Fitness. Retorne sempre JSON puro conforme solicitado.' },
          { role: 'user', content: prompt }
        ],
        temperature: config.temperature,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'Falha na comunicação com OpenAI');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  },

  /**
   * Chamada para Google Gemini.
   */
  async callGemini(prompt: string, config: { model: string; temperature: number }): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: config.model || 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: `Você é um Estrategista de SEO e Redator Fitness. Retorne OBRIGATORIAMENTE JSON puro.`,
        responseMimeType: "application/json",
        temperature: config.temperature,
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
    return response.text;
  },

  /**
   * Testa a integração atual.
   */
  async testIntegration(): Promise<{ success: boolean; message: string }> {
    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey || apiKey.length < 5) return { success: false, message: "Nenhuma chave configurada." };

      const provider = this.getProvider(apiKey);
      let resultText = "";

      if (provider === 'openai') {
        resultText = await this.callOpenAI("Responda apenas: OpenAI Ativo.", { model: 'gpt-3.5-turbo', temperature: 0 });
      } else {
        resultText = await this.callGemini("Responda apenas: Gemini Ativo.", { model: 'gemini-3-flash-preview', temperature: 0 });
      }

      return { success: true, message: "Conexão OK: " + (resultText.length > 50 ? "Resposta Recebida" : resultText) };
    } catch (error: any) {
      return { success: false, message: this.handleApiError(error) };
    }
  },

  /**
   * Gera um post completo.
   */
  async generatePost(prompt: string, config: { provider?: string; model: string; temperature: number; baseUrl?: string }): Promise<GeneratedPost> {
    try {
      const apiKey = process.env.API_KEY || '';
      const provider = config.provider || this.getProvider(apiKey);
      const fullPrompt = `Gere um artigo de blog profissional para uma academia focada em performance (Holy Spirit) baseado em: ${prompt}. O formato de saída deve ser um objeto JSON com as chaves: title, excerpt, content, category, seo_keywords (array), meta_description, slug_suggestion.`;

      let rawResponse = "";
      if (provider === 'openai') {
        rawResponse = await this.callOpenAI(fullPrompt, config);
      } else {
        rawResponse = await this.callGemini(fullPrompt, config);
      }

      return JSON.parse(rawResponse || '{}');
    } catch (error: any) {
      throw new Error(this.handleApiError(error));
    }
  }
};
