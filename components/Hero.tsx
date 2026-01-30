
import React from 'react';
import { ArrowDown, MessageCircle, BookOpen } from 'lucide-react';

const Hero: React.FC = () => {
  const settings = JSON.parse(localStorage.getItem('hs_settings') || '{"phone": "5511999999999"}');
  const waLink = `https://wa.me/${settings.phone.replace(/\D/g, '')}`;

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-black">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=2070"
          alt="Treino e Disciplina"
          className="w-full h-full object-cover opacity-50 grayscale contrast-125"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="max-w-4xl">
          <div className="inline-block bg-neon/10 border border-neon/30 text-neon px-5 py-2 rounded-full text-[10px] font-black tracking-[0.4em] uppercase mb-10 shadow-[0_0_20px_rgba(207,236,15,0.1)]">
            Corpo • Mente • Espírito
          </div>
          
          <h1 className="text-[14vw] md:text-[10rem] font-black mb-8 leading-[0.8] tracking-tightest italic uppercase text-white">
            TREINE O <br />
            <span className="text-neon neon-glow">TEMPLO.</span>
          </h1>
          
          <p className="text-zinc-500 text-lg md:text-2xl mb-12 leading-relaxed max-w-xl font-medium">
            A Holy Spirit une a excelência da musculação com a disciplina da fé. 
            Transforme seu físico enquanto fortalece seu espírito.
          </p>

          <div className="flex flex-wrap gap-6">
            <a 
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-holy px-10 py-5 rounded-2xl flex items-center gap-3 text-xs tracking-widest uppercase"
            >
              <MessageCircle size={20} /> AGENDAR VISITA
            </a>
            <a 
              href="#blog"
              className="bg-zinc-900/40 backdrop-blur-md border border-white/10 text-white font-black px-12 py-5 rounded-2xl hover:bg-zinc-800 transition-all flex items-center gap-3 text-xs uppercase tracking-widest"
            >
              <BookOpen size={20} /> LER O BLOG
            </a>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-neon/20">
        <ArrowDown size={40} />
      </div>
    </section>
  );
};

export default Hero;
