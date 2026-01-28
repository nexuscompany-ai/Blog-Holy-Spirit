
import React from 'react';
import { ShieldCheck, Heart, Users } from 'lucide-react';

const WhyUs: React.FC = () => {
  const pillars = [
    {
      icon: <ShieldCheck className="text-[#cfec0f]" size={32} />,
      title: 'Ambiente de Honra',
      desc: 'Um espaço livre de vulgaridade, focado no respeito mútuo e na superação pessoal sob princípios cristãos.'
    },
    {
      icon: <Heart className="text-[#cfec0f]" size={32} />,
      title: 'Saúde Integral',
      desc: 'Entendemos que o cuidado com o corpo é um ato de adoração. Oferecemos suporte para longevidade e vigor.'
    },
    {
      icon: <Users className="text-[#cfec0f]" size={32} />,
      title: 'Comunidade Forte',
      desc: 'Muito mais que uma academia, somos uma família unida pelo propósito de ser a melhor versão de nós mesmos.'
    }
  ];

  return (
    <section className="py-24 bg-[#050505] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-black mb-4 italic uppercase">Nossa Missão</h2>
          <div className="h-1 w-20 bg-[#cfec0f] mx-auto"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-12">
          {pillars.map((p, i) => (
            <div key={i} className="group p-8 bg-zinc-900/30 rounded-3xl border border-white/5 hover:border-[#cfec0f]/30 transition-all duration-500">
              <div className="mb-6 inline-block p-4 bg-black rounded-2xl group-hover:scale-110 transition-transform">
                {p.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{p.title}</h3>
              <p className="text-gray-500 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
