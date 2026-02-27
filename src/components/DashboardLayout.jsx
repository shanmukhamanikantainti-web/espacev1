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
    ShieldCheck
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
            "h-screen bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col",
            isOpen ? "w-64" : "w-20"
        )}>
            <div className="p-6 flex items-center justify-between">
                <div className={cn("flex items-center gap-3", !isOpen && "hidden")}>
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <LayoutDashboard className="text-white w-5 h-5" />
                    </div>
                    <span className="font-bold text-xl text-white">e-Space</span>
                </div>
                <button onClick={() => setIsOpen(!isOpen)} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400">
                    {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            <nav className="flex-1 px-3 space-y-2 mt-4">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                                isActive
                                    ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <item.icon size={22} className={cn(isActive ? "text-blue-400" : "group-hover:text-white")} />
                            {isOpen && <span className="font-medium">{item.name}</span>}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <div className={cn("flex items-center gap-3 px-2 mb-4", !isOpen && "justify-center")}>
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                        <span className="text-slate-200 font-bold">{profile?.name?.charAt(0) || profile?.email?.charAt(0).toUpperCase()}</span>
                    </div>
                    {isOpen && (
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-white truncate">{profile?.name || 'User'}</p>
                            <p className="text-xs text-slate-500 truncate">{profile?.role}</p>
                        </div>
                    )}
                </div>
                <button
                    onClick={signOut}
                    className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all",
                        !isOpen && "justify-center px-0"
                    )}
                >
                    <LogOut size={22} />
                    {isOpen && <span className="font-medium">Sign Out</span>}
                </button>
            </div>
        </div>
    );
};

const DashboardLayout = () => {
    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-50 font-sans">
            <Sidebar />
            <main className="flex-1 overflow-auto bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
                <div className="p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
