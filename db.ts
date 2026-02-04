
import { createClient } from '@supabase/supabase-js';

const getEnv = (name: string) => {
  if (typeof process !== 'undefined' && process.env && process.env[name]) return process.env[name];
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[name]) return import.meta.env[name];
  return '';
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL') || 'https://xkapuhuuqqjmcxxrnpcf.supabase.co';
const supabaseKey = getEnv('VITE_SUPABASE_ANON_KEY');

// Cliente Supabase real
export const supabase = createClient(supabaseUrl, supabaseKey || 'MOCK_KEY');

// Flag para saber se estamos em modo demonstração (sem chaves válidas)
const isDemoMode = !supabaseKey || supabaseKey === 'sua_chave_anonima_aqui' || supabaseKey === 'MISSING_ANON_KEY';

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

// Added missing AutomationSettings interface to fix export errors in components/admin/DashboardHome.tsx and components/admin/ManageAutomation.tsx
export interface AutomationSettings {
  id?: string;
  enabled: boolean;
  frequency_days: number;
  topics: string;
  target_category: string;
}

export const dbService = {
  async login(email: string, pass: string) {
    if (isDemoMode) {
      console.warn("Entrando em Modo de Demonstração (Chaves Supabase não configuradas)");
      // Simula um delay de rede
      await new Promise(r => setTimeout(r, 800));
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
    if (isDemoMode) {
      localStorage.removeItem('holy_demo_session');
    } else {
      await supabase.auth.signOut();
    }
    window.location.href = '/';
  },

  async getSettings(): Promise<HolySettings> {
    const defaultSettings = {
      gymName: 'Holy Spirit Academia',
      phone: '(11) 99999-9999',
      instagram: '@holyspirit.gym',
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
    const { data } = await supabase.from('posts').select('*').order('createdAt', { ascending: false });
    return data || [];
  },

  async saveBlog(post: any) {
    if (isDemoMode) {
      const current = await this.getBlogs();
      const newPost = { ...post, id: Date.now().toString(), createdAt: new Date().toISOString() };
      localStorage.setItem('holy_blogs', JSON.stringify([newPost, ...current]));
      return;
    }
    await supabase.from('posts').insert([post]);
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

  // Fixed return type and ensured consistency with the new AutomationSettings interface
  async getAutomationSettings(): Promise<AutomationSettings> {
    const defaults: AutomationSettings = { enabled: false, frequency_days: 3, topics: '', target_category: 'Musculação' };
    if (isDemoMode) {
      const saved = localStorage.getItem('holy_automation');
      return saved ? JSON.parse(saved) : defaults;
    }
    const { data } = await supabase.from('automation_settings').select('*').maybeSingle();
    return data || defaults;
  },

  // Added type for parameters to match the new AutomationSettings interface
  async saveAutomationSettings(settings: AutomationSettings) {
    if (isDemoMode) {
      localStorage.setItem('holy_automation', JSON.stringify(settings));
      return;
    }
    await supabase.from('automation_settings').upsert({ ...settings, id: 'config' });
  }
};
