
import React from 'react';

const CTABanner: React.FC = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden bg-gradient-to-br from-zinc-900 to-black rounded-[40px] p-12 md:p-20 border border-white/10 group">
          {/* Animated background element */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[#cfec0f]/5 -skew-x-12 translate-x-1/2 group-hover:translate-x-1/4 transition-transform duration-1000"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                Pronto para dar o Primeiro Passo <br className="hidden lg:block" /> 
                rumo a uma <span className="text-[#cfec0f]">Versão mais Saudável?</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-xl">
                Junte-se à Holy Spirit Gym hoje e sinta a diferença. 
                Nossa comunidade está esperando por você.
              </p>
            </div>
            <button className="bg-[#cfec0f] text-black text-xl font-black px-12 py-6 rounded-2xl hover:scale-105 hover:rotate-1 transition-all neon-shadow-hover whitespace-nowrap">
              Inscreva-se Hoje
            </button>
          </div>
          
          {/* Decorative mesh */}
          <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-[#cfec0f]/20 rounded-tl-3xl"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-[#cfec0f]/20 rounded-br-3xl"></div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
