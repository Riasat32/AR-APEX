import React from 'react';
import { useStore } from '../context/StoreContext';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, RefreshCw, X, CheckCircle2, Lock, Cpu, AlertCircle } from 'lucide-react';
import { TransformerLogo } from './TransformerLogo';

interface PlayProtectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlayProtectModal: React.FC<PlayProtectModalProps> = ({ isOpen, onClose }) => {
  const { apps, isScanningProtect, lastScanTime, runPlayProtectScan, currentUser, theme } = useStore();
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  const installedCount = Object.keys(currentUser.installedApps || {}).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={`w-full max-w-lg rounded-3xl p-6 shadow-2xl relative border ${
          isDark
            ? 'bg-[#12141c] border-[#00BFFF]/40 text-[#C0C0C0]'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Transformer AR Emblem */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-[#22252c]">
          <TransformerLogo size={40} glow={isDark} />
          <div>
            <h3 className={`text-lg font-bold font-['Space_Grotesk'] flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              AR-STORE Play Protect
            </h3>
            <p className="text-xs text-slate-500 dark:text-gray-400">Continuous AI-driven telemetry & sandbox verification</p>
          </div>
        </div>

        {/* Central Scan Status Graphic */}
        <div className={`text-center py-6 px-4 rounded-2xl border relative overflow-hidden mb-6 ${
          isDark ? 'bg-[#161824] border-[#232636]' : 'bg-slate-50 border-slate-200'
        }`}>
          {/* Radar Scan Wave Animation */}
          {isScanningProtect && (
            <div className="absolute inset-0 bg-gradient-to-b from-[#00BFFF]/20 via-[#00BFFF]/10 to-transparent animate-pulse pointer-events-none" />
          )}

          <div className="relative w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <div className={`w-20 h-20 rounded-full border-2 ${
              isScanningProtect
                ? 'border-[#00BFFF] border-t-transparent animate-spin'
                : 'border-emerald-500/50 bg-emerald-500/10'
            } flex items-center justify-center transition-all`} />
            
            <div className="absolute">
              {isScanningProtect ? (
                <RefreshCw className="w-8 h-8 text-[#00BFFF] animate-spin" />
              ) : (
                <ShieldCheck className="w-9 h-9 text-emerald-500 drop-shadow-md" />
              )}
            </div>
          </div>

          <h4 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {isScanningProtect ? 'Scanning Device Packages...' : 'No Harmful Apps Found'}
          </h4>

          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
            {isScanningProtect
              ? 'Analyzing binary signatures, APK manifests, and memory integrity across installed software...'
              : `Play Protect scanned ${installedCount || apps.length} packages ${lastScanTime}. Your system is completely secure.`}
          </p>

          <button
            onClick={runPlayProtectScan}
            disabled={isScanningProtect}
            className="mt-5 px-6 py-2.5 rounded-xl text-xs font-bold bg-[#00BFFF] hover:bg-[#38bdf8] text-black shadow-md disabled:opacity-50 transition-all flex items-center gap-2 mx-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanningProtect ? 'animate-spin' : ''}`} />
            <span>{isScanningProtect ? 'Scanning...' : 'Scan Device Now'}</span>
          </button>
        </div>

        {/* Protection Pillars */}
        <div className="space-y-2.5 text-xs">
          <div className={`flex items-center justify-between p-3 rounded-xl border ${
            isDark ? 'bg-[#161822] border-[#222530]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <div>
                <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Cryptographic APK Verification
                </span>
                <p className="text-[11px] text-slate-500 dark:text-gray-400">All packages checked against developer hashes</p>
              </div>
            </div>
            <span className="text-[10px] text-emerald-500 font-mono font-bold">ACTIVE</span>
          </div>

          <div className={`flex items-center justify-between p-3 rounded-xl border ${
            isDark ? 'bg-[#161822] border-[#222530]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-[#00BFFF] shrink-0" />
              <div>
                <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Isolated Execution Enclave
                </span>
                <p className="text-[11px] text-slate-500 dark:text-gray-400">Prevents background unauthorized telemetry</p>
              </div>
            </div>
            <span className="text-[10px] text-[#00BFFF] font-mono font-bold">SECURED</span>
          </div>
        </div>

      </motion.div>
    </div>
  );
};
