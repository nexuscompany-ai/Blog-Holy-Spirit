
import React from 'react';
import { ArrowDown, MessageCircle, BookOpen } from 'lucide-react';

const Hero: React.FC = () => {
  const settings = JSON.parse(localStorage.getItem('hs_settings') || '{"phone": "5511999999999"}');
  const waLink = `https://wa.me/${settings.phone.replace(/\D/g, '')}`;

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=2070"
          alt="Treino e Disciplina"
          className="w-full h-full object-cover opacity-40 grayscale"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="max-w-3xl">
          <div className="inline-block bg-[#cfec0f]/10 border border-[#cfec0f]/30 text-[#cfec0f] px-4 py-1.5 rounded-lg text-[10px] font-black tracking-[0.3em] uppercase mb-8 shadow-inner">
            Corpo • Mente • Espírito
          </div>
          <h1 className="text-7xl md:text-9xl font-black mb-8 leading-[0.85] tracking-tighter italic uppercase">
            TREINE O SEU <br />
            <span className="text-[#cfec0f]">TEMPLO.</span>
          </h1>
          <p className="text-gray-500 text-lg md:text-xl mb-12 leading-relaxed max-w-xl font-medium">
            A Holy Spirit une a excelência da musculação com a disciplina da fé. 
            Transforme seu físico enquanto fortalece seu espírito em um ambiente de honra e propósito.
          </p>
          <div className="flex flex-wrap gap-6">
            <a 
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#cfec0f] text-black font-black px-12 py-5 rounded-2xl hover:shadow-[0_0_40px_rgba(207,236,15,0.4)] transition-all flex items-center gap-3 text-xs uppercase tracking-widest"
            >
              <MessageCircle size={18} /> AGENDAR VISITA
            </a>
            <a 
              href="#blog"
              className="bg-zinc-900 border border-white/10 text-white font-black px-12 py-5 rounded-2xl hover:bg-zinc-800 transition-all flex items-center gap-3 text-xs uppercase tracking-widest"
            >
              <BookOpen size={18} /> LER O BLOG
            </a>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-gray-800">
        <ArrowDown size={32} />
      </div>
    </section>
  );
};

export default Hero;
