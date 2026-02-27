import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, LogIn, ShieldAlert } from 'lucide-react';

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
            <div className="flex items-center justify-center min-height-screen bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
            <div className="max-w-md w-full glassmorphism p-8 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl shadow-2xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
                        <LayoutDashboard className="text-white w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">e-Space</h1>
                    <p className="text-slate-400 text-center">Official Innovation Workspace Platform for E-Cell</p>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                        <div className="flex items-start gap-3">
                            <ShieldAlert className="text-amber-500 w-5 h-5 shrink-0 mt-0.5" />
                            <p className="text-sm text-slate-300">
                                Access is restricted to <span className="text-amber-400 font-semibold">@vishnu.edu.in</span> email domains only.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogin}
                        className="w-full py-4 px-6 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-xl hover:shadow-white/10 group"
                    >
                        <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        Continue with Institution Email
                    </button>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-800 text-center">
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold font-sans">
                        Powered by E-Cell Vishnu IT
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
