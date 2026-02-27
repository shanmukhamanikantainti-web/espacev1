import React, { useState, useEffect } from 'react';
import {
    Users, Plus, ShieldCheck, Mail, Lock, UserPlus,
    Briefcase, FileText, Layout, Trash2, Save, X,
    Activity, ChevronRight, CheckCircle2, AlertCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user, profile } = useAuth();
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
            // We can potentially add more fields if needed
        });
    };

    const handleCreateTeam = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: 'info', msg: 'Creating team and project...' });

        try {
            // 1. Create Team
            const { data: team, error: teamErr } = await supabase
                .from('teams')
                .insert({ team_name: teamData.name })
                .select()
                .single();

            if (teamErr) throw teamErr;

            // 2. Create Project
            const { error: projErr } = await supabase
                .from('projects')
                .insert({
                    team_id: team.id,
                    project_title: teamData.project_title,
                    problem_statement: teamData.problem_statement
                });

            if (projErr) throw projErr;

            await logActivity('TEAM_CREATED', { team_id: team.id, team_name: teamData.name });
            setStatus({ type: 'success', msg: 'Team and Project created successfully!' });
            setTeamData({ name: '', project_title: '', problem_statement: '', members: [{ name: '', role: 'Member', position: 'Developer' }] });
            fetchTeams();
        } catch (err) {
            setStatus({ type: 'error', msg: err.message });
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: 'info', msg: 'Provisioning account...' });

        try {
            // NOTE: In a production environment, you'd use a service key or edge function
            // to create users without them being logged in as that user.
            // For this flow, we'll use signUp which might trigger email confirmation 
            // depending on Supabase settings.
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

            // Update profile with role and team_id if necessary
            // (Though handle_new_user trigger should handle profile creation)
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
            setStatus({ type: 'success', msg: 'Account created! User can now login with provided credentials.' });
            setAccountData({ name: '', email: '', password: '', role: 'Member', team_id: '' });
        } catch (err) {
            setStatus({ type: 'error', msg: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-700 pb-20">
            <div className="flex justify-between items-end">
                <div>
                    <p className="text-blue-400 font-bold tracking-widest text-xs uppercase mb-2 italic flex items-center gap-2">
                        <ShieldCheck size={14} /> Higher-Level Command
                    </p>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent italic">
                        e-Space Admin
                    </h1>
                </div>
                <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-slate-800">
                    <button
                        onClick={() => setActiveTab('teams')}
                        className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'teams' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        <Layout size={16} /> Teams
                    </button>
                    <button
                        onClick={() => setActiveTab('accounts')}
                        className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'accounts' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        <UserPlus size={16} /> Accounts
                    </button>
                </div>
            </div>

            {status.msg && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 border animate-in slide-in-from-left-4 ${status.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                    status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                        'bg-blue-500/10 border-blue-500/20 text-blue-400'
                    }`}>
                    {status.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
                    <p className="text-sm font-bold">{status.msg}</p>
                    <button onClick={() => setStatus({ type: '', msg: '' })} className="ml-auto opacity-50 hover:opacity-100 transition-opacity">
                        <X size={16} />
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Manual Team Creation */}
                {activeTab === 'teams' && (
                    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400">
                                <Plus size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white italic">Create New Team</h2>
                                <p className="text-xs text-slate-500 font-sans">Initialize team, project, and primary details.</p>
                            </div>
                        </div>

                        <form onSubmit={handleCreateTeam} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Team Name</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Nexus Prime"
                                        value={teamData.name}
                                        onChange={(e) => setTeamData({ ...teamData, name: e.target.value })}
                                        className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-4 py-3 text-white focus:border-blue-500/50 outline-none transition-all text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Project Title</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. AI-Powered Smart Logistics"
                                        value={teamData.project_title}
                                        onChange={(e) => setTeamData({ ...teamData, project_title: e.target.value })}
                                        className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-4 py-3 text-white focus:border-blue-500/50 outline-none transition-all text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Problem Statement</label>
                                    <textarea
                                        rows="3"
                                        placeholder="Briefly describe the challenge being addressed..."
                                        value={teamData.problem_statement}
                                        onChange={(e) => setTeamData({ ...teamData, problem_statement: e.target.value })}
                                        className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-4 py-3 text-white focus:border-blue-500/50 outline-none transition-all text-sm resize-none"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-black italic tracking-tight transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                            >
                                {loading ? 'Initializing...' : 'Confirm Team Creation'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Manual Account Creation */}
                {activeTab === 'accounts' && (
                    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-600/10 rounded-2xl flex items-center justify-center text-emerald-400">
                                <UserPlus size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white italic">Manually Provision Account</h2>
                                <p className="text-xs text-slate-500 font-sans">Create credentials and assign roles/teams.</p>
                            </div>
                        </div>

                        <form onSubmit={handleCreateAccount} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                                    <div className="relative group">
                                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400" size={16} />
                                        <input
                                            required
                                            type="text"
                                            value={accountData.name}
                                            onChange={(e) => setAccountData({ ...accountData, name: e.target.value })}
                                            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-white focus:border-emerald-500/50 outline-none transition-all text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400" size={16} />
                                        <input
                                            required
                                            type="email"
                                            value={accountData.email}
                                            onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
                                            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-white focus:border-emerald-500/50 outline-none transition-all text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400" size={16} />
                                        <input
                                            required
                                            type="password"
                                            value={accountData.password}
                                            onChange={(e) => setAccountData({ ...accountData, password: e.target.value })}
                                            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-white focus:border-emerald-500/50 outline-none transition-all text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Assign Role</label>
                                    <select
                                        value={accountData.role}
                                        onChange={(e) => setAccountData({ ...accountData, role: e.target.value })}
                                        className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-4 py-3 text-white focus:border-emerald-500/50 outline-none transition-all text-sm appearance-none"
                                    >
                                        <option value="Member">Team Member</option>
                                        <option value="Leader">Team Leader</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Assign to Team</label>
                                <select
                                    value={accountData.team_id}
                                    onChange={(e) => setAccountData({ ...accountData, team_id: e.target.value })}
                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-4 py-3 text-white focus:border-emerald-500/50 outline-none transition-all text-sm appearance-none"
                                >
                                    <option value="">No Team Assigned</option>
                                    {existingTeams.map(team => (
                                        <option key={team.id} value={team.id}>{team.team_name}</option>
                                    ))}
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-black italic tracking-tight transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                            >
                                {loading ? 'Provisioning...' : 'Confirm Account Provisioning'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Activity Feed & Stats */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-amber-600/10 rounded-2xl flex items-center justify-center text-amber-400">
                                <Activity size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white italic">Institutional Activity</h2>
                                <p className="text-xs text-slate-500 font-sans">Real-time log of administrative actions.</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {logs.length > 0 ? logs.map(log => (
                            <div key={log.id} className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl flex items-center gap-4 group hover:border-blue-500/30 transition-all">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${log.activity_type.includes('SUCCESS') || log.activity_type.includes('CREATED') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                                    }`}>
                                    <Activity size={18} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-white tracking-tight">{log.activity_type.replace(/_/g, ' ')}</p>
                                    <p className="text-[10px] text-slate-500 font-sans">
                                        {new Date(log.timestamp).toLocaleString()} {log.profiles?.name ? `by ${log.profiles.name}` : ''}
                                    </p>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-8">
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">No Activity Records Found</p>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Teams</p>
                            <p className="text-2xl font-black text-white italic">{existingTeams.length}</p>
                        </div>
                        <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Active Staff</p>
                            <p className="text-2xl font-black text-white italic">--</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
