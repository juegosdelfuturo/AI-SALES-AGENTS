import React from 'react';
import { LayoutDashboard, MessageSquarePlus, PieChart, Users, Flower2 } from 'lucide-react';
import { View, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  lang: Language;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, lang }) => {
  const NavItem = ({ view, icon: Icon, label }: { view: View; icon: any; label: string }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`w-full flex items-center space-x-3 px-6 py-3 mb-1 transition-all duration-200 group ${
        currentView === view
          ? 'bg-primary-bg text-primary-dark border-r-4 border-primary-dark'
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <Icon size={20} className={`${currentView === view ? 'text-primary-dark' : 'text-gray-400 group-hover:text-gray-600'}`} />
      <span className="font-medium text-sm">{label}</span>
    </button>
  );

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-8 flex items-center space-x-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Flower2 className="text-white" size={20} />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-gray-900">
          Bloom<span className="text-primary-dark">.ai</span>
        </h1>
      </div>

      <nav className="flex-1 mt-4">
        <div className="px-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu</div>
        <NavItem view="DASHBOARD" icon={LayoutDashboard} label={TRANSLATIONS.dashboard[lang]} />
        <NavItem view="PERSONA_CREATOR" icon={MessageSquarePlus} label={TRANSLATIONS.persona[lang]} />
        <NavItem view="DOJO" icon={PieChart} label={TRANSLATIONS.dojo[lang]} /> {/* Re-using icon for demo */}
        <NavItem view="DEBRIEF" icon={PieChart} label={TRANSLATIONS.debrief[lang]} />
        <NavItem view="MANAGER" icon={Users} label={TRANSLATIONS.manager[lang]} />
      </nav>

      <div className="p-6 border-t border-gray-200">
        <div className="flex items-center space-x-3">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-500 font-medium">System Operational</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;