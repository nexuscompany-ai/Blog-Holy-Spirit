
import React from 'react';
import { ArrowUpRight, Clock, Shield, FileText } from 'lucide-react';

interface BlogCardProps {
  image?: string; 
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

const BlogCard: React.FC<BlogCardProps> = ({ image, title, desc, author, date, readTime, onClick }) => {
  const hasImage = image && image.length > 20;

  return (
    <div 
      onClick={onClick}
      className={`group cursor-pointer glass-card rounded-[32px] md:rounded-[40px] overflow-hidden flex flex-col h-full transition-all duration-500 hover:translate-y-[-4px] ${!hasImage ? 'bg-zinc-900/40 border-l-4 border-l-neon shadow-2xl' : ''}`}
    >
      {hasImage && (
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
          />
        </div>
      )}

      {!hasImage && (
        <div className="px-6 pt-6 md:px-10 md:pt-10 flex items-center justify-between">
          <FileText size={18} className="text-zinc-700" />
        </div>
      )}
      
      <div className={`p-6 md:p-10 flex flex-col flex-grow space-y-4 md:space-y-6 ${!hasImage ? 'justify-center' : ''}`}>
        <div className="flex items-center gap-3 text-zinc-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest">
          <div className="flex items-center gap-1.5"><Clock size={12} className="text-neon" /> {readTime}</div>
          <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
          <div>{date}</div>
        </div>

        <h3 className={`font-bold md:font-black uppercase italic leading-tight tracking-tight group-hover:text-neon transition-colors line-clamp-2 ${hasImage ? 'text-lg md:text-2xl' : 'text-xl md:text-4xl'}`}>
          {title}
        </h3>
        
        <p className={`text-zinc-500 text-xs md:text-sm leading-relaxed line-clamp-2 md:line-clamp-3 ${!hasImage ? 'text-sm md:text-base' : ''}`}>
          {desc}
        </p>
        
        <div className="pt-6 mt-auto flex items-center justify-between border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={author.avatar} alt={author.name} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-neon/20 p-0.5" />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 md:w-4 md:h-4 bg-neon rounded-full flex items-center justify-center border-2 border-black">
                <Shield size={7} className="text-black fill-black" />
              </div>
            </div>
            <p className="text-white text-[9px] md:text-xs font-black uppercase tracking-widest">{author.name}</p>
          </div>
          <div className="w-10 h-10 md:w-12 md:h-12 bg-zinc-900 border border-white/5 rounded-xl md:rounded-2xl flex items-center justify-center group-hover:bg-neon group-hover:text-black transition-all">
            <ArrowUpRight size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
