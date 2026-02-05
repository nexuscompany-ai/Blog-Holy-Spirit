
import React from 'react';
import { Rocket, ChevronRight } from 'lucide-react';

const CTABanner: React.FC = () => {
  return (
    <section className="py-32 px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden bg-zinc-950 rounded-[60px] p-16 md:p-32 border border-white/5 group">
          {/* Animated Glows */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-neon/10 rounded-full blur-[120px] group-hover:bg-neon/20 transition-all duration-1000"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-neon/5 rounded-full blur-[120px]"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="text-center lg:text-left max-w-3xl space-y-8">
              <div className="inline-block p-4 bg-black border border-neon/30 rounded-2xl text-neon mb-4">
                <Rocket size={32} />
              </div>
              <h2 className="text-5xl md:text-8xl font-black leading-[0.85] tracking-tighter italic uppercase">
                O SEU <span className="text-neon">TEMPLO</span> <br /> 
                MERECE O MELHOR.
              </h2>
              <p className="text-zinc-500 text-xl md:text-2xl font-medium leading-relaxed">
                Fortaleça sua jornada física e espiritual com quem entende a importância de cuidar do corpo como um templo sagrado.
              </p>
            </div>

            <div className="flex flex-col gap-6 w-full lg:w-auto">
              <a 
                href="https://wa.me/5511999999999" 
                target="_blank"
                className="btn-primary text-xl px-12 py-8 rounded-[32px] group"
              >
                Matricule-se Agora <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform" />
              </a>
              <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.4em] text-center">
                Ganhe uma Aula Experimental Gratuita
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
