
import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface BlogCardProps {
  image: string;
  category: string;
  title: string;
  desc: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  readTime: string;
}

const BlogCard: React.FC<BlogCardProps> = ({ image, category, title, desc, author, date, readTime }) => {
  return (
    <div className="bg-zinc-900/50 rounded-3xl overflow-hidden border border-white/5 hover:border-white/10 transition-all flex flex-col group">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute bottom-4 left-4">
          <span className="bg-[#cfec0f] text-black text-[10px] font-black px-3 py-1 uppercase rounded-md">
            {category}
          </span>
        </div>
      </div>
      
      <div className="p-8 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold mb-4 line-clamp-2 leading-tight group-hover:text-[#cfec0f] transition-colors">
          {title}
        </h3>
        <p className="text-gray-400 text-sm mb-8 line-clamp-2 leading-relaxed">
          {desc}
        </p>
        
        <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-6">
          <div className="flex items-center gap-3">
            <img src={author.avatar} alt={author.name} className="w-10 h-10 rounded-full border-2 border-[#cfec0f]/20" />
            <div>
              <p className="text-white text-sm font-bold">{author.name}</p>
              <p className="text-gray-500 text-[11px]">{date} • {readTime}</p>
            </div>
          </div>
          <button className="bg-white/5 hover:bg-[#cfec0f] hover:text-black p-3 rounded-full transition-all">
            <ArrowUpRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
