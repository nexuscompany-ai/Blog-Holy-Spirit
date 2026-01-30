
import React from 'react';
import { ShieldCheck, Heart, Users } from 'lucide-react';

const WhyUs: React.FC = () => {
  const pillars = [
    {
      icon: <ShieldCheck className="text-neon" size={32} />,
      title: 'Ambiente de Honra',
      desc: 'Um espaço livre de vulgaridade, focado no respeito mútuo e na superação pessoal sob princípios cristãos.'
    },
    {
      icon: <Heart className="text-neon" size={32} />,
      title: 'Saúde Integral',
      desc: 'Entendemos que o cuidado com o corpo é um ato de adoração. Oferecemos suporte para longevidade e vigor.'
    },
    {
      icon: <Users className="text-neon" size={32} />,
      title: 'Comunidade Forte',
      desc: 'Muito mais que uma academia, somos uma família unida pelo propósito de ser a melhor versão de nós mesmos.'
    }
  ];

  return (
    <section className="py-32 bg-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-24">
          <h2 className="text-5xl md:text-7xl font-black mb-6 italic uppercase leading-none tracking-tightest">
            NOSSA <span className="text-neon neon-glow">MISSÃO</span>
          </h2>
          <div className="h-1 w-24 bg-neon shadow-[0_0_15px_rgba(207,236,15,0.5)]"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((p, i) => (
            <div key={i} className="group glass-card p-10 rounded-[40px] hover:border-neon/30 transition-all duration-500">
              <div className="mb-8 inline-block p-5 bg-black rounded-2xl group-hover:scale-110 transition-transform shadow-inner">
                {p.icon}
              </div>
              <h3 className="text-2xl font-black mb-4 uppercase italic tracking-tight">{p.title}</h3>
              <p className="text-zinc-500 leading-relaxed font-medium">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
