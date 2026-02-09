
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

/**
 * RESOLUÇÃO DE CATEGORIA
 * Converte nome de categoria em UUID do banco para evitar erro 22P02.
 */
async function resolveCategoryId(categoryName: string | undefined): Promise<string | null> {
  if (!categoryName) return null;
  
  // Se já for um UUID, retorna ele mesmo
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(categoryName);
  if (isUUID) return categoryName;

  const { data, error } = await supabase
    .from('categories')
    .select('id')
    .ilike('name', categoryName)
    .maybeSingle();

  if (error || !data) {
    // Se não encontrar, tenta buscar a categoria padrão 'Geral' ou retorna null
    const { data: fallback } = await supabase.from('categories').select('id').ilike('name', 'Geral').maybeSingle();
    return fallback?.id || null;
  }
  return data.id;
}

/**
 * SANEAMENTO DE PAYLOAD PARA POSTS
 * Filtra apenas colunas existentes e mapeia nomes de campos do frontend.
 */
async function sanitizePostPayload(input: any) {
  const categoryId = await resolveCategoryId(input.category_id || input.category);
  
  return {
    title: input.title,
    content: input.content,
    excerpt: input.excerpt || (input.content ? input.content.replace(/<[^>]*>/g, '').substring(0, 160) : ''),
    image_url: input.image_url || input.image || input.imageUrl || '',
    category_id: categoryId, // UUID ou null
    published_at: input.published_at || null,
    updated_at: new Date().toISOString()
  };
}

const mapEventToDB = (event: Partial<HolyEvent>) => {
  const mapped: any = {};
  const directFields = ['title', 'date', 'time', 'location', 'description', 'category', 'status', 'image'];
  
  directFields.forEach(field => {
    if ((event as any)[field] !== undefined) {
      mapped[field] = (event as any)[field];
    }
  });

  if (event.whatsappEnabled !== undefined) mapped.whatsapp_enabled = event.whatsappEnabled;
  if (event.whatsappNumber !== undefined) mapped.whatsapp_number = event.whatsappNumber;
  if (event.whatsappMessage !== undefined) mapped.whatsapp_message = event.whatsappMessage;

  return mapped;
};

const mapEventFromDB = (data: any): HolyEvent => {
  return {
    id: data.id,
    title: data.title || '',
    date: data.date || '',
    time: data.time || '',
    location: data.location || '',
    description: data.description || '',
    category: data.category || 'Workshop',
    status: data.status || 'active',
    image: data.image || '',
    whatsappEnabled: !!data.whatsapp_enabled,
    whatsappNumber: data.whatsapp_number || '',
    whatsappMessage: data.whatsapp_message || ''
  };
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
        activeEventsCount: events.filter((e) => e.status === 'active').length,
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
      // Join com a tabela categories para obter o nome para o frontend
      const { data, error } = await supabase
        .from('posts')
        .select('*, categories(name)')
        .order('created_at', { ascending: false });
      
      if (error) return [];
      
      // Mapeia para que o frontend veja 'category' como o nome
      return (data || []).map(post => ({
        ...post,
        category: post.categories?.name || 'Geral'
      }));
    } catch {
      return [];
    }
  },

  async saveBlog(post: any) {
    const payload = await sanitizePostPayload(post);
    payload.created_at = new Date().toISOString();
    
    const { error } = await supabase.from('posts').insert([payload]);
    if (error) {
      console.error("Erro ao salvar post (Supabase):", error);
      throw error;
    }
  },

  async updateBlog(id: string, updates: any) {
    if (!id) throw new Error("ID do post obrigatório.");
    
    const payload = await sanitizePostPayload(updates);

    const { error } = await supabase
      .from('posts')
      .update(payload)
      .eq('id', id);

    if (error) {
      console.error("Erro na atualização do blog (Supabase):", error);
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
      console.error("Erro ao listar eventos:", err);
      return [];
    }
  },

  async saveEvent(event: Omit<HolyEvent, 'id'>) {
    try {
      const dbData = mapEventToDB(event);
      const { error } = await supabase.from('events').insert([dbData]);
      if (error) throw error;
    } catch (err) {
      console.error("Erro ao salvar evento:", err);
      throw err;
    }
  },

  async updateEvent(id: string, updates: Partial<HolyEvent>) {
    try {
      const dbData = mapEventToDB(updates);
      const { error } = await supabase.from('events').update(dbData).eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.error("Erro ao atualizar evento:", err);
      throw err;
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
  },

  async getCategories() {
    const { data, error } = await supabase.from('categories').select('*').order('name');
    if (error) return [];
    return data || [];
  }
};
