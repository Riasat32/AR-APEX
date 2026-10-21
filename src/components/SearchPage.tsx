import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { AppCard } from './AppCard';
import {
  Search,
  X,
  History,
  SlidersHorizontal,
  Star,
  HardDrive,
  Trash2,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppCategory } from '../types/store';

export const SearchPage: React.FC = () => {
  const {
    apps,
    searchQuery,
    setSearchQuery,
    searchHistory,
    addSearchHistory,
    removeSearchHistory,
    clearSearchHistory,
    categories,
    theme,
    setCurrentTab,
    loadSampleCatalog,
    switchUserRole
  } = useStore();

  const isDark = theme === 'dark';

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [minRating, setMinRating] = useState<number>(0);
  const [sizeFilter, setSizeFilter] = useState<'all' | 'small' | 'medium' | 'large'>('all');
  const [sortBy, setSortBy] = useState<'downloads' | 'rating' | 'newest'>('downloads');

  const parseSizeMb = (sizeStr: string): number => {
    const num = parseFloat(sizeStr.replace(/[^0-9.]/g, ''));
    if (sizeStr.toLowerCase().includes('gb')) return num * 1024;
    return num || 0;
  };

  const filteredApps = useMemo(() => {
    return apps
      .filter((app) => {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !q ||
          app.name.toLowerCase().includes(q) ||
          app.description.toLowerCase().includes(q) ||
          app.developer.toLowerCase().includes(q) ||
          app.tags.some((t) => t.toLowerCase().includes(q));

        if (!matchesQuery) return false;

        if (selectedCategory !== 'All' && app.category !== selectedCategory) {
          return false;
        }

        if (minRating > 0 && app.rating < minRating) {
          return false;
        }

        const sizeMb = parseSizeMb(app.size);
        if (sizeFilter === 'small' && sizeMb >= 50) return false;
        if (sizeFilter === 'medium' && (sizeMb < 50 || sizeMb > 100)) return false;
        if (sizeFilter === 'large' && sizeMb <= 100) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'downloads') return b.downloads - a.downloads;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return 0;
      });
  }, [apps, searchQuery, selectedCategory, minRating, sizeFilter, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addSearchHistory(searchQuery.trim());
    }
  };

  const handleChipClick = (term: string) => {
    setSearchQuery(term);
    addSearchHistory(term);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6"
    >
      {/* Search Input Bar */}
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSearchSubmit} className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#00BFFF] transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by app name, developer, cyber tag, or keyword..."
            autoFocus
            className={`w-full rounded-2xl py-3.5 pl-12 pr-12 text-sm sm:text-base outline-none transition-all border ${
              isDark
                ? 'bg-[#12141a] border-[#22252c] text-white placeholder-gray-500 focus:border-[#00BFFF] shadow-[0_4px_25px_rgba(0,0,0,0.5)]'
                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#0284c7] shadow-sm'
            }`}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        {/* Search History Chips */}
        {searchHistory.length > 0 && (
          <div className="mt-4 flex items-center justify-between flex-wrap gap-2 pt-1">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-gray-400">
              <History className="w-3.5 h-3.5 text-[#00BFFF]" />
              <span className="font-medium">Recent Searches:</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {searchHistory.map((term, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-all cursor-pointer border ${
                    isDark
                      ? 'bg-[#16171d] border-[#262832] text-[#C0C0C0] hover:text-[#00BFFF] hover:border-[#00BFFF]/50'
                      : 'bg-white border-slate-200 text-slate-700 hover:text-[#0284c7] hover:border-[#0284c7] shadow-2xs'
                  }`}
                >
                  <span onClick={() => handleChipClick(term)}>{term}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSearchHistory(term);
                    }}
                    className="text-gray-400 hover:text-red-500 p-0.5 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              <button
                onClick={clearSearchHistory}
                className="text-[11px] text-gray-400 hover:text-red-500 flex items-center gap-1 px-2 py-1 rounded"
              >
                <Trash2 className="w-3 h-3" />
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Filter Controls Toggle & Bar */}
      <div className={`rounded-3xl p-4 sm:p-5 border space-y-4 ${
        isDark ? 'bg-[#12141a] border-[#22252c] text-white' : 'bg-white border-slate-200 shadow-sm text-slate-900'
      }`}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#00BFFF]" />
            <h3 className="text-sm font-bold font-['Space_Grotesk']">
              Filter and Sort Results
            </h3>
            <span className="text-xs text-[#00BFFF] bg-[#00BFFF]/10 border border-[#00BFFF]/30 px-2 py-0.5 rounded-full font-mono font-bold">
              {filteredApps.length} {filteredApps.length === 1 ? 'Package' : 'Packages'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-slate-500">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={`rounded-xl px-2.5 py-1 text-xs outline-none border focus:border-[#00BFFF] ${
                isDark ? 'bg-[#171922] border-[#262834] text-white' : 'bg-slate-50 border-slate-300 text-slate-800'
              }`}
            >
              <option value="downloads">Most Downloaded</option>
              <option value="rating">Highest Rated (★)</option>
              <option value="newest">Latest Drop</option>
            </select>
          </div>
        </div>

        {/* Filter Rows */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-200 dark:border-[#1f2229]">
          
          {/* Category Filter */}
          <div>
            <label className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-gray-400 block mb-1.5 font-bold">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`w-full rounded-xl p-2 text-xs outline-none border focus:border-[#00BFFF] ${
                isDark ? 'bg-[#171922] border-[#262834] text-white' : 'bg-slate-50 border-slate-300 text-slate-800'
              }`}
            >
              <option value="All">All Categories</option>
              {categories.filter(c => c.id !== 'All').map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-gray-400 block mb-1.5 font-bold">
              Minimum Rating
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[0, 4.0, 4.5, 4.8].map((stars) => (
                <button
                  key={stars}
                  onClick={() => setMinRating(stars)}
                  className={`py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                    minRating === stars
                      ? 'bg-[#00BFFF]/20 text-[#00BFFF] border-[#00BFFF]/50 font-bold'
                      : isDark
                      ? 'bg-[#171922] text-[#C0C0C0] border-[#262834] hover:bg-white/5'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {stars === 0 ? 'Any' : `${stars}★+`}
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div>
            <label className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-gray-400 block mb-1.5 font-bold">
              Package Size
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'all', label: 'All' },
                { id: 'small', label: '<50M' },
                { id: 'medium', label: '50-100' },
                { id: 'large', label: '100M+' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSizeFilter(s.id as any)}
                  className={`py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                    sizeFilter === s.id
                      ? 'bg-[#00BFFF]/20 text-[#00BFFF] border-[#00BFFF]/50 font-bold'
                      : isDark
                      ? 'bg-[#171922] text-[#C0C0C0] border-[#262834] hover:bg-white/5'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Results Grid */}
      {apps.length === 0 ? (
        <div className={`p-12 text-center rounded-3xl border space-y-4 ${
          isDark ? 'bg-[#12141a] border-[#22252c]' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#00BFFF]/10 border border-[#00BFFF]/30 flex items-center justify-center p-3">
            <img
              src="/assets/aistudio/file_0000000093f081f5902b6fdd29762298_938e318c.png"
              alt="AR-STORE"
              className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(0,191,255,0.7)]"
            />
          </div>
          <h4 className={`text-lg font-bold font-['Space_Grotesk'] ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Store Repository is Clean & Empty
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Default clean state initialized for publishing. Upload your APK package using the Developer Console, or load sample packages.
          </p>
          <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
            <button
              onClick={() => {
                switchUserRole('admin');
                setCurrentTab('admin');
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#00BFFF] text-black hover:bg-[#38bdf8]"
            >
              Open Admin Console
            </button>

          </div>
        </div>
      ) : filteredApps.length === 0 ? (
        <div className={`p-12 text-center rounded-3xl border space-y-3 ${
          isDark ? 'bg-[#12141a] border-[#22252c]' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#00BFFF]/10 border border-[#00BFFF]/30 flex items-center justify-center text-[#00BFFF]">
            <Search className="w-7 h-7" />
          </div>
          <h4 className={`text-lg font-bold font-['Space_Grotesk'] ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            No cyber packages found
          </h4>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Try adjusting your query or resetting active rating and size filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setMinRating(0);
              setSizeFilter('all');
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 transition-all"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredApps.map((app) => (
            <div key={app.id} className="flex justify-center">
              <AppCard app={app} />
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
