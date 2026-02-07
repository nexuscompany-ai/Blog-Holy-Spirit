
import React from 'react';
import { ArrowUpRight, Clock, Shield, FileText } from 'lucide-react';

interface BlogCardProps {
  image?: string;
  category: string;
  title: string;
  desc: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  readTime: string;
  onClick?: () => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ image, category, title, desc, author, date, readTime, onClick }) => {
  const hasImage = image && image.length > 10;

  return (
    <div 
      onClick={onClick}
      className={`group cursor-pointer glass-card rounded-[40px] overflow-hidden flex flex-col h-full transition-all duration-500 hover:translate-y-[-8px] ${!hasImage ? 'bg-zinc-900/40 border-l-4 border-l-neon' : ''}`}
    >
      {hasImage ? (
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
          />
          <div className="absolute top-6 left-6">
            <span className="bg-neon text-black text-[9px] font-black px-4 py-1.5 uppercase rounded-full shadow-2xl">
              {category}
            </span>
          </div>
        </div>
      ) : (
        <div className="px-10 pt-10 flex items-center justify-between">
          <span className="bg-neon/10 text-neon text-[9px] font-black px-4 py-1.5 uppercase rounded-full border border-neon/20">
            {category}
          </span>
          <FileText size={18} className="text-zinc-800" />
        </div>
      )}
      
      <div className="p-10 flex flex-col flex-grow space-y-6">
        <div className="flex items-center gap-4 text-zinc-500 text-[10px] font-black uppercase tracking-widest">
          <div className="flex items-center gap-2"><Clock size={12} className="text-neon" /> {readTime} de leitura</div>
          <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
          <div>{date}</div>
        </div>

        <h3 className={`font-black uppercase italic leading-none tracking-tighter group-hover:text-neon transition-colors ${hasImage ? 'text-3xl' : 'text-4xl'}`}>
          {title}
        </h3>
        
        <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3">
          {desc}
        </p>
        
        <div className="pt-8 mt-auto flex items-center justify-between border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={author.avatar} alt={author.name} className="w-10 h-10 rounded-full border-2 border-neon/20 p-0.5" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-neon rounded-full flex items-center justify-center border-2 border-black">
                <Shield size={8} className="text-black fill-black" />
              </div>
            </div>
            <p className="text-white text-xs font-black uppercase tracking-widest">{author.name}</p>
          </div>
          <div className="w-12 h-12 bg-zinc-900 border border-white/5 rounded-2xl flex items-center justify-center group-hover:bg-neon group-hover:text-black transition-all">
            <ArrowUpRight size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
