
export const aiService = {
  /**
   * Dispara o sinal para o n8n gerar o post
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
        // Se o erro for 404, o workflow no n8n provavelmente está desativado
        if (response.status === 404) {
          throw new Error("Webhook n8n não encontrado. Verifique se o workflow está em modo 'ACTIVE' no n8n Cloud.");
        }
        throw new Error(data.details || data.error || 'Erro na automação');
      }

      return data;
    } catch (error: any) {
      console.error("AI Service Error:", error);
      throw error;
    }
  },

  /**
   * Teste rápido de conectividade
   */
  async testIntegration(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'TEST_PING', category: 'System' })
      });
      
      return { 
        success: response.ok, 
        message: response.ok ? "n8n Conectado" : "Falha na Nuvem" 
      };
    } catch {
      return { success: false, message: "Erro de Rede" };
    }
  }
};
