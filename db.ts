
import { createClient } from '@supabase/supabase-js';

const getEnv = (name: string) => {
  if (typeof process !== 'undefined' && process.env && process.env[name]) return process.env[name];
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[name]) return import.meta.env[name];
  return '';
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL') || 'https://xkapuhuuqqjmcxxrnpcf.supabase.co';
const supabaseKey = getEnv('VITE_SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrYXB1aHV1cXFqbWN4eHJucGNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2Mjk0MTIsImV4cCI6MjA4NTIwNTQxMn0.tbA_C45JUPLUwIOb8IUsf2TGqW57MBIpLiG2z8i3NPE';

export const supabase = createClient(supabaseUrl, supabaseKey);

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

const createSlug = (text: string) => {
  if (!text) return `post-${Math.random().toString(36).substring(2, 7)}`;
  const cleanText = text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
    
  return `${cleanText}-${Math.random().toString(36).substring(2, 7)}`;
};

/**
 * Mapeamento estrito para evitar o envio de colunas que podem não existir no banco.
 * Prioriza snake_case mas mantém suporte a colunas citadas se o usuário as criou assim.
 */
const mapToSnakeCase = (obj: any) => {
  const mapping: Record<string, string> = {
    'createdAt': 'created_at',
    'updatedAt': 'updated_at',
    'publishedAt': 'published_at',
    'status': 'status',
    'published': 'published'
  };

  const newObj: any = {};
  for (const key in obj) {
    if (mapping[key]) {
      newObj[mapping[key]] = obj[key];
    } else {
      newObj[key] = obj[key];
    }
  }
  return newObj;
};

export const dbService = {
  async login(email: string, pass: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) throw error;
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .maybeSingle();

    if (profile?.role !== 'admin') {
      await supabase.auth.signOut();
      throw new Error('Acesso restrito a administradores.');
    }
    return { ...data, role: profile.role };
  },

  async getSession() {
    return { 
      user: { id: 'dev-mode', email: 'admin@holyspirit.com' }, 
      role: 'admin' 
    };
  },

  async signOut() {
    await supabase.auth.signOut();
    window.location.href = '/';
  },

  async getMetrics(): Promise<DashboardMetrics> {
    try {
      // Usamos chamadas isoladas para que falha em uma não mate as outras
      const posts = await this.getBlogs().catch(() => []);
      const events = await this.getEvents().catch(() => []);
      const automation = await this.getAutomationSettings().catch(() => ({ enabled: false }));
      
      return {
        postsCount: posts.length,
        eventsCount: events.length,
        activeEventsCount: events.filter((e: any) => e.status === 'active').length,
        automationActive: automation.enabled
      };
    } catch {
      return { postsCount: 0, eventsCount: 0, activeEventsCount: 0, automationActive: false };
    }
  },

  async getSettings(): Promise<HolySettings> {
    const defaultSettings: HolySettings = {
      gymName: 'Holy Spirit Academia',
      phone: '(11) 99999-9999',
      instagram: 'https://instagram.com/holyspirit.gym',
      address: 'Av. das Nações, 1000 - SP',
      website: 'www.holyspiritgym.com.br'
    };
    try {
      const { data, error } = await supabase.from('settings').select('*').maybeSingle();
      if (error) return defaultSettings;
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
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        const { data: retryData, error: retryError } = await supabase
          .from('posts')
          .select('*')
          .order('createdAt', { ascending: false });
          
        if (retryError) return [];
        return retryData || [];
      }
      return data || [];
    } catch {
      return [];
    }
  },

  async saveBlog(post: any) {
    const now = new Date().toISOString();
    const slug = post.slug || createSlug(post.title || 'post');
    
    const finalPost: any = {
      title: post.title,
      slug: slug.toLowerCase(),
      content: post.content,
      excerpt: post.excerpt || post.content?.substring(0, 160).replace(/<[^>]*>/g, '') || '',
      category: post.category || 'Geral',
      image: post.image || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
      source: post.source || 'manual',
      status: post.status || 'draft',
      published: post.status === 'published',
      created_at: now,
      updated_at: now,
      published_at: (post.status === 'published') ? now : null
    };
    
    const { error } = await supabase.from('posts').insert([finalPost]);
    if (error) throw error;
  },

  async updateBlog(id: string, updates: any) {
    if (!id) throw new Error("ID do post não fornecido para atualização.");
    
    const now = new Date().toISOString();
    
    // Limpeza rigorosa do payload para evitar erros 400 (colunas inexistentes)
    const payload: any = {};
    
    // Se estivermos apenas alternando o estado de publicação:
    if (updates.hasOwnProperty('published')) {
      payload.published = !!updates.published;
      payload.status = payload.published ? 'published' : 'draft';
      payload.published_at = payload.published ? (updates.publishedAt || now) : null;
    }

    // Outros campos comuns que podem vir no update
    if (updates.title) payload.title = updates.title;
    if (updates.content) payload.content = updates.content;
    if (updates.category) payload.category = updates.category;
    if (updates.image) payload.image = updates.image;
    
    payload.updated_at = now;

    const { error } = await supabase
      .from('posts')
      .update(payload)
      .eq('id', id);

    if (error) {
      console.error("Erro ao publicar post:", {
        message: error.message,
        details: error.details,
        code: error.code
      });
      throw error;
    }
  },

  async deleteBlog(id: string) {
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) throw error;
  },

  async getEvents() {
    try {
      const { data, error } = await supabase.from('events').select('*').order('date', { ascending: true });
      if (error) return [];
      return data || [];
    } catch {
      return [];
    }
  },

  async saveEvent(event: any) {
    const { error } = await supabase.from('events').insert([event]);
    if (error) throw error;
  },

  async updateEvent(id: string, updates: Partial<HolyEvent>) {
    const { error } = await supabase.from('events').update(updates).eq('id', id);
    if (error) throw error;
  },

  async deleteEvent(id: string) {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) throw error;
  },

  async getAutomationSettings(): Promise<AutomationSettings> {
    const defaults: AutomationSettings = { enabled: false, frequency_days: 3, topics: '', target_category: 'Musculação' };
    try {
      const { data, error } = await supabase.from('automation_settings').select('*').maybeSingle();
      if (error) return defaults;
      return data || defaults;
    } catch {
      return defaults;
    }
  },

  async saveAutomationSettings(settings: AutomationSettings) {
    const { error } = await supabase.from('automation_settings').upsert({ ...settings, id: 'config' });
    if (error) throw error;
  }
};
