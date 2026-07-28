import React, { useState } from 'react';
import { HiX, HiLockClosed, HiUser, HiEye, HiEyeOff, HiShieldCheck } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminLoginModal = ({ isOpen, onClose, onSuccess }) => {
  const { loginAdmin } = useAuth();

  const [username, setUsername] = useState('Admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const res = loginAdmin(username, password);
    if (res.success) {
      toast.success('Admin authentication successful! Access granted.');
      setPassword('');
      onClose();
      if (onSuccess) onSuccess();
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md animate-in fade-in duration-200" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden p-6 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <HiLockClosed className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--text-main)]">
                  NOC Admin Portal Access
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-mono">
                  Elevated Administrator Authentication
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-[11px]">
                {error}
              </div>
            )}

            <div>
              <label className="block font-semibold text-[var(--text-main)] mb-1">
                Admin Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                  <HiUser className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] font-mono focus:outline-none focus:border-[var(--accent-color)]"
                  placeholder="Admin"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[var(--text-main)] mb-1">
                Admin Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                  <HiLockClosed className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="admin@123"
                  className="w-full pl-9 pr-10 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] font-mono focus:outline-none focus:border-[var(--accent-color)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--text-muted)] hover:text-[var(--text-main)]"
                >
                  {showPassword ? <HiEyeOff className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-[var(--text-muted)] font-mono mt-1">
                Default Credentials — User: <code className="text-cyan-400 font-bold">Admin</code> | Pass: <code className="text-cyan-400 font-bold">admin@123</code>
              </p>
            </div>

            <div className="pt-3 border-t border-[var(--border-color)] flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)] font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-lg shadow-amber-500/20 transition-all"
              >
                <HiShieldCheck className="w-4 h-4" />
                <span>Authenticate Admin</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginModal;
