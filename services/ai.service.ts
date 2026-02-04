
export const aiService = {
  /**
   * Dispara o fluxo de automação no n8n via proxy seguro
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
        throw new Error(data.error || 'Erro na central de comando n8n.');
      }

      return data;
    } catch (error: any) {
      console.error("AI Service Error:", error);
      throw new Error(error.message || "Erro de conexão com o servidor de automação.");
    }
  },

  /**
   * Valida se a rota de automação está operacional
   */
  async testIntegration(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: "PING",
          category: "System",
          source: "health_check"
        })
      });

      return { 
        success: response.ok, 
        message: response.ok ? "Conexão n8n Estabelecida" : "n8n não respondeu" 
      };
    } catch (error: any) {
      return { success: false, message: "Erro de rede com n8n" };
    }
  }
};
