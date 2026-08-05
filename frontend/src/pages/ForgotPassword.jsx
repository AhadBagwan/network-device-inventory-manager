import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HiMail, 
  HiKey, 
  HiLockClosed, 
  HiEye, 
  HiEyeOff, 
  HiArrowRight, 
  HiCheckCircle,
  HiClock
} from 'react-icons/hi';
import { HiOutlineSignal } from 'react-icons/hi2';
import toast, { Toaster } from 'react-hot-toast';
import ThemeSwitcher from '../components/ThemeSwitcher';
import { requestForgotPasswordOtp, resetPasswordWithOtp } from '../services/api';

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Send OTP, 2: Enter OTP & New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpPreview, setOtpPreview] = useState('');
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await requestForgotPasswordOtp(email);
      toast.success(res.message || 'OTP verification code dispatched!');
      if (res.otp_preview) {
        setOtpPreview(res.otp_preview);
      }
      setStep(2);
      setTimer(60);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to request OTP code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!otp.trim() || otp.length !== 6) {
      toast.error('Please enter the 6-digit OTP code.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await resetPasswordWithOtp(email, otp, newPassword);
      toast.success(res.message || 'Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password reset failed.');
    } finally {
      setIsSubmitting(false);
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
              {step === 1 ? 'Forgot Password?' : 'Enter OTP Verification Code'}
            </h2>
            <p className="text-xs text-[var(--text-muted)] font-mono">
              {step === 1
                ? 'Enter your registered email to receive a 6-digit OTP reset code'
                : `We dispatched a 6-digit verification OTP code to ${email}`}
            </p>
          </div>

          {step === 1 ? (
            /* STEP 1: SEND OTP FORM */
            <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[var(--text-main)] mb-1">
                  Registered Email Address <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                    <HiMail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@netpulse.noc"
                    required
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] font-mono focus:outline-none focus:border-[var(--accent-color)]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-[var(--accent-color)] text-slate-950 font-bold shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 text-sm mt-2"
              >
                <span>{isSubmitting ? 'Sending OTP Code...' : 'Send OTP Code'}</span>
                <HiArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* STEP 2: VERIFY OTP & RESET PASSWORD FORM */
            <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
              {/* OTP Preview Banner for fast testing */}
              {otpPreview && (
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-center text-xs space-y-0.5">
                  <span className="text-[10px] block opacity-75 uppercase">Dispatched Verification Code:</span>
                  <span className="font-extrabold text-base tracking-widest text-white">{otpPreview}</span>
                </div>
              )}

              {/* OTP 6-digit Code Input */}
              <div>
                <label className="block font-semibold text-[var(--text-main)] mb-1">
                  6-Digit OTP Verification Code <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                    <HiKey className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="e.g. 482915"
                    required
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] font-mono text-center font-bold tracking-widest text-base focus:outline-none focus:border-[var(--accent-color)]"
                  />
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block font-semibold text-[var(--text-main)] mb-1">
                  New Password <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                    <HiLockClosed className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
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

              {/* Confirm New Password */}
              <div>
                <label className="block font-semibold text-[var(--text-main)] mb-1">
                  Confirm New Password <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                    <HiLockClosed className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    required
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] font-mono focus:outline-none focus:border-[var(--accent-color)]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)] pt-1">
                <span>Didn't receive code?</span>
                <button
                  type="button"
                  disabled={timer > 0}
                  onClick={handleSendOtp}
                  className="text-[var(--accent-color)] font-bold hover:underline disabled:opacity-50 flex items-center gap-1"
                >
                  <HiClock className="w-3.5 h-3.5" />
                  <span>{timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-[var(--accent-color)] text-slate-950 font-bold shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 text-sm mt-2"
              >
                <span>{isSubmitting ? 'Resetting Password...' : 'Reset Password'}</span>
                <HiCheckCircle className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="text-center text-xs text-[var(--text-muted)] font-mono pt-2 border-t border-[var(--border-color)]">
            Remembered your password?{' '}
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

export default ForgotPassword;
