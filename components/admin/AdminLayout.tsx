
import React, { useState } from 'react';
import { 
  LayoutDashboard, List, Calendar, Sparkles, 
  Settings as SettingsIcon, LogOut, Bot
} from 'lucide-react';
import DashboardHome from './DashboardHome';
import CreateBlog from './CreateBlog';
import MyBlogs from './MyBlogs';
import ManageEvents from './ManageEvents';
import SettingsPage from './SettingsPage';
import ManageAutomation from './ManageAutomation';
import { dbService } from '../../db';
import Logo from '../Logo';

interface AdminLayoutProps {
  exitAdmin: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ exitAdmin }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'create' | 'list' | 'event' | 'settings' | 'automation'>('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Início', icon: <LayoutDashboard size={20} /> },
    { id: 'create', label: 'Escritora n8n', icon: <Sparkles size={20} /> },
    { id: 'automation', label: 'Auto-Pilot', icon: <Bot size={20} /> },
    { id: 'list', label: 'Meus Blogs', icon: <List size={20} /> },
    { id: 'event', label: 'Eventos', icon: <Calendar size={20} /> },
    { id: 'settings', label: 'Configurações', icon: <SettingsIcon size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#050505] text-white selection:bg-neon selection:text-black">
      <aside className="w-64 border-r border-white/5 bg-black p-6 flex flex-col fixed h-full z-20">
        <div className="flex items-center gap-3 mb-12">
          <Logo className="w-8 h-8" />
          <span className="text-xl font-black tracking-tighter uppercase italic">
            Holy<span className="text-neon">Admin</span>
          </span>
        </div>

        <nav className="flex-grow space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeTab === item.id 
                  ? 'bg-neon text-black' 
                  : 'text-gray-500 hover:bg-white/5 hover:text-white'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <button 
          onClick={() => dbService.signOut()}
          className="flex items-center gap-4 px-4 py-3 text-gray-500 hover:text-red-500 transition-colors text-sm font-bold border-t border-white/5 pt-6"
        >
          <LogOut size={20} />
          Encerrar Sessão
        </button>
      </aside>

      <main className="flex-grow ml-64 p-10 min-h-screen">
        <header className="flex justify-between items-center mb-10 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter">
              {menuItems.find(i => i.id === activeTab)?.label}
            </h1>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-2">
              Holy Spirit • Gestão Editorial
            </p>
          </div>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {activeTab === 'dashboard' && <DashboardHome />}
          {activeTab === 'create' && <CreateBlog onSuccess={() => setActiveTab('list')} />}
          {activeTab === 'automation' && <ManageAutomation />}
          {activeTab === 'list' && <MyBlogs />}
          {activeTab === 'event' && <ManageEvents />}
          {activeTab === 'settings' && <SettingsPage />}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
