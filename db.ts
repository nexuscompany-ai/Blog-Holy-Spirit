
import { BlogPost } from './components/BlogSection';

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

const KEYS = {
  SETTINGS: 'hs_settings',
  BLOGS: 'hs_blogs',
  EVENTS: 'hs_events',
  AUTO_CONFIG: 'hs_auto_config'
};

const DEFAULT_SETTINGS: HolySettings = {
  gymName: 'Holy Spirit Academia',
  phone: '5511999999999',
  instagram: '@holyspirit.gym',
  address: 'Av. das Nações, 1000 - São Paulo, SP',
  website: 'www.holyspiritgym.com.br'
};

export const dbService = {
  // Configurações
  async getSettings(): Promise<HolySettings> {
    const saved = localStorage.getItem(KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  },

  async saveSettings(settings: HolySettings): Promise<void> {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  },

  // Blogs
  async getBlogs(): Promise<BlogPost[]> {
    const saved = localStorage.getItem(KEYS.BLOGS);
    return saved ? JSON.parse(saved) : [];
  },

  async saveBlog(post: BlogPost): Promise<void> {
    const blogs = await this.getBlogs();
    const updated = [post, ...blogs];
    localStorage.setItem(KEYS.BLOGS, JSON.stringify(updated));
  },

  async deleteBlog(id: string): Promise<void> {
    const blogs = await this.getBlogs();
    const updated = blogs.filter(b => b.id !== id);
    localStorage.setItem(KEYS.BLOGS, JSON.stringify(updated));
  },

  // Eventos
  async getEvents(): Promise<HolyEvent[]> {
    const saved = localStorage.getItem(KEYS.EVENTS);
    return saved ? JSON.parse(saved) : [];
  },

  async saveEvent(event: HolyEvent): Promise<void> {
    const events = await this.getEvents();
    const updated = [event, ...events];
    localStorage.setItem(KEYS.EVENTS, JSON.stringify(updated));
  },

  async deleteEvent(id: string): Promise<void> {
    const events = await this.getEvents();
    const updated = events.filter(e => e.id !== id);
    localStorage.setItem(KEYS.EVENTS, JSON.stringify(updated));
  },

  async updateEvent(id: string, updates: Partial<HolyEvent>): Promise<void> {
    const events = await this.getEvents();
    const updated = events.map(e => e.id === id ? { ...e, ...updates } : e);
    localStorage.setItem(KEYS.EVENTS, JSON.stringify(updated));
  }
};
