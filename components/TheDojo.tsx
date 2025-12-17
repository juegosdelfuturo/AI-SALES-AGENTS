import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, PhoneOff, User, Volume2, Clock } from 'lucide-react';
import { Language, Persona, Session } from '../types';
import { TRANSLATIONS, MOCK_PERSONAS } from '../constants';

interface DojoProps {
  lang: Language;
  onEndSession: (sessionData: Session) => void;
  selectedPersona?: Persona | null;
  personas: Persona[];
}

const TheDojo: React.FC<DojoProps> = ({ lang, onEndSession, selectedPersona, personas }) => {
  const [active, setActive] = useState(false);
  const [currentPersona, setCurrentPersona] = useState<Persona>(selectedPersona || personas[0] || MOCK_PERSONAS[0]);
  
  // Timer State
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Update if prop changes
  useEffect(() => {
    if (selectedPersona) {
        setCurrentPersona(selectedPersona);
    }
  }, [selectedPersona]);

  // Timer Logic
  useEffect(() => {
    if (active) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [active]);

  const handleEndCall = () => {
    setActive(false);
    
    // Create session data
    const newSession: Session = {
      id: Date.now().toString(),
      personaId: currentPersona.id,
      personaName: currentPersona.name,
      avatarUrl: currentPersona.avatarUrl,
      date: new Date().toISOString(),
      durationSeconds: elapsedSeconds,
      score: Math.floor(Math.random() * (95 - 70 + 1)) + 70, // Mock score generation
    };

    onEndSession(newSession);
    setElapsedSeconds(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const renderWaveform = () => (
    <div className="flex items-center justify-center space-x-1 h-24 w-full max-w-xs mx-auto">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className={`w-3 bg-primary rounded-full transition-all duration-100 ${
            active ? 'animate-wave' : 'h-2 opacity-20'
          }`}
          style={{
            animationDelay: `${i * 0.05}s`,
            height: active ? `${Math.random() * 60 + 10}%` : '8px'
          }}
        ></div>
      ))}
    </div>
  );

  return (
    <div className="h-full flex flex-col md:flex-row gap-6">
      {/* Main Stage */}
      <div className="flex-1 bg-white border border-gray-200 rounded-2xl flex flex-col relative overflow-hidden shadow-sm">
        
        {/* Active Call Badge & Timer */}
        <div className="absolute top-6 left-6 z-20 flex gap-3">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide ${active ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                <div className={`w-2 h-2 rounded-full ${active ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
                {active ? 'LIVE CALL' : 'READY'}
            </div>
            {active && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-bold bg-gray-900 text-white animate-fade-in">
                 <Clock size={12} />
                 {formatTime(elapsedSeconds)}
              </div>
            )}
        </div>

        {/* Persona Info */}
        <div className="relative z-10 p-12 text-center flex-1 flex flex-col justify-center items-center">
            <div className="relative mb-8">
                <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-primary-light to-primary flex items-center justify-center">
                    <div className="w-full h-full rounded-full border-4 border-white bg-white flex items-center justify-center text-4xl font-bold text-primary">
                        {getInitials(currentPersona.name)}
                    </div>
                </div>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-1">{currentPersona.name}</h2>
            <p className="text-gray-500 font-medium text-lg mb-8">{currentPersona.role} @ {currentPersona.company || currentPersona.industry}</p>
            
            <div className="flex flex-wrap justify-center gap-2 mb-8">
                <span className="px-4 py-1.5 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
                    {currentPersona.type}
                </span>
                <span className="px-4 py-1.5 rounded-full bg-red-50 text-red-600 border border-red-100 text-sm font-medium">
                    Obs: {currentPersona.objection}
                </span>
            </div>

            {/* Voice Visualization */}
            <div className="w-full mb-8 min-h-[100px] flex flex-col justify-center">
                {active ? renderWaveform() : (
                    <div className="text-gray-300 flex flex-col items-center">
                        <Volume2 size={40} className="mb-2" />
                        <span className="text-sm">Start the call to begin</span>
                    </div>
                )}
            </div>

            {/* Opening Line Hint */}
            {currentPersona.openingLine && !active && (
                <div className="bg-gray-50 p-4 rounded-lg text-sm italic text-gray-600 max-w-md">
                    "{currentPersona.openingLine}"
                </div>
            )}
        </div>

        {/* Controls */}
        <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-center items-center gap-8">
            <button 
                onClick={() => setActive(!active)}
                className={`w-16 h-16 rounded-full transition-all duration-300 flex items-center justify-center shadow-lg transform hover:scale-105 ${
                    active 
                    ? 'bg-white border-2 border-red-500 text-red-500' 
                    : 'bg-primary text-white shadow-primary/40'
                }`}
            >
                {active ? <MicOff size={24} /> : <Mic size={24} />}
            </button>
            {active && (
                <button 
                    onClick={handleEndCall}
                    className="w-16 h-16 rounded-full bg-red-500 text-white shadow-lg shadow-red-500/30 flex items-center justify-center transform hover:scale-105 transition-all"
                >
                    <PhoneOff size={24} />
                </button>
            )}
        </div>
      </div>

      {/* Sidebar: Controls */}
      <div className="w-full md:w-80 flex flex-col gap-6">
        
        {/* Persona Switcher */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 flex-1 shadow-sm overflow-y-auto max-h-[calc(100vh-140px)]">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Quick Switch</h3>
            <div className="space-y-3">
                {personas.map(p => (
                    <button
                        key={p.id}
                        onClick={() => !active && setCurrentPersona(p)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                            currentPersona.id === p.id 
                            ? 'bg-primary-bg border-primary' 
                            : 'bg-white border-gray-100 hover:border-gray-300'
                        } ${active ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <div className="w-10 h-10 rounded-full bg-primary-bg flex items-center justify-center text-xs font-bold text-primary-dark">
                            {getInitials(p.name)}
                        </div>
                        <div>
                            <div className={`text-sm font-bold ${currentPersona.id === p.id ? 'text-primary-dark' : 'text-gray-900'}`}>{p.name}</div>
                            <div className="text-xs text-gray-500">{p.role}</div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default TheDojo;