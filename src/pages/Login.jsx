import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, LogIn, ShieldAlert, Sparkles, ChevronRight } from 'lucide-react';

const Login = () => {
    const { signInWithGoogle, user, profile, loading } = useAuth();

    const handleLogin = async () => {
        try {
            await signInWithGoogle();
        } catch (error) {
            console.error('Login failed:', error.message);
            alert('Login failed. Please ensure you use your @vishnu.edu.in email.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-bg-deep">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="text-brand w-6 h-6 animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg-deep p-4 relative overflow-hidden grid-pattern">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full" />

            <div className="max-w-md w-full glassmorphism p-10 rounded-[2.5rem] border border-white/5 relative z-10 animate-in fade-in zoom-in duration-700">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-20 h-20 bg-brand/10 border border-brand/20 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-brand/10 group hover:scale-110 transition-transform duration-500">
                        <LayoutDashboard className="text-brand w-10 h-10 group-hover:rotate-12 transition-transform" />
                    </div>
                    <h1 className="text-5xl font-black gold-text-gradient mb-3 tracking-tighter italic">e-Space</h1>
                    <p className="text-slate-400 text-center font-medium font-poppins text-sm tracking-wide">
                        THE OFFICIAL INNOVATION WORKSPACE<br />
                        <span className="text-slate-500 font-bold">POWERED BY E-CELL VISHNU IT</span>
                    </p>
                </div>

                <div className="space-y-8">
                    <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 flex items-start gap-4">
                        <div className="p-2 bg-brand/10 rounded-lg">
                            <ShieldAlert className="text-brand w-5 h-5 shrink-0" />
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            Secured institutional access. Please authenticate using your <span className="text-brand font-bold underline underline-offset-4 Decoration-brand/30">@vishnu.edu.in</span> email to proceed.
                        </p>
                    </div>

                    <button
                        onClick={handleLogin}
                        className="w-full py-5 px-6 bg-brand hover:bg-brand-light text-bg-deep font-black italic rounded-2xl transition-all duration-500 flex items-center justify-center gap-3 shadow-xl shadow-brand/20 hover:shadow-brand/40 group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        CONTINUE TO WORKSPACE
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 text-center">
                    <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 uppercase tracking-[0.3em] font-black">
                        <span className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse" />
                        Secured Identity Platform
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
