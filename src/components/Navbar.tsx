import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Search,
  ShieldAlert,
  Sparkles,
  User,
  Check,
  HardDrive,
  PlusCircle,
  Bell,
  Mic,
  ShieldCheck,
  Heart,
  Coins,
  X,
  Sun,
  Moon,
  Settings as SettingsIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TransformerLogo } from './TransformerLogo';

interface NavbarProps {
  onOpenPoints: () => void;
  onOpenProtect: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenPoints, onOpenProtect }) => {
  const {
    currentUser,
    switchUserRole,
    currentTab,
    setCurrentTab,
    searchQuery,
    setSearchQuery,
    addSearchHistory,
    notifications,
    unreadNotificationCount,
    markNotificationsAsRead,
    theme,
    setTheme,
    showToast
  } = useStore();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [isListeningVoice, setIsListeningVoice] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addSearchHistory(searchQuery.trim());
      setCurrentTab('search');
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    showToast(
      'Theme Switched',
      nextTheme === 'light' ? 'White Theme activated (Default)' : 'Black Theme activated',
      'info'
    );
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        setIsListeningVoice(true);
        showToast('Listening...', 'Speak the name of an app or game now', 'info');

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setSearchQuery(transcript);
          addSearchHistory(transcript);
          setCurrentTab('search');
          setIsListeningVoice(false);
          showToast('Voice Recognized', `Searching for "${transcript}"`, 'success');
        };

        recognition.onerror = () => {
          setIsListeningVoice(false);
          simulateVoice();
        };

        recognition.onend = () => {
          setIsListeningVoice(false);
        };

        recognition.start();
      } catch {
        simulateVoice();
      }
    } else {
      simulateVoice();
    }
  };

  const simulateVoice = () => {
    setIsListeningVoice(true);
    showToast('Voice Search', 'Voice listening ready. Speak app name or keyword into microphone.', 'info');
    setTimeout(() => {
      setIsListeningVoice(false);
    }, 1200);
  };

  const isDark = theme === 'dark';

  return (
    <header className={`sticky top-0 z-40 w-full backdrop-blur-xl transition-all ${
      isDark
        ? 'bg-[#0a0a0a]/92 border-b border-[#1f2229] text-white'
        : 'bg-white/95 border-b border-slate-200 text-slate-900 shadow-xs'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-3 sm:gap-4">
        
        {/* Left: AR-STORE Brand Identity with Transformer Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-3 group focus:outline-none text-left"
          >
            {/* Cybernetic Transformer AR Emblem */}
            <div className={`relative flex items-center justify-center w-12 h-12 rounded-2xl border transition-all duration-300 p-1 ${
              isDark
                ? 'bg-gradient-to-br from-[#12161f] to-[#0c0d12] border-[#00BFFF]/60 shadow-[0_0_20px_rgba(0,191,255,0.45)] group-hover:border-[#00BFFF]'
                : 'bg-slate-100 border-slate-300 shadow-sm group-hover:border-[#0284c7]'
            }`}>
              <TransformerLogo size={38} glow={isDark} />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-wider font-['Space_Grotesk']">
                  AR<span className="text-[#00BFFF]">-STORE</span>
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#00BFFF]/15 border border-[#00BFFF]/40 text-[#00BFFF] font-bold">
                  AUTOBOT
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-[#C0C0C0] hidden sm:block">
                Google Play Cyber Edition
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 pl-2">
            {[
              { id: 'home', label: 'Discover' },
              { id: 'games', label: 'Games' },
              { id: 'apps', label: 'Apps' },
              { id: 'my-apps', label: 'My Apps' },
              { id: 'settings', label: 'Settings', icon: SettingsIcon },
            ].map((tab) => {
              const isActive = currentTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? isDark
                        ? 'bg-[#00BFFF]/15 text-[#00BFFF] border border-[#00BFFF]/40 shadow-[0_0_12px_rgba(0,191,255,0.25)]'
                        : 'bg-[#0284c7]/10 text-[#0284c7] border border-[#0284c7]/30'
                      : isDark
                      ? 'text-[#C0C0C0] hover:text-white hover:bg-white/5'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  <span>{tab.label}</span>
                </button>
              );
            })}

            {/* Admin clearance tab - ONLY visible to ADMIN role */}
            {currentUser.role === 'admin' && (
              <button
                onClick={() => setCurrentTab('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currentTab === 'admin'
                    ? 'bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-400/50 shadow-md'
                    : 'text-purple-600 dark:text-purple-300 hover:bg-purple-500/10'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5 text-purple-500" />
                <span>Admin Console</span>
              </button>
            )}
          </nav>
        </div>

        {/* Center: Search Bar with Voice Search (Desktop/Tablet) */}
        <div className="hidden sm:block flex-1 max-w-md mx-2 sm:mx-4">
          <form onSubmit={handleSearchSubmit} className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#00BFFF] transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (currentTab !== 'search') {
                  setCurrentTab('search');
                }
              }}
              placeholder="Search apps, games, cyber tools..."
              className={`w-full rounded-xl py-2 pl-10 pr-10 text-sm transition-all outline-none border ${
                isDark
                  ? 'bg-[#14151a] border-[#262832] text-white placeholder-gray-500 focus:border-[#00BFFF] focus:ring-1 focus:ring-[#00BFFF]'
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7]'
              }`}
            />
            {/* Voice Search Button */}
            <button
              type="button"
              onClick={handleVoiceSearch}
              className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-gray-400 hover:text-[#00BFFF] transition-colors ${
                isListeningVoice ? 'text-[#00BFFF] animate-pulse' : ''
              }`}
              title="Voice Search"
            >
              <Mic className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Controls: Compact and fully adjusted inside mobile screen */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Mobile Search Button (Compact) */}
          <button
            onClick={() => setCurrentTab('search')}
            className={`sm:hidden w-9 h-9 rounded-xl border flex items-center justify-center transition-all shrink-0 ${
              currentTab === 'search'
                ? 'bg-[#00BFFF]/20 text-[#00BFFF] border-[#00BFFF]/50'
                : isDark
                ? 'bg-[#14151a] border-[#22252c] text-gray-300 hover:text-white'
                : 'bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-900'
            }`}
            title="Search Apps"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Theme Toggle (Desktop/Tablet) */}
          <button
            onClick={toggleTheme}
            className={`hidden sm:flex w-9 h-9 sm:w-10 sm:h-10 rounded-xl border items-center justify-center transition-all shrink-0 ${
              isDark
                ? 'bg-[#14151a] border-[#22252c] text-amber-400 hover:bg-white/5'
                : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
            }`}
            title={isDark ? 'Switch to White Theme (Default)' : 'Switch to Black Cyber Theme'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Cyber Points Rewards Pill (Desktop) */}
          <button
            onClick={onOpenPoints}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all shrink-0 ${
              isDark
                ? 'bg-[#14151a] hover:bg-[#1a1c24] border-[#00BFFF]/30 text-white'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00BFFF]" />
            <span className="font-mono text-[#00BFFF] font-bold">{currentUser.cyberPoints}</span>
            <span className="text-[10px] text-gray-500">pts</span>
          </button>

          {/* Play Protect Shield Indicator (Tablet/Desktop) */}
          <button
            onClick={onOpenProtect}
            className={`hidden sm:flex w-9 h-9 sm:w-10 sm:h-10 rounded-xl border items-center justify-center transition-all shrink-0 ${
              isDark
                ? 'bg-[#14151a] border-[#22252c] hover:border-emerald-500/50 text-emerald-400'
                : 'bg-slate-100 border-slate-300 hover:border-emerald-500 text-emerald-600'
            }`}
            title="AR Play Protect Security Center"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </button>

          {/* Notification Center: Fully adjusted inside screen */}
          <div className="relative shrink-0">
            <button
              onClick={() => {
                setShowNotifMenu(!showNotifMenu);
                if (!showNotifMenu) markNotificationsAsRead();
              }}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border transition-all relative flex items-center justify-center shrink-0 ${
                isDark
                  ? 'bg-[#14151a] border-[#22252c] text-gray-300 hover:text-white'
                  : 'bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-900'
              }`}
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-[#00BFFF]" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[14px] h-[14px] px-0.5 rounded-full bg-[#00BFFF] text-black font-extrabold text-[8px] flex items-center justify-center ring-1.5 ring-white dark:ring-[#14151a] shadow-xs">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown: Responsive inset for mobile screen */}
            <AnimatePresence>
              {showNotifMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.96 }}
                  className={`fixed sm:absolute inset-x-3 sm:inset-x-auto sm:right-0 top-20 sm:top-full sm:mt-2 sm:w-80 rounded-2xl border p-3.5 z-50 shadow-2xl backdrop-blur-xl ${
                    isDark ? 'bg-[#121318] border-[#22252c] text-white' : 'bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between p-2 border-b border-slate-200 dark:border-[#22252c] mb-2">
                    <span className="text-xs font-bold font-['Space_Grotesk'] flex items-center gap-1.5">
                      <Bell className="w-3.5 h-3.5 text-[#00BFFF]" />
                      Store Notifications
                    </span>
                    <button onClick={() => setShowNotifMenu(false)} className="text-gray-400 hover:text-gray-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto no-scrollbar">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-2.5 rounded-xl border border-slate-200 dark:border-[#242734] bg-slate-50 dark:bg-[#171922] text-xs flex items-start gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#00BFFF]/10 border border-[#00BFFF]/30 flex items-center justify-center text-[#00BFFF] shrink-0 mt-0.5">
                          <Bell className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="font-semibold truncate">{n.title}</h4>
                            <span className="text-[10px] text-gray-500 shrink-0">{n.time}</span>
                          </div>
                          <p className="text-[11px] text-gray-500 dark:text-gray-300 mt-0.5">{n.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile & Role Switcher */}
          <div className="relative shrink-0">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className={`w-9 h-9 sm:w-auto flex items-center justify-center sm:justify-start gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl border transition-all shrink-0 ${
                isDark
                  ? 'bg-[#14151a] border-[#22252c] hover:border-[#00BFFF]/50'
                  : 'bg-slate-100 border-slate-300 hover:border-[#0284c7]'
              }`}
            >
              <div className="relative">
                <img
                  src={currentUser.photoUrl}
                  alt={currentUser.displayName}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover border border-[#00BFFF]/40"
                />
                <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-[#0a0a0a] ${
                  currentUser.role === 'admin' ? 'bg-purple-500' : 'bg-[#00BFFF]'
                }`} />
              </div>

              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold leading-tight">
                  {currentUser.displayName}
                </div>
                <div className="text-[10px]">
                  {currentUser.role === 'admin' ? (
                    <span className="text-purple-600 dark:text-purple-400 font-semibold">ADMIN CLEARANCE</span>
                  ) : (
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">USER MODE</span>
                  )}
                </div>
              </div>
            </button>

            {/* Profile Menu: Responsive inset for mobile screen */}
            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.96 }}
                  className={`fixed sm:absolute inset-x-3 sm:inset-x-auto sm:right-0 top-20 sm:top-full sm:mt-2 sm:w-72 rounded-2xl border p-3.5 z-50 shadow-2xl backdrop-blur-xl ${
                    isDark ? 'bg-[#121318] border-[#22252c] text-white' : 'bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="p-2 border-b border-slate-200 dark:border-[#22252c] mb-2">
                    <p className="text-xs text-gray-500">Identity Account</p>
                    <p className="text-sm font-semibold truncate">{currentUser.email}</p>
                    <div className="mt-1 flex items-center justify-between">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${
                        currentUser.role === 'admin'
                          ? 'bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-400/30'
                          : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-400/30'
                      }`}>
                        ROLE: {currentUser.role.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-amber-500 font-mono font-bold">
                        {currentUser.cyberPoints} PTS
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[11px] font-medium text-gray-500 px-2 py-1">
                      Switch Role for Testing:
                    </p>
                    
                    <button
                      onClick={() => {
                        switchUserRole('admin');
                        setShowProfileMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        currentUser.role === 'admin'
                          ? 'bg-purple-500/20 text-purple-600 dark:text-purple-200 border border-purple-400/40'
                          : 'hover:bg-slate-100 dark:hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-purple-500" />
                        <span>Admin (admin@arstore.com)</span>
                      </div>
                      {currentUser.role === 'admin' && <Check className="w-3.5 h-3.5 text-purple-500" />}
                    </button>

                    <button
                      onClick={() => {
                        switchUserRole('user');
                        setShowProfileMenu(false);
                        if (currentTab === 'admin') setCurrentTab('home');
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        currentUser.role === 'user'
                          ? 'bg-[#00BFFF]/20 text-[#00BFFF] border border-[#00BFFF]/40'
                          : 'hover:bg-slate-100 dark:hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-[#00BFFF]" />
                        <span>User (Regular Mode)</span>
                      </div>
                      {currentUser.role === 'user' && <Check className="w-3.5 h-3.5 text-[#00BFFF]" />}
                    </button>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200 dark:border-[#22252c] flex flex-col gap-1">
                    <button
                      onClick={() => {
                        toggleTheme();
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-between sm:hidden"
                    >
                      <div className="flex items-center gap-2">
                        {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
                        <span>Display Theme ({isDark ? 'Switch to White' : 'Switch to Black'})</span>
                      </div>
                      <span className="text-[10px] text-gray-400 uppercase font-mono">{theme}</span>
                    </button>
                    <button
                      onClick={() => {
                        onOpenProtect();
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-white/5 flex items-center gap-2 sm:hidden"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      AR Play Protect Security
                    </button>
                    <button
                      onClick={() => {
                        setCurrentTab('settings');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-white/5 flex items-center gap-2"
                    >
                      <SettingsIcon className="w-3.5 h-3.5 text-[#00BFFF]" />
                      Store Settings & Theme Preferences
                    </button>
                    <button
                      onClick={() => {
                        setCurrentTab('my-apps');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-white/5 flex items-center gap-2"
                    >
                      <HardDrive className="w-3.5 h-3.5 text-gray-500" />
                      Manage Installed Apps
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </header>
  );
};
