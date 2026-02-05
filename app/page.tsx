
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import WhyUs from '../components/WhyUs';
import BlogSection from '../components/BlogSection';
import CTABanner from '../components/CTABanner';
import Footer from '../components/Footer';
import AdminLayout from '../components/admin/AdminLayout';
import Login from '../components/admin/Login';
import { dbService, supabase } from '../db';

export default function Home() {
  const [path, setPath] = useState(typeof window !== 'undefined' ? window.location.pathname : '/');
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);

  const fetchSession = async () => {
    try {
      const sess = await dbService.getSession();
      if (isMounted.current) setSession(sess);
    } catch (err) {
      console.error("Auth initialization failed:", err);
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  useEffect(() => {
    isMounted.current = true;

    const handleLocationChange = () => {
      if (isMounted.current) setPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);

    fetchSession();

    // Use type assertion to avoid property missing error on SupabaseAuthClient
    const { data: authListener } = (supabase.auth as any).onAuthStateChange(async (event: any, currentSession: any) => {
      if (!isMounted.current) return;
      if (currentSession) {
        const profile = await dbService.getSession();
        setSession(profile);
      } else {
        // No modo demo, não limpamos se houver sessão manual
        const demoSess = localStorage.getItem('holy_demo_session');
        if (!demoSess) setSession(null);
      }
    });

    return () => {
      isMounted.current = false;
      window.removeEventListener('popstate', handleLocationChange);
      authListener.subscription.unsubscribe();
    };
  }, []);

  const navigate = (to: string) => {
    window.history.pushState({}, '', to);
    setPath(to);
    window.scrollTo(0, 0);
  };

  const handleLoginSuccess = async () => {
    // Re-busca a sessão imediatamente após o login bem-sucedido
    await fetchSession();
    navigate('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-4 border-neon border-t-transparent rounded-full animate-spin"></div>
          <p className="text-neon text-[10px] font-black uppercase tracking-[0.5em] animate-pulse italic">Santificando Templo...</p>
        </div>
      </div>
    );
  }

  // Admin Route Protection
  if (path.startsWith('/admin')) {
    if (!session || session.role !== 'admin') {
      return <Login onLoginSuccess={handleLoginSuccess} />;
    }
    return <AdminLayout exitAdmin={() => navigate('/')} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-black selection:bg-neon selection:text-black">
      <Header />
      <main className="flex-grow animate-in fade-in duration-1000">
        <Hero />
        <WhyUs />
        <BlogSection />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}
