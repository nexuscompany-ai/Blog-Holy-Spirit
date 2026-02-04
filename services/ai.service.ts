
export const aiService = {
  /**
   * Dispara o fluxo de automação no n8n via proxy seguro
   */
  async generatePost(prompt: string, config: { category: string }): Promise<{ status: string; message: string }> {
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt,
          category: config.category,
          source: 'holy_spirit_admin'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Se houver detalhes, mostramos o erro específico
        const errorMsg = data.details ? `${data.error} (${data.details})` : (data.error || 'Erro na central n8n');
        throw new Error(errorMsg);
      }

      return data;
    } catch (error: any) {
      console.error("AI Service Error:", error);
      // Mantemos a mensagem original do erro para o usuário saber o que aconteceu
      throw new Error(error.message || "Erro de rede ao conectar com a automação.");
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

      const data = await response.json();
      return { 
        success: response.ok, 
        message: response.ok ? "Conexão n8n OK" : (data.details || "n8n Offline") 
      };
    } catch (error: any) {
      return { success: false, message: "Erro de Conexão Local" };
    }
  }
};
