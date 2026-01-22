
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Início', href: '#' },
    { name: 'Planos', href: '#' },
    { name: 'Aulas', href: '#' },
    { name: 'Personal Trainer', href: '#' },
    { name: 'Instalações', href: '#' },
    { name: 'Blogs', href: '#' },
    { name: 'Eventos', href: '#' },
  ];

  return (
    <nav className="fixed w-full z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-[#cfec0f] rounded-lg rotate-12 group-hover:rotate-0 transition-transform"></div>
              <span className="text-2xl font-extrabold tracking-tighter">
                HOLY<span className="text-[#cfec0f]">SPIRIT</span>
              </span>
            </a>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-300 hover:text-[#cfec0f] px-3 py-2 text-sm font-medium transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <button className="bg-[#cfec0f] text-black font-bold px-5 py-2 rounded-full text-sm hover:brightness-110 transition-all neon-shadow-hover">
                Fale Conosco
              </button>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-[#0a0a0a] border-b border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-300 hover:text-[#cfec0f] block px-3 py-4 text-base font-medium border-b border-white/5"
              >
                {link.name}
              </a>
            ))}
            <button className="w-full bg-[#cfec0f] text-black font-bold py-4 mt-4 rounded-lg">
              Fale Conosco
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
