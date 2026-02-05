
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
          <a href="/" className="flex items-center gap-4 group">
            <div className="transition-transform duration-500 group-hover:scale-110">
              <Logo className="w-10 h-10" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white uppercase italic">
              HOLY<span className="text-neon">SPIRIT</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.name === 'Eventos' ? '#eventos' : link.href}
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

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2">
              {isOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black flex flex-col items-center justify-center space-y-10 md:hidden">
          <a href="#blog" onClick={() => setIsOpen(false)} className="text-4xl font-black uppercase italic text-white">Blog</a>
          <a href="#eventos" onClick={() => setIsOpen(false)} className="text-4xl font-black uppercase italic text-white">Eventos</a>
          <a href={waLink} onClick={() => setIsOpen(false)} className="px-12 py-5 bg-neon text-black rounded-2xl font-black uppercase tracking-widest">Matricule-se</a>
          <button onClick={() => setIsOpen(false)} className="absolute top-8 right-8 text-zinc-500"><X size={40} /></button>
        </div>
      )}
    </nav>
  );
};

export default Header;
