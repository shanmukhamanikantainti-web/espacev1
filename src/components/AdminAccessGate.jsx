import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShieldAlert, KeyRound, ArrowRight, Mail, ChevronLeft, ShieldCheck, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const AdminAccessGate = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1); // 1: Email, 2: Code
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user, updateManualAdmin } = useAuth();

    const ADMIN_CODE = import.meta.env.VITE_ADMIN_ACCESS_CODE;
    const SUPER_ADMIN_EMAIL = import.meta.env.VITE_SUPER_ADMIN_EMAIL;

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setEmail('');
            setCode('');
            setError('');
        }
    }, [isOpen]);

    const logAttempt = async (success, type) => {
        supabase.from('activity_logs').insert({
            activity_type: type,
            user_id: user?.id,
        }).then(({ error }) => {
            if (error) console.warn('Activity log failed:', error.message);
        });
    };

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (email.toLowerCase().trim() === SUPER_ADMIN_EMAIL.toLowerCase().trim()) {
            setStep(2);
        } else {
            setError('Unauthorized Identity: Access Denied');
            logAttempt(false, 'ADMIN_EMAIL_DENIED');
        }
    };

    const handleCodeSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (code === ADMIN_CODE) {
            logAttempt(true, 'ADMIN_ACCESS_SUCCESS');
            sessionStorage.setItem('admin_authenticated', 'true');
            sessionStorage.setItem('admin_email', email.toLowerCase().trim());
            updateManualAdmin({
                isAuthenticated: true,
                email: email.toLowerCase().trim()
            });
            onClose();
            navigate('/admin');
        } else {
            logAttempt(false, 'ADMIN_CODE_FAILURE');
            setError('Invalid Security Code');
            setTimeout(() => {
                setCode('');
                setLoading(false);
            }, 1000);
            return;
        }
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-bg-deep/90 backdrop-blur-md">
            <div className="w-full max-w-md glassmorphism border border-white/10 rounded-[2.5rem] overflow-hidden animate-in fade-in zoom-in duration-500 relative">
                {/* Background Glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand/10 blur-[80px] rounded-full" />

                <div className="relative p-10">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 text-slate-500 hover:text-brand transition-colors rounded-xl hover:bg-white/5"
                    >
                        <X size={20} />
                    </button>

                    {step === 2 && (
                        <button
                            onClick={() => setStep(1)}
                            className="absolute top-6 left-6 p-2 text-slate-500 hover:text-brand transition-colors flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/5 group"
                        >
                            <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> Back
                        </button>
                    )}

                    <div className="flex flex-col items-center text-center mb-10 mt-4">
                        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transition-all duration-700 shadow-2xl ${step === 1 ? 'bg-brand/10 text-brand border border-brand/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                            {step === 1 ? <Lock size={32} /> : <ShieldCheck size={32} />}
                        </div>
                        <h2 className="text-3xl font-black text-white italic mb-3 tracking-tighter">
                            {step === 1 ? 'IDENTITY CHECK' : 'SECURITY CLEARANCE'}
                        </h2>
                        <p className="text-slate-400 text-xs font-bold font-poppets leading-relaxed px-4 uppercase tracking-wide">
                            {step === 1
                                ? 'Authorize access via Super Admin credentials.'
                                : 'Verified. Enter secondary layer security code.'}
                        </p>
                    </div>

                    {step === 1 ? (
                        <form onSubmit={handleEmailSubmit} className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] ml-1">Admin Identity</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-600 transition-colors group-focus-within:text-brand">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="institutional-admin@example.com"
                                        required
                                        className="w-full bg-white/[0.02] border border-white/10 focus:border-brand/40 rounded-2xl py-5 pl-14 pr-4 text-white placeholder:text-slate-700 outline-none transition-all text-sm font-bold tracking-tight"
                                    />
                                </div>
                                {error && (
                                    <p className="text-[10px] text-red-500 font-black uppercase tracking-widest ml-1 flex items-center gap-2 animate-pulse">
                                        <ShieldAlert size={12} /> {error}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="w-full py-5 bg-brand hover:bg-brand-light text-bg-deep rounded-2xl font-black italic tracking-tight flex items-center justify-center gap-2 transition-all shadow-xl shadow-brand/20 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                CONTINUE TO VERIFICATION <ArrowRight size={18} />
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleCodeSubmit} className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] ml-1"> Access Key </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-600 transition-colors group-focus-within:text-emerald-500">
                                        <KeyRound size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        placeholder="••••••••••••••••"
                                        required
                                        autoFocus
                                        className="w-full bg-white/[0.02] border border-white/10 focus:border-emerald-500/40 rounded-2xl py-5 pl-14 pr-4 text-white placeholder:text-slate-700 outline-none transition-all font-mono tracking-[0.5em]"
                                    />
                                </div>
                                {error && (
                                    <p className="text-[10px] text-red-500 font-black uppercase tracking-widest ml-1 flex items-center gap-2 animate-bounce">
                                        <ShieldAlert size={12} /> {error}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !code}
                                className={`w-full py-5 rounded-2xl font-black italic tracking-tight flex items-center justify-center gap-2 transition-all ${loading || !code
                                    ? 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5'
                                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98]'
                                    }`}
                            >
                                {loading ? 'AUTHORIZING...' : 'AUTHENTICATE ACCESS'}
                                {!loading && <ArrowRight size={18} />}
                            </button>
                        </form>
                    )}
                </div>

                <div className="bg-white/[0.03] border-t border-white/5 p-5 flex items-center justify-center gap-3">
                    <div className="flex gap-1.5">
                        <div className={`w-6 h-1 rounded-full transition-all duration-500 ${step === 1 ? 'bg-brand' : 'bg-slate-700'}`} />
                        <div className={`w-6 h-1 rounded-full transition-all duration-500 ${step === 2 ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                    </div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                        {step === 1 ? 'Layer 01: Identity' : 'Layer 02: Clearance'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default AdminAccessGate;
