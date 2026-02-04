
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
            temperature: config.temperature
          }
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Erro na comunicação com o servidor de IA.');
      }

      const rawData = await response.json();
      // O backend retorna uma string JSON que precisa ser parseada
      return typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
    } catch (error: any) {
      console.error("AI Service Error:", error);
      throw new Error("Falha ao gerar conteúdo: " + (error.message || "Verifique as chaves no painel da Vercel."));
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
          config: { model: 'gemini-3-flash-preview', temperature: 0 }
        })
      });

      if (response.ok) {
        return { success: true, message: "Conexão com o Backend de IA estabelecida com sucesso." };
      }
      
      const err = await response.json();
      return { success: false, message: err.error || "Erro de resposta do servidor." };
    } catch (error: any) {
      return { success: false, message: "Erro de rede: Certifique-se de que as chaves estão configuradas na Vercel." };
    }
  }
};
