import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineSignal } from 'react-icons/hi2';

const SplashScreen = ({ onFinish }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onFinish) onFinish();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-slate-100 select-none overflow-hidden"
        >
          {/* Cyber glow background effects */}
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-950/30 via-slate-950 to-blue-950/40 pointer-events-none" />
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'out' }}
            className="relative flex flex-col items-center gap-6 z-10"
          >
            {/* Glowing Logo Icon */}
            <div className="relative p-6 rounded-3xl bg-slate-900/80 border border-cyan-500/40 cyber-glow shadow-2xl">
              <HiOutlineSignal className="w-16 h-16 text-cyan-400 animate-pulse" />
              <div className="absolute -inset-1 rounded-3xl bg-cyan-500/20 blur-xl -z-10" />
            </div>

            {/* Brand Title */}
            <div className="text-center space-y-1">
              <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 font-mono">
                NetPulse NOC
              </h1>
              <p className="text-xs font-mono text-cyan-400/80 tracking-widest uppercase">
                Enterprise Telemetry & Asset Management
              </p>
            </div>

            {/* Animated Loading Bar */}
            <div className="w-48 bg-slate-900 rounded-full h-1.5 overflow-hidden border border-cyan-500/30">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.8, ease: 'linear' }}
                className="bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 h-full rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
