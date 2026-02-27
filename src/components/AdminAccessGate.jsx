import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShieldAlert, KeyRound, ArrowRight, Mail, ChevronLeft, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const AdminAccessGate = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1); // 1: Email, 2: Code
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

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
        // Non-blocking log attempt to prevent hanging UI
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="w-full max-w-md glassmorphism border border-slate-800 rounded-3xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="relative p-8">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>

                    {step === 2 && (
                        <button
                            onClick={() => setStep(1)}
                            className="absolute top-4 left-4 p-2 text-slate-500 hover:text-white transition-colors flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest"
                        >
                            <ChevronLeft size={16} /> Back
                        </button>
                    )}

                    <div className="flex flex-col items-center text-center mb-8">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${step === 1 ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                            {step === 1 ? <ShieldAlert size={32} /> : <ShieldCheck size={32} />}
                        </div>
                        <h2 className="text-2xl font-black text-white italic mb-2 tracking-tight">
                            {step === 1 ? 'Identity Check' : 'Security Clearance'}
                        </h2>
                        <p className="text-slate-400 text-sm font-sans px-4">
                            {step === 1
                                ? 'Please enter the Super Admin email to initiate the verification process.'
                                : 'Identity confirmed. Now enter the high-level security code.'}
                        </p>
                    </div>

                    {step === 1 ? (
                        <form onSubmit={handleEmailSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Admin Identity</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500 transition-colors group-focus-within:text-blue-400">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter Super Admin Email"
                                        required
                                        className="w-full bg-slate-900/50 border border-slate-800 focus:border-blue-500/50 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-700 outline-none transition-all text-sm font-bold"
                                    />
                                </div>
                                {error && (
                                    <p className="text-xs text-red-500 font-medium ml-1 flex items-center gap-1.5 animate-pulse">
                                        <ShieldAlert size={12} /> {error}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black italic tracking-tight flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20"
                            >
                                Continue to Verification <ArrowRight size={18} />
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleCodeSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1"> Security Code </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500 transition-colors group-focus-within:text-emerald-400">
                                        <KeyRound size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        placeholder="••••••••••••••••"
                                        required
                                        autoFocus
                                        className="w-full bg-slate-900/50 border border-slate-800 focus:border-emerald-500/50 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-700 outline-none transition-all font-mono tracking-widest"
                                    />
                                </div>
                                {error && (
                                    <p className="text-xs text-red-500 font-medium ml-1 flex items-center gap-1.5 animate-shake">
                                        <ShieldAlert size={12} /> {error}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !code}
                                className={`w-full py-4 rounded-2xl font-black italic tracking-tight flex items-center justify-center gap-2 transition-all ${loading || !code
                                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                                    }`}
                            >
                                {loading ? 'Verifying...' : 'Authenticate Access'}
                                {!loading && <ArrowRight size={18} />}
                            </button>
                        </form>
                    )}
                </div>

                <div className="bg-slate-900/50 border-t border-slate-800 p-4 flex items-center justify-center gap-2">
                    <span className={`w-2 h-2 rounded-full animate-pulse transition-colors duration-500 ${step === 1 ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        {step === 1 ? 'Step 1: Identity Verification' : 'Step 2: Security Clearance'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default AdminAccessGate;
