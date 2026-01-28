
import React from 'react';
import { Mail, Phone, Instagram, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">
          <div className="col-span-1">
            <a href="/" className="flex items-center gap-2 mb-8">
              <div className="w-6 h-6 bg-[#cfec0f] rounded-sm rotate-45"></div>
              <span className="text-2xl font-black tracking-tighter text-white">
                HOLY<span className="text-[#cfec0f]">SPIRIT</span>
              </span>
            </a>
            <p className="text-gray-500 max-w-xs leading-relaxed mb-8">
              Treinando corpos, fortalecendo espíritos. Uma comunidade dedicada à excelência física e espiritual.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-3 bg-zinc-900 rounded-xl text-gray-400 hover:text-[#cfec0f] transition-all">
                <Instagram size={20} />
              </a>
              <a href="#" className="p-3 bg-zinc-900 rounded-xl text-gray-400 hover:text-[#cfec0f] transition-all">
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div className="col-span-1">
            <h4 className="text-white font-black uppercase tracking-widest text-sm mb-8">Nossa Localização</h4>
            <div className="space-y-4">
              <p className="flex items-center gap-3 text-gray-500">
                <MapPin className="text-[#cfec0f]" size={18} />
                Av. das Nações, 1000 - São Paulo, SP
              </p>
              <p className="flex items-center gap-3 text-gray-500">
                <Phone className="text-[#cfec0f]" size={18} />
                (11) 99999-9999
              </p>
            </div>
          </div>

          <div className="col-span-1">
            <h4 className="text-white font-black uppercase tracking-widest text-sm mb-8">Newsletter do Templo</h4>
            <p className="text-gray-500 text-sm mb-4">Receba dicas de treino e mensagens semanais de edificação.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Seu e-mail principal" 
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#cfec0f] outline-none transition-all"
              />
              <button className="absolute right-2 top-2 bg-[#cfec0f] text-black text-[10px] font-black px-4 py-1.5 rounded-lg">
                ASSINAR
              </button>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-700 font-bold uppercase tracking-widest">
          <p>© 2024 HOLY SPIRIT ACADEMIA. TREINE PARA GLÓRIA DE DEUS.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white">Privacidade</a>
            <a href="#" className="hover:text-white">Termos</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
