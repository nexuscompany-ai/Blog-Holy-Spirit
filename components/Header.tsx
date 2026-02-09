
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { dbService, HolySettings } from '../db';
import Logo from './Logo';

interface HeaderProps {
  onAdminClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAdminClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState<HolySettings | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    dbService.getSettings().then(setSettings);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Trava a rolagem do body quando o menu mobile está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navLinks = [
    { name: 'Blog', href: '#blog' },
    { name: 'Eventos', href: '#eventos' },
  ];

  const whatsappNumber = settings?.phone?.replace(/\D/g, '') || '5511999999999';
  const waLink = `https://wa.me/${whatsappNumber}`;

  return (
    <nav className={`fixed w-full z-[60] transition-all duration-500 ${scrolled ? 'py-4 bg-black/95 backdrop-blur-xl border-b border-white/5' : 'py-6 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 group shrink-0">
            <div className="transition-transform duration-500 group-hover:scale-110">
              <Logo className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tighter text-white uppercase italic">
              HOLY<span className="text-neon">SPIRIT</span>
            </span>
          </a>

          {/* Desktop Nav */}
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

          {/* Hamburger Icon */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(true)} 
              className="text-white p-2 hover:text-neon transition-colors"
              aria-label="Abrir menu"
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Fullscreen Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-[70] bg-black flex flex-col items-center justify-center p-6 animate-in fade-in duration-300 overflow-hidden w-screen h-screen max-w-full max-h-full">
          {/* Close Button - fixed position to stay visible */}
          <button 
            onClick={() => setIsOpen(false)} 
            className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors p-2"
            aria-label="Fechar menu"
          >
            <X size={32} />
          </button>

          {/* Mobile Menu Logo */}
          <div className="mb-12">
            <Logo className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-xl font-black italic text-white text-center tracking-tighter uppercase">
              HOLY<span className="text-neon">SPIRIT</span>
            </h2>
          </div>

          {/* Links e CTAs - Contidos no Viewport */}
          <div className="flex flex-col items-center gap-8 w-full max-w-[300px] overflow-y-auto custom-scrollbar">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href} 
                onClick={() => setIsOpen(false)} 
                className="text-4xl font-black uppercase italic text-white hover:text-neon transition-colors"
              >
                {link.name}
              </a>
            ))}
            
            <div className="w-full h-px bg-white/5 my-4"></div>

            <a 
              href={waLink} 
              target="_blank"
              onClick={() => setIsOpen(false)} 
              className="w-full py-5 bg-neon text-black rounded-2xl font-black uppercase tracking-widest text-center text-sm shadow-xl shadow-neon/20 hover:scale-105 transition-all"
            >
              Matricule-se Agora
            </a>

            <button
              onClick={() => { setIsOpen(false); onAdminClick?.(); }}
              className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-zinc-400"
            >
              Portal do Templo
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
