import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    CheckCircle2,
    Clock,
    Github,
    FileText,
    Plus,
    MoreVertical,
    Activity,
    Sparkles,
    ChevronRight,
    Search
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
    <div className="glassmorphism p-8 rounded-[2rem] hover:border-brand/30 transition-all duration-500 group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 blur-3xl group-hover:bg-brand/10 transition-colors" />

        <div className="flex justify-between items-start mb-6 relative z-10">
            <div className={cn("p-4 rounded-2xl bg-brand/10 border border-brand/20 group-hover:scale-110 transition-transform duration-500", color)}>
                <Icon size={24} className="text-brand" />
            </div>
            {trend && (
                <span className="text-[10px] font-black text-brand bg-brand/10 border border-brand/20 px-3 py-1.5 rounded-full flex items-center gap-1.5 tracking-tighter uppercase">
                    <TrendingUp size={12} /> {trend}
                </span>
            )}
        </div>
        <h3 className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] mb-2">{title}</h3>
        <p className="text-3xl font-black text-white italic tracking-tighter">{value}</p>
    </div>
);

const Dashboard = () => {
    const { profile, manualAdmin } = useAuth();
    const SUPER_ADMIN_EMAIL = import.meta.env.VITE_SUPER_ADMIN_EMAIL;
    const isSuperAdmin = manualAdmin?.isAuthenticated && manualAdmin?.email?.toLowerCase() === SUPER_ADMIN_EMAIL?.toLowerCase();
    const [milestones, setMilestones] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setMilestones([
            { id: 1, title: 'Project Research', status: true, due: '2024-03-01' },
            { id: 2, title: 'UI/UX Design', status: true, due: '2024-03-05' },
            { id: 3, title: 'Backend Setup', status: false, due: '2024-03-10' },
            { id: 4, title: 'API Integration', status: false, due: '2024-03-15' },
        ]);
        setLoading(false);
    }, []);

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-white/5">
                <div>
                    <div className="flex items-center gap-3 text-brand mb-3">
                        <div className="w-8 h-px bg-brand/30" />
                        <p className="font-black tracking-[0.3em] text-[10px] uppercase italic">Workspace Strategic Overview</p>
                    </div>
                    <h1 className="text-6xl font-black gold-text-gradient italic tracking-tighter leading-none">
                        {(isSuperAdmin ? 'SHANMUKHA INTI' : profile?.team_name) || 'COMMAND'} DASHBOARD
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="glassmorphism px-6 py-3 rounded-2xl flex items-center gap-4 border border-white/5 group hover:border-brand/20 transition-all cursor-pointer">
                        <div className="relative">
                            <Activity className="text-brand animate-pulse" size={18} />
                            <div className="absolute inset-0 bg-brand/20 blur-sm rounded-full animate-ping" />
                        </div>
                        <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Live Sync: Active</span>
                        <ChevronRight className="text-slate-600 group-hover:text-brand transition-colors" size={16} />
                    </div>
                </div>
            </div>

            {/* Stats Ecosystem */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard title="Overall Progress" value="65%" icon={TrendingUp} trend="+12%" />
                <StatCard title="Milestones" value="12 / 18" icon={CheckCircle2} />
                <StatCard title="GitHub Commits" value="142" icon={Github} trend="+24" />
                <StatCard title="Documentation" value="85%" icon={FileText} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Advanced Analytics */}
                <div className="lg:col-span-2 glassmorphism p-10 rounded-[2.5rem] relative overflow-hidden group border border-white/5 hover:border-brand/20 transition-all duration-700">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-2xl font-black text-white italic tracking-tighter flex items-center gap-3">
                            <div className="w-2 h-8 bg-brand rounded-full" />
                            PROGRESS ANALYTICS
                        </h2>
                        <div className="flex items-center gap-3">
                            <div className="relative group/search">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/search:text-brand transition-colors" size={14} />
                                <input type="text" placeholder="Search..." className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-brand/30 transition-all w-40" />
                            </div>
                            <select className="bg-brand/10 border border-brand/20 text-brand text-[10px] font-black uppercase tracking-widest rounded-xl px-4 py-2 outline-none hover:bg-brand/20 transition-all cursor-pointer">
                                <option>LAST 30 DAYS</option>
                                <option>LAST 7 DAYS</option>
                            </select>
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorBrand" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FFB800" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#FFB800" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="10 10" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="rgba(255,255,255,0.2)"
                                    fontSize={10}
                                    fontWeight="bold"
                                    tickLine={false}
                                    axisLine={false}
                                    dy={15}
                                />
                                <YAxis
                                    stroke="rgba(255,255,255,0.2)"
                                    fontSize={10}
                                    fontWeight="bold"
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}%`}
                                    dx={-10}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#0A0A0A',
                                        border: '1px solid rgba(255,184,0,0.2)',
                                        borderRadius: '16px',
                                        padding: '12px'
                                    }}
                                    itemStyle={{ color: '#FFB800', fontWeight: 'bold', fontSize: '12px' }}
                                    cursor={{ stroke: '#FFB800', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="progress"
                                    stroke="#FFB800"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorBrand)"
                                    animationDuration={2000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Milestone Architecture */}
                <div className="glassmorphism p-10 rounded-[2.5rem] border border-white/5 hover:border-brand/20 transition-all duration-700">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-black text-white italic tracking-tighter flex items-center gap-3">
                            <CheckCircle2 className="text-brand" size={24} />
                            MILESTONES
                        </h2>
                        <button className="w-10 h-10 bg-brand/10 text-brand border border-brand/20 hover:bg-brand hover:text-bg-deep rounded-xl transition-all flex items-center justify-center group shadow-lg shadow-brand/5">
                            <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                        </button>
                    </div>
                    <div className="space-y-5">
                        {milestones.map((milestone) => (
                            <div key={milestone.id} className="group p-5 bg-white/[0.02] rounded-[1.5rem] border border-white/5 hover:border-brand/30 transition-all duration-500 flex items-center gap-5 cursor-pointer">
                                <div className={cn(
                                    "w-8 h-8 rounded-xl border flex items-center justify-center transition-all duration-500",
                                    milestone.status
                                        ? "bg-brand border-brand shadow-lg shadow-brand/20"
                                        : "bg-white/5 border-white/10 group-hover:border-brand/50 group-hover:bg-brand/5"
                                )}>
                                    {milestone.status && <CheckCircle2 size={16} className="text-bg-deep" />}
                                </div>
                                <div className="flex-1">
                                    <p className={cn(
                                        "text-sm font-bold tracking-tight transition-colors",
                                        milestone.status ? "text-slate-500 line-through" : "text-white group-hover:text-brand"
                                    )}>
                                        {milestone.title}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <div className="p-1 bg-white/5 rounded-md">
                                            <Clock size={10} className="text-slate-500" />
                                        </div>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Due {milestone.due}</p>
                                    </div>
                                </div>
                                <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white/10 rounded-lg text-slate-500 hover:text-white transition-all">
                                    <MoreVertical size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-10 py-5 bg-white/[0.02] border border-white/10 border-dashed rounded-[1.5rem] text-slate-500 text-xs font-black uppercase tracking-[0.2em] hover:bg-brand/5 hover:text-brand hover:border-brand/30 transition-all duration-500">
                        ACCESS ARCHIVE
                    </button>
                </div>
            </div>

            {/* Strategic Feed */}
            <div className="glassmorphism p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[120px] pointer-events-none" />
                <h2 className="text-2xl font-black text-white italic tracking-tighter mb-10 flex items-center gap-3">
                    <div className="w-2 h-8 bg-emerald-500 rounded-full" />
                    RECENT STRATEGIC ACTIVITY
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex gap-5 hover:border-emerald-500/30 transition-all group/item">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/5 group-hover/item:scale-110 transition-transform duration-500">
                                <Github size={24} className="text-emerald-400" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <p className="text-sm font-black text-white tracking-tight">Rahul P.</p>
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">2h ago</span>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                    Pushed 3 commits to <span className="text-brand font-bold underline underline-offset-4 decoration-brand/30">main</span>
                                </p>
                                <p className="text-[10px] text-slate-500 mt-3 italic bg-white/5 p-2 rounded-lg border border-white/5">
                                    "Initial setup for auth context and protected routes..."
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
