
// Importamos apenas as interfaces, nunca a lógica de servidor
import type { BlogPost } from './components/BlogSection';

export interface HolySettings {
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
  async getSettings(): Promise<HolySettings> {
    const saved = localStorage.getItem('hs_settings');
    return saved ? JSON.parse(saved) : {
      gymName: 'Holy Spirit Academia',
      phone: '5511999999999',
      instagram: '@holyspirit.gym',
      address: 'Av. das Nações, 1000 - São Paulo, SP',
      website: 'www.holyspiritgym.com.br'
    };
  },

  async saveSettings(settings: HolySettings): Promise<void> {
    localStorage.setItem('hs_settings', JSON.stringify(settings));
  },

  async getBlogs(): Promise<BlogPost[]> {
    try {
      const response = await fetch('/api/posts');
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return [];
    }
  },

  async saveBlog(post: any): Promise<void> {
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    });
    if (!response.ok) throw new Error('Erro ao salvar post via API');
  },

  async getEvents(): Promise<HolyEvent[]> {
    const saved = localStorage.getItem('hs_events');
    return saved ? JSON.parse(saved) : [];
  },

  async saveEvent(event: HolyEvent): Promise<void> {
    const events = await this.getEvents();
    localStorage.setItem('hs_events', JSON.stringify([event, ...events]));
  },

  async deleteEvent(id: string): Promise<void> {
    const events = await this.getEvents();
    const filtered = events.filter(e => e.id !== id);
    localStorage.setItem('hs_events', JSON.stringify(filtered));
  },

  async updateEvent(id: string, updates: Partial<HolyEvent>): Promise<void> {
    const events = await this.getEvents();
    const updated = events.map(e => e.id === id ? { ...e, ...updates } : e);
    localStorage.setItem('hs_events', JSON.stringify(updated));
  }
};
