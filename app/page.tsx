
'use client';

import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    let isMounted = true;

    const handleLocationChange = () => {
      if (isMounted) setPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);

    const fetchInitialSession = async () => {
      try {
        const sess = await dbService.getSession();
        if (isMounted) {
          setSession(sess);
        }
      } catch (err: any) {
        // Ignore abort errors which are common during component re-mounts/Strict Mode
        if (err.name !== 'AbortError' && !err.message?.includes('aborted')) {
          console.error("Auth error:", err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (currentSession) {
        try {
          const profile = await dbService.getSession();
          if (isMounted) setSession(profile);
        } catch (e) {
          // Silent catch for auth state change errors
        }
      } else {
        if (isMounted) setSession(null);
      }
    });

    return () => {
      isMounted = false;
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
        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-4 border-neon border-t-transparent rounded-full animate-spin"></div>
          <p className="text-neon text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Iniciando Templo...</p>
        </div>
      </div>
    );
  }

  // Admin access strictly via /admin path
  if (path.startsWith('/admin')) {
    if (!session || session.role !== 'admin') {
      return <Login onLoginSuccess={() => navigate('/admin')} />;
    }
    return <AdminLayout exitAdmin={() => navigate('/')} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-black selection:bg-neon selection:text-black">
      <Header />
      <main className="flex-grow">
        <Hero />
        <WhyUs />
        <BlogSection />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}
