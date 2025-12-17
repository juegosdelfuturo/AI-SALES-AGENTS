import React from 'react';
import { Globe, Bell, Search, User } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
}

const Header: React.FC<HeaderProps> = ({ lang, setLang }) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 fixed top-0 left-64 right-0 z-40">
      {/* Search Bar */}
      <div className="flex items-center w-96 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-primary-light transition-all">
         <Search size={18} className="text-gray-400" />
         <input 
            type="text" 
            placeholder="Search training prospects, scenarios..." 
            className="bg-transparent border-none outline-none text-sm text-gray-700 ml-3 w-full placeholder-gray-400"
         />
      </div>

      <div className="flex items-center space-x-6">
        {/* Language Selector */}
        <div className="relative group">
          <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 transition-colors">
            <Globe size={18} />
            <span className="text-sm font-medium">{lang}</span>
          </button>
          
          <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-100 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto py-1">
            {(Object.keys(Language) as Array<keyof typeof Language>).map((key) => (
              <button
                key={key}
                onClick={() => setLang(Language[key])}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${lang === key ? 'text-primary font-bold' : 'text-gray-600'}`}
              >
                {key}
              </button>
            ))}
          </div>
        </div>
        
        <button className="text-gray-400 hover:text-gray-600 relative">
            <Bell size={20} />
            <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
        </button>

        <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary-dark font-bold text-xs border border-white shadow-sm cursor-pointer">
            JD
        </div>
      </div>
    </header>
  );
};

export default Header;