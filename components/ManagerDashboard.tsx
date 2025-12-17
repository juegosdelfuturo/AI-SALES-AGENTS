import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { MOCK_CANDIDATES } from '../constants';
import { Candidate } from '../types';

const ManagerDashboard: React.FC = () => {
  const teamData = [
    { x: 10, y: 30, z: 200, name: 'Rep A' },
    { x: 30, y: 200, z: 260, name: 'Rep B' },
    { x: 45, y: 100, z: 400, name: 'Rep C' },
    { x: 50, y: 250, z: 280, name: 'Rep D' },
    { x: 70, y: 210, z: 100, name: 'Rep E' },
    { x: 100, y: 300, z: 200, name: 'Rep F' },
  ];

  const rampData = [
    { name: 'Week 1', avg: 20, newHire: 15 },
    { name: 'Week 2', avg: 35, newHire: 40 },
    { name: 'Week 3', avg: 50, newHire: 55 },
    { name: 'Week 4', avg: 70, newHire: 85 },
  ];

  return (
    <div className="h-full overflow-y-auto pb-20 space-y-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Team Performance Map */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-gray-900 font-bold text-lg mb-6">Team Performance Matrix</h2>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis type="number" dataKey="x" name="Training Vol" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis type="number" dataKey="y" name="Close Rate" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#FFF', borderColor: '#E5E7EB', color: '#111', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                            <Scatter name="Team" data={teamData} fill="#DC2626" />
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Ramp Up Tracker */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-gray-900 font-bold text-lg mb-6">Ramp-Up Velocity</h2>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={rampData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                            <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                            <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#FFF', borderColor: '#E5E7EB', color: '#111', borderRadius: '8px' }} />
                            <Line type="monotone" dataKey="avg" stroke="#9CA3AF" strokeDasharray="5 5" strokeWidth={2} name="Gold Standard" dot={false} />
                            <Line type="monotone" dataKey="newHire" stroke="#DC2626" strokeWidth={3} name="Current Cohort" dot={{ r: 4, fill: '#DC2626' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* Candidate Screening */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-gray-900 font-bold text-lg mb-4">Recruitment: AI Simulation Scores</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {MOCK_CANDIDATES.map((c: Candidate) => (
                    <div key={c.id} className="bg-gray-50 border border-gray-100 p-4 rounded-xl flex items-center justify-between group hover:border-primary-light transition-all cursor-pointer">
                        <div>
                            <div className="font-bold text-gray-900">{c.name}</div>
                            <div className="text-xs text-gray-500 mt-1">{c.role} • {c.status}</div>
                        </div>
                        <div className="text-right">
                             <div className={`text-2xl font-bold ${c.matchScore > 90 ? 'text-green-500' : c.matchScore > 80 ? 'text-primary' : 'text-yellow-500'}`}>
                                {c.matchScore}%
                             </div>
                             <div className="text-[10px] text-gray-400 uppercase font-medium">Skill Match</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default ManagerDashboard;