import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    LayoutDashboard,
    FolderOpen,
    Video,
    Settings,
    LogOut,
    Menu,
    X,
    ShieldCheck,
    Sparkles
} from 'lucide-react';
import { cn } from '../lib/utils';

const Sidebar = () => {
    const { profile, signOut } = useAuth();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(true);

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
        { name: 'Workspace', icon: FolderOpen, path: '/workspace' },
        { name: 'Meet Space', icon: Video, path: '/meet' },
    ];

    if (profile?.role === 'Admin') {
        navItems.push({ name: 'Admin Portal', icon: ShieldCheck, path: '/admin' });
    }

    return (
        <div className={cn(
            "h-screen bg-bg-deep border-r border-white/5 transition-all duration-500 flex flex-col relative z-20",
            isOpen ? "w-72" : "w-24"
        )}>
            {/* Sidebar Glow */}
            <div className="absolute top-0 left-0 w-full h-32 bg-brand/5 blur-[60px] pointer-events-none" />

            <div className="p-8 flex items-center justify-between relative">
                <div className={cn("flex items-center gap-4", !isOpen && "hidden")}>
                    <div className="w-10 h-10 bg-brand/10 border border-brand/20 rounded-xl flex items-center justify-center shadow-lg shadow-brand/10">
                        <Sparkles className="text-brand w-6 h-6" />
                    </div>
                    <span className="font-black text-2xl gold-text-gradient italic tracking-tighter">e-Space</span>
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-brand transition-all border border-transparent hover:border-white/5"
                >
                    {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            <nav className="flex-1 px-4 space-y-3 mt-6">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={cn(
                                "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                                isActive
                                    ? "bg-brand/10 text-brand border border-brand/20 shadow-lg shadow-brand/5"
                                    : "text-slate-500 hover:bg-white/[0.03] hover:text-slate-200 border border-transparent"
                            )}
                        >
                            {isActive && <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-brand rounded-r-full" />}
                            <item.icon size={22} className={cn("transition-transform duration-300 group-hover:scale-110", isActive ? "text-brand" : "text-slate-500 group-hover:text-slate-200")} />
                            {isOpen && <span className="font-bold font-poppets text-sm tracking-wide">{item.name.toUpperCase()}</span>}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6 border-t border-white/5 relative bg-white/[0.01]">
                <div className={cn("flex items-center gap-4 px-2 mb-6", !isOpen && "justify-center")}>
                    <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center border border-brand/20 shadow-inner overflow-hidden group">
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-brand font-black text-lg group-hover:scale-110 transition-transform">{profile?.name?.charAt(0) || profile?.email?.charAt(0).toUpperCase()}</span>
                        )}
                    </div>
                    {isOpen && (
                        <div className="overflow-hidden">
                            <p className="text-sm font-black text-white truncate tracking-tight">{profile?.name || 'Workspace User'}</p>
                            <p className="text-[10px] text-brand/70 font-black uppercase tracking-[0.2em]">{profile?.role || 'Member'}</p>
                        </div>
                    )}
                </div>
                <button
                    onClick={signOut}
                    className={cn(
                        "w-full flex items-center gap-4 px-5 py-4 text-slate-500 hover:text-white hover:bg-red-500/10 rounded-2xl transition-all group overflow-hidden border border-transparent hover:border-red-500/20",
                        !isOpen && "justify-center px-0"
                    )}
                >
                    <LogOut size={22} className="group-hover:text-red-400 group-hover:-translate-x-1 transition-all" />
                    {isOpen && <span className="font-bold text-sm tracking-wide">SIGN OUT</span>}
                </button>
            </div>
        </div>
    );
};

const DashboardLayout = () => {
    return (
        <div className="flex min-h-screen bg-bg-deep text-slate-50 font-inter selection:bg-brand/30 selection:text-brand-light">
            <Sidebar />
            <main className="flex-1 overflow-auto relative grid-pattern">
                {/* Foreground Ambient Glow */}
                <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-brand/5 blur-[150px] pointer-events-none" />

                <div className="p-10 max-w-[1600px] mx-auto relative z-10">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
