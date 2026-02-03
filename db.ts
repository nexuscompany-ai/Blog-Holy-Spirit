
import { createClient } from '@supabase/supabase-js';

// Use process.env for environment variables to avoid ImportMeta errors in this environment
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://xkapuhuuqqjmcxxrnpcf.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

// Modo demonstração ativo se a chave não for encontrada
const isPlaceholder = !process.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey || 'placeholder_key');

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
      throw new Error('Modo Demo: Use admin@holyspirit.com / admin123 ou configure o arquivo .env');
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) throw error;
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (profileError || profile?.role !== 'admin') {
      await supabase.auth.signOut();
      throw new Error('Acesso negado: você não tem permissão de administrador.');
    }
    return { ...data, role: profile.role };
  },

  async getSession() {
    if (isPlaceholder) return { user: { email: 'admin@holyspirit.com' }, role: 'admin' };
    if (pendingSession) return pendingSession;

    pendingSession = (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return null;
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
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
    if (isPlaceholder) {
      console.log("Sign out (Demo Mode)");
      return;
    }
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
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('createdAt', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (e) {
      console.error("Erro ao buscar blogs:", e);
      return [];
    }
  },

  async saveBlog(post: any) {
    if (isPlaceholder) return;
    const { error } = await supabase.from('posts').insert([{
        ...post,
        createdAt: new Date().toISOString()
    }]);
    if (error) throw error;
  },

  async deleteBlog(id: string) {
    if (isPlaceholder) return;
    await supabase.from('posts').delete().eq('id', id);
  },

  async getEvents() {
    if (isPlaceholder) return [];
    try {
      const { data } = await supabase.from('events').select('*').order('date', { ascending: true });
      return data || [];
    } catch {
      return [];
    }
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
    const defaults: AutomationSettings = { enabled: false, frequency_days: 3, topics: '', target_category: 'Musculação' };
    if (isPlaceholder) return defaults;
    try {
      const { data } = await supabase.from('automation_settings').select('*').maybeSingle();
      return data || defaults;
    } catch {
      return defaults;
    }
  },

  async saveAutomationSettings(settings: any) {
    if (isPlaceholder) return;
    await supabase.from('automation_settings').upsert({ ...settings, id: 'config' });
  }
};
