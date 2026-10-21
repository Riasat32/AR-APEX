import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { motion } from 'motion/react';
import {
  Sparkles,
  Trophy,
  Gift,
  Zap,
  CheckCircle,
  X,
  ChevronRight,
  Shield,
  Coins
} from 'lucide-react';
import { TransformerLogo } from './TransformerLogo';

interface CyberPointsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CyberPointsModal: React.FC<CyberPointsModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, redeemPoints, theme } = useStore();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<'use' | 'perks' | 'earn'>('use');

  if (!isOpen) return null;

  const rewards = [
    { id: 'rew-1', title: '$3 AR-STORE Credit Coupon', points: 300, icon: Gift, desc: 'Usable for any premium APK or in-game bundle.' },
    { id: 'rew-2', title: 'CyberBlade 2088 Katana Skin', points: 650, icon: Zap, desc: 'Exclusive neon cyan plasma blade cosmetic.' },
    { id: 'rew-3', title: 'NeuralOS Unlimited Queries (1 Mo)', points: 1000, icon: Sparkles, desc: 'Unlock ultra high-priority inference tier.' },
    { id: 'rew-4', title: 'Quantum Hi-Res Master Access', points: 1200, icon: Coins, desc: '384kHz uncompressed studio spatial master stream.' }
  ];

  const tierGoal = currentUser.pointsTier === 'Diamond' ? 5000 : currentUser.pointsTier === 'Platinum' ? 3000 : currentUser.pointsTier === 'Gold' ? 2000 : 1000;
  const progressPercent = Math.min(100, Math.round((currentUser.cyberPoints / tierGoal) * 100));

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={`w-full max-w-xl rounded-3xl p-6 shadow-2xl relative border ${
          isDark
            ? 'bg-[#12141c] border-[#00BFFF]/40 text-[#C0C0C0]'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header Card */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-[#22252c]">
          <div className="flex items-center gap-3">
            <TransformerLogo size={42} glow={isDark} />
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`text-xl font-bold font-['Space_Grotesk'] ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  AR Play Points
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-400/30">
                  {currentUser.pointsTier.toUpperCase()} TIER
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-gray-400">Earn rewards with every game install and review</p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-black text-[#00BFFF] font-mono flex items-center gap-1 justify-end">
              <Sparkles className="w-5 h-5 text-[#00BFFF]" />
              <span>{currentUser.cyberPoints.toLocaleString()}</span>
            </div>
            <span className="text-[11px] text-gray-400">Available Points</span>
          </div>
        </div>

        {/* Level Progression Bar */}
        <div className={`my-5 p-4 rounded-2xl border space-y-2 ${
          isDark ? 'bg-[#161824] border-[#232636]' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-xs">
            <span className={`font-semibold flex items-center gap-1.5 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              <Trophy className="w-4 h-4 text-amber-500" />
              {currentUser.pointsTier} Status Progression
            </span>
            <span className="text-slate-500 font-mono">
              {currentUser.cyberPoints} / {tierGoal} pts
            </span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-[#202330] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#00BFFF] via-[#38bdf8] to-purple-400 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">
            Earn {tierGoal - currentUser.cyberPoints} more points to reach the next tier multiplier!
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-[#22252c] pb-2 mb-4">
          <button
            onClick={() => setActiveTab('use')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'use'
                ? 'bg-[#00BFFF]/20 text-[#00BFFF] border border-[#00BFFF]/40'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Use Points
          </button>
          <button
            onClick={() => setActiveTab('perks')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'perks'
                ? 'bg-[#00BFFF]/20 text-[#00BFFF] border border-[#00BFFF]/40'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Tier Perks
          </button>
          <button
            onClick={() => setActiveTab('earn')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'earn'
                ? 'bg-[#00BFFF]/20 text-[#00BFFF] border border-[#00BFFF]/40'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            How to Earn
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'use' && (
          <div className="space-y-3 max-h-64 overflow-y-auto no-scrollbar pr-1">
            {rewards.map((rew) => {
              const Icon = rew.icon;
              return (
                <div
                  key={rew.id}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                    isDark ? 'bg-[#161822] border-[#232634]' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#00BFFF]/10 border border-[#00BFFF]/30 flex items-center justify-center text-[#00BFFF] shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{rew.title}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-gray-400 truncate">{rew.desc}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => redeemPoints(rew.points, rew.title)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#00BFFF] hover:bg-[#38bdf8] text-black shadow-xs shrink-0 transition-all"
                  >
                    {rew.points} pts
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'perks' && (
          <div className="space-y-2.5 text-xs">
            <div className={`p-3 rounded-xl border flex items-center justify-between ${
              isDark ? 'bg-[#161822] border-[#222530]' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>1.4x Points Multiplier on Games</span>
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            </div>
            <div className={`p-3 rounded-xl border flex items-center justify-between ${
              isDark ? 'bg-[#161822] border-[#222530]' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>Weekly Mystery Cyber Drops</span>
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            </div>
            <div className={`p-3 rounded-xl border flex items-center justify-between ${
              isDark ? 'bg-[#161822] border-[#222530]' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>Exclusive Beta Access to New Releases</span>
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            </div>
          </div>
        )}

        {activeTab === 'earn' && (
          <div className="space-y-3 text-xs p-2">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#00BFFF]/10 text-[#00BFFF] flex items-center justify-center font-bold font-mono">
                +100
              </div>
              <div>
                <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Install Any App or Game</p>
                <p className="text-slate-500 dark:text-gray-400">Earn 100 points instantly when package download completes.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#00BFFF]/10 text-[#00BFFF] flex items-center justify-center font-bold font-mono">
                +25
              </div>
              <div>
                <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Write a Community Review</p>
                <p className="text-slate-500 dark:text-gray-400">Leave star ratings and feedback for developers.</p>
              </div>
            </div>
          </div>
        )}

      </motion.div>
    </div>
  );
};
