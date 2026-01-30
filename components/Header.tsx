
import React, { useState, useEffect } from 'react';
import { Menu, X, Shield } from 'lucide-react';
import { dbService, HolySettings } from '../db';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState<HolySettings | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    dbService.getSettings().then(setSettings);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Links atualizados conforme solicitação
  const navLinks = [
    { name: 'Blog', href: '#blog' },
    { name: 'Eventos', href: '#blog' },
  ];

  const whatsappNumber = settings?.phone?.replace(/\D/g, '') || '5511999999999';
  const waLink = `https://wa.me/${whatsappNumber}`;

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'py-4 bg-black/95 backdrop-blur-xl border-b border-white/5' : 'py-8 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-neon rounded-lg rotate-12 group-hover:rotate-0 transition-transform duration-500 flex items-center justify-center shadow-[0_0_20px_rgba(207,236,15,0.3)]">
              <Shield size={18} className="text-black fill-black" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white uppercase italic">
              HOLY<span className="text-neon">SPIRIT</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-zinc-400 hover:text-neon text-[11px] font-bold uppercase tracking-[0.2em] transition-colors"
              >
                {link.name}
              </a>
            ))}
            <a 
              href={waLink}
              target="_blank"
              className="px-8 py-3 bg-neon text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-neon/20"
            >
              Matricule-se
            </a>
          </div>

          {/* Mobile Hamburguer Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-white p-2 hover:text-neon transition-colors"
              aria-label="Menu"
            >
              {isOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-40 bg-black transition-all duration-500 md:hidden ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}`}>
        <div className="flex flex-col items-center justify-center h-full space-y-10 px-6">
          <a 
            href="#blog" 
            className="text-4xl font-black uppercase italic tracking-tighter text-white hover:text-neon"
            onClick={() => setIsOpen(false)}
          >
            Blog
          </a>
          <a 
            href="#blog" 
            className="text-4xl font-black uppercase italic tracking-tighter text-white hover:text-neon"
            onClick={() => setIsOpen(false)}
          >
            Eventos
          </a>
          <div className="w-full pt-10">
            <a 
              href={waLink} 
              className="w-full py-6 bg-neon text-black flex items-center justify-center rounded-2xl text-sm font-black uppercase tracking-widest shadow-2xl"
              onClick={() => setIsOpen(false)}
            >
              Matricule-se Agora
            </a>
          </div>
          
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-8 right-8 text-zinc-500 hover:text-white"
          >
            <X size={40} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
