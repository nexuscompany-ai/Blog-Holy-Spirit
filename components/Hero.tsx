
import React from 'react';
import { ArrowDown } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-black">
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
          <div className="inline-block bg-[#cfec0f]/10 border border-[#cfec0f]/30 text-[#cfec0f] px-3 py-1 rounded-md text-xs font-bold tracking-widest uppercase mb-6">
            Corpo, Mente e Espírito
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-[0.9] tracking-tighter">
            TREINE O SEU <br />
            <span className="text-[#cfec0f]">TEMPLO.</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl mb-10 leading-relaxed max-w-xl">
            A Holy Spirit une a excelência da musculação com a disciplina da fé. 
            Transforme seu físico enquanto fortalece seu espírito em um ambiente de honra e propósito.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-[#cfec0f] text-black font-black px-10 py-4 rounded-xl hover:shadow-[0_0_30px_rgba(207,236,15,0.4)] transition-all">
              AULA EXPERIMENTAL GRATUITA
            </button>
            <button className="border border-white/20 text-white font-bold px-10 py-4 rounded-xl hover:bg-white/5 transition-all">
              CONHECER O BLOG
            </button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-gray-600">
        <ArrowDown size={24} />
      </div>
    </section>
  );
};

export default Hero;
