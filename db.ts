
export interface HolySettings {
  id?: string;
  gymName: string;
  phone: string;
  instagram: string;
  address: string;
  website: string;
}

export interface HolyEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: string;
  status: 'active' | 'inactive';
  image?: string;
}

export const dbService = {
  // SETTINGS
  async getSettings(): Promise<HolySettings> {
    try {
      const response = await fetch('/api/settings');
      if (!response.ok) throw new Error();
      return await response.json();
    } catch {
      return {
        gymName: 'Holy Spirit Academia',
        phone: '5511999999999',
        instagram: '@holyspirit.gym',
        address: 'Av. das Nações, 1000 - São Paulo, SP',
        website: 'www.holyspiritgym.com.br'
      };
    }
  },

  async saveSettings(settings: HolySettings): Promise<void> {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
  },

  // BLOGS
  async getBlogs(): Promise<any[]> {
    try {
      const response = await fetch('/api/posts');
      return response.ok ? await response.json() : [];
    } catch (error) {
      console.error('API Connect Error:', error);
      return [];
    }
  },

  async saveBlog(post: any): Promise<void> {
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    });
    if (!response.ok) throw new Error('Erro ao salvar post no Supabase');
  },

  async deleteBlog(id: string): Promise<void> {
    await fetch(`/api/posts/${id}`, { method: 'DELETE' });
  },

  // EVENTS
  async getEvents(): Promise<HolyEvent[]> {
    try {
      const response = await fetch('/api/events');
      return response.ok ? await response.json() : [];
    } catch {
      return [];
    }
  },

  async saveEvent(event: any): Promise<void> {
    await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
  },

  async deleteEvent(id: string): Promise<void> {
    await fetch(`/api/events/${id}`, { method: 'DELETE' });
  },

  async updateEvent(id: string, updates: Partial<HolyEvent>): Promise<void> {
    await fetch(`/api/events/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
  }
};
