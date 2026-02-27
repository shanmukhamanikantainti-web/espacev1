import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import DashboardLayout from './components/DashboardLayout';

import { isConfigured } from './lib/supabase';
import Dashboard from './pages/Dashboard';
import FileWorkspace from './pages/FileWorkspace';
import MeetSpace from './pages/MeetSpace';
import AdminDashboard from './pages/AdminDashboard';
import AdminAccessGate from './components/AdminAccessGate';
import { AlertTriangle, Settings } from 'lucide-react';

const EnvError = () => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
    <div className="max-w-md w-full glassmorphism p-8 rounded-3xl border border-amber-500/30">
      <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <AlertTriangle className="text-amber-500" size={32} />
      </div>
      <h1 className="text-2xl font-black text-white mb-4 italic">Configuration Required</h1>
      <p className="text-slate-400 mb-8 font-sans">
        Supabase environment variables are missing. Please update your <code className="text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded">.env</code> file with your project credentials.
      </p>
      <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-left space-y-2 mb-8">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Required Keys:</p>
        <code className="block text-xs text-slate-300">VITE_SUPABASE_URL</code>
        <code className="block text-xs text-slate-300">VITE_SUPABASE_ANON_KEY</code>
      </div>
      <p className="text-xs text-slate-500 italic">Restart the dev server after updating the file.</p>
    </div>
  </div>
);

function App() {
  if (!isConfigured) return <EnvError />;
  const [isAdminGateOpen, setIsAdminGateOpen] = useState(false);
  const { user } = useAuth();

  // Global listener for Ctrl + Q
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'q') {
        const SUPER_ADMIN_EMAIL = import.meta.env.VITE_SUPER_ADMIN_EMAIL;
        if (user?.email === SUPER_ADMIN_EMAIL) {
          setIsAdminGateOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [user]);

  return (
    <AuthProvider>
      <Router>
        <AdminAccessGate
          isOpen={isAdminGateOpen}
          onClose={() => setIsAdminGateOpen(false)}
        />
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Protected Routes inside DashboardLayout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/workspace" element={<FileWorkspace />} />
              <Route path="/meet" element={<MeetSpace />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
