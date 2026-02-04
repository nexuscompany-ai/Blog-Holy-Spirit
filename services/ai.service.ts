
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
   * Inicializa o cliente GenAI.
   * A API_KEY deve estar disponível via process.env.API_KEY.
   */
  getClient() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  },

  /**
   * Testa a conectividade com a TEST API BLOG.
   */
  async testIntegration(): Promise<{ success: boolean; message: string }> {
    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey || apiKey.includes('sua_chave')) {
        return { success: false, message: "Chave não configurada. Certifique-se de que o arquivo se chama '.env' (não .env.example) e reinicie o servidor." };
      }

      const ai = this.getClient();
      // Teste simples de geração
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Diga 'Conexão OK'",
      });
      
      if (response.text) {
        return { success: true, message: "Integração TEST API BLOG ativa: " + response.text };
      }
      return { success: false, message: "A API respondeu, mas sem conteúdo." };
    } catch (error: any) {
      console.error("AI Service Error:", error);
      return { success: false, message: "Erro na API: " + (error.message || "Verifique se a chave é válida e tem permissões.") };
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

    return JSON.parse(response.text || '{}');
  }
};
