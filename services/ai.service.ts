
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
   * Obtém a chave de forma segura
   */
  getApiKey(): string {
    try {
      // @ts-ignore
      return process.env.API_KEY || '';
    } catch {
      return '';
    }
  },

  /**
   * Detecta qual provedor usar com base na chave.
   */
  getProvider(key: string) {
    if (!key) return 'unknown';
    if (key.startsWith('sk-')) return 'openai';
    if (key.startsWith('AIza')) return 'gemini';
    return 'custom';
  },

  /**
   * Traduz erros de qualquer API.
   */
  handleApiError(error: any): string {
    const message = error?.message || String(error);
    if (message.includes("429") || message.includes("quota") || message.includes("limit")) {
      return "Cota Excedida: O provedor de IA limitou suas requisições. Se estiver usando o plano gratuito do Gemini, aguarde 60 segundos.";
    }
    if (message.includes("401") || message.includes("403") || message.includes("key") || message.includes("API Key")) {
      return "Erro de Autenticação: A chave de API não foi encontrada ou é inválida para este provedor no ambiente de deploy.";
    }
    return "Erro na IA: " + message;
  },

  /**
   * Chamada genérica para provedores compatíveis com OpenAI.
   */
  async callOpenAI(prompt: string, config: { model: string; temperature: number; baseUrl?: string }): Promise<string> {
    const apiKey = this.getApiKey();
    if (!apiKey) throw new Error("API_KEY não configurada no ambiente.");

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
          { role: 'system', content: 'Você é um Estrategista de SEO e Redator Fitness para a academia Holy Spirit. Retorne sempre JSON puro.' },
          { role: 'user', content: prompt }
        ],
        temperature: config.temperature,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'Falha na comunicação com o Provedor.');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  },

  /**
   * Chamada para Google Gemini.
   */
  async callGemini(prompt: string, config: { model: string; temperature: number }): Promise<string> {
    const apiKey = this.getApiKey();
    if (!apiKey) throw new Error("API_KEY não configurada no ambiente.");
    
    // IMPORTANTE: Só instanciamos o SDK se realmente formos usar o Gemini
    // para evitar o erro de validação de chave do construtor no navegador.
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: config.model || 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: `Você é um Estrategista de SEO e Redator Fitness para a academia Holy Spirit. Retorne OBRIGATORIAMENTE JSON puro.`,
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
      const apiKey = this.getApiKey();
      if (!apiKey) return { success: false, message: "Variável API_KEY não encontrada no sistema." };

      const provider = this.getProvider(apiKey);
      let resultText = "";

      if (provider === 'openai') {
        resultText = await this.callOpenAI("Responda em JSON: {\"status\": \"OpenAI OK\"}", { model: 'gpt-3.5-turbo', temperature: 0 });
      } else if (provider === 'gemini') {
        resultText = await this.callGemini("Responda apenas: Gemini Ativo.", { model: 'gemini-3-flash-preview', temperature: 0 });
      } else {
        return { success: false, message: "Provedor desconhecido para esta chave." };
      }

      return { success: true, message: "Conexão Estabelecida com " + provider.toUpperCase() };
    } catch (error: any) {
      return { success: false, message: this.handleApiError(error) };
    }
  },

  /**
   * Gera um post completo respeitando as configurações.
   */
  async generatePost(prompt: string, config: { provider?: string; model: string; temperature: number; baseUrl?: string }): Promise<GeneratedPost> {
    try {
      const apiKey = this.getApiKey();
      const provider = config.provider || this.getProvider(apiKey);
      
      const fullPrompt = `Gere um artigo de blog profissional focado em SEO para a academia Holy Spirit. Tema: ${prompt}. Retorne um JSON com: title, excerpt, content, category, seo_keywords (array), meta_description, slug_suggestion.`;

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
