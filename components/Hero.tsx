
import React from 'react';
import { ArrowRight, Trophy, Activity } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/80 to-black z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=2069"
          alt="Holy Spirit Gym"
          className="w-full h-full object-cover grayscale opacity-50"
        />
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-neon/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-20 w-full">
        <div className="max-w-4xl space-y-8">
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-md">
            <Trophy size={14} className="text-neon" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300">O Templo da Performance</span>
          </div>
          
          <h1 className="text-6xl md:text-9xl font-black uppercase italic leading-[0.85] tracking-tighter text-white">
            TREINE O <br />
            <span className="text-neon neon-glow">TEMPLO.</span>
          </h1>
          
          <p className="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-2xl font-medium">
            Na Holy Spirit, unimos a força física bruta à clareza mental e espiritual. Explore nosso blog para conteúdos exclusivos de treino, nutrição e mentalidade.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <a href="#blog" className="btn-primary group">
              Explorar Blog <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="https://wa.me/5511999999999" target="_blank" className="btn-secondary">
              <Activity size={18} className="text-neon" /> Aula Experimental
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
