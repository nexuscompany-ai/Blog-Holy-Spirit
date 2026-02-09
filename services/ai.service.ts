
export interface PostPreview {
  title: string;
  excerpt: string;
  content: string;
}

/**
 * SERVIÇO EDITORIAL INTELIGENTE
 * Centraliza a comunicação com o Hub de Automação n8n.
 * Configurado para aguardar respostas longas sem interrupção.
 */
export const aiService = {
  async getPreview(prompt: string): Promise<any> {
    return this.callAutomation({ mode: 'preview', prompt });
  },

  async publishPost(postData: PostPreview): Promise<any> {
    return this.callAutomation({ mode: 'publish', postData });
  },

  async callAutomation(payload: any): Promise<any> {
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.details || data.error || 'Ocorreu um erro na automação editorial.');
      }

      if (!data.post && data.title && data.content) {
        return { 
          success: true, 
          mode: payload.mode, 
          post: { 
            title: data.title, 
            excerpt: data.excerpt || '', 
            content: data.content 
          } 
        };
      }

      return data;
    } catch (e: any) {
      if (e.name === 'AbortError') {
        throw new Error("A conexão foi interrompida pelo navegador. Tente novamente.");
      }
      console.error("Editorial Hub Error:", e);
      throw e;
    }
  },

  async testIntegration(): Promise<{ success: boolean; message: string }> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); 
      
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'PING' }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        return { success: true, message: "Hub de Automação Sincronizado" };
      }
      return { success: false, message: "Falha na resposta do Hub (Status " + response.status + ")" };
    } catch (e: any) {
      return { success: false, message: "Sem conexão com o Hub: " + e.message };
    }
  }
};
