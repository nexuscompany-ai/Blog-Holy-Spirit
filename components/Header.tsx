
import React, { useState } from 'react';
import { Menu, X, Settings, MessageCircle } from 'lucide-react';

interface HeaderProps {
  onAdminClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAdminClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const settings = JSON.parse(localStorage.getItem('hs_settings') || '{"phone": "5511999999999"}');
  const waLink = `https://wa.me/${settings.phone.replace(/\D/g, '')}`;

  const navLinks = [
    { name: 'Início', href: '#' },
    { name: 'Blog do Templo', href: '#blog' },
    { name: 'Eventos', href: '#blog' },
  ];

  return (
    <nav className="fixed w-full z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-2 group">
              <div className="w-6 h-6 bg-neon rounded-sm rotate-45 group-hover:rotate-0 transition-all duration-500 shadow-[0_0_15px_rgba(207,236,15,0.5)]"></div>
              <span className="text-xl font-black tracking-tightest text-white uppercase italic">
                HOLY<span className="text-neon">SPIRIT</span>
              </span>
            </a>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-10">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-zinc-500 hover:text-neon text-[10px] font-black uppercase tracking-[0.2em] transition-all"
                >
                  {link.name}
                </a>
              ))}
              <button 
                onClick={onAdminClick}
                className="text-zinc-600 hover:text-neon transition-colors"
              >
                <Settings size={18} />
              </button>
              <a 
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-holy px-8 py-3 rounded-xl text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg"
              >
                <MessageCircle size={14} /> WHATSAPP
              </a>
            </div>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-neon">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-2xl border-b border-white/5 p-8 space-y-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-white block text-2xl font-black uppercase italic tracking-tighter"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <a href={waLink} className="text-neon font-black uppercase text-sm block pt-4">WhatsApp</a>
        </div>
      )}
    </nav>
  );
};

export default Header;
