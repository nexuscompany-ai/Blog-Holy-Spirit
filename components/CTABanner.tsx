
import React from 'react';
import { MessageCircle } from 'lucide-react';

const CTABanner: React.FC = () => {
  const settings = JSON.parse(localStorage.getItem('hs_settings') || '{"phone": "5511999999999"}');
  const waLink = `https://wa.me/${settings.phone.replace(/\D/g, '')}`;

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden bg-gradient-to-br from-zinc-900 to-black rounded-[50px] p-16 md:p-24 border border-white/5 group">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[#cfec0f]/5 -skew-x-12 translate-x-1/2 group-hover:translate-x-1/4 transition-transform duration-1000"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="text-center lg:text-left max-w-2xl">
              <h2 className="text-5xl md:text-7xl font-black mb-8 leading-[0.9] tracking-tighter italic uppercase">
                O SEU <span className="text-[#cfec0f]">TEMPLO</span> <br /> 
                MERECE O MELHOR.
              </h2>
              <p className="text-gray-500 text-xl font-medium leading-relaxed">
                Nossa equipe está pronta para te receber e tirar todas as suas dúvidas sobre treinos, eventos e propósito. Chame agora no WhatsApp.
              </p>
            </div>
            <a 
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#cfec0f] text-black text-xl font-black px-16 py-8 rounded-[32px] hover:scale-105 hover:rotate-1 transition-all shadow-[0_20px_60px_rgba(207,236,15,0.2)] whitespace-nowrap flex items-center gap-4 uppercase tracking-tighter"
            >
              <MessageCircle size={28} /> CHAMAR NO WHATSAPP
            </a>
          </div>
          
          <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-[#cfec0f]/10 rounded-tl-[50px]"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-[#cfec0f]/10 rounded-br-[50px]"></div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
