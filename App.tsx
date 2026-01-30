
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import WhyUs from './components/WhyUs';
import BlogSection from './components/BlogSection';
import CTABanner from './components/CTABanner';
import Footer from './components/Footer';
import AdminLayout from './components/admin/AdminLayout';
import Login from './components/admin/Login';
import { dbService, supabase } from './db';

const App: React.FC = () => {
  const [path, setPath] = useState(window.location.pathname);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Monitorar alterações de URL
    const handleLocationChange = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handleLocationChange);

    // 2. Monitorar estado da autenticação em tempo real
    const fetchInitialSession = async () => {
      const sess = await dbService.getSession();
      setSession(sess);
      setLoading(false);
    };

    fetchInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (currentSession) {
        const profile = await dbService.getSession();
        setSession(profile);
      } else {
        setSession(null);
      }
    });

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      authListener.subscription.unsubscribe();
    };
  }, []);

  const navigate = (to: string) => {
    window.history.pushState({}, '', to);
    setPath(to);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-neon border-t-transparent rounded-full animate-spin"></div>
          <p className="text-neon text-[10px] font-black uppercase tracking-widest animate-pulse">Autenticando Templo...</p>
        </div>
      </div>
    );
  }

  // LOGICA DE PROTEÇÃO DE ROTA (Middleware de Aplicação)
  if (path.startsWith('/admin')) {
    // Se não houver sessão ou não for admin, forçar Login
    if (!session || session.role !== 'admin') {
      return <Login onLoginSuccess={() => navigate('/admin')} />;
    }
    // Se autenticado como admin, mostrar Painel
    return <AdminLayout exitAdmin={() => navigate('/')} />;
  }

  // ROTA PÚBLICA
  return (
    <div className="min-h-screen flex flex-col selection:bg-[#cfec0f] selection:text-black">
      <Header onAdminClick={() => navigate('/admin')} />
      <main className="flex-grow">
        <Hero />
        <WhyUs />
        <BlogSection />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
};

export default App;
