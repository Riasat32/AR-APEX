import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Star, Download, Sparkles, ArrowRight } from 'lucide-react';

export const HeroCarousel: React.FC = () => {
  const { apps, setSelectedApp, installApp, installingState, isAppInstalled, theme } = useStore();
  const isDark = theme === 'dark';

  const featuredApps = apps.filter((app) => app.featured).length > 0
    ? apps.filter((app) => app.featured)
    : apps.slice(0, 4);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || featuredApps.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredApps.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, featuredApps.length]);

  if (!featuredApps.length) {
    return (
      <div className={`relative w-full rounded-3xl overflow-hidden my-4 p-6 sm:p-10 border transition-all ${
        isDark
          ? 'bg-gradient-to-r from-cyan-950/40 via-[#12141c] to-[#0a0a0a] border-[#00BFFF]/30 text-white shadow-xl'
          : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#00BFFF]/10 border border-[#00BFFF]/30 text-[#00BFFF] uppercase tracking-wider">
                Official Marketplace
              </span>
              <span className="text-xs text-slate-500">Ready for Publishing</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-['Space_Grotesk'] tracking-tight">
              AR-STORE • Next-Gen Application Grid
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-300 leading-relaxed">
              Clean default environment initialized. Zero pre-seeded packages or dummy ratings. Upload APK files from internal storage or browse device packages.
            </p>
          </div>
          <div className="shrink-0 flex flex-col items-center gap-2">
            <div className="w-24 h-24 rounded-3xl bg-[#00BFFF]/10 border border-[#00BFFF]/30 flex items-center justify-center p-3 shadow-lg">
              <img
                src="/assets/aistudio/file_0000000093f081f5902b6fdd29762298_938e318c.png"
                alt="AR Identity"
                className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(0,191,255,0.7)]"
              />
            </div>
            <span className="text-[10px] font-mono text-[#00BFFF] font-bold">CYBER IDENTITY</span>
          </div>
        </div>
      </div>
    );
  }
  const current = featuredApps[currentIndex] || featuredApps[0];
  const isInstalled = isAppInstalled(current.id);
  const installProgress = installingState[current.id];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredApps.length) % featuredApps.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredApps.length);
  };

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden my-4 transition-all group ${
        isDark
          ? 'bg-[#12141a] border border-[#22252c] shadow-[0_10px_35px_rgba(0,0,0,0.7)] text-white'
          : 'bg-white border border-slate-200 shadow-sm text-slate-900'
      }`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Ambient Glow */}
      <div className="absolute -top-24 left-1/4 w-96 h-96 bg-[#00BFFF]/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative min-h-[300px] sm:min-h-[360px] md:min-h-[420px] flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full flex flex-col md:flex-row items-center justify-between p-6 sm:p-10 gap-6"
          >
            {/* Banner Background Image with Gradient Overlay */}
            <div className="absolute inset-0 z-0">
              <img
                src={current.bannerUrl || current.screenshots[0]}
                alt={current.name}
                className={`w-full h-full object-cover filter blur-xs ${isDark ? 'opacity-25' : 'opacity-15'}`}
              />
              <div className={`absolute inset-0 ${
                isDark
                  ? 'bg-gradient-to-t md:bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/85 to-transparent'
                  : 'bg-gradient-to-t md:bg-gradient-to-r from-white via-white/85 to-transparent'
              }`} />
            </div>

            {/* Left Content */}
            <div className="relative z-10 max-w-xl flex flex-col items-start space-y-3 sm:space-y-4">
              
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#00BFFF]/15 border border-[#00BFFF]/40 text-[#00BFFF]">
                  <Sparkles className="w-3.5 h-3.5" />
                  Featured Spotlight
                </span>
                <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
                  isDark ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}>
                  {current.category}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={current.iconUrl}
                  alt={current.name}
                  className="w-14 h-14 sm:w-18 sm:h-18 rounded-2xl object-cover border-2 border-[#00BFFF]/50 shadow-md"
                />
                <div>
                  <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-['Space_Grotesk']">
                    {current.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#00BFFF] font-semibold">
                    {current.developer}
                  </p>
                </div>
              </div>

              <p className={`text-xs sm:text-sm line-clamp-2 sm:line-clamp-3 leading-relaxed ${
                isDark ? 'text-[#C0C0C0]' : 'text-slate-600'
              }`}>
                {current.description}
              </p>

              {/* Stats Bar */}
              <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-500 dark:text-gray-300">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{current.rating}</span>
                  <span className="text-gray-400">({(current.ratingCount / 1000).toFixed(0)}k)</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-gray-400" />
                <div>
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {(current.downloads / 1000000).toFixed(1)}M+
                  </span>
                  <span className="text-gray-400"> downloads</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-gray-400" />
                <span className="text-gray-400">{current.size}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => installApp(current.id)}
                  disabled={installProgress?.status === 'downloading' || installProgress?.status === 'installing'}
                  className="relative group/btn overflow-hidden px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 bg-[#00BFFF] text-black hover:bg-[#38bdf8] shadow-md disabled:opacity-75"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {isInstalled
                      ? 'Open App'
                      : installProgress?.status === 'downloading'
                      ? `Downloading (${installProgress.progress}%)`
                      : installProgress?.status === 'installing'
                      ? 'Installing...'
                      : 'Install'}
                  </span>
                </button>

                <button
                  onClick={() => setSelectedApp(current)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-sm border transition-all flex items-center gap-1.5 ${
                    isDark
                      ? 'text-white bg-white/10 hover:bg-white/15 border-white/15'
                      : 'text-slate-800 bg-slate-100 hover:bg-slate-200 border-slate-300'
                  }`}
                >
                  <span>Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Right Side: Hero Visual Device / Screenshot Card */}
            <div className="relative z-10 hidden md:block w-72 lg:w-96 shrink-0">
              <div className="relative rounded-2xl overflow-hidden border border-[#00BFFF]/40 shadow-xl">
                <img
                  src={current.screenshots[0] || current.bannerUrl}
                  alt={current.name}
                  className="w-full h-52 lg:h-64 object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                  <span className="text-xs text-white/90 font-mono">Real-time AR Rendering</span>
                </div>
              </div>
            </div>

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nav Controls */}
      <button
        onClick={handlePrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 border border-white/10 text-white/80 hover:text-white hover:bg-black/90 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-20"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 border border-white/10 text-white/80 hover:text-white hover:bg-black/90 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-20"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
        {featuredApps.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              currentIndex === i
                ? 'w-6 bg-[#00BFFF] shadow-xs'
                : 'w-1.5 bg-slate-300 dark:bg-gray-600 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
