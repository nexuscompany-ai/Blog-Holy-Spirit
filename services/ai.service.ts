
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
   * Inicializa o cliente GenAI usando a chave de ambiente segura.
   */
  getClient() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  },

  /**
   * Testa a conectividade com a TEST API BLOG.
   */
  async testIntegration(): Promise<{ success: boolean; message: string }> {
    try {
      if (!process.env.API_KEY) {
        return { success: false, message: "Chave de integração ausente no servidor." };
      }
      const ai = this.getClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "responder apenas 'ok'",
      });
      return { success: true, message: "Integração TEST API BLOG ativa e respondendo." };
    } catch (error: any) {
      return { success: false, message: error.message || "Erro desconhecido na integração." };
    }
  },

  /**
   * Gera um post completo com metadados de SEO.
   */
  async generatePost(prompt: string, config: { model: string; temperature: number }): Promise<GeneratedPost> {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: config.model || 'gemini-3-pro-preview',
      contents: `Gere um artigo de blog profissional para uma academia cristã/performance (Holy Spirit) baseado em: ${prompt}`,
      config: {
        systemInstruction: `Você é um Estrategista de SEO e Redator Fitness.
        O Templo (Holy Spirit) foca em excelência física e fé.
        Gere um conteúdo rico, estruturado com H1, H2 e H3.
        Retorne OBRIGATORIAMENTE em JSON seguindo o esquema definido.`,
        responseMimeType: "application/json",
        temperature: config.temperature,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Título otimizado para SEO (H1)" },
            excerpt: { type: Type.STRING, description: "Resumo chamativo para o card" },
            content: { type: Type.STRING, description: "Conteúdo completo com Markdown" },
            category: { type: Type.STRING, description: "Uma destas: Musculação, Nutrição, Espiritualidade, Lifestyle" },
            seo_keywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista de 5 palavras-chave LSI" },
            meta_description: { type: Type.STRING, description: "Meta description de max 160 caracteres" },
            slug_suggestion: { type: Type.STRING, description: "URL amigável (ex: como-ganhar-massa)" }
          },
          required: ["title", "excerpt", "content", "category", "seo_keywords", "meta_description", "slug_suggestion"]
        }
      }
    });

    try {
      return JSON.parse(response.text || '{}');
    } catch (e) {
      throw new Error("Falha ao processar resposta da IA.");
    }
  }
};
