
import React from 'react';
import { Zap, HeartPulse, Trophy } from 'lucide-react';

const WhyUs: React.FC = () => {
  const features = [
    {
      icon: <Zap className="text-[#cfec0f]" />,
      title: 'Dicas de Treino',
      desc: 'Desvende os segredos para otimizar seus treinos, desde o domínio de técnicas essenciais até a incorporação de abordagens inovadoras para ganhos mais rápidos.'
    },
    {
      icon: <HeartPulse className="text-[#cfec0f]" />,
      title: 'Conselhos Nutricionais',
      desc: 'Aprenda a nutrir seu corpo com escolhas saudáveis e manter uma dieta equilibrada e sustentável.'
    },
    {
      icon: <Trophy className="text-[#cfec0f]" />,
      title: 'Histórias de Sucesso',
      desc: 'Inspire-se com as conquistas incríveis de indivíduos que transformaram suas vidas através do fitness na Holy Spirit Gym.'
    }
  ];

  return (
    <section className="py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-4xl font-extrabold mb-6">Por que o Blog da Holy Spirit Gym?</h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Na Holy Spirit Gym, acreditamos que o fitness é uma jornada de crescimento contínuo e autoaperfeiçoamento. 
              Nosso blog é uma extensão do nosso compromisso em apoiá-lo neste caminho transformador, 
              seja você buscando rotinas de treino eficazes, conselhos nutricionais ou histórias de sucesso reais para inspirar seus resultados.
            </p>
          </div>
          <div className="space-y-12">
            <h3 className="text-2xl font-bold mb-8">O Que Esperar</h3>
            {features.map((f, i) => (
              <div key={i} className="flex gap-6 group">
                <div className="mt-1 p-3 bg-white/5 rounded-xl border border-white/10 group-hover:border-[#cfec0f]/50 transition-colors">
                  {f.icon}
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2 group-hover:text-[#cfec0f] transition-colors">{f.title}</h4>
                  <p className="text-gray-400 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
