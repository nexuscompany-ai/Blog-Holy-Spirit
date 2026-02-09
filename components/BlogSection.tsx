
import React, { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, MapPin, ArrowLeft, Sparkles, BookOpen, X, Clock, Info, MessageSquare } from 'lucide-react';
import { dbService, HolyEvent, HolySettings, supabase } from '../db';
import BlogCard from './BlogCard';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string; // O dbService já entrega o nome via Join
  image_url: string;
  created_at: string;
  published_at?: string | null;
}

const BlogSection: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [events, setEvents] = useState<HolyEvent[]>([]);
  const [activeTab, setActiveTab] = useState<'articles' | 'events'>('articles');
  const [settings, setSettings] = useState<HolySettings | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<HolyEvent | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [allPosts, allEvents, currentSettings] = await Promise.all([
          dbService.getBlogs(),
          dbService.getEvents().catch(() => []),
          dbService.getSettings()
        ]);

        const now = new Date();
        const publishedPosts = allPosts.filter((p: any) => {
          const pDate = p.published_at;
          return pDate ? new Date(pDate) <= now : false;
        });

        setPosts(publishedPosts);
        setEvents(allEvents.filter((e: any) => e.status === 'active'));
        setSettings(currentSettings);
      } catch (err) {
        console.error("Erro no feed público:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    const handleHash = () => {
      if (window.location.hash === '#eventos') setActiveTab('events');
      else if (window.location.hash === '#blog') setActiveTab('articles');
    };
    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  if (selectedPost) {
    return (
      <section className="py-32 bg-black min-h-screen">
        <div className="max-w-4xl mx-auto px-6">
          <button 
            onClick={() => setSelectedPost(null)}
            className="flex items-center gap-3 text-neon font-black text-[11px] uppercase tracking-[0.4em] mb-16 hover:-translate-x-2 transition-transform"
          >
            <ArrowLeft size={16} /> Voltar para o Feed
          </button>

          <article className="space-y-16 animate-in fade-in duration-700">
            <header className="space-y-8 text-center">
              <span className="bg-neon text-black px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                {selectedPost.category || 'Templo'}
              </span>
              <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.85] text-white">
                {selectedPost.title}
              </h1>
            </header>

            {selectedPost.image_url && selectedPost.image_url.length > 20 && (
              <div className="aspect-video rounded-[60px] overflow-hidden border border-white/5 shadow-2xl relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                <img src={selectedPost.image_url} alt={selectedPost.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="prose prose-invert max-w-none text-zinc-400 text-xl leading-loose space-y-10 font-medium pb-20 blog-content-view">
              <div dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
            </div>

            <div className="pt-32 border-t border-white/5">
              <div className="glass-card p-16 rounded-[60px] text-center space-y-10 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-neon/10 rounded-full blur-3xl"></div>
                <h3 className="text-4xl font-black uppercase italic text-white">Inspirado pela Performance?</h3>
                <p className="text-zinc-500 text-lg max-w-xl mx-auto">Transforme seu templo hoje mesmo. Comece sua jornada na Holy Spirit.</p>
                <a 
                  href={`https://wa.me/${settings?.phone?.replace(/\D/g, '') || '5511999999999'}`}
                  target="_blank"
                  className="btn-primary mx-auto inline-flex"
                >
                  Matricule-se Agora
                </a>
              </div>
            </div>
          </article>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="py-32 bg-black">
      {selectedEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/80 animate-in fade-in duration-300">
          <div className="bg-zinc-950 border border-white/10 w-full max-w-3xl rounded-[40px] overflow-hidden shadow-2xl animate-