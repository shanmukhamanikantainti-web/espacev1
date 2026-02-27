import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ allowedRoles = [] }) => {
    const { user, profile, loading, manualAdmin } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light"></div>
            </div>
        );
    }

    if (!user && !manualAdmin?.isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Domain restriction check (fail-safe)
    const isSuperAdmin = user.email === import.meta.env.VITE_SUPER_ADMIN_EMAIL;
    if (!user.email?.endsWith('@vishnu.edu.in') && !isSuperAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 font-sans">
                <div className="max-w-md w-full p-8 bg-slate-900 rounded-2xl border border-red-500/30 text-center">
                    <h2 className="text-2xl font-bold text-white mb-4 italic">Access Denied</h2>
                    <p className="text-slate-400 mb-6 font-sans">
                        e-Space is only accessible to users with a <span className="text-red-400 font-bold">@vishnu.edu.in</span> email address.
                    </p>
                    <button
                        onClick={() => window.location.href = '/login'}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(profile?.role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
