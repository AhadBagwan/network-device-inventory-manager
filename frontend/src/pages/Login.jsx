import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HiMail, 
  HiLockClosed, 
  HiEye, 
  HiEyeOff, 
  HiArrowRight,
  HiShieldCheck
} from 'react-icons/hi';
import { HiOutlineSignal } from 'react-icons/hi2';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import ThemeSwitcher from '../components/ThemeSwitcher';

const Login = () => {
  const { loginUser, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('admin@netpulse.noc');
  const [password, setPassword] = useState('Admin@123');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Email and password are required.');
      return;
    }

    const res = await loginUser(email, password, rememberMe);
    if (res.success) {
      toast.success(`Welcome back, ${res.user.full_name || 'Operator'}!`);
      navigate(from, { replace: true });
    } else {
      setError(res.message);
      toast.error(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors flex flex-col justify-between">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="px-4 lg:px-8 py-4 flex items-center justify-between border-b border-[var(--border-color)]">
        <Link to="/" className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-[var(--accent-color)] shadow-lg shadow-cyan-500/10">
            <HiOutlineSignal className="w-6 h-6 animate-pulse" />
          </div>
          <span className="font-bold text-lg font-mono text-[var(--text-main)]">
            NetPulse NOC
          </span>
        </Link>
        <ThemeSwitcher />
      </header>

      {/* Form Container */}
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md noc-card p-6 sm:p-8 rounded-2xl space-y-6 shadow-2xl"
        >
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <HiShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-[var(--text-main)]">
              NOC Portal Sign In
            </h2>
            <p className="text-xs text-[var(--text-muted)] font-mono">
              Access live network inventory telemetry and maintenance controls
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-[11px]">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block font-semibold text-[var(--text-main)] mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                  <HiMail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@netpulse.noc"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] font-mono focus:outline-none focus:border-[var(--accent-color)]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-[var(--text-main)]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => toast('Password reset link has been dispatched to your NOC supervisor.', { icon: '🔒' })}
                  className="text-[10px] font-mono text-[var(--text-muted)] hover:text-[var(--accent-color)]"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                  <HiLockClosed className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter password"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] font-mono focus:outline-none focus:border-[var(--accent-color)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--text-muted)] hover:text-[var(--text-main)]"
                >
                  {showPassword ? <HiEyeOff className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-[var(--text-muted)] font-mono">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--accent-color)] focus:ring-0"
                />
                <span>Remember session credentials</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[var(--accent-color)] text-slate-950 font-bold shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 text-sm mt-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <HiArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-[var(--text-muted)] font-mono pt-2 border-t border-[var(--border-color)]">
            Don't have an administrator account?{' '}
            <Link to="/register" className="text-[var(--accent-color)] font-bold hover:underline">
              Create Account
            </Link>
          </div>
        </motion.div>
      </div>

      <footer className="py-4 text-center text-xs text-[var(--text-muted)] font-mono">
        NetPulse Network Operations Center • Enterprise Telemetry Management
      </footer>
    </div>
  );
};

export default Login;
