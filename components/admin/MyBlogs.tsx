
import React, { useEffect, useState } from 'react';
import { Eye, Edit2, Trash2, Cpu, User, RefreshCcw } from 'lucide-react';
import { BlogPost } from '../BlogSection';

const MyBlogs: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

  const loadBlogs = () => {
    const saved = JSON.parse(localStorage.getItem('hs_blogs') || '[]');
    setBlogs(saved);
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const deleteBlog = (id: string) => {
    const filtered = blogs.filter(b => b.id !== id);
    localStorage.setItem('hs_blogs', JSON.stringify(filtered));
    setBlogs(filtered);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={loadBlogs} className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-500 hover:text-[#cfec0f] transition-colors">
          <RefreshCcw size={12} /> Atualizar Lista
        </button>
      </div>
      
      <div className="bg-zinc-900/30 rounded-3xl border border-white/5 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-black/50">
              <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-500 tracking-widest">Título do Blog</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-500 tracking-widest">Categoria</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-500 tracking-widest">Data</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-500 tracking-widest text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {blogs.map((blog) => (
              <tr key={blog.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-5">
                  <p className="font-bold text-sm group-hover:text-[#cfec0f] transition-colors">{blog.title}</p>
                </td>
                <td className="px-6 py-5">
                  <span className="text-[9px] font-black uppercase px-3 py-1 rounded-full bg-[#cfec0f]/10 text-[#cfec0f]">
                    {blog.category}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <p className="text-[10px] text-gray-600 font-bold uppercase">{blog.date}</p>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 hover:bg-black rounded-lg text-gray-500 transition-all"><Eye size={16} /></button>
                    <button onClick={() => deleteBlog(blog.id)} className="p-2 hover:bg-black rounded-lg text-red-500 transition-all"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {blogs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-20 text-center text-gray-600 text-sm font-bold">
                  Nenhum post encontrado. Use o Orquestrador IA para começar!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyBlogs;
