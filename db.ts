
import { createClient } from '@supabase/supabase-js';

const getEnv = (name: string) => {
  if (typeof process !== 'undefined' && process.env && process.env[name]) return process.env[name];
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[name]) return import.meta.env[name];
  return '';
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL') || 'https://xkapuhuuqqjmcxxrnpcf.supabase.co';
const supabaseKey = getEnv('VITE_SUPABASE_ANON_KEY');

export const supabase = createClient(supabaseUrl, supabaseKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy');

const isDemoMode = !supabaseKey || supabaseKey.includes('sua_chave') || supabaseKey === 'MISSING_ANON_KEY';

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
  whatsappEnabled?: boolean;
  whatsappNumber?: string;
  whatsappMessage?: string;
}

export interface AutomationSettings {
  id?: string;
  enabled: boolean;
  frequency_days: number;
  topics: string;
  target_category: string;
}

export interface DashboardMetrics {
  postsCount: number;
  eventsCount: number;
  activeEventsCount: number;
  automationActive: boolean;
}

// Helper para gerar slug determinístico no frontend caso necessário
const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') + '-' + Math.random().toString(36).substring(2, 7);
};

export const dbService = {
  async login(email: string, pass: string) {
    if (isDemoMode) {
      const mockSession = { user: { id: 'demo-user', email }, role: 'admin' };
      localStorage.setItem('holy_demo_session', JSON.stringify(mockSession));
      return mockSession;
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) throw error;
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
    if (profile?.role !== 'admin') {
      await supabase.auth.signOut();
      throw new Error('Acesso restrito a administradores.');
    }
    return { ...data, role: profile.role };
  },

  async getSession() {
    if (isDemoMode) {
      const saved = localStorage.getItem('holy_demo_session');
      return saved ? JSON.parse(saved) : null;
    }
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;
    try {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
      return { user: session.user, role: profile?.role || 'user' };
    } catch {
      return { user: session.user, role: 'user' };
    }
  },

  async signOut() {
    localStorage.removeItem('holy_demo_session');
    if (!isDemoMode) await supabase.auth.signOut();
    window.location.href = '/';
  },

  async getMetrics(): Promise<DashboardMetrics> {
    const blogs = await this.getBlogs();
    const events = await this.getEvents();
    const automation = await this.getAutomationSettings();
    return {
      postsCount: blogs.length,
      eventsCount: events.length,
      activeEventsCount: events.filter(e => e.status === 'active').length,
      automationActive: automation.enabled
    };
  },

  async getSettings(): Promise<HolySettings> {
    const defaultSettings: HolySettings = {
      gymName: 'Holy Spirit Academia',
      phone: '(11) 99999-9999',
      instagram: 'https://instagram.com/holyspirit.gym',
      address: 'Av. das Nações, 1000 - SP',
      website: 'www.holyspiritgym.com.br'
    };
    if (isDemoMode) {
      const saved = localStorage.getItem('holy_settings');
      return saved ? JSON.parse(saved) : defaultSettings;
    }
    try {
      const { data } = await supabase.from('settings').select('*').maybeSingle();
      return data || defaultSettings;
    } catch {
      return defaultSettings;
    }
  },

  async saveSettings(settings: HolySettings) {
    if (isDemoMode) {
      localStorage.setItem('holy_settings', JSON.stringify(settings));
      return;
    }
    await supabase.from('settings').upsert({ ...settings, id: 'config' });
  },

  async getBlogs() {
    if (isDemoMode) {
      const saved = localStorage.getItem('holy_blogs');
      return saved ? JSON.parse(saved) : [];
    }
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('createdAt', { ascending: false });
    
    if (error) {
      console.error("Erro ao buscar blogs:", error);
      return [];
    }
    return data || [];
  },

  async saveBlog(post: any) {
    const now = new Date().toISOString();
    const slug = post.slug || generateSlug(post.title);
    
    const finalPost = {
      ...post,
      slug: slug.toLowerCase(),
      status: post.status || 'draft',
      source: post.source || 'manual',
      createdAt: now,
      updatedAt: now,
      publishedAt: post.status === 'published' ? (post.publishedAt || now) : null
    };

    if (isDemoMode) {
      const current = await this.getBlogs();
      const newPost = { ...finalPost, id: Math.random().toString(36).substr(2, 9) };
      localStorage.setItem('holy_blogs', JSON.stringify([newPost, ...current]));
      return;
    }
    
    const { error } = await supabase.from('posts').insert([finalPost]);
    if (error) throw error;
  },

  async updateBlog(id: string, updates: any) {
    const now = new Date().toISOString();
    const finalUpdates = {
      ...updates,
      updatedAt: now,
      // Se mudar para publicado, garante a data de publicação
      ...(updates.status === 'published' && !updates.publishedAt ? { publishedAt: now } : {})
    };

    if (isDemoMode) {
      const current = await this.getBlogs();
      const updated = current.map((b: any) => b.id === id ? { ...b, ...finalUpdates } : b);
      localStorage.setItem('holy_blogs', JSON.stringify(updated));
      return;
    }
    
    const { error } = await supabase.from('posts').update(finalUpdates).eq('id', id);
    if (error) throw error;
  },

  async deleteBlog(id: string) {
    if (isDemoMode) {
      const current = await this.getBlogs();
      localStorage.setItem('holy_blogs', JSON.stringify(current.filter((b: any) => b.id !== id)));
      return;
    }
    await supabase.from('posts').delete().eq('id', id);
  },

  async getEvents() {
    if (isDemoMode) {
      const saved = localStorage.getItem('holy_events');
      return saved ? JSON.parse(saved) : [];
    }
    const { data } = await supabase.from('events').select('*').order('date', { ascending: true });
    return data || [];
  },

  async saveEvent(event: any) {
    if (isDemoMode) {
      const current = await this.getEvents();
      localStorage.setItem('holy_events', JSON.stringify([...current, event]));
      return;
    }
    await supabase.from('events').insert([event]);
  },

  async updateEvent(id: string, updates: Partial<HolyEvent>) {
    if (isDemoMode) {
      const current = await this.getEvents();
      localStorage.setItem('holy_events', JSON.stringify(current.map((e: any) => e.id === id ? { ...e, ...updates } : e)));
      return;
    }
    await supabase.from('events').update(updates).eq('id', id);
  },

  async deleteEvent(id: string) {
    if (isDemoMode) {
      const current = await this.getEvents();
      localStorage.setItem('holy_events', JSON.stringify(current.filter((e: any) => e.id !== id)));
      return;
    }
    await supabase.from('events').delete().eq('id', id);
  },

  async getAutomationSettings(): Promise<AutomationSettings> {
    const defaults: AutomationSettings = { enabled: false, frequency_days: 3, topics: '', target_category: 'Musculação' };
    if (isDemoMode) {
      const saved = localStorage.getItem('holy_automation');
      return saved ? JSON.parse(saved) : defaults;
    }
    const { data } = await supabase.from('automation_settings').select('*').maybeSingle();
    return data || defaults;
  },

  async saveAutomationSettings(settings: AutomationSettings) {
    if (isDemoMode) {
      localStorage.setItem('holy_automation', JSON.stringify(settings));
      return;
    }
    await supabase.from('automation_settings').upsert({ ...settings, id: 'config' });
  }
};
