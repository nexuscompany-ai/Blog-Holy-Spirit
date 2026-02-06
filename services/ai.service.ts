
export interface PostPreview {
  title: string;
  excerpt: string;
  content: string;
}

export const aiService = {
  async getPreview(prompt: string, category: string): Promise<any> {
    return this.callN8n({ mode: 'preview', prompt, category });
  },

  async publishPost(postData: PostPreview, category: string): Promise<any> {
    return this.callN8n({ mode: 'publish', postData, category });
  },

  async callN8n(payload: any): Promise<any> {
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.status === 404) {
        throw new Error("Endpoint /api/ai/generate não encontrado. Verifique se o backend está rodando.");
      }

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.details || data.error || 'Erro na resposta da automação');
      }

      if (!data.post && data.title && data.content) {
        return { 
          success: true, 
          mode: payload.mode, 
          post: { 
            title: data.title, 
            excerpt: data.excerpt, 
            content: data.content 
          } 
        };
      }

      return data;
    } catch (e: any) {
      console.error("AI Service Error:", e);
      throw e;
    }
  },

  async testIntegration(): Promise<{ success: boolean; message: string }> {
    try {
      // Usamos um timeout curto para o teste
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'preview', prompt: 'PING', category: 'System' }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        return { success: true, message: "n8n Consagrado" };
      }
      return { success: false, message: "Hub n8n inacessível (Status " + response.status + ")" };
    } catch (e: any) {
      return { success: false, message: "Erro de conexão: " + e.message };
    }
  }
};
