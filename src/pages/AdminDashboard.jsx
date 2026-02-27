import React, { useState, useEffect } from 'react';
import {
    Users,
    BarChart3,
    Trophy,
    MessageSquare,
    Search,
    Filter,
    MoreVertical,
    CheckCircle,
    AlertCircle,
    TrendingUp,
    Award
} from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';

const AdminDashboard = () => {
    const [teams, setTeams] = useState([
        { id: 1, name: 'Team Alpha', project: 'e-Space Platform', progress: 65, github: 142, status: 'On Track', score: 8.5 },
        { id: 2, name: 'Code Wizards', project: 'AI Health Bot', progress: 42, github: 89, status: 'Delayed', score: 7.2 },
        { id: 3, name: 'Nexus Prime', project: 'Smart Logistics', progress: 88, github: 210, status: 'On Track', score: 9.1 },
        { id: 4, name: 'Innovators', project: 'Blockchain Voting', progress: 15, github: 12, status: 'At Risk', score: 4.5 },
    ]);

    const [selectedTeam, setSelectedTeam] = useState(null);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex justify-between items-end">
                <div>
                    <p className="text-amber-400 font-bold tracking-widest text-xs uppercase mb-2 italic">Institutional Oversight</p>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent italic">
                        Admin Control Center
                    </h1>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Filter teams..."
                            className="bg-slate-900 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-300 focus:outline-none focus:border-amber-500/50 transition-all w-64"
                        />
                    </div>
                    <button className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-xl font-bold transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2">
                        <Trophy size={18} /> Export Results
                    </button>
                </div>
            </div>

            {/* Analytics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-400">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Teams</p>
                        <p className="text-2xl font-black text-white">24</p>
                    </div>
                </div>
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-600/10 rounded-xl flex items-center justify-center text-emerald-400">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Avg Progress</p>
                        <p className="text-2xl font-black text-white">52%</p>
                    </div>
                </div>
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-600/10 rounded-xl flex items-center justify-center text-amber-400">
                        <Award size={24} />
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Submissions</p>
                        <p className="text-2xl font-black text-white">18 / 24</p>
                    </div>
                </div>
            </div>

            {/* Teams Table */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <BarChart3 className="text-blue-400" /> Hackathon Leaderboard
                    </h2>
                    <div className="flex gap-2">
                        <button className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all"><Filter size={18} /></button>
                    </div>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-slate-800/50">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Team Name</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Project</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Progress</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Score</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {teams.map((team) => (
                            <tr key={team.id} className="hover:bg-slate-800/20 transition-all cursor-pointer group" onClick={() => setSelectedTeam(team)}>
                                <td className="px-6 py-4">
                                    <span className="text-sm font-bold text-white">{team.name}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-300">{team.project}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-1.5 w-24 bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className={cn(
                                                    "h-full rounded-full transition-all duration-1000",
                                                    team.progress > 70 ? "bg-emerald-500" : team.progress > 30 ? "bg-blue-500" : "bg-amber-500"
                                                )}
                                                style={{ width: `${team.progress}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-bold text-slate-400">{team.progress}%</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={cn(
                                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                        team.status === 'On Track' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                                            team.status === 'Delayed' ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                                                "bg-red-500/10 text-red-400 border border-red-500/20"
                                    )}>
                                        {team.status === 'On Track' ? <CheckCircle size={10} /> : <AlertCircle size={10} />}
                                        {team.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm font-black text-blue-400">{team.score}</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 group-hover:text-white transition-all"><MoreVertical size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Evaluation Modal / Drawer (Conditional) */}
            {selectedTeam && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-3xl shadow-3xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-gradient-to-r from-blue-600/10 to-transparent">
                            <div>
                                <h3 className="text-2xl font-black text-white italic">{selectedTeam.name}</h3>
                                <p className="text-sm text-slate-400 italic">Evaluation & Remarks</p>
                            </div>
                            <button onClick={() => setSelectedTeam(null)} className="p-2 hover:bg-slate-800 rounded-xl text-slate-400">
                                <Users size={24} />
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Progress Score (0-10)</label>
                                    <input type="number" step="0.1" defaultValue={selectedTeam.score} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-all font-black" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Innovation Multiplier</label>
                                    <select className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-all font-bold">
                                        <option>1.0x (Standard)</option>
                                        <option>1.2x (High)</option>
                                        <option>1.5x (Exceptional)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Jury Remarks</label>
                                <textarea
                                    rows="4"
                                    placeholder="Enter evaluation remarks..."
                                    className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-all text-sm"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={() => setSelectedTeam(null)}
                                    className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-black transition-all"
                                >
                                    Discard
                                </button>
                                <button
                                    onClick={() => setSelectedTeam(null)}
                                    className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black transition-all shadow-lg shadow-blue-500/20"
                                >
                                    Save Evaluation
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
