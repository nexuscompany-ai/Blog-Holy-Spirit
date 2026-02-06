
import React, { useEffect, useState } from 'react';
import { 
  Eye, Trash2, BrainCircuit, User, RefreshCw, 
  Clock, Globe, AlertCircle, CheckCircle, Database, 
  Sparkles, Search, Rocket, Power, EyeOff
} from 'lucide-react';
import { dbService } from '../../db';

const MyBlogs: React.FC = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success'>('idle');
  const [newItemsCount, setNewItemsCount] = useState(0);
  const [lastSync, setLastSync] = useState<string>('');

  const performDeepSync = async () => {
    setLoading(true);
    setSyncStatus('syncing');
    setNewItemsCount(0);
    
    const previousCount = blogs.length;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const freshData = await dbService.getBlogs();
      setBlogs(freshData);
      
      const diff = freshData.length - previousCount;
      if (diff > 0) setNewItemsCount(diff);
      
      setLastSync(new Date().toLocaleTimeString('pt-BR'));
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 4000);
    } catch (err) {
      console.error("Erro na sincronização:", err);
      setSyncStatus('idle');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    performDeepSync();
  }, []);

  const deleteBlog = async (id: string) => {
    if (confirm('Deseja excluir este registro permanentemente?')) {
      await dbService.deleteBlog(id);
      performDeepSync();
    }
  };

  const togglePublish = async (blog: any) => {
    const newStatus = blog.published === false ? true : false;
    setLoading(true);
    try {
      await dbService.updateBlog(blog.id, { published: newStatus });
      await performDeepSync();
    } catch (err) {
      alert("Erro ao alterar status de publicação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* HEADER DE SINCRONIZAÇÃO MAESTRO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-zinc-900/30 p-8 rounded-[32px] border border-white/5 gap-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-neon/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-neon/10 transition-all duration-1000"></div>
        
        <div className="relative z-10">
          <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
            <Database size={14} className="text-[#cfec0f]" /> 
            Consagração de Conteúdo
          </h3>
          <p className="text-[10px] text-zinc-600 font-bold uppercase mt-1">
            {lastSync ? `Última varredura no Templo: ${lastSync}` : 'Iniciando conexão com o Supabase...'}
          </p>
        </div>

        <div className="flex items-center gap-4 relative z-10">
          {newItemsCount > 0 && syncStatus === 'success' && (
            <div className="flex items-center gap-2 bg-neon/10 text-neon px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest animate-bounce">
              <Sparkles size={12} /> {newItemsCount} {newItemsCount === 1 ? 'Novo Post Encontrado' : 'Novos Posts Encontrados'}
            </div>
          )}
          
          <button 
            onClick={performDeepSync} 
            disabled={loading}
            className={`flex items-center gap-3 text-[10px] font-black uppercase px-8 py-4 rounded-2xl transition-all relative overflow-hidden group/btn ${
              loading 
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5' 
              : 'bg-[#cfec0f] text-black hover:scale-105 shadow-xl shadow-[#cfec0f]/10'
            }`}
          >
            {loading && (
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            )}
            <RefreshCw size={14} className={loading ? 'animate-spin' : 'group-hover/btn:rotate-180 transition-transform duration-500'} /> 
            {loading ? 'Escaneando o Templo...' : 'Sincronizar com Banco'}
          </button>
        </div>
      </div>
      
      {/* TABELA DE BLOGS */}
      <div className="bg-zinc-900/10 rounded-[40px] border border-white/5 overflow-hidden relative">
        {loading && blogs.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-neon/10 border-t-neon rounded-full animate-spin"></div>
              <Database className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-neon" size={24} />
            </div>
            <p className="text-neon text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Consultando Registros Sagrados...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/40 border-b border-white/5">
                  <th className="px-8 py-6 text-[10px] font-black uppercase text-zinc-600 tracking-widest">Identidade do Post</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase text-zinc-600 tracking-widest">Origem</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase text-zinc-600 tracking-widest">Estado no Site</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase text-zinc-600 tracking-widest">Data</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase text-zinc-600 tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {blogs.map((blog) => {
                  const isPublished = blog.published !== false;
                  return (
                    <tr key={blog.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-black border border-white/5">
                            <img src={blog.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="" />
                          </div>
                          <div>
                            <p className="font-black italic text-base group-hover:text-[#cfec0f] transition-colors leading-tight">
                              {blog.title || "Revelação Sem Nome"}
                            </p>
                            <span className="text-[9px] text-zinc-600 uppercase font-black tracking-widest">{blog.category}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-widest ${blog.source === 'ai' ? 'text-[#cfec0f]' : 'text-zinc-500'}`}>
                          {blog.source === 'ai' ? (
                            <>
                              <div className="p-2 bg-[#cfec0f]/10 rounded-lg"><BrainCircuit size={14} /></div>
                              n8n Pilot
                            </>
                          ) : (
                            <>
                              <div className="p-2 bg-zinc-800/50 rounded-lg"><User size={14} /></div>
                              Manual
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        {isPublished ? (
                          <span className="flex items-center gap-2 text-[9px] font-black uppercase px-4 py-1.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/10">
                            <Globe size={10} /> No Templo (Ar)
                          </span>
                        ) : (
                          <span className="flex items-center gap-2 text-[9px] font-black uppercase px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/10">
                            <Clock size={10} /> Rascunho / Oculto
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">
                            {new Date(blog.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          {!isPublished ? (
                            <button 
                              onClick={() => togglePublish(blog)}
                              title="Publicar agora no Site"
                              className="px-4 py-2 bg-[#cfec0f] text-black rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-[#cfec0f]/10"
                            >
                              <Rocket size={14} /> Lançar
                            </button>
                          ) : (
                            <button 
                              onClick={() => togglePublish(blog)}
                              title="Remover do site e tornar rascunho"
                              className="p-3 bg-black border border-white/5 hover:border-orange-500/50 rounded-xl text-zinc-500 hover:text-orange-500 transition-all"
                            >
                              <EyeOff size={16} />
                            </button>
                          )}
                          <button 
                            onClick={() => deleteBlog(blog.id)} 
                            className="p-3 bg-black border border-white/5 hover:border-red-500/50 rounded-xl text-zinc-600 hover:text-red-500 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="p-8 bg-[#cfec0f]/5 border border-[#cfec0f]/10 rounded-[32px] flex items-start gap-4">
        <Sparkles size={18} className="text-[#cfec0f] shrink-0 mt-1" />
        <div className="space-y-1">
          <h4 className="text-[10px] font-black text-[#cfec0f] uppercase tracking-widest">Moderação do Templo</h4>
          <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">
            Posts gerados via n8n aparecem como <strong>Rascunho</strong> para que você revise o conteúdo antes de "Lançar" para o feed público. Clique no botão de foguete para tornar o post visível para seus alunos.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyBlogs;
