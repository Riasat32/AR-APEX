import React, { useRef } from 'react';
import { AppItem } from '../types/store';
import { AppCard } from './AppCard';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface HorizontalAppRowProps {
  title: string;
  subtitle?: string;
  badge?: string;
  apps: AppItem[];
  showRank?: boolean;
}

export const HorizontalAppRow: React.FC<HorizontalAppRowProps> = ({
  title,
  subtitle,
  badge,
  apps,
  showRank = false
}) => {
  const { theme } = useStore();
  const isDark = theme === 'dark';
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -380 : 380;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  if (!apps.length) return null;

  return (
    <section className="my-8 relative group/row">
      {/* Header */}
      {title && (
        <div className="flex items-end justify-between mb-4 px-1">
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`text-lg sm:text-xl font-bold tracking-tight font-['Space_Grotesk'] ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {title}
              </h3>
              {badge && (
                <span className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#00BFFF]/10 border border-[#00BFFF]/30 text-[#00BFFF]">
                  <Flame className="w-3 h-3 text-[#00BFFF]" />
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-[#C0C0C0] mt-0.5">{subtitle}</p>
            )}
          </div>

          {/* Scroll Arrows */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => scroll('left')}
              className={`p-1.5 rounded-xl border transition-all ${
                isDark
                  ? 'bg-[#14151b] border-[#232630] text-gray-400 hover:text-white hover:border-[#00BFFF]'
                  : 'bg-white border-slate-300 text-slate-600 hover:text-slate-900 shadow-2xs'
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className={`p-1.5 rounded-xl border transition-all ${
                isDark
                  ? 'bg-[#14151b] border-[#232630] text-gray-400 hover:text-white hover:border-[#00BFFF]'
                  : 'bg-white border-slate-300 text-slate-600 hover:text-slate-900 shadow-2xs'
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Horizontal Scroll Track */}
      <div
        ref={scrollContainerRef}
        className="flex items-stretch gap-4 overflow-x-auto no-scrollbar py-2 px-1 scroll-smooth"
      >
        {apps.map((app, index) => (
          <AppCard
            key={app.id}
            app={app}
            rank={showRank ? index + 1 : undefined}
          />
        ))}
      </div>
    </section>
  );
};
