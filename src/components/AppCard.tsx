import React from 'react';
import { AppItem } from '../types/store';
import { useStore } from '../context/StoreContext';
import { motion } from 'motion/react';
import { Star, Download, Check, Heart, Play } from 'lucide-react';

interface AppCardProps {
  app: AppItem;
  rank?: number;
}

export const AppCard: React.FC<AppCardProps> = ({ app, rank }) => {
  const {
    setSelectedApp,
    isAppInstalled,
    installApp,
    installingState,
    toggleWishlist,
    isWishlisted,
    setLaunchedApp,
    theme
  } = useStore();

  const isInstalled = isAppInstalled(app.id);
  const isHearted = isWishlisted(app.id);
  const installProgress = installingState[app.id];
  const isDark = theme === 'dark';

  return (
    <motion.div
      whileHover={{ scale: 1.04, y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={() => setSelectedApp(app)}
      className={`group relative cursor-pointer w-[165px] sm:w-[190px] shrink-0 p-3 rounded-2xl border transition-all duration-300 flex flex-col justify-between select-none ${
        isDark
          ? 'bg-[#14151b] border-[#22252c] hover:border-[#00BFFF]/60 hover:shadow-[0_0_22px_rgba(0,191,255,0.25)] text-white'
          : 'bg-white border-slate-200 hover:border-[#0284c7]/50 shadow-sm hover:shadow-md text-slate-900'
      }`}
    >
      {/* Rank badge if part of Top Charts */}
      {rank !== undefined && (
        <div className="absolute -top-2 -left-2 z-20 w-6 h-6 rounded-lg bg-[#00BFFF] text-black font-extrabold text-xs flex items-center justify-center shadow-md">
          {rank}
        </div>
      )}

      {/* Wishlist Heart Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(app.id);
        }}
        className={`absolute top-4 right-4 z-20 p-1.5 rounded-full backdrop-blur-md transition-all ${
          isHearted
            ? 'bg-rose-500/20 text-rose-500 border border-rose-500/50 shadow-sm'
            : isDark
            ? 'bg-black/50 text-gray-400 hover:text-white border border-white/10 opacity-0 group-hover:opacity-100'
            : 'bg-white/80 text-slate-400 hover:text-rose-500 border border-slate-200 opacity-0 group-hover:opacity-100'
        }`}
        title={isHearted ? 'Remove from Wishlist' : 'Add to Wishlist'}
      >
        <Heart className={`w-3.5 h-3.5 ${isHearted ? 'fill-rose-500' : ''}`} />
      </button>

      <div>
        {/* App Icon Container */}
        <div className={`relative w-full aspect-square rounded-2xl overflow-hidden mb-2.5 border ${
          isDark ? 'bg-[#1f2229] border-white/5' : 'bg-slate-100 border-slate-200'
        }`}>
          <img
            src={app.iconUrl}
            alt={app.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* App Title */}
        <h4 className="text-sm font-semibold tracking-tight truncate group-hover:text-[#00BFFF] transition-colors">
          {app.name}
        </h4>

        {/* Developer */}
        <p className="text-[11px] text-slate-500 dark:text-gray-400 truncate mt-0.5">
          {app.developer}
        </p>

        {/* Category & Monetization note */}
        <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-400 dark:text-gray-500">
          <span>{app.category}</span>
          <span>•</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">{app.price || 'Free'}</span>
          {app.inAppPurchases && <span>• In-app</span>}
        </div>

        {/* Rating and Size */}
        <div className="flex items-center gap-2 mt-1 text-xs">
          <div className="flex items-center gap-0.5 text-amber-500">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span className={`font-semibold text-[11px] ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {app.rating}
            </span>
          </div>
          <span className="text-slate-300 dark:text-gray-600">•</span>
          <span className="text-[11px] text-slate-500 dark:text-[#C0C0C0]">{app.size}</span>
        </div>
      </div>

      {/* Quick Action footer */}
      <div className="mt-3 pt-2 border-t border-slate-200 dark:border-[#22252c] flex items-center justify-between">
        <span className="text-[10px] text-slate-400 dark:text-gray-400">
          {(app.downloads / 1000 >= 1000)
            ? `${(app.downloads / 1000000).toFixed(1)}M`
            : `${(app.downloads / 1000).toFixed(0)}k`} dl
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (isInstalled) {
              setLaunchedApp(app);
            } else {
              installApp(app.id);
            }
          }}
          className={`px-2.5 py-1 rounded-xl text-[10px] font-semibold transition-all flex items-center gap-1 ${
            isInstalled
              ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
              : installProgress?.status === 'downloading' || installProgress?.status === 'installing'
              ? 'bg-[#00BFFF]/20 text-[#00BFFF] animate-pulse border border-[#00BFFF]/40'
              : isDark
              ? 'bg-white/5 hover:bg-[#00BFFF] text-[#C0C0C0] hover:text-black border border-white/10'
              : 'bg-slate-100 hover:bg-[#0284c7] text-slate-700 hover:text-white border border-slate-200'
          }`}
        >
          {isInstalled ? (
            <>
              <Play className="w-2.5 h-2.5 fill-current" /> Open
            </>
          ) : installProgress?.status === 'downloading' ? (
            `${installProgress.progress}%`
          ) : (
            'Install'
          )}
        </button>
      </div>
    </motion.div>
  );
};
