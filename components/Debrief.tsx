import React, { useEffect, useState } from 'react';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer } from 'recharts';
import { getCoachingTips } from '../services/geminiService';
import { Play, Flag, MessageSquare, Share2, Download, History, Calendar, Clock } from 'lucide-react';
import { Language, Session } from '../types';

interface DebriefProps {
  lang: Language;
  sessions: Session[];
}

const Debrief: React.FC<DebriefProps> = ({ lang, sessions }) => {
  const [tips, setTips] = useState<string[]>([]);
  const [loadingTips, setLoadingTips] = useState(true);

  // If we have sessions, show the latest one. If not, defaults (will act as empty state or mock)
  const latestSession = sessions.length > 0 ? sessions[sessions.length - 1] : null;

  const scoreValue = latestSession ? latestSession.score : 84;
  
  const scoreData = [
    { name: 'Score', uv: scoreValue, fill: '#DC2626' } // Primary Red
  ];

  const kpiData = [
    { name: 'Discovery', score: latestSession ? Math.min(100, latestSession.score + 5) : 90, fill: '#DC2626' }, // Red
    { name: 'Empathy', score: latestSession ? Math.min(100, latestSession.score - 10) : 65, fill: '#60A5FA' }, // Blue
    { name: 'Closing', score: latestSession ? Math.min(100, latestSession.score - 20) : 45, fill: '#1F2937' }, // Dark Gray for contrast
    { name: 'Objection', score: latestSession ? Math.min(100, latestSession.score + 2) : 80, fill: '#FBBF24' }, // Amber
  ];

  useEffect(() => {
    // Generate fresh tips when the session changes
    setLoadingTips(true);
    getCoachingTips(kpiData).then(fetchedTips => {
      setTips(fetchedTips);
      setLoadingTips(false);
    });
  }, [latestSession]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };
  
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full overflow-y-auto pb-20">
      
      {/* 1. The Scorecard */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center relative shadow-sm">
        <div className="flex justify-between w-full items-start mb-4">
            <h2 className="text-gray-400 font-bold text-xs uppercase tracking-wider">Session Score</h2>
            <div className={`px-2 py-1 text-xs font-bold rounded ${scoreValue >= 70 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {scoreValue >= 70 ? 'PASS' : 'NEEDS IMPROVEMENT'}
            </div>
        </div>
        
        <div className="h-48 w-full relative">
           <ResponsiveContainer width="100%" height="100%">
             <RadialBarChart innerRadius="70%" outerRadius="100%" barSize={12} data={scoreData} startAngle={90} endAngle={-270}>
               <RadialBar background clockWise dataKey="uv" cornerRadius={10} />
             </RadialBarChart>
           </ResponsiveContainer>
           {/* Center Text */}
           <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
             <span className="text-5xl font-bold text-gray-900">{scoreValue}</span>
             <span className="text-gray-400 text-xs font-medium uppercase mt-1">out of 100</span>
           </div>
        </div>
        
        <div className="w-full mt-6 space-y-4">
             {kpiData.map(kpi => (
                 <div key={kpi.name}>
                    <div className="flex justify-between text-xs font-medium text-gray-500 mb-1">
                        <span>{kpi.name}</span>
                        <span className="text-gray-900">{kpi.score}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${kpi.score}%`, backgroundColor: kpi.fill }}></div>
                    </div>
                 </div>
             ))}
        </div>
      </div>

      {/* 2. Timeline Analysis */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 lg:col-span-2 flex flex-col shadow-sm">
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
                <h2 className="text-gray-400 font-bold text-xs uppercase tracking-wider">
                    {latestSession ? `Analysis: ${latestSession.personaName}` : 'Call Recording'}
                </h2>
                {latestSession && (
                    <span className="bg-primary-bg text-primary-dark text-xs px-2 py-1 rounded-full font-medium">
                        {formatDuration(latestSession.durationSeconds)}
                    </span>
                )}
            </div>
            <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"><Download size={18}/></button>
                <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"><Share2 size={18}/></button>
            </div>
        </div>

        {/* Waveform */}
        <div className="flex-1 bg-gray-50 rounded-xl border border-gray-100 p-6 relative flex items-center">
            {/* Play Line */}
            <div className="absolute left-1/3 top-0 bottom-0 w-px bg-primary z-10 flex flex-col items-center">
                <div className="w-3 h-3 bg-primary rounded-full -mt-1.5 shadow-sm border border-white"></div>
            </div>

            <div className="w-full h-32 flex items-center gap-1 opacity-60">
                {[...Array(60)].map((_, i) => (
                    <div 
                        key={i} 
                        className={`flex-1 rounded-full ${i % 3 === 0 ? 'bg-primary' : 'bg-gray-300'}`}
                        style={{ height: `${Math.random() * 80 + 20}%`}}
                    ></div>
                ))}
            </div>

            {/* Call Flags */}
            <div className="absolute top-8 left-[20%] group">
                <div className="w-6 h-6 bg-white rounded-full shadow-sm flex items-center justify-center border border-gray-200 cursor-pointer hover:border-green-400">
                    <Flag size={12} className="text-green-500" fill="currentColor" />
                </div>
            </div>
            
            <div className="absolute top-8 left-[60%] group">
                <div className="w-6 h-6 bg-white rounded-full shadow-sm flex items-center justify-center border border-gray-200 cursor-pointer hover:border-red-400">
                     <Flag size={12} className="text-red-500" fill="currentColor" />
                </div>
            </div>
        </div>
        
        {/* Playback Controls */}
        <div className="mt-4 flex items-center gap-4 border-t border-gray-100 pt-4">
            <button className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20">
                <Play size={16} fill="white" />
            </button>
            <div className="text-xs font-mono text-gray-500">
                00:00 / {latestSession ? formatDuration(latestSession.durationSeconds) : '00:00'}
            </div>
        </div>
      </div>

      {/* 3. AI Coach Chat */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 lg:col-span-3 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary-bg flex items-center justify-center">
                <MessageSquare size={20} className="text-primary-dark" />
            </div>
            <div>
                <h2 className="text-gray-900 font-bold text-lg">AI Coach Feedback</h2>
                <p className="text-xs text-gray-500">Automated insights from your session</p>
            </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-8 border border-gray-100">
            {loadingTips ? (
                <div className="flex gap-2 text-primary font-medium text-sm animate-pulse items-center">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <span>Analyzing Call Data...</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {tips.map((tip, idx) => (
                        <div key={idx} className="flex gap-4 items-start bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                            <span className="flex-shrink-0 w-6 h-6 bg-primary-bg text-primary-dark rounded-full flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                            <p className="text-gray-700 text-sm leading-relaxed">{tip}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>

      {/* 4. Session History */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 lg:col-span-3 shadow-sm">
        <h2 className="text-gray-900 font-bold text-lg mb-6 flex items-center gap-2">
            <History size={20} className="text-gray-400" /> Recent Training History
        </h2>
        
        {sessions.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
                <p>No sessions recorded yet. Go to the Dojo to start training.</p>
            </div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100 text-xs uppercase text-gray-400 tracking-wider">
                            <th className="py-3 font-semibold">Prospect</th>
                            <th className="py-3 font-semibold">Date</th>
                            <th className="py-3 font-semibold">Duration</th>
                            <th className="py-3 font-semibold">Score</th>
                            <th className="py-3 font-semibold text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {[...sessions].reverse().map((session) => (
                            <tr key={session.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                <td className="py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary-bg flex items-center justify-center text-xs font-bold text-primary-dark">
                                            {getInitials(session.personaName)}
                                        </div>
                                        <span className="font-bold text-gray-900">{session.personaName}</span>
                                    </div>
                                </td>
                                <td className="py-4 text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} /> {formatDate(session.date)}
                                    </div>
                                </td>
                                <td className="py-4 text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} /> {formatDuration(session.durationSeconds)}
                                    </div>
                                </td>
                                <td className="py-4">
                                    <span className={`font-bold ${session.score >= 80 ? 'text-green-600' : session.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                                        {session.score}%
                                    </span>
                                </td>
                                <td className="py-4 text-right">
                                    <button className="text-primary hover:text-primary-dark font-medium text-xs">View Report</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>
    </div>
  );
};

export default Debrief;