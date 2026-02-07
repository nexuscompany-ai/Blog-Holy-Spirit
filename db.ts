
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

const mapEventToDB = (event: Partial<HolyEvent>) => {
  const mapped: any = {};
  const directKeys = ['id', 'title', 'date', 'time', 'location', 'description', 'category', 'status', 'image'] as const;
  
  directKeys.forEach(key => {
    if (event[key] !== undefined) mapped[key] = event[key];
  });

  if (event.whatsappEnabled !== undefined) mapped.whatsapp_enabled = event.whatsappEnabled;
  if (event.whatsappNumber !== undefined) mapped.whatsapp_number = event.whatsappNumber;
  if (event.whatsappMessage !== undefined) mapped.whatsapp_message = event.whatsappMessage;

  return mapped;
};

const mapEventFromDB = (data: any): HolyEvent => {
  const { whatsapp_enabled, whatsapp_number, whatsapp_message, ...rest } = data;
  return {
    ...rest,
    whatsappEnabled: whatsapp_enabled,
    whatsappNumber: whatsapp_number,
    whatsappMessage: whatsapp_message,
  } as HolyEvent;
};

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

export const dbService = {
  async login(email: string, pass: string) {
    const { data, error } = await (supabase.auth as any).signInWithPassword({ email, password: pass });
    if (error) throw error;
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .maybeSingle();

    if (profile?.role !== 'admin') {
      await (supabase.auth as any).signOut();
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
    await (supabase.auth as any).signOut();
    window.location.href = '/';
  },

  async getMetrics(): Promise<DashboardMetrics> {
    try {
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
        return [];
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
      created_at: now,
      updated_at: now,
      published_at: post.published_at || null
    };
    
    const { error } = await supabase.from('posts').insert([finalPost]);
    if (error) {
      console.error("Erro ao salvar post:", error);
      throw error;
    }
  },

  async updateBlog(id: string, updates: any) {
    if (!id) throw new Error("ID do post obrigatório.");
    const now = new Date().toISOString();
    const payload: any = { ...updates };
    
    delete payload.published;
    delete payload.status;
    delete payload.publishedAt;
    delete payload.updatedAt;
    delete payload.createdAt;
    
    payload.updated_at = now;

    const { error } = await supabase
      .from('posts')
      .update(payload)
      .eq('id', id);

    if (error) {
      console.error("Erro na atualização via published_at:", error);
      throw error;
    }
  },

  async deleteBlog(id: string) {
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) throw error;
  },

  async getEvents(): Promise<HolyEvent[]> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });
        
      if (error) throw error;
      return (data || []).map(mapEventFromDB);
    } catch (err) {
      console.error("Erro ao buscar eventos:", err);
      return [];
    }
  },

  async saveEvent(event: HolyEvent) {
    const dbData = mapEventToDB(event);
    const { error } = await supabase.from('events').insert([dbData]);
    if (error) {
      console.error("Erro ao salvar evento:", error);
      throw error;
    }
  },

  async updateEvent(id: string, updates: Partial<HolyEvent>) {
    const dbData = mapEventToDB(updates);
    const { error } = await supabase.from('events').update(dbData).eq('id', id);
    if (error) {
      console.error("Erro ao atualizar evento:", error);
      throw error;
    }
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
