
import React from 'react';
import { PencilLine, BrainCircuit, Rocket } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <PencilLine size={32} />,
      title: 'Briefing Rápido',
      desc: 'Insira o tema ou uma dor do seu aluno (ex: Como começar no agachamento).'
    },
    {
      icon: <BrainCircuit size={32} />,
      title: 'IA Processa',
      desc: 'Nossa IA avançada gera um post técnico com imagens e SEO otimizado.'
    },
    {
      icon: <Rocket size={32} />,
      title: 'Publicação Instantânea',
      desc: 'Revise e publique em um clique diretamente no blog da sua academia.'
    }
  ];

  return (
    <section id="how-it-works" className="py-32 bg-zinc-950/30 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-24">
          <h2 className="section-title">DO BRIEFING AO POST <br /><span className="text-neon">EM SEGUNDOS</span></h2>
        </div>

        <div className="grid md:grid-cols-3 gap-16 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 -z-10"></div>

          {steps.map((s, i) => (
            <div key={i} className="flex flex-col items-center text-center space-y-8 group">
              <div className="w-24 h-24 bg-zinc-900 border border-white/10 rounded-[32px] flex items-center justify-center text-neon shadow-2xl group-hover:bg-neon group-hover:text-black transition-all duration-500 rotate-12 group-hover:rotate-0">
                {s.icon}
              </div>
              <div className="space-y-4">
                <span className="text-[10px] font-black text-neon uppercase tracking-[0.4em]">Passo 0{i+1}</span>
                <h3 className="text-2xl font-black uppercase italic tracking-tight">{s.title}</h3>
                <p className="text-zinc-500 max-w-[280px] font-medium leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
