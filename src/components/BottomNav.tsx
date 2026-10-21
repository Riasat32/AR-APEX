import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, Gamepad2, LayoutGrid, HardDrive, Search, ShieldAlert, Settings, Trophy } from 'lucide-react';

interface BottomNavProps {
  onOpenPoints: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenPoints }) => {
  const { currentTab, setCurrentTab, currentUser, theme } = useStore();
  const isDark = theme === 'dark';

  const navItems = [
    { id: 'home', label: 'Discover', icon: Sparkles },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'apps', label: 'Apps', icon: LayoutGrid },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'my-apps', label: 'My Apps', icon: HardDrive },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <div className={`md:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-xl border-t px-1 py-1.5 flex items-center justify-around transition-all ${
      isDark ? 'bg-[#0a0a0a]/95 border-[#1f2229] text-white' : 'bg-white/95 border-slate-200 text-slate-800 shadow-md'
    }`}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setCurrentTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative ${
              isActive
                ? 'text-[#00BFFF]'
                : isDark ? 'text-gray-400 hover:text-[#C0C0C0]' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {isActive && (
                <div className="absolute -inset-1 rounded-full bg-[#00BFFF]/20 blur-xs" />
              )}
            </div>
            <span className={`text-[10px] mt-0.5 font-medium ${isActive ? 'text-[#00BFFF] font-bold' : ''}`}>
              {item.label}
            </span>
          </button>
        );
      })}

      {currentUser.role === 'admin' && (
        <button
          onClick={() => setCurrentTab('admin')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
            currentTab === 'admin' ? 'text-purple-500' : 'text-purple-400/60'
          }`}
        >
          <ShieldAlert className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-medium">Admin</span>
        </button>
      )}
    </div>
  );
};
