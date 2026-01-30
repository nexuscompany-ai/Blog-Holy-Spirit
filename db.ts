
import { createClient } from 'https://esm.sh/@supabase/supabase-js@^2.48.1';

// Configuração segura via process.env
const supabaseUrl = 'https://xkapuhuuqqjmcxxrnpcf.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; // Em produção, usar process.env.SUPABASE_ANON_KEY

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
}

export const dbService = {
  // AUTH
  async login(email: string, pass: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    if (error) throw error;
    
    // Validar role do perfil
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();
      
    if (profileError || profile?.role !== 'admin') {
      await supabase.auth.signOut();
      throw new Error('Acesso restrito: sua conta não possui privilégios de administrador.');
    }
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error signing out:', error);
  },

  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    return { user: session.user, role: profile?.role };
  },

  // DATA FETCHING (RLS handles security on Supabase side)
  async getSettings(): Promise<HolySettings> {
    const { data } = await supabase.from('settings').select('*').single();
    return data || {
      gymName: 'Holy Spirit Academia',
      phone: '5511999999999',
      instagram: '@holyspirit.gym',
      address: 'Av. das Nações, 1000 - São Paulo, SP',
      website: 'www.holyspiritgym.com.br'
    };
  },

  async saveSettings(settings: HolySettings): Promise<void> {
    const { error } = await supabase.from('settings').upsert(settings);
    if (error) throw error;
  },

  async getBlogs(): Promise<any[]> {
    const { data } = await supabase.from('posts').select('*').order('createdAt', { ascending: false });
    return data || [];
  },

  async saveBlog(post: any): Promise<void> {
    const { error } = await supabase.from('posts').insert([post]);
    if (error) throw error;
  },

  async deleteBlog(id: string): Promise<void> {
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) throw error;
  },

  async getEvents(): Promise<HolyEvent[]> {
    const { data } = await supabase.from('events').select('*').order('date', { ascending: true });
    return data || [];
  },

  async saveEvent(event: any): Promise<void> {
    const { error } = await supabase.from('events').insert([event]);
    if (error) throw error;
  },

  async deleteEvent(id: string): Promise<void> {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) throw error;
  },

  async updateEvent(id: string, updates: Partial<HolyEvent>): Promise<void> {
    const { error } = await supabase.from('events').update(updates).eq('id', id);
    if (error) throw error;
  }
};
