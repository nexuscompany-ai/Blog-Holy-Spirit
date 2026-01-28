
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
    <nav className="fixed w-full z-50 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-2 group">
              <div className="w-6 h-6 bg-[#cfec0f] rounded-sm rotate-45 group-hover:rotate-0 transition-all duration-300"></div>
              <span className="text-xl font-extrabold tracking-tighter text-white uppercase">
                HOLY<span className="text-[#cfec0f]">SPIRIT</span>
              </span>
            </a>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-400 hover:text-[#cfec0f] text-[10px] font-black uppercase tracking-widest transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <button 
                onClick={onAdminClick}
                className="text-gray-500 hover:text-[#cfec0f] transition-colors"
                title="Área Admin"
              >
                <Settings size={18} />
              </button>
              <a 
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#cfec0f] text-black font-black px-8 py-3 rounded-xl text-[10px] uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2"
              >
                <MessageCircle size={14} /> FALAR NO WHATSAPP
              </a>
            </div>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-[#cfec0f]">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[#0a0a0a] border-b border-white/10">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-300 block text-sm font-black uppercase tracking-widest border-b border-white/5 pb-2"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <a href={waLink} className="text-[#cfec0f] font-black uppercase text-xs block py-2">WhatsApp do Templo</a>
            <button onClick={onAdminClick} className="text-gray-600 font-black uppercase text-[10px] block py-2">Dashboard Admin</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
