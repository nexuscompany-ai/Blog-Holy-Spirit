
import React from 'react';
import { Play } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-start gap-4 mb-8">
          <div className="flex gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-2 h-8 bg-[#cfec0f] rounded-full"></div>
            ))}
          </div>
          <span className="text-[#cfec0f] font-semibold tracking-widest uppercase text-sm">Nossos Blogs</span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-12 leading-tight">
          Incendeie sua <br />
          Jornada Fitness com <br />
          o Blog da <span className="text-[#cfec0f]">Holy Spirit!</span>
        </h1>

        <div className="relative rounded-3xl overflow-hidden aspect-video lg:aspect-[21/9] group cursor-pointer shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=2070"
            alt="Ambiente da Academia"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <div className="w-20 h-20 bg-[#cfec0f] rounded-full flex items-center justify-center text-black animate-pulse group-hover:scale-110 transition-transform">
              <Play fill="black" size={32} />
            </div>
          </div>
          <div className="absolute bottom-8 left-8 right-8 text-white">
             <p className="text-xl font-medium max-w-2xl hidden md:block">
              "Sua fonte de insights sobre fitness, dicas de nutrição e histórias inspiradoras"
             </p>
          </div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-[#cfec0f]/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-[#cfec0f]/10 rounded-full blur-[100px]"></div>
    </section>
  );
};

export default Hero;
