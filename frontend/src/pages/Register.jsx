import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HiUser, 
  HiMail, 
  HiLockClosed, 
  HiEye, 
  HiEyeOff, 
  HiCheckCircle, 
  HiExclamationCircle,
  HiArrowRight
} from 'react-icons/hi';
import { HiOutlineSignal } from 'react-icons/hi2';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import ThemeSwitcher from '../components/ThemeSwitcher';

const Register = () => {
  const { registerUser, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Enter a valid email address.';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    } else {
      const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#^()-])[A-Za-z\d@$!%*?&_#^()-]{8,}$/;
      if (!passRegex.test(formData.password)) {
        newErrors.password = 'Password must include uppercase, lowercase, number, and special character (@$!%*?&).';
      }
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const res = await registerUser(
      formData.fullName,
      formData.email,
      formData.password
    );

    if (res.success) {
      toast.success('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } else if (res.errors) {
      setErrors(res.errors);
      toast.error('Please resolve form validation errors.');
    } else {
      toast.error(res.message || 'Registration failed.');
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
            <h2 className="text-2xl font-extrabold text-[var(--text-main)]">
              Create NOC Account
            </h2>
            <p className="text-xs text-[var(--text-muted)] font-mono">
              Register administrator account for NOC inventory access
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Full Name */}
            <div>
              <label className="block font-semibold text-[var(--text-main)] mb-1">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                  <HiUser className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Alex Mercer"
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-[var(--bg-main)] border ${
                    errors.fullName ? 'border-rose-500' : 'border-[var(--border-color)]'
                  } text-[var(--text-main)] font-sans focus:outline-none focus:border-[var(--accent-color)]`}
                />
              </div>
              {errors.fullName && (
                <p className="text-rose-400 text-[10px] mt-1 font-mono">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block font-semibold text-[var(--text-main)] mb-1">
                Email Address <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                  <HiMail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="alex.mercer@netpulse.noc"
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-[var(--bg-main)] border ${
                    errors.email ? 'border-rose-500' : 'border-[var(--border-color)]'
                  } text-[var(--text-main)] font-mono focus:outline-none focus:border-[var(--accent-color)]`}
                />
              </div>
              {errors.email && (
                <p className="text-rose-400 text-[10px] mt-1 font-mono">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block font-semibold text-[var(--text-main)] mb-1">
                Password <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                  <HiLockClosed className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Admin@123"
                  className={`w-full pl-9 pr-10 py-2.5 rounded-xl bg-[var(--bg-main)] border ${
                    errors.password ? 'border-rose-500' : 'border-[var(--border-color)]'
                  } text-[var(--text-main)] font-mono focus:outline-none focus:border-[var(--accent-color)]`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--text-muted)] hover:text-[var(--text-main)]"
                >
                  {showPassword ? <HiEyeOff className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password ? (
                <p className="text-rose-400 text-[10px] mt-1 font-mono">{errors.password}</p>
              ) : (
                <p className="text-[10px] text-[var(--text-muted)] mt-1 font-mono">
                  Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char (@$!%*?&)
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block font-semibold text-[var(--text-main)] mb-1">
                Confirm Password <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                  <HiLockClosed className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-[var(--bg-main)] border ${
                    errors.confirmPassword ? 'border-rose-500' : 'border-[var(--border-color)]'
                  } text-[var(--text-main)] font-mono focus:outline-none focus:border-[var(--accent-color)]`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-rose-400 text-[10px] mt-1 font-mono">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[var(--accent-color)] text-slate-950 font-bold shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 text-sm mt-2"
            >
              <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
              <HiArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-[var(--text-muted)] font-mono pt-2 border-t border-[var(--border-color)]">
            Already have an account?{' '}
            <Link to="/login" className="text-[var(--accent-color)] font-bold hover:underline">
              Log In here
            </Link>
          </div>
        </motion.div>
      </div>

      <footer className="py-4 text-center text-xs text-[var(--text-muted)] font-mono">
        NetPulse NOC Inventory Manager
      </footer>
    </div>
  );
};

export default Register;
