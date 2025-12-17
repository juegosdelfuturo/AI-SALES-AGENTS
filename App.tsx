import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TheDojo from './components/TheDojo';
import Debrief from './components/Debrief';
import ManagerDashboard from './components/ManagerDashboard';
import PersonaCreator from './components/PersonaCreator';
import { View, Language, Persona, Session } from './types';
import { TRANSLATIONS, MOCK_PERSONAS } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('DASHBOARD');
  const [lang, setLang] = useState<Language>(Language.EN);
  
  // App State
  const [personas, setPersonas] = useState<Persona[]>(MOCK_PERSONAS);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);

  const handleCreateNew = () => {
    setCurrentView('PERSONA_CREATOR');
  };

  const handlePersonaSaved = (newPersona: Persona, startSession: boolean) => {
      setPersonas(prev => [...prev, newPersona]);
      if (startSession) {
          setSelectedPersona(newPersona);
          setCurrentView('DOJO');
      } else {
          setCurrentView('DASHBOARD');
      }
  };

  const handleSelectPersonaFromDashboard = (persona: Persona) => {
      setSelectedPersona(persona);
      setCurrentView('DOJO');
  };

  const handleSessionComplete = (sessionData: Session) => {
    setSessions(prev => [...prev, sessionData]);
    setCurrentView('DEBRIEF');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'DASHBOARD':
        return (
            <Dashboard 
                personas={personas} 
                onCreateNew={handleCreateNew} 
                onSelectPersona={handleSelectPersonaFromDashboard} 
            />
        );
      case 'DOJO':
        return (
            <TheDojo 
                lang={lang} 
                onEndSession={handleSessionComplete} 
                selectedPersona={selectedPersona}
                personas={personas}
            />
        );
      case 'DEBRIEF':
        return <Debrief lang={lang} sessions={sessions} />;
      case 'MANAGER':
        return <ManagerDashboard />;
      case 'PERSONA_CREATOR':
        return <PersonaCreator onSave={handlePersonaSaved} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-primary selection:text-white">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} lang={lang} />
      
      <div className="flex-1 ml-64 relative flex flex-col h-screen">
        <Header lang={lang} setLang={setLang} />
        
        <main className="flex-1 p-8 mt-16 overflow-hidden">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;