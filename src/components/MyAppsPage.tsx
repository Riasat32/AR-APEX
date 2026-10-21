import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { motion } from 'motion/react';
import {
  HardDrive,
  CheckCircle,
  RefreshCw,
  Trash2,
  ExternalLink,
  ShieldCheck,
  History,
  Sparkles,
  Download,
  Heart,
  Play
} from 'lucide-react';
import { AppCard } from './AppCard';

interface MyAppsPageProps {
  onOpenProtect?: () => void;
}

export const MyAppsPage: React.FC<MyAppsPageProps> = ({ onOpenProtect }) => {
  const {
    apps,
    currentUser,
    uninstallApp,
    setSelectedApp,
    installApp,
    setLaunchedApp,
    lastScanTime,
    theme,
    showToast
  } = useStore();

  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<'installed' | 'wishlist' | 'history'>('installed');

  // Installed apps lookup
  const installedAppEntries = Object.entries(currentUser.installedApps || {});
  const installedApps = installedAppEntries
    .map(([appId, info]) => {
      const appData = apps.find((a) => a.id === appId);
      return appData ? { ...appData, installedAt: info.installedAt } : null;
    })
    .filter(Boolean) as (typeof apps[0] & { installedAt: string })[];

  // Wishlist lookup
  const wishlistApps = (currentUser.wishlist || [])
    .map((appId) => apps.find((a) => a.id === appId))
    .filter(Boolean) as typeof apps;

  // Downloads history lookup
  const historyApps = (currentUser.downloadsHistory || [])
    .map((appId) => apps.find((a) => a.id === appId))
    .filter(Boolean) as typeof apps;

  // Compute simulated storage used
  const totalStorageMb = installedApps.reduce((acc, app) => {
    const num = parseFloat(app.size.replace(/[^0-9.]/g, '')) || 50;
    return acc + num;
  }, 0);

  const handleCheckUpdates = () => {
    showToast(
      'All Packages Up to Date',
      'AR-STORE checked all installed binaries against the central repository.',
      'success'
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6"
    >
      {/* Device Overview Header */}
      <div className={`relative overflow-hidden p-6 sm:p-8 rounded-3xl border transition-all ${
        isDark ? 'bg-[#12141a] border-[#22252c] text-[#C0C0C0]' : 'bg-white border-slate-200 shadow-sm text-slate-700'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center text-[#00BFFF] shadow-md ${
              isDark ? 'bg-gradient-to-br from-[#1b1e28] to-[#12141b] border-[#00BFFF]/50' : 'bg-slate-50 border-slate-300'
            }`}>
              <HardDrive className="w-8 h-8" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className={`text-xl sm:text-2xl font-extrabold font-['Space_Grotesk'] ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  Manage Apps & Device
                </h1>
                <button
                  onClick={onOpenProtect}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors cursor-pointer flex items-center gap-1 font-bold"
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>Play Protect Safe</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 mt-0.5">
                Profile: <span className="font-semibold text-slate-900 dark:text-white">{currentUser.displayName}</span> ({currentUser.email})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCheckUpdates}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#00BFFF]/15 hover:bg-[#00BFFF]/25 text-[#00BFFF] border border-[#00BFFF]/40 shadow-xs transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Check for Updates</span>
            </button>
          </div>

        </div>

        {/* Device Storage Bar */}
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-[#1f2229] space-y-2 relative z-10">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-500 dark:text-gray-400">Internal Storage Usage</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">
              {(totalStorageMb / 1024).toFixed(2)} GB used of 128 GB
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-[#1e2029] overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#00BFFF] to-[#38bdf8] shadow-sm"
              style={{ width: `${Math.max(4, Math.min(100, (totalStorageMb / 1024 / 128) * 100 * 15))}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">
            {installedApps.length} active applications installed on this profile.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-[#22252c] pb-1 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('installed')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
            activeTab === 'installed'
              ? 'bg-[#00BFFF]/15 text-[#00BFFF] border border-[#00BFFF]/40'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          <span>Installed ({installedApps.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
            activeTab === 'wishlist'
              ? 'bg-[#00BFFF]/15 text-[#00BFFF] border border-[#00BFFF]/40'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Heart className="w-4 h-4 text-rose-500" />
          <span>Wishlist ({wishlistApps.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
            activeTab === 'history'
              ? 'bg-[#00BFFF]/15 text-[#00BFFF] border border-[#00BFFF]/40'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Download History ({historyApps.length})</span>
        </button>
      </div>

      {/* Tab 1: Installed */}
      {activeTab === 'installed' && (
        installedApps.length === 0 ? (
          <div className={`p-12 text-center rounded-3xl border ${
            isDark ? 'bg-[#12141a] border-[#22252c]' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <HardDrive className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              No Apps Installed Yet
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Browse the AR-STORE catalogue and install high-octane cyber apps or games with 1 click.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {installedApps.map((app) => (
              <div
                key={app.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group ${
                  isDark ? 'bg-[#12141a] border-[#22252c] hover:border-[#00BFFF]/40' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div
                  onClick={() => setSelectedApp(app)}
                  className="flex items-center gap-4 cursor-pointer flex-1 min-w-0"
                >
                  <img
                    src={app.iconUrl}
                    alt={app.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-[#00BFFF]/30 group-hover:scale-105 transition-transform"
                  />
                  <div className="min-w-0">
                    <h4 className={`text-sm font-bold truncate group-hover:text-[#00BFFF] transition-colors ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {app.name}
                    </h4>
                    <p className="text-xs text-slate-500 truncate">{app.developer}</p>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                      <span>v{app.version}</span>
                      <span>•</span>
                      <span>{app.size}</span>
                      <span>•</span>
                      <span>Installed {new Date(app.installedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => setLaunchedApp(app)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#00BFFF] hover:bg-[#38bdf8] text-black shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Launch</span>
                  </button>

                  <button
                    onClick={() => uninstallApp(app.id)}
                    className="p-2 rounded-xl text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-all"
                    title="Uninstall App"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Tab 2: Wishlist */}
      {activeTab === 'wishlist' && (
        wishlistApps.length === 0 ? (
          <div className={`p-12 text-center rounded-3xl border ${
            isDark ? 'bg-[#12141a] border-[#22252c]' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <Heart className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Your Wishlist is Empty
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Click the heart icon on any application to save it to your wishlist for later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {wishlistApps.map((app) => (
              <div key={app.id} className="flex justify-center">
                <AppCard app={app} />
              </div>
            ))}
          </div>
        )
      )}

      {/* Tab 3: History */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          {historyApps.map((app) => (
            <div
              key={app.id}
              className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
                isDark ? 'bg-[#12141a] border-[#22252c]' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div
                onClick={() => setSelectedApp(app)}
                className="flex items-center gap-4 cursor-pointer flex-1 min-w-0"
              >
                <img
                  src={app.iconUrl}
                  alt={app.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-white/10"
                />
                <div className="min-w-0">
                  <h4 className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{app.name}</h4>
                  <p className="text-xs text-slate-500">{app.category} • {app.size}</p>
                </div>
              </div>

              <button
                onClick={() => installApp(app.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-white/5 hover:bg-[#00BFFF] text-slate-700 dark:text-[#C0C0C0] hover:text-black border border-slate-300 dark:border-white/10 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Reinstall</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
