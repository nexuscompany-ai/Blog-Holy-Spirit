
export interface PostPreview {
  title: string;
  excerpt: string;
  content: string;
}

export const aiService = {
  /**
   * Solicita o PREVIEW (Geração via IA sem salvar)
   */
  async getPreview(prompt: string, category: string): Promise<any> {
    return this.callN8n({ mode: 'preview', prompt, category });
  },

  /**
   * Solicita o PUBLISH (Gravação no Supabase via n8n)
   */
  async publishPost(postData: PostPreview, category: string): Promise<any> {
    return this.callN8n({ mode: 'publish', postData, category });
  },

  async callN8n(payload: any): Promise<any> {
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
      throw new Error(data.details || data.error || 'Erro na resposta da automação');
    }

    // Normalização: Se o n8n retornar o post direto na raiz, nós encapsulamos para o componente
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
  },

  async testIntegration(): Promise<{ success: boolean; message: string }> {
    try {
      await this.getPreview('TEST_PING', 'System');
      return { success: true, message: "n8n Consagrado" };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }
};
