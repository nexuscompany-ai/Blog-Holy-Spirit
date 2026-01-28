
import React, { useState } from 'react';
import { LayoutDashboard, FileText, Calendar, List, LogOut, Sparkles, Wifi, WifiOff, PenTool } from 'lucide-react';
import DashboardHome from './DashboardHome';
import CreateBlog from './CreateBlog';
import MyBlogs from './MyBlogs';

interface AdminLayoutProps {
  exitAdmin: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ exitAdmin }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'create' | 'list' | 'event'>('dashboard');
  const [isAiConnected] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Início', icon: <LayoutDashboard size={20} /> },
    { id: 'create', label: 'Criar Blog', icon: <PenTool size={20} /> },
    { id: 'list', label: 'Meus Blogs', icon: <List size={20} /> },
    { id: 'event', label: 'Criar Evento', icon: <Calendar size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#050505] text-white selection:bg-[#cfec0f] selection:text-black">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-black p-6 flex flex-col fixed h-full z-20">
        <div className="flex items-center gap-2 mb-12">
          <div className="w-6 h-6 bg-[#cfec0f] rounded-sm rotate-45 shadow-[0_0_15px_rgba(207,236,15,0.3)]"></div>
          <span className="text-xl font-black tracking-tighter uppercase">
            Holy<span className="text-[#cfec0f]">Admin</span>
          </span>
        </div>

        <nav className="flex-grow space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 group ${
                activeTab === item.id 
                  ? 'bg-[#cfec0f] text-black shadow-[0_0_25px_rgba(207,236,15,0.15)]' 
                  : 'text-gray-500 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className={`${activeTab === item.id ? 'text-black' : 'group-hover:text-[#cfec0f]'}`}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mb-6 p-4 bg-zinc-900/50 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase text-gray-500">Conexão com Inteligência</span>
            {isAiConnected ? (
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> 
                <span className="text-[8px] text-green-500 font-bold uppercase tracking-widest">Ativa</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span> 
                <span className="text-[8px] text-red-500 font-bold uppercase tracking-widest">Offline</span>
              </div>
            )}
          </div>
          <p className="text-[10px] text-gray-400">Motor Holy IA operando normalmente.</p>
        </div>

        <button 
          onClick={exitAdmin}
          className="flex items-center gap-4 px-4 py-3 text-gray-500 hover:text-red-500 transition-colors text-sm font-bold border-t border-white/5 pt-6"
        >
          <LogOut size={20} />
          Sair do Painel
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow ml-64 p-10 min-h-screen">
        <header className="flex justify-between items-center mb-10 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter">
              {menuItems.find(i => i.id === activeTab)?.label}
            </h1>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2">
              Templo Holy Spirit • Painel de Gestão v2.1
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-zinc-900/50 p-2 pr-6 rounded-full border border-white/5">
            <div className="w-10 h-10 bg-[#cfec0f] rounded-full flex items-center justify-center font-black text-black text-lg">
              HS
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-tight">Felipe Almeida</p>
              <p className="text-[9px] text-gray-600 font-bold uppercase">Super Administrador</p>
            </div>
          </div>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {activeTab === 'dashboard' && <DashboardHome />}
          {activeTab === 'create' && <CreateBlog onSuccess={() => setActiveTab('list')} />}
          {activeTab === 'list' && <MyBlogs />}
          {activeTab === 'event' && (
            <div className="p-20 text-center bg-zinc-900/30 rounded-[40px] border border-dashed border-white/10">
              <Calendar size={64} className="mx-auto mb-6 text-gray-800" />
              <h3 className="text-xl font-bold mb-2">Eventos do Templo</h3>
              <p className="text-gray-600 max-w-sm mx-auto">Em breve: Agende aulas especiais, cultos e workshops direto no site.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
