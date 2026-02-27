import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    CheckCircle2,
    Clock,
    Github,
    FileText,
    Plus,
    MoreVertical,
    Activity
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

const data = [
    { name: 'Week 1', progress: 10 },
    { name: 'Week 2', progress: 25 },
    { name: 'Week 3', progress: 45 },
    { name: 'Week 4', progress: 60 },
];

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-all">
        <div className="flex justify-between items-start mb-4">
            <div className={cn("p-3 rounded-xl", color)}>
                <Icon size={24} className="text-white" />
            </div>
            {trend && (
                <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full flex items-center gap-1">
                    <TrendingUp size={12} /> {trend}
                </span>
            )}
        </div>
        <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-white">{value}</p>
    </div>
);

const Dashboard = () => {
    const { profile } = useAuth();
    const [milestones, setMilestones] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data for now, would fetch from Supabase in real app
        setMilestones([
            { id: 1, title: 'Project Research', status: true, due: '2024-03-01' },
            { id: 2, title: 'UI/UX Design', status: true, due: '2024-03-05' },
            { id: 3, title: 'Backend Setup', status: false, due: '2024-03-10' },
            { id: 4, title: 'API Integration', status: false, due: '2024-03-15' },
        ]);
        setLoading(false);
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <p className="text-blue-400 font-bold tracking-widest text-xs uppercase mb-2">Workspace Overview</p>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent italic">
                        {profile?.team_name || 'Team Alpha'} Dashboard
                    </h1>
                </div>
                <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 px-4 py-2 rounded-xl flex items-center gap-3">
                    <Activity className="text-blue-400" size={18} />
                    <span className="text-sm font-bold text-slate-300">Live Updates Enabled</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Overall Progress" value="65%" icon={TrendingUp} color="bg-blue-600" trend="+12%" />
                <StatCard title="Milestones" value="12 / 18" icon={CheckCircle2} color="bg-purple-600" />
                <StatCard title="GitHub Commits" value="142" icon={Github} color="bg-slate-700" trend="+24" />
                <StatCard title="Documentation" value="85%" icon={FileText} color="bg-emerald-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Progress Chart */}
                <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <TrendingUp className="text-blue-400" /> Progress Analytics
                        </h2>
                        <select className="bg-slate-800 border-none text-slate-300 text-sm rounded-lg px-3 py-1 outline-none">
                            <option>Last 30 Days</option>
                            <option>Last 7 Days</option>
                        </select>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="progress" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorProgress)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Milestones / Goals */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <CheckCircle2 className="text-purple-400" /> Milestones
                        </h2>
                        <button className="p-2 bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg transition-all">
                            <Plus size={18} />
                        </button>
                    </div>
                    <div className="space-y-4">
                        {milestones.map((milestone) => (
                            <div key={milestone.id} className="group p-4 bg-slate-800/20 rounded-2xl border border-slate-700/50 hover:border-slate-600 transition-all flex items-center gap-4">
                                <div className={cn(
                                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                                    milestone.status ? "bg-emerald-500 border-emerald-500" : "border-slate-600 group-hover:border-blue-500"
                                )}>
                                    {milestone.status && <CheckCircle2 size={14} className="text-white" />}
                                </div>
                                <div className="flex-1">
                                    <p className={cn("text-sm font-medium", milestone.status ? "text-slate-400 line-through" : "text-slate-200")}>
                                        {milestone.title}
                                    </p>
                                    <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                                        <Clock size={10} /> Due {milestone.due}
                                    </p>
                                </div>
                                <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-slate-800 rounded-lg text-slate-500 transition-all">
                                    <MoreVertical size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-3 border border-slate-700 border-dashed rounded-2xl text-slate-400 text-sm font-medium hover:bg-slate-800/50 transition-all">
                        View All Goals
                    </button>
                </div>
            </div>

            {/* Activity Log Section (Quick View) */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Activity className="text-emerald-400" /> Recent Activity
                </h2>
                <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-4 relative">
                            {i !== 3 && <div className="absolute left-5 top-10 bottom-0 w-px bg-slate-800" />}
                            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center z-10">
                                <Github size={18} className="text-slate-400" />
                            </div>
                            <div className="flex-1 pb-4">
                                <div className="flex justify-between items-start">
                                    <p className="text-sm text-slate-200">
                                        <span className="font-bold text-white">Rahul P.</span> pushed 3 new commits to <span className="text-blue-400">main</span>
                                    </p>
                                    <span className="text-xs text-slate-500">2h ago</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1 italic">"Initial setup for auth context and protected routes"</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
