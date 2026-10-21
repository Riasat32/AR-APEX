import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { HeroCarousel } from './components/HeroCarousel';
import { CategoryChips } from './components/CategoryChips';
import { HorizontalAppRow } from './components/HorizontalAppRow';
import { AppCard } from './components/AppCard';
import { AppDetailsModal } from './components/AppDetailsModal';
import { AppSandboxModal } from './components/AppSandboxModal';
import { PlayProtectModal } from './components/PlayProtectModal';
import { CyberPointsModal } from './components/CyberPointsModal';
import { SettingsPage } from './components/SettingsPage';
import { FullWebSplash } from './components/FullWebSplash';
import { ToastContainer } from './components/ToastContainer';
import { SearchPage } from './components/SearchPage';
import { MyAppsPage } from './components/MyAppsPage';
import { AdminDashboard } from './components/AdminDashboard';
import { HeroSkeleton, AppRowSkeleton } from './components/SkeletonLoader';
import { TransformerLogo } from './components/TransformerLogo';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Gamepad2,
  LayoutGrid,
  Flame,
  Award,
  Zap,
  ShieldCheck,
  Cpu,
  Layers,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Heart,
  Settings as SettingsIcon,
  UploadCloud,
  RotateCcw
} from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    apps,
    activeCategory,
    setActiveCategory,
    currentTab,
    setCurrentTab,
    isInitialLoading,
    selectedApp,
    launchedApp,
    theme,
    showSplash,
    setShowSplash,
    loadSampleCatalog,
    triggerStartupAnimation,
    switchUserRole
  } = useStore();

  const isDark = theme === 'dark';

  const [subFilter, setSubFilter] = useState<'for-you' | 'top-charts' | 'categories' | 'editors'>('for-you');
  const [topChartTab, setTopChartTab] = useState<'free' | 'grossing' | 'trending'>('free');

  // Modals
  const [isPointsOpen, setIsPointsOpen] = useState(false);
  const [isProtectOpen, setIsProtectOpen] = useState(false);

  // Filtered lists for distinct sections
  const filteredApps = activeCategory === 'All'
    ? apps
    : apps.filter((a) => a.category === activeCategory);

  const topChartsApps = [...apps].sort((a, b) => {
    if (topChartTab === 'free') return b.downloads - a.downloads;
    if (topChartTab === 'grossing') return (b.rating * b.downloads) - (a.rating * a.downloads);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  }).slice(0, 10);

  const newReleasesApps = [...apps].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8);
  const gamesOnly = apps.filter((a) => a.category === 'Games');
  const toolsAndAI = apps.filter((a) => a.category === 'AI & AR' || a.category === 'Tools' || a.category === 'Productivity');

  return (
    <div className={`min-h-screen flex flex-col font-['Plus_Jakarta_Sans'] pb-20 md:pb-8 selection:bg-[#00BFFF]/30 selection:text-white transition-colors duration-200 ${
      isDark ? 'bg-[#0a0a0a] text-white' : 'bg-[#f8fafc] text-slate-900'
    }`}>
      {/* Full Web Loading Startup Animation (with Transformer AR Identity) */}
      <AnimatePresence>
        {showSplash && <FullWebSplash onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>

      {/* Top Navbar */}
      <Navbar
        onOpenPoints={() => setIsPointsOpen(true)}
        onOpenProtect={() => setIsProtectOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        
        {/* Render Skeleton Loaders while data fetches */}
        {isInitialLoading ? (
          <div className="space-y-6 py-4">
            <HeroSkeleton />
            <div className="flex gap-4 overflow-hidden py-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-16 h-16 rounded-2xl skeleton-pulse shrink-0" />
              ))}
            </div>
            <AppRowSkeleton />
            <AppRowSkeleton />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {/* TAB: HOME / DISCOVER */}
            {currentTab === 'home' && (
              <motion.div
                key="tab-home"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Sub Header Filters: For You, Top Charts, Categories, Editors' Choice */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  {[
                    { id: 'for-you', label: 'For You', icon: Sparkles },
                    { id: 'top-charts', label: 'Top Charts', icon: Flame },
                    { id: 'categories', label: 'Categories', icon: Layers },
                    { id: 'editors', label: "Editors' Choice", icon: Award }
                  ].map((sub) => {
                    const Icon = sub.icon;
                    const isSel = subFilter === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => {
                          setSubFilter(sub.id as any);
                          if (sub.id === 'categories') {
                            const el = document.getElementById('categories-section');
                            el?.scrollIntoView({ behavior: 'smooth' });
                          } else if (sub.id === 'top-charts') {
                            const el = document.getElementById('top-charts-section');
                            el?.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
                          isSel
                            ? isDark
                              ? 'bg-[#00BFFF]/20 text-[#00BFFF] border-[#00BFFF]/50 shadow-[0_0_15px_rgba(0,191,255,0.3)]'
                              : 'bg-[#0284c7]/10 text-[#0284c7] border-[#0284c7]/40 shadow-xs'
                            : isDark
                            ? 'bg-[#14151b] text-[#C0C0C0] hover:text-white hover:bg-white/5 border-[#232630]'
                            : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-slate-200 shadow-2xs'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{sub.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Hero Carousel: Auto-scrolling featured banner */}
                <HeroCarousel />

                {/* Categories: Horizontal scroll of circular icons */}
                <div id="categories-section">
                  <CategoryChips />
                </div>

                {/* Active Category Filter Indicator if not 'All' */}
                {activeCategory !== 'All' && (
                  <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                    isDark ? 'bg-[#12141c] border-[#00BFFF]/30' : 'bg-white border-slate-200 shadow-xs'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Filtering by category:</span>
                      <span className="text-xs font-bold text-[#00BFFF] uppercase tracking-wide">
                        {activeCategory}
                      </span>
                    </div>
                    <button
                      onClick={() => setActiveCategory('All')}
                      className="text-xs text-slate-500 hover:underline"
                    >
                      Show All Categories
                    </button>
                  </div>
                )}

                {/* If user filtered by a specific category, show the category grid */}
                {activeCategory !== 'All' ? (
                  <section className="my-6">
                    <h3 className="text-xl font-bold mb-4 font-['Space_Grotesk']">
                      All {activeCategory} Applications
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                      {filteredApps.map((app) => (
                        <div key={app.id} className="flex justify-center">
                          <AppCard app={app} />
                        </div>
                      ))}
                    </div>
                  </section>
                ) : apps.length === 0 ? (
                  /* Clean Slate Empty Store Welcome Hub */
                  <div className={`my-8 p-8 sm:p-12 rounded-3xl border text-center space-y-6 ${
                    isDark
                      ? 'bg-gradient-to-b from-[#141622] via-[#0d0e14] to-[#0a0a0a] border-[#00BFFF]/30 shadow-[0_0_35px_rgba(0,191,255,0.15)] text-white'
                      : 'bg-white border-slate-200 shadow-md text-slate-900'
                  }`}>
                    <div className="w-24 h-24 rounded-3xl bg-[#00BFFF]/10 border border-[#00BFFF]/40 flex items-center justify-center mx-auto p-4 shadow-xl">
                      <img
                        src="/assets/aistudio/file_0000000093f081f5902b6fdd29762298_938e318c.png"
                        alt="AR-STORE"
                        className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(0,191,255,0.7)]"
                      />
                    </div>

                    <div className="max-w-xl mx-auto space-y-2">
                      <span className="text-[11px] font-mono uppercase tracking-widest text-[#00BFFF] font-bold">
                        Production Ready • Clean Slate Default
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] tracking-tight">
                        AR-STORE Repository Ready for Deployment
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-300 leading-relaxed">
                        Default pristine environment initialized with zero pre-loaded packages or ratings. Use the Developer Console to upload your custom APKs from internal storage, style app icons, and publish live to users.
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-3 flex-wrap pt-2">
                      <button
                        onClick={() => {
                          switchUserRole('admin');
                          setCurrentTab('admin');
                        }}
                        className="px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm bg-[#00BFFF] hover:bg-[#38bdf8] text-black shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
                      >
                        <UploadCloud className="w-4 h-4" />
                        <span>Open Admin Console & Publish APK</span>
                      </button>


                      <button
                        onClick={triggerStartupAnimation}
                        className="px-5 py-3 rounded-2xl font-semibold text-xs text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-800 border border-slate-300 dark:border-gray-700 transition-all flex items-center gap-2"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-[#00BFFF]" />
                        <span>Replay Startup Animation</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Top Charts Section with Sub Tabs (Top Free, Top Grossing, Trending) */}
                    <div id="top-charts-section" className="pt-2">
                      <div className="flex items-center justify-between mb-3 px-1">
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold tracking-tight font-['Space_Grotesk']">
                            Top Charts
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-[#C0C0C0]">
                            Most popular packages across the AR-STORE network
                          </p>
                        </div>

                        {/* Top Charts Tabs */}
                        <div className={`flex items-center gap-1 p-1 rounded-xl border text-xs ${
                          isDark ? 'bg-[#14151b] border-[#232630]' : 'bg-white border-slate-200 shadow-xs'
                        }`}>
                          <button
                            onClick={() => setTopChartTab('free')}
                            className={`px-3 py-1 rounded-lg transition-all ${
                              topChartTab === 'free'
                                ? 'bg-[#00BFFF] text-black font-bold'
                                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            Top Free
                          </button>
                          <button
                            onClick={() => setTopChartTab('grossing')}
                            className={`px-3 py-1 rounded-lg transition-all ${
                              topChartTab === 'grossing'
                                ? 'bg-[#00BFFF] text-black font-bold'
                                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            Top Grossing
                          </button>
                          <button
                            onClick={() => setTopChartTab('trending')}
                            className={`px-3 py-1 rounded-lg transition-all ${
                              topChartTab === 'trending'
                                ? 'bg-[#00BFFF] text-black font-bold'
                                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            Trending
                          </button>
                        </div>
                      </div>

                      <HorizontalAppRow
                        title=""
                        apps={topChartsApps}
                        showRank={true}
                      />
                    </div>

                    {/* New Releases & Updates */}
                    <HorizontalAppRow
                      title="New Releases & Recent Updates"
                      subtitle="Fresh neural tools, games, and packages just added to AR-STORE"
                      badge="Fresh Drops"
                      apps={newReleasesApps}
                    />

                    {/* Action & Cyber Games */}
                    <HorizontalAppRow
                      title="Featured Cyber Games"
                      subtitle="Ray-traced, high-octane 120 FPS titles"
                      apps={gamesOnly}
                    />

                    {/* Neural & Productivity Tools */}
                    <HorizontalAppRow
                      title="AI Co-Processors & High-Tech Utilities"
                      subtitle="Maximize productivity with next-generation neural coprocessors"
                      apps={toolsAndAI}
                    />
                  </>
                )}

                {/* Cyber Security Banner Footer */}
                <div
                  onClick={() => setIsProtectOpen(true)}
                  className={`mt-12 p-6 rounded-3xl border transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-between gap-4 group ${
                    isDark
                      ? 'bg-gradient-to-r from-[#11141d] to-[#0c0d12] border-[#1f2229] hover:border-[#00BFFF]/50 text-white'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#00BFFF]/10 border border-[#00BFFF]/30 flex items-center justify-center text-[#00BFFF] group-hover:scale-105 transition-transform">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold flex items-center gap-2">
                        <span>AR-STORE Play Protect Protocol</span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700" />
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-[#C0C0C0]">
                        All applications and binaries are cryptographically signed and sandbox-scanned for zero-day vulnerabilities.
                      </p>
                    </div>
                  </div>
                  <div className="text-xs font-mono text-[#00BFFF] border border-[#00BFFF]/30 px-3 py-1.5 rounded-xl bg-[#00BFFF]/5 font-semibold">
                    SCAN VERIFIED
                  </div>
                </div>

              </motion.div>
            )}

            {/* TAB: GAMES */}
            {currentTab === 'games' && (
              <motion.div
                key="tab-games"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className={`p-8 rounded-3xl border flex items-center justify-between ${
                  isDark
                    ? 'bg-gradient-to-r from-cyan-950/30 via-[#13151f] to-[#0a0a0a] border-[#00BFFF]/30 text-white shadow-lg'
                    : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                }`}>
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#00BFFF] font-bold">
                      Gaming Sector
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] mt-1">
                      Cyber & Sci-Fi Games
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-[#C0C0C0] mt-1 max-w-lg">
                      Explore combat simulators, anti-gravity hover racers, and space 4X strategy empires with instant simulated APK download.
                    </p>
                  </div>
                  <div className="hidden sm:block">
                    <TransformerLogo size={64} glow={isDark} />
                  </div>
                </div>

                {gamesOnly.length === 0 ? (
                  <div className={`p-8 sm:p-12 rounded-3xl border text-center space-y-4 ${
                    isDark ? 'bg-[#12141a] border-[#22252c]' : 'bg-white border-slate-200 shadow-sm'
                  }`}>
                    <div className="w-14 h-14 rounded-2xl bg-[#00BFFF]/10 border border-[#00BFFF]/30 flex items-center justify-center mx-auto text-[#00BFFF]">
                      <Gamepad2 className="w-7 h-7" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold font-['Space_Grotesk']">
                      No Games Published Yet
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-gray-400 max-w-sm mx-auto">
                      Publish your first gaming APK from internal storage using the Admin Dashboard, or load demo showcase games to test the store.
                    </p>
                    <div className="flex items-center justify-center gap-2 pt-2 flex-wrap">
                      <button
                        onClick={() => {
                          switchUserRole('admin');
                          setCurrentTab('admin');
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-[#00BFFF] hover:bg-[#38bdf8] text-black shadow-sm"
                      >
                        Upload Game APK
                      </button>
                      <button
                        onClick={loadSampleCatalog}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600/10 hover:bg-purple-600/20 text-purple-600 dark:text-purple-300 border border-purple-500/30"
                      >
                        Load Demo Games
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <HorizontalAppRow
                      title="Top Ranked Games"
                      badge="Top 10"
                      apps={gamesOnly}
                      showRank={true}
                    />

                    <div className="my-6">
                      <h3 className="text-lg font-bold mb-4 font-['Space_Grotesk']">
                        All Game Packages ({gamesOnly.length})
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {gamesOnly.map((app) => (
                          <div key={app.id} className="flex justify-center">
                            <AppCard app={app} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* TAB: APPS */}
            {currentTab === 'apps' && (
              <motion.div
                key="tab-apps"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className={`p-8 rounded-3xl border flex items-center justify-between ${
                  isDark
                    ? 'bg-gradient-to-r from-blue-950/30 via-[#13151f] to-[#0a0a0a] border-[#00BFFF]/30 text-white shadow-lg'
                    : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                }`}>
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#00BFFF] font-bold">
                      Utility Grid
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] mt-1">
                      Next-Gen Tools & AI
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-[#C0C0C0] mt-1 max-w-lg">
                      From quantum-encrypted VPNs to spatial 3D holographic workstations, elevate your digital workflow.
                    </p>
                  </div>
                  <div className="hidden sm:block">
                    <TransformerLogo size={64} glow={isDark} />
                  </div>
                </div>

                {apps.filter((a) => a.category !== 'Games').length === 0 ? (
                  <div className={`p-8 sm:p-12 rounded-3xl border text-center space-y-4 ${
                    isDark ? 'bg-[#12141a] border-[#22252c]' : 'bg-white border-slate-200 shadow-sm'
                  }`}>
                    <div className="w-14 h-14 rounded-2xl bg-[#00BFFF]/10 border border-[#00BFFF]/30 flex items-center justify-center mx-auto text-[#00BFFF]">
                      <Cpu className="w-7 h-7" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold font-['Space_Grotesk']">
                      No Utility Packages Published Yet
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-gray-400 max-w-sm mx-auto">
                      Publish your first utility or AI package using the Developer Console, or load demo packages.
                    </p>
                    <div className="flex items-center justify-center gap-2 pt-2 flex-wrap">
                      <button
                        onClick={() => {
                          switchUserRole('admin');
                          setCurrentTab('admin');
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-[#00BFFF] hover:bg-[#38bdf8] text-black shadow-sm"
                      >
                        Upload Tool / AI APK
                      </button>
                      <button
                        onClick={loadSampleCatalog}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600/10 hover:bg-purple-600/20 text-purple-600 dark:text-purple-300 border border-purple-500/30"
                      >
                        Load Demo Apps
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="my-6">
                    <h3 className="text-lg font-bold mb-4 font-['Space_Grotesk']">
                      Productivity, AI & Utility Packages ({apps.filter((a) => a.category !== 'Games').length})
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                      {apps
                        .filter((a) => a.category !== 'Games')
                        .map((app) => (
                          <div key={app.id} className="flex justify-center">
                            <AppCard app={app} />
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB: SEARCH */}
            {currentTab === 'search' && (
              <motion.div
                key="tab-search"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <SearchPage />
              </motion.div>
            )}

            {/* TAB: MY APPS */}
            {currentTab === 'my-apps' && (
              <motion.div
                key="tab-my-apps"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <MyAppsPage onOpenProtect={() => setIsProtectOpen(true)} />
              </motion.div>
            )}

            {/* TAB: SETTINGS (NEW NAVIGATION BAR FEATURE) */}
            {currentTab === 'settings' && (
              <motion.div
                key="tab-settings"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <SettingsPage />
              </motion.div>
            )}

            {/* TAB: ADMIN CONSOLE */}
            {currentTab === 'admin' && (
              <motion.div
                key="tab-admin"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <AdminDashboard />
              </motion.div>
            )}
          </AnimatePresence>
        )}

      </main>

      {/* App Details Modal */}
      <AnimatePresence>
        {selectedApp && (
          <AppDetailsModal onOpenProtect={() => setIsProtectOpen(true)} />
        )}
      </AnimatePresence>

      {/* App Sandbox / Live In-App Launcher */}
      <AnimatePresence>
        {launchedApp && <AppSandboxModal />}
      </AnimatePresence>

      {/* Google Play Protect Security Scanner Modal */}
      <AnimatePresence>
        {isProtectOpen && (
          <PlayProtectModal isOpen={isProtectOpen} onClose={() => setIsProtectOpen(false)} />
        )}
      </AnimatePresence>

      {/* Cyber Points / Play Points Modal */}
      <AnimatePresence>
        {isPointsOpen && (
          <CyberPointsModal isOpen={isPointsOpen} onClose={() => setIsPointsOpen(false)} />
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      <ToastContainer />

      {/* Mobile Bottom Navigation */}
      <BottomNav onOpenPoints={() => setIsPointsOpen(true)} />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}
