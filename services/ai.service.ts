
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
   * Encaminha a requisição para o nosso backend seguro (Vercel Function)
   */
  async generatePost(prompt: string, config: { provider?: string; model: string; temperature: number; baseUrl?: string }): Promise<GeneratedPost> {
    try {
      const fullPrompt = `Gere um artigo de blog profissional focado em SEO para a academia Holy Spirit. Tema: ${prompt}.`;

      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: fullPrompt,
          config: {
            model: config.model,
            temperature: config.temperature,
            baseUrl: config.baseUrl
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro desconhecido no servidor de IA.');
      }

      // Se o dado já for um objeto (OpenAI ou Gemini parseado pelo handler)
      if (typeof data === 'object' && data !== null && data.title) {
        return data as GeneratedPost;
      }

      // Se for uma string JSON (Gemini às vezes retorna assim)
      try {
        return JSON.parse(data);
      } catch {
        throw new Error("A IA retornou um formato inválido. Tente novamente.");
      }
    } catch (error: any) {
      console.error("AI Service Error:", error);
      throw new Error(error.message || "Erro na conexão com o Templo da IA.");
    }
  },

  /**
   * Testa a integração chamando o backend
   */
  async testIntegration(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: "Responda apenas com a palavra: OK",
          config: { model: '', temperature: 0 }
        })
      });

      if (response.ok) {
        return { success: true, message: "Conexão estabelecida." };
      }
      
      const err = await response.json();
      return { success: false, message: err.error || "Erro de resposta." };
    } catch (error: any) {
      return { success: false, message: "Erro de rede." };
    }
  }
};
