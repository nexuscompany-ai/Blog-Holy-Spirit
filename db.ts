
import { createClient } from '@supabase/supabase-js';

// Tenta obter as variáveis de diversos contextos possíveis (Vite, Process, etc)
const getEnv = (name: string) => {
  if (typeof process !== 'undefined' && process.env && process.env[name]) return process.env[name];
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[name]) return import.meta.env[name];
  return '';
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL') || 'https://xkapuhuuqqjmcxxrnpcf.supabase.co';
const supabaseKey = getEnv('VITE_SUPABASE_ANON_KEY');

// Se a chave estiver vazia, o Supabase retornará 401. 
// Em ambiente de desenvolvimento local, certifique-se de que o .env está configurado.
export const supabase = createClient(supabaseUrl, supabaseKey || 'MISSING_ANON_KEY');

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

export const dbService = {
  async login(email: string, pass: string) {
    if (!supabaseKey) {
      throw new Error('Configuração ausente: VITE_SUPABASE_ANON_KEY não encontrada nas variáveis de ambiente.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) {
      if (error.message.includes('API key')) throw new Error('API Key do Supabase inválida ou expirada.');
      throw error;
    }
    
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
    if (profile?.role !== 'admin') {
      await supabase.auth.signOut();
      throw new Error('Acesso negado: Este portal é restrito a administradores (role admin).');
    }
    return { ...data, role: profile.role };
  },

  async getSession() {
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
    await supabase.auth.signOut();
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
    try {
      const { data } = await supabase.from('settings').select('*').maybeSingle();
      return data || defaultSettings;
    } catch {
      return defaultSettings;
    }
  },

  async saveSettings(settings: HolySettings) {
    await supabase.from('settings').upsert({ ...settings, id: 'config' });
  },

  async getBlogs() {
    try {
        const { data } = await supabase
          .from('posts')
          .select('*')
          .order('createdAt', { ascending: false });
        return data || [];
    } catch {
        return [];
    }
  },

  async saveBlog(post: any) {
    const { error } = await supabase.from('posts').insert([post]);
    if (error) throw error;
  },

  async deleteBlog(id: string) {
    await supabase.from('posts').delete().eq('id', id);
  },

  async getEvents() {
    try {
        const { data } = await supabase.from('events').select('*').order('date', { ascending: true });
        return data || [];
    } catch {
        return [];
    }
  },

  async saveEvent(event: any) {
    await supabase.from('events').insert([event]);
  },

  async updateEvent(id: string, updates: Partial<HolyEvent>) {
    await supabase.from('events').update(updates).eq('id', id);
  },

  async deleteEvent(id: string) {
    await supabase.from('events').delete().eq('id', id);
  },

  async getAutomationSettings(): Promise<AutomationSettings> {
    try {
        const { data } = await supabase.from('automation_settings').select('*').maybeSingle();
        return data || { enabled: false, frequency_days: 3, topics: '', target_category: 'Musculação' };
    } catch {
        return { enabled: false, frequency_days: 3, topics: '', target_category: 'Musculação' };
    }
  },

  async saveAutomationSettings(settings: any) {
    await supabase.from('automation_settings').upsert({ ...settings, id: 'config' });
  }
};
