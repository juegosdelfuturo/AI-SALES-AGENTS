import React from 'react';
import { Plus, User, Building2, ArrowRight, MoreHorizontal, Play } from 'lucide-react';
import { Persona } from '../types';

interface DashboardProps {
  personas: Persona[];
  onCreateNew: () => void;
  onSelectPersona: (persona: Persona) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ personas, onCreateNew, onSelectPersona }) => {
  return (
    <div className="h-full overflow-y-auto pb-20">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Training Prospects</h1>
          <p className="text-gray-500 mt-1">Manage your AI personas and start training sessions.</p>
        </div>
        <button 
          onClick={onCreateNew}
          className="px-6 py-2 bg-primary text-white rounded-lg font-bold shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all flex items-center gap-2"
        >
          <Plus size={18} /> New Prospect
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Create New Card */}
        <button 
          onClick={onCreateNew}
          className="group flex flex-col items-center justify-center p-8 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl hover:border-primary hover:bg-primary-bg transition-all h-[280px]"
        >
          <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Plus size={32} className="text-gray-400 group-hover:text-primary" />
          </div>
          <span className="font-bold text-gray-500 group-hover:text-primary">Create New Prospect</span>
        </button>

        {/* Persona Cards */}
        {personas.map((persona) => (
          <div 
            key={persona.id} 
            onClick={() => onSelectPersona(persona)}
            className="cursor-pointer bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:border-primary relative flex flex-col h-[280px] group"
          >
             <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-600">
                    {persona.type === 'B2B' ? <Building2 size={12} /> : <User size={12} />}
                    {persona.type}
                </div>
                <button 
                    onClick={(e) => { e.stopPropagation(); }}
                    className="text-gray-400 hover:text-gray-600"
                >
                    <MoreHorizontal size={20} />
                </button>
             </div>

             <div className="flex flex-col items-center text-center flex-1">
                <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-br from-gray-100 to-gray-200 mb-4 group-hover:from-primary-light group-hover:to-primary transition-colors">
                    <img 
                        src={persona.avatarUrl} 
                        alt={persona.name} 
                        className="w-full h-full rounded-full object-cover border-2 border-white"
                    />
                </div>
                <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{persona.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-1">{persona.role}</p>
                <p className="text-xs text-primary font-medium mt-1">{persona.industry || persona.company}</p>
             </div>

             <div className="mt-6 pt-4 border-t border-gray-100 flex gap-2">
                 <button 
                    className="flex-1 py-2 bg-primary-bg text-primary-dark font-bold text-sm rounded-lg group-hover:bg-primary group-hover:text-white transition-colors flex items-center justify-center gap-2"
                 >
                    <Play size={14} /> Train
                 </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;