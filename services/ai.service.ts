
export const aiService = {
  /**
   * Envia o briefing e aguarda o n8n devolver o post pronto
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
        throw new Error(data.details || data.error || 'Erro na automação Cloud');
      }

      // Validação do formato obrigatório definido para o n8n
      if (data.success === false) {
        throw new Error(data.error || 'O n8n falhou ao gerar o conteúdo.');
      }

      return data;
    } catch (error: any) {
      console.error("AI Service Error:", error);
      throw error;
    }
  },

  /**
   * Teste de integridade
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
        message: response.ok ? "n8n Consagrado" : (data.details || "n8n Inacessível") 
      };
    } catch {
      return { success: false, message: "Erro de Rede Local" };
    }
  }
};
