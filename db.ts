
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xkapuhuuqqjmcxxrnpcf.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; 

// Verifica se estamos em modo demonstração (sem chaves reais)
const isPlaceholder = supabaseKey === 'YOUR_SUPABASE_ANON_KEY' || !supabaseKey;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface HolySettings {
  id?: string;
  gymName: string;
  phone: string;
  instagram: string;
  address: string;
  website: string;
}

export interface AutomationSettings {
  id?: string;
  enabled: boolean;
  frequency_days: number;
  topics: string;
  last_run?: string;
  next_run?: string;
  target_category: string;
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

let pendingSession: Promise<any> | null = null;

export const dbService = {
  async login(email: string, pass: string) {
    if (isPlaceholder) {
      if (email === 'admin@holyspirit.com' && pass === 'admin123') {
        return { user: { id: 'mock-admin', email }, role: 'admin' };
      }
      throw new Error('Modo Demo: Use admin@holyspirit.com / admin123');
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) throw error;
    
    const { data: profile } = await supabase.from('profiles').select('role').eq(data.user.id).single();
    if (profile?.role !== 'admin') {
      await supabase.auth.signOut();
      throw new Error('Acesso negado: privilégios insuficientes.');
    }
    return { ...data, role: profile.role };
  },

  async getSession() {
    if (isPlaceholder) return null;
    if (pendingSession) return pendingSession;

    pendingSession = (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return null;
        const { data: profile } = await supabase.from('profiles').select('role').eq(session.user.id).single();
        return { user: session.user, role: profile?.role || 'user' };
      } catch (err) {
        return null;
      } finally {
        pendingSession = null;
      }
    })();

    return pendingSession;
  },

  async signOut() {
    if (isPlaceholder) return;
    await supabase.auth.signOut();
    window.location.href = '/';
  },

  async getSettings(): Promise<HolySettings> {
    const defaultSettings = {
      gymName: 'Holy Spirit Academia',
      phone: '5511999999999',
      instagram: '@holyspirit.gym',
      address: 'Av. das Nações, 1000 - SP',
      website: 'www.holyspiritgym.com.br'
    };

    if (isPlaceholder) {
      const stored = localStorage.getItem('hs_settings');
      return stored ? JSON.parse(stored) : defaultSettings;
    }

    try {
      const { data } = await supabase.from('settings').select('*').maybeSingle();
      return data || defaultSettings;
    } catch {
      return defaultSettings;
    }
  },

  async saveSettings(settings: HolySettings) {
    if (isPlaceholder) {
      localStorage.setItem('hs_settings', JSON.stringify(settings));
      return;
    }
    await supabase.from('settings').upsert({ ...settings, id: 'config' });
  },

  async getBlogs() {
    if (isPlaceholder) return [];
    const { data } = await supabase.from('posts').select('*').order('createdAt', { ascending: false });
    return data || [];
  },

  async saveBlog(post: any) {
    if (isPlaceholder) return;
    await supabase.from('posts').insert([post]);
  },

  async deleteBlog(id: string) {
    if (isPlaceholder) return;
    await supabase.from('posts').delete().eq('id', id);
  },

  async getEvents() {
    if (isPlaceholder) return [];
    const { data } = await supabase.from('events').select('*').order('date', { ascending: true });
    return data || [];
  },

  async saveEvent(event: any) {
    if (isPlaceholder) return;
    await supabase.from('events').insert([event]);
  },

  async updateEvent(id: string, updates: Partial<HolyEvent>) {
    if (isPlaceholder) return;
    await supabase.from('events').update(updates).eq('id', id);
  },

  async deleteEvent(id: string) {
    if (isPlaceholder) return;
    await supabase.from('events').delete().eq('id', id);
  },

  async getAutomationSettings() {
    if (isPlaceholder) return { enabled: false, frequency_days: 3, topics: '', target_category: 'Musculação' };
    const { data } = await supabase.from('automation_settings').select('*').maybeSingle();
    return data || { enabled: false, frequency_days: 3, topics: '', target_category: 'Musculação' };
  },

  async saveAutomationSettings(settings: any) {
    if (isPlaceholder) return;
    await supabase.from('automation_settings').upsert({ ...settings, id: 'config' });
  }
};
