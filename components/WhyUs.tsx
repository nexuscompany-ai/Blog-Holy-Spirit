
import React from 'react';
import { Dumbbell, Users, HeartPulse, Target } from 'lucide-react';

const WhyUs: React.FC = () => {
  const benefits = [
    {
      icon: <Dumbbell size={28} className="text-neon" />,
      title: 'Treino de Elite',
      desc: 'Equipamentos de última geração e metodologia focada em resultados reais e duradouros.',
      size: 'lg'
    },
    {
      icon: <Users size={28} className="text-neon" />,
      title: 'Comunidade',
      desc: 'Um ambiente de respeito e mútua evolução. Aqui, cada aluno é parte do Templo.',
      size: 'sm'
    },
    {
      icon: <HeartPulse size={28} className="text-neon" />,
      title: 'Saúde Integral',
      desc: 'Cuidado com o corpo, mente e espírito através de orientações técnicas e motivacionais.',
      size: 'sm'
    },
    {
      icon: <Target size={28} className="text-neon" />,
      title: 'Foco no Aluno',
      desc: 'Acompanhamento dedicado para garantir que você alcance sua melhor versão em honra ao Criador.',
      size: 'lg'
    }
  ];

  return (
    <section id="benefits" className="py-24 bg-black relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-16">
          <p className="text-neon text-[11px] font-black uppercase tracking-[0.5em] mb-4">Nossos Pilares</p>
          <h2 className="text-5xl md:text-7xl font-black uppercase italic italic leading-none tracking-tighter text-white">
            A ESSÊNCIA DA <br /><span className="text-neon">HOLY SPIRIT</span>
          </h2>
        </div>
        
        <div className="grid md:grid-cols-6 gap-4">
          {benefits.map((b, i) => (
            <div 
              key={i} 
              className={`glass-card p-10 rounded-[32px] group relative overflow-hidden ${b.size === 'lg' ? 'md:col-span-3' : 'md:col-span-2'}`}
            >
              <div className="mb-6 inline-block p-3 bg-black border border-white/5 rounded-2xl">
                {b.icon}
              </div>
              <h3 className="text-2xl font-black mb-3 uppercase italic tracking-tight text-white">{b.title}</h3>
              <p className="text-zinc-500 leading-relaxed font-medium text-sm">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
