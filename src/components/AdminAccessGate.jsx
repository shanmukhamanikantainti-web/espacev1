import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShieldAlert, KeyRound, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const AdminAccessGate = ({ isOpen, onClose }) => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    const ADMIN_CODE = import.meta.env.VITE_ADMIN_ACCESS_CODE;
    const SUPER_ADMIN_EMAIL = import.meta.env.VITE_SUPER_ADMIN_EMAIL;

    useEffect(() => {
        if (isOpen) {
            setCode('');
            setError('');
        }
    }, [isOpen]);

    const logAttempt = async (success) => {
        try {
            await supabase.from('activity_logs').insert({
                activity_type: success ? 'ADMIN_ACCESS_SUCCESS' : 'ADMIN_ACCESS_FAILURE',
                user_id: user?.id,
                // We'll add a metadata field or use the activity_type to represent this
                // Since our schema is simple, this will suffice for now.
            });
        } catch (err) {
            console.error('Failed to log activity:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (code === ADMIN_CODE) {
            await logAttempt(true);
            sessionStorage.setItem('admin_authenticated', 'true');
            onClose();
            navigate('/admin');
        } else {
            await logAttempt(false);
            setError('Access Denied: Invalid Security Code');
            setTimeout(() => setCode(''), 1000);
        }
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="w-full max-w-md glassmorphism border border-slate-800 rounded-3xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="relative p-8">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
                            <ShieldAlert className="text-blue-500" size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-white italic mb-2 tracking-tight">Admin Access Gate</h2>
                        <p className="text-slate-400 text-sm font-sans px-4">
                            Please enter the high-level security code to access the administrative dashboard.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1"> Security Code </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500 transition-colors group-focus-within:text-blue-400">
                                    <KeyRound size={18} />
                                </div>
                                <input
                                    type="password"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder="••••••••••••••••"
                                    required
                                    className="w-full bg-slate-900/50 border border-slate-800 focus:border-blue-500/50 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-700 outline-none transition-all font-mono tracking-widest"
                                />
                            </div>
                            {error && (
                                <p className="text-xs text-red-500 font-medium ml-1 flex items-center gap-1.5 animate-bounce">
                                    <ShieldAlert size={12} /> {error}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !code}
                            className={`w-full py-4 rounded-2xl font-black italic tracking-tight flex items-center justify-center gap-2 transition-all ${loading || !code
                                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
                                }`}
                        >
                            {loading ? 'Verifying...' : 'Authenticate Access'}
                            {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>
                </div>

                <div className="bg-slate-900/50 border-t border-slate-800 p-4 flex items-center justify-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Secured Session Control</span>
                </div>
            </div>
        </div>
    );
};

export default AdminAccessGate;
