
export const aiService = {
  /**
   * Aciona a automação no n8n através do nosso proxy seguro
   */
  async generatePost(prompt: string, config: { category: string }): Promise<any> {
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt,
          category: config.category,
          source: 'holy_spirit_admin_panel'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        const message = data.details || data.error || 'Erro desconhecido na automação';
        throw new Error(message);
      }

      return data;
    } catch (error: any) {
      console.error("AI Service Error:", error);
      throw error;
    }
  },

  /**
   * Verifica se o webhook está acessível
   */
  async testIntegration(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'PING', category: 'System' })
      });
      
      const data = await response.json();
      return { 
        success: response.ok, 
        message: response.ok ? "Conexão n8n Consagrada" : (data.details || "n8n Inacessível") 
      };
    } catch (error: any) {
      return { success: false, message: "Erro de rede local" };
    }
  }
};
