
import { createClient } from 'https://esm.sh/@supabase/supabase-js@^2.48.1';

const supabaseUrl = 'https://xkapuhuuqqjmcxxrnpcf.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; 

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

export const dbService = {
  // AUTH
  async login(email: string, pass: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    if (error) throw error;
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();
      
    if (profileError || profile?.role !== 'admin') {
      await supabase.auth.signOut();
      throw new Error('Acesso restrito: conta sem privilégios.');
    }
    return data;
  },

  async signOut() {
    await supabase.auth.signOut();
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

  // SETTINGS
  async getSettings(): Promise<HolySettings> {
    const { data } = await supabase.from('settings').select('*').single();
    return data || {
      gymName: 'Holy Spirit Academia',
      phone: '5511999999999',
      instagram: '@holyspirit.gym',
      address: 'Av. das Nações, 1000 - SP',
      website: 'www.holyspiritgym.com.br'
    };
  },

  async saveSettings(settings: HolySettings): Promise<void> {
    await supabase.from('settings').upsert(settings);
  },

  // AUTOMATION (AUTO-PILOT)
  async getAutomationSettings(): Promise<AutomationSettings> {
    const { data } = await supabase.from('automation_settings').select('*').single();
    return data || {
      enabled: false,
      frequency_days: 3,
      topics: 'Musculação, Nutrição, Superação',
      target_category: 'Musculação'
    };
  },

  async saveAutomationSettings(settings: AutomationSettings): Promise<void> {
    await supabase.from('automation_settings').upsert({ ...settings, id: 'config' });
  },

  // BLOGS
  async getBlogs(): Promise<any[]> {
    const { data } = await supabase.from('posts').select('*').order('createdAt', { ascending: false });
    return data || [];
  },

  async saveBlog(post: any): Promise<void> {
    await supabase.from('posts').insert([post]);
  },

  async deleteBlog(id: string): Promise<void> {
    await supabase.from('posts').delete().eq('id', id);
  },

  // EVENTS
  async getEvents(): Promise<HolyEvent[]> {
    const { data } = await supabase.from('events').select('*').order('date', { ascending: true });
    return data || [];
  },

  async saveEvent(event: any): Promise<void> {
    await supabase.from('events').insert([event]);
  },

  async deleteEvent(id: string): Promise<void> {
    await supabase.from('events').delete().eq('id', id);
  },

  async updateEvent(id: string, updates: Partial<HolyEvent>): Promise<void> {
    await supabase.from('events').update(updates).eq('id', id);
  }
};
