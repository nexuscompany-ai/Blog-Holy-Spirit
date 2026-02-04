
export const aiService = {
  /**
   * Dispara o fluxo de automação no n8n via nosso proxy de API
   */
  async generatePost(prompt: string, config: { category: string }): Promise<{ status: string; message: string }> {
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
        throw new Error(data.error || 'Erro ao acionar automação.');
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
        return { success: true, message: "n8n Cloud Sincronizado" };
      }
      
      return { success: false, message: "n8n não respondeu" };
    } catch (error: any) {
      return { success: false, message: "Erro de rede com n8n" };
    }
  }
};
