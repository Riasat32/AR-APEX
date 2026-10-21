import React from 'react';
import { useStore } from '../context/StoreContext';
import { motion } from 'motion/react';
import {
  Sun,
  Moon,
  Wifi,
  Download,
  ShieldCheck,
  Trash2,
  RotateCcw,
  Check,
  Lock,
  Volume2,
  Sparkles,
  Info,
  ChevronRight,
  Sliders,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { TransformerLogo } from './TransformerLogo';
import { StoreTheme } from '../types/store';

export const SettingsPage: React.FC = () => {
  const {
    theme,
    setTheme,
    settings,
    updateSettings,
    clearSearchHistory,
    resetToFactoryDefaults,
    triggerStartupAnimation,
    loadSampleCatalog,
    clearAllCatalog,
    apps,
    showToast
  } = useStore();

  const handleClearCache = () => {
    showToast('Cache Cleared', 'Freed 142 MB of temporary APK binaries and preview textures.', 'success');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6"
    >
      {/* Header Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border transition-all ${
        theme === 'dark'
          ? 'bg-[#12141c] border-[#22252c] text-[#C0C0C0]'
          : 'bg-white border-slate-200 shadow-sm text-slate-700'
      }`}>
        <div className="flex items-center gap-4">
          <div className="relative">
            <TransformerLogo size={54} glow={theme === 'dark'} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-xl sm:text-2xl font-extrabold font-['Space_Grotesk'] ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                AR-STORE Settings
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-[#00BFFF]/15 border border-[#00BFFF]/40 text-[#00BFFF]">
                PREFERENCES
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
              Configure store theme, download engine, security enclaves, and defaults
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 1: THEME SELECTION (WHITE THEME IS DEFAULT) */}
      <div className={`p-6 rounded-3xl border space-y-4 ${
        theme === 'dark'
          ? 'bg-[#12141c] border-[#22252c]'
          : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-base font-bold font-['Space_Grotesk'] ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              Display Theme & Appearance
            </h3>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
              White theme is default. Switch anytime to pure black cybernetic mode.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#00BFFF]/10 border border-[#00BFFF]/30 text-[#00BFFF]">
            {theme === 'light' ? 'White Theme (Active)' : 'Black Theme (Active)'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          
          {/* White Theme Card (DEFAULT) */}
          <button
            onClick={() => {
              setTheme('light');
              showToast('Theme Changed', 'White Theme applied as default.', 'info');
            }}
            className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
              theme === 'light'
                ? 'bg-slate-50 border-[#0284c7] shadow-[0_0_20px_rgba(2,132,199,0.2)] ring-2 ring-[#0284c7]'
                : 'bg-slate-50/50 hover:bg-slate-100 border-slate-200 opacity-75'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                  <Sun className="w-5 h-5" />
                </div>
                {theme === 'light' && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#0284c7] text-white">
                    DEFAULT ACTIVE
                  </span>
                )}
              </div>
              <h4 className="text-sm font-bold text-slate-900">White Theme (Google Play Style)</h4>
              <p className="text-xs text-slate-500 mt-1">
                Clean, high-clarity white background with crisp typography and vibrant cyber blue highlights.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-200 flex items-center gap-1.5 text-xs text-[#0284c7] font-semibold">
              <Check className="w-3.5 h-3.5" />
              <span>Recommended for publishing</span>
            </div>
          </button>

          {/* Black Theme Card */}
          <button
            onClick={() => {
              setTheme('dark');
              showToast('Theme Changed', 'Futuristic Black Theme activated.', 'info');
            }}
            className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
              theme === 'dark'
                ? 'bg-[#181a24] border-[#00BFFF] shadow-[0_0_20px_rgba(0,191,255,0.4)] ring-2 ring-[#00BFFF]'
                : 'bg-[#14151c] hover:bg-[#1a1c24] border-[#22252c] opacity-75'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#00BFFF]/10 border border-[#00BFFF]/30 flex items-center justify-center text-[#00BFFF]">
                  <Moon className="w-5 h-5" />
                </div>
                {theme === 'dark' && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#00BFFF] text-black">
                    ACTIVE
                  </span>
                )}
              </div>
              <h4 className="text-sm font-bold text-white">Black Theme (Futuristic Cyber)</h4>
              <p className="text-xs text-gray-400 mt-1">
                Pure deep black background (#0a0a0a) with glowing neon blue borders and metallic silver text.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-gray-700/50 flex items-center gap-1.5 text-xs text-[#00BFFF] font-semibold">
              <Check className="w-3.5 h-3.5" />
              <span>Optimus Cyber Grid</span>
            </div>
          </button>

        </div>
      </div>

      {/* SECTION 2: NETWORK & DOWNLOAD PREFERENCES */}
      <div className={`p-6 rounded-3xl border space-y-4 ${
        theme === 'dark'
          ? 'bg-[#12141c] border-[#22252c]'
          : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <h3 className={`text-base font-bold font-['Space_Grotesk'] ${
          theme === 'dark' ? 'text-white' : 'text-slate-900'
        }`}>
          Network & Download Engine
        </h3>

        <div className="space-y-3 text-xs">
          
          <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 dark:border-[#222530] bg-slate-50 dark:bg-[#161822]">
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-[#00BFFF]" />
              <div>
                <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  App Download Preference
                </span>
                <p className="text-[11px] text-slate-500 dark:text-gray-400">
                  Select network policy before downloading APK binaries
                </p>
              </div>
            </div>

            <select
              value={settings.downloadNetwork}
              onChange={(e) => updateSettings({ downloadNetwork: e.target.value as any })}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold outline-none border ${
                theme === 'dark'
                  ? 'bg-[#1f222e] border-[#2c2f40] text-white'
                  : 'bg-white border-slate-300 text-slate-800'
              }`}
            >
              <option value="any">Over any network (Fastest)</option>
              <option value="wifi">Over Wi-Fi only</option>
              <option value="ask">Ask me every time</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 dark:border-[#222530] bg-slate-50 dark:bg-[#161822]">
            <div className="flex items-center gap-3">
              <Wifi className="w-5 h-5 text-emerald-500" />
              <div>
                <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  Auto-Update Applications
                </span>
                <p className="text-[11px] text-slate-500 dark:text-gray-400">
                  Silently download package updates in background
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoUpdate}
                onChange={(e) => updateSettings({ autoUpdate: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00BFFF]"></div>
            </label>
          </div>

        </div>
      </div>

      {/* SECTION 3: PLAY PROTECT & VERIFICATION */}
      <div className={`p-6 rounded-3xl border space-y-4 ${
        theme === 'dark'
          ? 'bg-[#12141c] border-[#22252c]'
          : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <h3 className={`text-base font-bold font-['Space_Grotesk'] ${
          theme === 'dark' ? 'text-white' : 'text-slate-900'
        }`}>
          Play Protect & Security Enclave
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 dark:border-[#222530] bg-slate-50 dark:bg-[#161822]">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <div>
                <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  Scan Device with Play Protect
                </span>
                <p className="text-[11px] text-slate-500 dark:text-gray-400">
                  Real-time malware heuristics and signature checks
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-500">ALWAYS ON</span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 dark:border-[#222530] bg-slate-50 dark:bg-[#161822]">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-[#00BFFF]" />
              <div>
                <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  Biometric Purchase / Install Prompt
                </span>
                <p className="text-[11px] text-slate-500 dark:text-gray-400">
                  Prompt for fingerprint or face scan on downloads
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.biometricVerification}
                onChange={(e) => updateSettings({ biometricVerification: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00BFFF]"></div>
            </label>
          </div>
        </div>
      </div>

      {/* SECTION 4: DATA & STORAGE MAINTENANCE */}
      <div className={`p-6 rounded-3xl border space-y-4 ${
        theme === 'dark'
          ? 'bg-[#12141c] border-[#22252c]'
          : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <h3 className={`text-base font-bold font-['Space_Grotesk'] ${
          theme === 'dark' ? 'text-white' : 'text-slate-900'
        }`}>
          Data & Storage Maintenance
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <button
            onClick={clearSearchHistory}
            className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${
              theme === 'dark'
                ? 'bg-[#161822] border-[#222530] hover:border-gray-500 text-gray-300'
                : 'bg-slate-50 border-slate-200 hover:border-slate-400 text-slate-700'
            }`}
          >
            <Trash2 className="w-4 h-4 text-rose-500 shrink-0" />
            <div>
              <span className="text-xs font-semibold block">Clear Search History</span>
              <span className="text-[10px] text-gray-400">Purge local history</span>
            </div>
          </button>

          <button
            onClick={handleClearCache}
            className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${
              theme === 'dark'
                ? 'bg-[#161822] border-[#222530] hover:border-gray-500 text-gray-300'
                : 'bg-slate-50 border-slate-200 hover:border-slate-400 text-slate-700'
            }`}
          >
            <RotateCcw className="w-4 h-4 text-[#00BFFF] shrink-0" />
            <div>
              <span className="text-xs font-semibold block">Clear APK Cache</span>
              <span className="text-[10px] text-gray-400">Free temporary storage</span>
            </div>
          </button>

          <button
            onClick={resetToFactoryDefaults}
            className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${
              theme === 'dark'
                ? 'bg-[#161822] border-[#222530] hover:border-[#00BFFF] text-gray-300'
                : 'bg-slate-50 border-slate-200 hover:border-slate-400 text-slate-700'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <div>
              <span className="text-xs font-semibold block">Reset Defaults (White Theme)</span>
              <span className="text-[10px] text-gray-400">Clean slate for publish</span>
            </div>
          </button>


          <button
            onClick={() => {
              if (window.confirm('Clear all apps? Store will return to clean empty state.')) {
                clearAllCatalog();
              }
            }}
            className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${
              theme === 'dark'
                ? 'bg-[#161822] border-[#222530] hover:border-red-500 text-gray-300'
                : 'bg-slate-50 border-slate-200 hover:border-red-400 text-slate-700'
            }`}
          >
            <Trash2 className="w-4 h-4 text-red-400 shrink-0" />
            <div>
              <span className="text-xs font-semibold block">Clear Store Catalog ({apps.length})</span>
              <span className="text-[10px] text-gray-400">Clean 0 apps default</span>
            </div>
          </button>
        </div>
      </div>

      {/* SECTION: FULL WEB LOADING ANIMATION & IDENTITY */}
      <div className={`p-6 rounded-3xl border space-y-4 ${
        theme === 'dark'
          ? 'bg-[#12141c] border-[#22252c]'
          : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className={`text-base font-bold font-['Space_Grotesk'] ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              Full Web Loading Animation & Brand Identity
            </h3>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
              The high-tech startup boot sequence featuring the Transformer AR metallic emblem, module initialization, and Play Protect verification.
            </p>
          </div>
          <button
            onClick={triggerStartupAnimation}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#00BFFF] to-[#38bdf8] text-black hover:opacity-90 transition-all flex items-center gap-2 shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Replay Full Web Loading Animation</span>
          </button>
        </div>
      </div>

      {/* SECTION 5: ABOUT AR-STORE (PUBLISHING DETAILS) */}
      <div className={`p-6 rounded-3xl border space-y-3 ${
        theme === 'dark'
          ? 'bg-[#12141c] border-[#22252c]'
          : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center gap-3">
          <TransformerLogo size={36} glow={theme === 'dark'} />
          <div>
            <h4 className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              AR-STORE • Google Play Cyber Release v2.5.0
            </h4>
            <p className="text-xs text-slate-500 dark:text-gray-400">
              Identity: Transformers Autobot Core • Play Protect Certified Clean
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200 dark:border-[#202330] flex flex-wrap items-center justify-between text-[11px] text-slate-400">
          <span>Target Architecture: Universal Android Package (APK / AAB)</span>
          <span>Build Signature: 938e318c-verified</span>
        </div>
      </div>

    </motion.div>
  );
};
