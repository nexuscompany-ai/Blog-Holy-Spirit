

export interface PostPreview {
  title: string;
  excerpt: string;
  content: string;
}

export const aiService = {
  /**
   * Solicita o PREVIEW do conteúdo ao n8n
   */
  async getPreview(prompt: string, category: string): Promise<any> {
    return this.callN8n({ mode: 'preview', prompt, category });
  },

  /**
   * Solicita a PUBLICAÇÃO efetiva ao n8n
   */
  async publishPost(postData: PostPreview, category: string): Promise<any> {
    return this.callN8n({ mode: 'publish', postData, category });
  },

  // Fix: Removed 'private' modifier because it is not allowed on properties within an object literal.
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
      throw new Error(data.details || data.error || 'Erro na automação Cloud');
    }

    return data;
  },

  async testIntegration(): Promise<{ success: boolean; message: string }> {
    try {
      const result = await this.getPreview('TEST_PING', 'System');
      return { success: true, message: "n8n Conectado" };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }
};