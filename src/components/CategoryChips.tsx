import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  Sparkles,
  Gamepad2,
  BrainCircuit,
  Layers,
  ShieldCheck,
  Music,
  Users,
  Camera,
  Code,
  HeartPulse,
  Coins
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Sparkles,
  Gamepad2,
  BrainCircuit,
  Layers,
  ShieldCheck,
  Music,
  Users,
  Camera,
  Code,
  HeartPulse,
  Coins
};

export const CategoryChips: React.FC = () => {
  const { categories, activeCategory, setActiveCategory, theme } = useStore();
  const isDark = theme === 'dark';

  return (
    <div className="w-full my-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className={`text-xs sm:text-sm font-bold tracking-wider uppercase font-['Space_Grotesk'] ${
          isDark ? 'text-[#C0C0C0]' : 'text-slate-600'
        }`}>
          Explore by Category
        </h3>
        <span className="text-xs text-slate-400">Horizontal scroll</span>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2 px-1">
        {categories.map((cat) => {
          const Icon = ICON_MAP[cat.icon] || Sparkles;
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="shrink-0 flex flex-col items-center gap-2 group transition-all focus:outline-none"
            >
              {/* Circular Icon Container */}
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-all duration-300 relative ${
                  isActive
                    ? isDark
                      ? 'bg-gradient-to-br from-[#00BFFF]/25 to-[#0077b6]/20 border-2 border-[#00BFFF] shadow-[0_0_20px_rgba(0,191,255,0.5)] scale-105'
                      : 'bg-[#0284c7]/15 border-2 border-[#0284c7] shadow-sm scale-105'
                    : isDark
                    ? 'bg-[#14151b] border border-[#232630] hover:border-[#00BFFF]/50 hover:bg-[#1a1c24]'
                    : 'bg-white border border-slate-200 hover:border-slate-400 hover:bg-slate-50 shadow-xs'
                }`}
              >
                <Icon
                  className={`w-6 h-6 transition-colors duration-300 ${
                    isActive
                      ? isDark ? 'text-[#00BFFF]' : 'text-[#0284c7]'
                      : isDark ? 'text-gray-400 group-hover:text-white' : 'text-slate-500 group-hover:text-slate-900'
                  }`}
                />
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#00BFFF] shadow-sm" />
                )}
              </div>

              {/* Category Label */}
              <span
                className={`text-xs font-medium text-center whitespace-nowrap transition-colors ${
                  isActive
                    ? isDark ? 'text-[#00BFFF] font-bold' : 'text-[#0284c7] font-bold'
                    : isDark ? 'text-[#C0C0C0] group-hover:text-white' : 'text-slate-600 group-hover:text-slate-900'
                }`}
              >
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
