
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
   * Dispara o fluxo de automação no n8n via nosso proxy de API
   */
  async generatePost(prompt: string, config: { category: string }): Promise<any> {
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt,
          category: config.category,
          source: 'holy_spirit_admin'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro na comunicação com o n8n.');
      }

      return data;
    } catch (error: any) {
      console.error("AI Service Webhook Error:", error);
      throw new Error(error.message || "Erro na conexão com a central de automação.");
    }
  },

  /**
   * Verifica se o endpoint de automação está respondendo
   */
  async testIntegration(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: "PING TEST",
          category: "System",
          source: "health_check"
        })
      });

      if (response.ok) {
        return { success: true, message: "Webhook n8n Online." };
      }
      
      const err = await response.json();
      return { success: false, message: err.error || "Webhook n8n Offline." };
    } catch (error: any) {
      return { success: false, message: "Erro de rede com n8n." };
    }
  }
};
