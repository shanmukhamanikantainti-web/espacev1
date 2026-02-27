import React, { useState, useEffect } from 'react';
import {
    Users, Plus, ShieldCheck, Mail, Lock, UserPlus,
    Briefcase, FileText, Layout, Trash2, Save, X,
    Activity, ChevronRight, CheckCircle2, AlertCircle,
    Command, Sparkles, Database, History, Search
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('teams'); // 'teams' or 'accounts'
    const [status, setStatus] = useState({ type: '', msg: '' });

    // Team Form State
    const [teamData, setTeamData] = useState({
        name: '',
        project_title: '',
        problem_statement: '',
        members: [{ name: '', role: 'Member', position: 'Developer' }]
    });

    // Account Form State
    const [accountData, setAccountData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Member',
        team_id: ''
    });

    const [existingTeams, setExistingTeams] = useState([]);
    const [logs, setLogs] = useState([]);
    const SUPER_ADMIN_EMAIL = import.meta.env.VITE_SUPER_ADMIN_EMAIL;

    useEffect(() => {
        // Strict security check
        const isAuth = sessionStorage.getItem('admin_authenticated') === 'true';
        const adminEmail = sessionStorage.getItem('admin_email');

        // Access allowed if:
        // 1. Manually authenticated via gate with correct email
        // 2. OR Logged in via Supabase with super admin email
        const isManualAdmin = isAuth && adminEmail?.toLowerCase() === SUPER_ADMIN_EMAIL?.toLowerCase();
        const isSupabaseAdmin = user?.email?.toLowerCase() === SUPER_ADMIN_EMAIL?.toLowerCase();

        if (!isManualAdmin && !isSupabaseAdmin) {
            console.log('Admin check failed:', { isManualAdmin, isSupabaseAdmin, adminEmail, userEmail: user?.email });
            navigate('/');
            return;
        }
        fetchTeams();
        fetchLogs();
    }, [user, navigate, SUPER_ADMIN_EMAIL]);

    const fetchTeams = async () => {
        const { data } = await supabase.from('teams').select('*');
        setExistingTeams(data || []);
    };

    const fetchLogs = async () => {
        const { data } = await supabase
            .from('activity_logs')
            .select('*, profiles(name)')
            .order('timestamp', { ascending: false })
            .limit(10);
        setLogs(data || []);
    };

    const logActivity = async (type, metadata = {}) => {
        await supabase.from('activity_logs').insert({
            activity_type: type,
            user_id: user?.id,
        });
    };

    const handleCreateTeam = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: 'info', msg: 'INITIALIZING TEAM CORE...' });

        try {
            const { data: team, error: teamErr } = await supabase
                .from('teams')
                .insert({ team_name: teamData.name })
                .select()
                .single();

            if (teamErr) throw teamErr;

            const { error: projErr } = await supabase
                .from('projects')
                .insert({
                    team_id: team.id,
                    project_title: teamData.project_title,
                    problem_statement: teamData.problem_statement
                });

            if (projErr) throw projErr;

            await logActivity('TEAM_CREATED', { team_id: team.id, team_name: teamData.name });
            setStatus({ type: 'success', msg: 'STRATEGIC TEAM ASSET CREATED SUCCESSFULLY' });
            setTeamData({ name: '', project_title: '', problem_statement: '', members: [{ name: '', role: 'Member', position: 'Developer' }] });
            fetchTeams();
        } catch (err) {
            setStatus({ type: 'error', msg: err.message.toUpperCase() });
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: 'info', msg: 'PROVISIONING CREDENTIALS...' });

        try {
            const { data, error: authErr } = await supabase.auth.signUp({
                email: accountData.email,
                password: accountData.password,
                options: {
                    data: {
                        full_name: accountData.name,
                        role: accountData.role
                    }
                }
            });

            if (authErr) throw authErr;

            if (accountData.team_id && data.user) {
                await supabase
                    .from('profiles')
                    .update({ role: accountData.role })
                    .eq('id', data.user.id);

                await supabase
                    .from('team_members')
                    .insert({ team_id: accountData.team_id, user_id: data.user.id });
            }

            await logActivity('ACCOUNT_CREATED', { email: accountData.email, role: accountData.role });
            setStatus({ type: 'success', msg: 'IDENTITY PROVISIONED. USER CAN NOW ACCESS WORKSPACE.' });
            setAccountData({ name: '', email: '', password: '', role: 'Member', team_id: '' });
        } catch (err) {
            setStatus({ type: 'error', msg: err.message.toUpperCase() });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-top-8 duration-1000 pb-20">
            {/* Header / Command Center */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
                <div>
                    <div className="flex items-center gap-3 text-brand mb-3">
                        <Command size={16} className="animate-pulse" />
                        <p className="font-black tracking-[0.4em] text-[10px] uppercase italic">Central Administrative Command</p>
                    </div>
                    <h1 className="text-6xl font-black gold-text-gradient italic tracking-tighter leading-none">
                        E-SPACE COMMAND
                    </h1>
                </div>

                <div className="flex bg-white/[0.03] p-1.5 rounded-2xl border border-white/5 shadow-2xl">
                    <button
                        onClick={() => setActiveTab('teams')}
                        className={cn(
                            "px-8 py-3 rounded-xl text-xs font-black transition-all duration-500 flex items-center gap-3 tracking-widest uppercase",
                            activeTab === 'teams'
                                ? "bg-brand text-bg-deep shadow-lg shadow-brand/20 italic"
                                : "text-slate-500 hover:text-slate-200"
                        )}
                    >
                        <Layout size={16} /> Team Registry
                    </button>
                    <button
                        onClick={() => setActiveTab('accounts')}
                        className={cn(
                            "px-8 py-3 rounded-xl text-xs font-black transition-all duration-500 flex items-center gap-3 tracking-widest uppercase",
                            activeTab === 'accounts'
                                ? "bg-brand text-bg-deep shadow-lg shadow-brand/20 italic"
                                : "text-slate-500 hover:text-slate-200"
                        )}
                    >
                        <UserPlus size={16} /> Personnel
                    </button>
                </div>
            </div>

            {/* Status Feedback */}
            {status.msg && (
                <div className={cn(
                    "p-6 rounded-[1.5rem] flex items-center gap-5 border-l-4 animate-in slide-in-from-left-8 duration-500 glassmorphism",
                    status.type === 'error' ? 'border-red-500 bg-red-500/5 text-red-500' :
                        status.type === 'success' ? 'border-brand bg-brand/5 text-brand' :
                            'border-blue-500 bg-blue-500/5 text-blue-500'
                )}>
                    <div className="p-2 bg-white/5 rounded-lg shrink-0">
                        {status.type === 'error' ? <AlertCircle size={22} /> : <CheckCircle2 size={22} />}
                    </div>
                    <p className="text-xs font-black tracking-widest uppercase italic">{status.msg}</p>
                    <button onClick={() => setStatus({ type: '', msg: '' })} className="ml-auto opacity-30 hover:opacity-100 transition-opacity p-2">
                        <X size={20} />
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Dynamic Management Forms */}
                <div className="glassmorphism rounded-[2.5rem] border border-white/5 p-10 relative overflow-hidden group">
                    {/* Ambient Glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 blur-3xl rounded-full group-hover:bg-brand/10 transition-colors" />

                    {activeTab === 'teams' ? (
                        <div className="space-y-10">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 bg-brand/10 border border-brand/20 rounded-2xl flex items-center justify-center text-brand shadow-xl shadow-brand/5">
                                    <Plus size={32} />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-white italic tracking-tighter">CREATE NEW TEAM</h2>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1 italic">Initialize workspace team architecture.</p>
                                </div>
                            </div>

                            <form onSubmit={handleCreateTeam} className="space-y-8">
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] ml-1">Team Designation</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="e.g. ALPHA_SIX"
                                            value={teamData.name}
                                            onChange={(e) => setTeamData({ ...teamData, name: e.target.value })}
                                            className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-brand/40 outline-none transition-all text-sm font-bold tracking-tight"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] ml-1">Strategic Project Title</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="e.g. QUANTUM_ANALYTICS"
                                            value={teamData.project_title}
                                            onChange={(e) => setTeamData({ ...teamData, project_title: e.target.value })}
                                            className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-brand/40 outline-none transition-all text-sm font-bold tracking-tight"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] ml-1">Problem Objective</label>
                                        <textarea
                                            rows="4"
                                            placeholder="Define the strategic challenge..."
                                            value={teamData.problem_statement}
                                            onChange={(e) => setTeamData({ ...teamData, problem_statement: e.target.value })}
                                            className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-brand/40 outline-none transition-all text-sm font-bold tracking-tight resize-none"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-brand hover:bg-brand-light text-bg-deep py-5 rounded-2xl font-black italic tracking-tighter transition-all shadow-xl shadow-brand/20 flex items-center justify-center gap-3 disabled:opacity-50 group/btn"
                                >
                                    {loading ? 'INITIALIZING...' : 'CONFIRM TEAM DEPLOYMENT'}
                                    <Sparkles size={18} className="group-hover/btn:rotate-12 transition-transform" />
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="space-y-10">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 bg-brand/10 border border-brand/20 rounded-2xl flex items-center justify-center text-brand shadow-xl shadow-brand/5">
                                    <UserPlus size={32} />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-white italic tracking-tighter">PROVISION PERSONNEL</h2>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1 italic">Assign identity and access clearance.</p>
                                </div>
                            </div>

                            <form onSubmit={handleCreateAccount} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] ml-1">Personnel Name</label>
                                        <div className="relative group">
                                            <Users className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-brand transition-colors" size={18} />
                                            <input
                                                required
                                                type="text"
                                                value={accountData.name}
                                                onChange={(e) => setAccountData({ ...accountData, name: e.target.value })}
                                                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-white focus:border-brand/40 outline-none transition-all text-sm font-bold"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] ml-1">Institutional Email</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-brand transition-colors" size={18} />
                                            <input
                                                required
                                                type="email"
                                                value={accountData.email}
                                                onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
                                                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-white focus:border-brand/40 outline-none transition-all text-sm font-bold"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] ml-1">Access Passphrase</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-brand transition-colors" size={18} />
                                            <input
                                                required
                                                type="password"
                                                value={accountData.password}
                                                onChange={(e) => setAccountData({ ...accountData, password: e.target.value })}
                                                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-white focus:border-brand/40 outline-none transition-all text-sm font-bold"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] ml-1">Role Designation</label>
                                        <select
                                            value={accountData.role}
                                            onChange={(e) => setAccountData({ ...accountData, role: e.target.value })}
                                            className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-brand/40 outline-none transition-all text-sm font-bold appearance-none cursor-pointer"
                                        >
                                            <option value="Member">TEAM MEMBER</option>
                                            <option value="Leader">TEAM LEADER</option>
                                            <option value="Admin">SYSTEM ADMIN</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] ml-1">Assigned Operational Unit</label>
                                    <select
                                        value={accountData.team_id}
                                        onChange={(e) => setAccountData({ ...accountData, team_id: e.target.value })}
                                        className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-brand/40 outline-none transition-all text-sm font-bold appearance-none cursor-pointer"
                                    >
                                        <option value="">STANDALONE PERSONNEL</option>
                                        {existingTeams.map(team => (
                                            <option key={team.id} value={team.id}>{team.team_name.toUpperCase()}</option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-brand hover:bg-brand-light text-bg-deep py-5 rounded-2xl font-black italic tracking-tighter transition-all shadow-xl shadow-brand/20 flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {loading ? 'PROVISIONING...' : 'AUTHORIZE IDENTITY ACCESS'}
                                    <ShieldCheck size={20} />
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                {/* Audit Logs & System Metrics */}
                <div className="space-y-12">
                    <div className="glassmorphism rounded-[2.5rem] border border-white/5 p-10 relative overflow-hidden group">
                        {/* Ambient Glow */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 blur-3xl rounded-full" />

                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 bg-brand/10 border border-brand/20 rounded-2xl flex items-center justify-center text-brand shadow-xl shadow-brand/5">
                                    <History size={32} />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-white italic tracking-tighter">AUDIT LOGS</h2>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1 italic">Real-time command stream.</p>
                                </div>
                            </div>
                            <div className="relative group/search">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within/search:text-brand" size={16} />
                                <input type="text" placeholder="FILTER..." className="bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-2 text-[10px] text-white outline-none focus:border-brand/30 transition-all font-black tracking-widest w-32" />
                            </div>
                        </div>

                        <div className="space-y-5 max-h-[450px] overflow-y-auto pr-3 custom-scrollbar">
                            {logs.length > 0 ? logs.map(log => (
                                <div key={log.id} className="p-5 bg-white/[0.01] border border-white/5 rounded-2xl flex items-center gap-5 group/log hover:border-brand/30 transition-all duration-500 cursor-default">
                                    <div className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center group-hover/log:scale-110 transition-transform duration-500 border",
                                        log.activity_type.includes('SUCCESS') || log.activity_type.includes('CREATED')
                                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                            : 'bg-red-500/10 text-red-500 border-red-500/20'
                                    )}>
                                        <Activity size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-black text-white tracking-widest uppercase italic">{log.activity_type.replace(/_/g, ' ')}</p>
                                        <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                            <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                                            <span className="w-1 h-1 bg-slate-800 rounded-full" />
                                            <span className="text-brand/70">{log.profiles?.name || 'SYSTEM CORE'}</span>
                                        </div>
                                    </div>
                                    <ChevronRight size={14} className="text-slate-800 group-hover/log:text-brand transition-colors" />
                                </div>
                            )) : (
                                <div className="text-center py-16 opacity-30">
                                    <Database size={48} className="mx-auto mb-4 text-slate-600" />
                                    <p className="text-xs font-black uppercase tracking-[0.4em]">Zero Protocol Records</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="glassmorphism p-10 rounded-[2.5rem] border border-white/5 group hover:border-brand/20 transition-all">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 italic">Active Units</p>
                            <div className="flex items-end gap-3">
                                <p className="text-5xl font-black text-white italic tracking-tighter leading-none">{existingTeams.length}</p>
                                <Users size={24} className="text-brand mb-1 animate-bounce" />
                            </div>
                        </div>
                        <div className="glassmorphism p-10 rounded-[2.5rem] border border-white/5 group hover:border-brand/20 transition-all">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 italic">System Health</p>
                            <div className="flex items-end gap-3">
                                <p className="text-5xl font-black text-white italic tracking-tighter leading-none">99 <span className="text-2xl ml-[-10px]">%</span></p>
                                <History size={24} className="text-emerald-500 mb-1" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
