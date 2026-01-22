
import React from 'react';
import BlogCard from './BlogCard';

const BlogSection: React.FC = () => {
  const blogs = [
    {
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800',
      category: 'Dicas de Treino',
      title: '5 Maneiras Eficazes de Aumentar sua Resistência Cardiovascular',
      desc: 'Eleve seu nível no cárdio com estas técnicas baseadas em pesquisas, projetadas para todos os níveis de condicionamento.',
      author: { name: 'João Silva', avatar: 'https://i.pravatar.cc/150?u=john' },
      date: '15 de Julho, 2024',
      readTime: '5 min de leitura'
    },
    {
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
      category: 'Dicas de Treino',
      title: 'O Poder dos Exercícios Compostos: Por que Você Precisa Deles',
      desc: 'Descubra por que o levantamento terra, agachamento e supinos são os reis de todos os exercícios para o crescimento muscular.',
      author: { name: 'Sara Oliveira', avatar: 'https://i.pravatar.cc/150?u=sarah' },
      date: '5 de Agosto, 2024',
      readTime: '4 min de leitura'
    },
    {
      image: 'https://images.unsplash.com/photo-1574673139084-c2a115482343?auto=format&fit=crop&q=80&w=800',
      category: 'Mobilidade',
      title: 'Equilibrando Flexibilidade e Estabilidade na sua Rotina',
      desc: 'Domine a arte de ser forte e ágil com nosso guia completo de mobilidade funcional.',
      author: { name: 'Cristiano Pereira', avatar: 'https://i.pravatar.cc/150?u=kris' },
      date: '12 de Setembro, 2024',
      readTime: '6 min de leitura'
    },
    {
      image: 'https://images.unsplash.com/photo-1590239068579-38c114ef68e8?auto=format&fit=crop&q=80&w=800',
      category: 'Prevenção',
      title: 'Prevenção e Tratamento de Lesões Relacionadas ao Exercício',
      desc: 'Mantenha-se no jogo por mais tempo aprendendo os sinais de alerta de excesso de treino e como se recuperar rápido.',
      author: { name: 'Miguel Arcanjo', avatar: 'https://i.pravatar.cc/150?u=michael' },
      date: '20 de Outubro, 2024',
      readTime: '7 min de leitura'
    }
  ];

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <span className="text-[#cfec0f] text-sm font-bold uppercase tracking-wider">Dicas de Treino</span>
            <h2 className="text-4xl md:text-5xl font-extrabold mt-4 leading-tight">
              Domine seus Treinos com estas <span className="text-[#cfec0f]">Dicas Provadas</span> de Fitness
            </h2>
            <p className="text-gray-400 mt-6 leading-relaxed">
              Maximize seus resultados com nossa coleção abrangente de dicas de especialistas. 
              Seja você iniciante ou veterano na academia, esses insights ajudarão você a 
              otimizar sua rotina e alcançar seus objetivos mais rápido.
            </p>
          </div>
          <button className="bg-zinc-800 hover:bg-[#cfec0f] hover:text-black text-white px-8 py-3 rounded-full font-bold transition-all border border-white/5 whitespace-nowrap">
            Ver Todos os Blogs
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {blogs.map((blog, i) => (
            <BlogCard key={i} {...blog} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
