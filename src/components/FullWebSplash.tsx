import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TransformerLogo, TRANSFORMER_LOGO_URL } from './TransformerLogo';
import { ShieldCheck, Sparkles, Cpu } from 'lucide-react';

interface FullWebSplashProps {
  onComplete: () => void;
}

export const FullWebSplash: React.FC<FullWebSplashProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('AUTHENTICATING IDENTITY...');

  useEffect(() => {
    const steps = [
      { at: 20, msg: 'BOOTING TRANSFORMER AR CORE...' },
      { at: 45, msg: 'INITIALIZING PLAY PROTECT SECURITY ENCLAVE...' },
      { at: 75, msg: 'SYNCHRONIZING REPOSITORIES & CYBER POINTS...' },
      { at: 95, msg: 'LAUNCHING AR-STORE...' }
    ];

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 3;
        const matchingStep = steps.find((s) => next >= s.at && prev < s.at);
        if (matchingStep) {
          setStatusMessage(matchingStep.msg);
        }
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 350);
          return 100;
        }
        return next;
      });
    }, 35);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-[#0a0a0c] text-white select-none px-6"
    >
      {/* Background Ambient Radial Pulses */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[#00BFFF]/15 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute w-[350px] h-[350px] rounded-full bg-cyan-600/10 blur-[90px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full text-center space-y-6">
        
        {/* Glowing Transformer AR Metallic Emblem */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: 'spring', damping: 15 }}
          className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center p-2 rounded-3xl bg-gradient-to-b from-[#161a24] to-[#0c0d12] border-2 border-[#00BFFF]/60 shadow-[0_0_50px_rgba(0,191,255,0.6)]"
        >
          <img
            src={TRANSFORMER_LOGO_URL}
            alt="AR-STORE Transformer Emblem"
            className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(0,191,255,0.8)]"
          />
          {/* Animated rim radar ring */}
          <div className="absolute -inset-1 rounded-3xl border border-[#00BFFF]/40 animate-ping opacity-25 pointer-events-none" />
        </motion.div>

        {/* Brand Name */}
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wider text-white font-['Space_Grotesk']">
            AR<span className="text-[#00BFFF]">-STORE</span>
          </h1>
          <p className="text-xs uppercase font-mono tracking-widest text-[#C0C0C0]">
            Transformers Cyber Edition
          </p>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full space-y-2 pt-2">
          <div className="w-full h-2 rounded-full bg-[#181a24] border border-[#2a2d3c] overflow-hidden p-0.5 shadow-inner">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#00BFFF] via-[#38bdf8] to-[#00f5ff] shadow-[0_0_12px_#00BFFF]"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
            <span className="text-[#00BFFF] truncate max-w-[240px]">{statusMessage}</span>
            <span className="font-bold text-white">{progress}%</span>
          </div>
        </div>

        {/* Play Protect Certified Footer */}
        <div className="flex items-center gap-2 text-xs text-emerald-400/90 pt-4">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-mono">Google Play Protect Certified</span>
        </div>

      </div>
    </motion.div>
  );
};
