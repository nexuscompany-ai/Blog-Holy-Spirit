
import React from 'react';
import { Instagram, Twitter, Facebook, Mail, MapPin, ChevronRight } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="space-y-8">
             <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#cfec0f] rounded-lg"></div>
              <span className="text-2xl font-extrabold tracking-tighter">
                HOLY<span className="text-[#cfec0f]">SPIRIT</span>
              </span>
            </a>
            <p className="text-gray-500 leading-relaxed">
              Redefinindo o fitness com espírito, força e comunidade. Junte-se a nós para acender sua jornada.
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-gray-400 hover:text-[#cfec0f] hover:border-[#cfec0f]/50 transition-all">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-8">Links Rápidos</h4>
            <ul className="space-y-4">
              {[
                { name: 'Início', label: 'Home' },
                { name: 'Planos', label: 'Membership' },
                { name: 'Aulas', label: 'Classes' },
                { name: 'Personal Training', label: 'Personal Training' },
                { name: 'Instalações', label: 'Facilities' },
                { name: 'Eventos', label: 'Events' },
                { name: 'Blogs', label: 'Blogs' }
              ].map((item) => (
                <li key={item.name}>
                  <a href="#" className="text-gray-500 hover:text-[#cfec0f] flex items-center gap-2 group transition-colors">
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" />
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-8">Fale Conosco</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <Mail className="text-[#cfec0f] shrink-0" size={20} />
                <span className="text-gray-500">ola@holyspirit.com</span>
              </li>
              <li className="flex items-start gap-4">
                <MapPin className="text-[#cfec0f] shrink-0" size={20} />
                <span className="text-gray-500">Rua Fitness, 123, Bairro Malhação <br /> São Paulo, SP</span>
              </li>
              <li className="pt-4">
                <span className="block text-white font-bold mb-1">Ajuda & Suporte</span>
                <a href="#" className="text-[#cfec0f] underline underline-offset-4">suporte@holyspirit.com</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-8">Galeria Recente</h4>
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden bg-zinc-900 border border-white/5 group relative">
                   <img 
                    src={`https://picsum.photos/seed/${i + 20}/300/300`} 
                    alt="Galeria" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                   />
                   <div className="absolute inset-0 bg-[#cfec0f]/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-white/5 text-gray-600 text-sm gap-4">
          <p>© 2024 Holy Spirit Gym. Todos os direitos reservados.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Termos e Condições</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
