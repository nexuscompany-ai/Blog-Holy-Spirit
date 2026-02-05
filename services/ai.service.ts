
export const aiService = {
  /**
   * Aciona a geração via n8n
   */
  async generatePost(prompt: string, config: { category: string }): Promise<any> {
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt,
          category: config.category
        })
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.details || data.error || 'Erro inesperado no servidor.';
        throw new Error(errorMessage);
      }

      // Verifica se o n8n reportou sucesso no JSON de retorno
      if (data.success === false) {
        throw new Error(data.error || 'O n8n processou mas retornou erro.');
      }

      return data;
    } catch (error: any) {
      console.error("AI Service Error:", error);
      throw error;
    }
  },

  /**
   * Teste de conectividade
   */
  async testIntegration(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'TEST_PING', category: 'System' })
      });
      
      const data = await response.json();
      return { 
        success: response.ok, 
        message: response.ok ? "n8n Online" : (data.details || "n8n Offline") 
      };
    } catch {
      return { success: false, message: "Erro de Rede" };
    }
  }
};
