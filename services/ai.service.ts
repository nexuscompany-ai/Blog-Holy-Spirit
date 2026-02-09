
export interface PostPreview {
  title: string;
  excerpt: string;
  content: string;
}

/**
 * SERVIÇO EDITORIAL INTELIGENTE
 * Centraliza a comunicação com o Hub de Automação n8n.
 */
export const aiService = {
  async getPreview(prompt: string, category: string): Promise<any> {
    return this.callAutomation({ mode: 'preview', prompt, category });
  },

  async publishPost(postData: PostPreview, category: string): Promise<any> {
    return this.callAutomation({ mode: 'publish', postData, category });
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

      // O n8n deve retornar um objeto contendo 'post' {title, excerpt, content}
      // Se retornar diretamente na raiz, mapeamos aqui
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
      console.error("Editorial Hub Error:", e);
      throw e;
    }
  },

  async testIntegration(): Promise<{ success: boolean; message: string }> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
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
