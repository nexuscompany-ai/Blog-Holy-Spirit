
import React, { useEffect, useState } from 'react';
import { Instagram, MapPin, MessageCircle, Lock, Phone } from 'lucide-react';
import { dbService, HolySettings } from '../db';
import Logo from './Logo';

const Footer: React.FC = () => {
  const [settings, setSettings] = useState<HolySettings | null>(null);

  useEffect(() => {
    dbService.getSettings().then(setSettings);
  }, []);

  const currentSettings = settings || {
    phone: '(11) 99999-9999',
    instagram: 'https://instagram.com/holyspirit.gym',
    address: 'Av. das Nações, 1000 - SP'
  };

  const waLink = `https://wa.me/${currentSettings.phone.replace(/\D/g, '')}`;

  return (
    <footer className="bg-black pt-24 pb-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <div className="col-span-1 lg:col-span-2">
            <a href="/" className="flex items-center gap-4 mb-8 group">
              <Logo className="w-12 h-12 group-hover:rotate-12 transition-transform duration-500" />
              <span className="text-3xl font-black tracking-tighter text-white uppercase italic">
                HOLY<span className="text-neon">SPIRIT</span>
              </span>
            </a>
            <p className="text-gray-500 max-w-md leading-relaxed mb-10 text-lg">
              Corpos treinados, espíritos fortalecidos. Nossa missão é a excelência integral em honra ao Criador.
            </p>
            <div className="flex gap-4">
              <a 
                href={currentSettings.instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-4 bg-zinc-900 rounded-2xl text-gray-400 hover:text-neon transition-all hover:scale-110"
              >
                <Instagram size={24} />
              </a>
              <a 
                href={waLink} 
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-zinc-900 rounded-2xl text-gray-400 hover:text-neon transition-all hover:scale-110"
              >
                <MessageCircle size={24} />
              </a>
            </div>
          </div>

          <div className="col-span-1">
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-[10px] mb-8">O Templo</h4>
            <div className="space-y-6">
              <p className="flex items-start gap-4 text-gray-500 text-sm">
                <MapPin className="text-neon shrink-0" size={18} />
                {currentSettings.address}
              </p>
              <p className="flex items-center gap-4 text-gray-500 text-sm font-bold">
                <Phone className="text-neon" size={18} />
                {currentSettings.phone}
              </p>
            </div>
          </div>

          <div className="col-span-1">
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-[10px] mb-8">Atendimento</h4>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Dúvidas sobre o blog, eventos ou visitas ao templo? 
            </p>
            <a 
              href={waLink}
              target="_blank"
              className="bg-neon text-black font-black py-4 px-8 rounded-2xl text-[10px] uppercase tracking-widest inline-block hover:shadow-[0_10px_30px_rgba(207,236,15,0.2)] transition-all text-center"
            >
              CHAMAR NO WHATSAPP
            </a>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] text-gray-700 font-black uppercase tracking-[0.3em]">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p>© 2024 HOLY SPIRIT ACADEMIA. TREINE O TEMPLO.</p>
            <a href="/admin" className="flex items-center gap-1 text-gray-800 hover:text-zinc-600 transition-colors lowercase italic">
               <Lock size={10} /> portal interno
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
