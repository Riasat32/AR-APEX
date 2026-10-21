import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Star,
  Download,
  CheckCircle,
  Share2,
  ShieldCheck,
  Smartphone,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Layers,
  Check,
  Heart,
  Play,
  Info,
  Mail,
  Lock,
  FolderOpen
} from 'lucide-react';
import { AppCard } from './AppCard';
import { TransformerLogo } from './TransformerLogo';

interface AppDetailsModalProps {
  onOpenProtect?: () => void;
}

export const AppDetailsModal: React.FC<AppDetailsModalProps> = ({ onOpenProtect }) => {
  const {
    selectedApp,
    setSelectedApp,
    apps,
    reviews,
    addReview,
    installApp,
    downloadApkBinary,
    uninstallApp,
    isAppInstalled,
    installingState,
    toggleWishlist,
    isWishlisted,
    setLaunchedApp,
    theme,
    showToast
  } = useStore();

  const isDark = theme === 'dark';

  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);

  if (!selectedApp) return null;

  const appReviews = reviews.filter((r) => r.appId === selectedApp.id);
  const isInstalled = isAppInstalled(selectedApp.id);
  const isHearted = isWishlisted(selectedApp.id);
  const progressState = installingState[selectedApp.id];
  const isBusy = progressState?.status === 'downloading' || progressState?.status === 'installing';

  // Similar apps in same category excluding current app
  const similarApps = apps
    .filter((a) => a.category === selectedApp.category && a.id !== selectedApp.id)
    .slice(0, 6);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      showToast('Review Required', 'Please enter your thoughts before submitting.', 'error');
      return;
    }
    addReview(selectedApp.id, newRating, newComment.trim());
    setNewComment('');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link Copied', 'AR-STORE app link copied to clipboard.', 'info');
    }
  };

  const dist = selectedApp.ratingDistribution || { 5: 80, 4: 12, 3: 5, 2: 2, 1: 1 };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-start justify-center p-2 sm:p-4 md:p-6">
      
      {/* Lightbox for screenshots */}
      <AnimatePresence>
        {selectedScreenshot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedScreenshot(null)}
            className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={selectedScreenshot}
              alt="Screenshot full view"
              className="max-w-5xl max-h-[90vh] object-contain rounded-2xl border border-[#00BFFF]/50 shadow-[0_0_50px_rgba(0,191,255,0.4)]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.97 }}
        transition={{ type: 'spring', damping: 28, stiffness: 350 }}
        className={`relative w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden my-4 sm:my-8 border ${
          isDark
            ? 'bg-[#0f1015] border-[#22252c] text-[#C0C0C0]'
            : 'bg-white border-slate-200 text-slate-800 shadow-xl'
        }`}
      >
        {/* Modal Close Button */}
        <button
          onClick={() => setSelectedApp(null)}
          className={`absolute top-4 right-4 z-20 p-2 rounded-full border transition-all ${
            isDark
              ? 'bg-black/60 border-white/10 text-gray-400 hover:text-white'
              : 'bg-slate-100 border-slate-300 text-slate-600 hover:text-slate-900'
          }`}
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-[#00BFFF]/10 via-transparent to-transparent pointer-events-none" />

        {/* Top Header Section */}
        <div className="relative p-6 sm:p-8 border-b border-slate-200 dark:border-[#1f2229]">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            
            {/* Big App Icon */}
            <div className="relative shrink-0">
              <img
                src={selectedApp.iconUrl}
                alt={selectedApp.name}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl object-cover border-2 border-[#00BFFF]/50 shadow-md"
              />
              <span className={`absolute -bottom-2 -right-2 p-1.5 rounded-xl border border-[#00BFFF]/40 text-[#00BFFF] ${
                isDark ? 'bg-[#0a0a0a]' : 'bg-white shadow-xs'
              }`}>
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>

            {/* App Meta & Title */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#00BFFF]/15 border border-[#00BFFF]/40 text-[#00BFFF]">
                  {selectedApp.category}
                </span>
                <span className="text-xs text-gray-500 font-mono">
                  v{selectedApp.version}
                </span>
                {selectedApp.contentRating && (
                  <span className={`text-[11px] px-2 py-0.5 rounded border ${
                    isDark ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}>
                    {selectedApp.contentRating}
                  </span>
                )}
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold">
                  {selectedApp.price || 'Free'}
                </span>
                {selectedApp.inAppPurchases && (
                  <span className="text-[10px] text-gray-500">
                    In-app purchases
                  </span>
                )}
              </div>

              <h1 className={`text-2xl sm:text-4xl font-extrabold tracking-tight mt-1 font-['Space_Grotesk'] ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {selectedApp.name}
              </h1>

              <p className="text-sm text-[#00BFFF] font-semibold mt-0.5">
                {selectedApp.developer}
              </p>

              {/* Key Metrics Grid like real Play Store */}
              <div className="grid grid-cols-4 gap-2 sm:gap-4 my-4 py-3 border-y border-slate-200 dark:border-[#1f2229] max-w-xl text-center">
                
                {/* Rating */}
                <div className="border-r border-slate-200 dark:border-[#1f2229] px-1">
                  <div className={`flex items-center justify-center gap-1 font-bold text-sm sm:text-base ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    <span>{selectedApp.rating}</span>
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-gray-500 truncate block">
                    {selectedApp.ratingCount?.toLocaleString()} reviews
                  </span>
                </div>

                {/* Downloads */}
                <div className="border-r border-slate-200 dark:border-[#1f2229] px-1">
                  <span className={`font-bold text-sm sm:text-base ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {(selectedApp.downloads / 1000000).toFixed(1)}M+
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-gray-500 block">Downloads</span>
                </div>

                {/* Size */}
                <div className="border-r border-slate-200 dark:border-[#1f2229] px-1">
                  <span className={`font-bold text-sm sm:text-base ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {selectedApp.size}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-gray-500 block">Size</span>
                </div>

                {/* Age Rating */}
                <div className="px-1">
                  <span className={`font-bold text-sm sm:text-base ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {selectedApp.contentRating?.split(' ')[0] || '12+'}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-gray-500 block">Rated for</span>
                </div>

              </div>

              {/* Install and Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <div className="relative w-full sm:w-auto">
                  <button
                    onClick={() => {
                      if (isInstalled) {
                        setLaunchedApp(selectedApp);
                      } else {
                        installApp(selectedApp.id);
                      }
                    }}
                    disabled={isBusy}
                    className={`relative overflow-hidden w-full sm:min-w-[210px] h-12 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                      isInstalled
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/50 shadow-sm hover:bg-emerald-500/30'
                        : isBusy
                        ? 'bg-slate-800 text-[#00BFFF] border border-[#00BFFF]/60 shadow-md cursor-wait'
                        : 'bg-[#00BFFF] hover:bg-[#38bdf8] text-black shadow-md'
                    }`}
                  >
                    {/* Animated Progress Fill Bar */}
                    {isBusy && (
                      <motion.div
                        className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#00BFFF]/40 via-[#00BFFF]/80 to-[#00BFFF]"
                        initial={{ width: '0%' }}
                        animate={{ width: `${progressState?.progress || 0}%` }}
                        transition={{ ease: 'linear', duration: 0.1 }}
                      />
                    )}

                    {/* Button Text & Icons */}
                    <div className="relative z-10 flex items-center justify-center gap-2">
                      {isInstalled ? (
                        <>
                          <Play className="w-4 h-4 fill-current text-emerald-500" />
                          <span>Open Live Sandbox</span>
                        </>
                      ) : progressState?.status === 'downloading' ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Downloading... {progressState.progress}%</span>
                        </>
                      ) : progressState?.status === 'installing' ? (
                        <>
                          <div className="w-4 h-4 border-2 border-[#00BFFF] border-t-transparent rounded-full animate-spin" />
                          <span>Finalizing Install...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5" />
                          <span>Install ({selectedApp.size})</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>

                {/* Direct APK File Download for Internal Storage */}
                <button
                  onClick={() => downloadApkBinary(selectedApp)}
                  className={`px-4 h-12 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                    isDark
                      ? 'bg-[#161822] hover:bg-[#1e202e] border-[#00BFFF]/40 text-[#00BFFF] hover:border-[#00BFFF]'
                      : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                  }`}
                  title="Download raw .APK binary file to your device internal storage"
                >
                  <FolderOpen className="w-4 h-4 text-[#00BFFF]" />
                  <span>Download .APK ({selectedApp.size})</span>
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(selectedApp.id)}
                  className={`px-4 h-12 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                    isHearted
                      ? 'bg-rose-500/20 text-rose-500 border-rose-500/50 shadow-sm'
                      : isDark
                      ? 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300 hover:text-white'
                      : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isHearted ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{isHearted ? 'Wishlisted' : 'Add to Wishlist'}</span>
                </button>

                {/* Uninstall Option if installed */}
                {isInstalled && (
                  <button
                    onClick={() => uninstallApp(selectedApp.id)}
                    className="px-4 h-12 rounded-xl text-xs font-semibold text-red-500 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-all"
                  >
                    Uninstall
                  </button>
                )}

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className={`p-3 h-12 rounded-xl border transition-all ${
                    isDark ? 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300' : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                  }`}
                  title="Share App"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Play Protect Verified Banner */}
              <div
                onClick={onOpenProtect}
                className="flex items-center gap-2 mt-4 text-xs text-emerald-600 dark:text-emerald-400 cursor-pointer hover:underline font-medium"
              >
                <Check className="w-4 h-4" />
                <span>Verified by AR-STORE Play Protect • Certified Clean</span>
              </div>

            </div>

          </div>
        </div>

        {/* Screenshots Carousel */}
        <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-[#1f2229]">
          <h3 className={`text-base font-bold mb-3 font-['Space_Grotesk'] ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            App Previews & In-Game Screens
          </h3>
          <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
            {selectedApp.screenshots.map((shot, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedScreenshot(shot)}
                className={`shrink-0 w-64 sm:w-80 h-38 sm:h-48 rounded-2xl overflow-hidden border cursor-zoom-in transition-all group ${
                  isDark ? 'border-[#232630] hover:border-[#00BFFF]' : 'border-slate-200 hover:border-[#0284c7] shadow-xs'
                }`}
              >
                <img
                  src={shot}
                  alt={`${selectedApp.name} preview ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Description & "What's New" Section */}
        <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-[#1f2229] space-y-6">
          
          {/* What's New */}
          {selectedApp.whatsNew && (
            <div className={`p-4 rounded-2xl border ${
              isDark ? 'bg-[#14151c] border-[#232632]' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className={`flex items-center gap-2 text-sm font-bold mb-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                <Sparkles className="w-4 h-4 text-[#00BFFF]" />
                <span>What's New in v{selectedApp.version}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                {selectedApp.whatsNew}
              </p>
              <div className="mt-2 text-[11px] text-gray-400">
                Updated on {new Date(selectedApp.updatedAt || selectedApp.createdAt).toLocaleDateString()}
              </div>
            </div>
          )}

          {/* About this app */}
          <div>
            <h3 className={`text-base font-bold mb-2 font-['Space_Grotesk'] ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              About this application
            </h3>
            <p className={`text-sm leading-relaxed ${
              isDark ? 'text-[#C0C0C0]' : 'text-slate-600'
            } ${!showFullDesc ? 'line-clamp-3' : ''}`}>
              {selectedApp.description}
            </p>
            <button
              onClick={() => setShowFullDesc(!showFullDesc)}
              className="mt-2 text-xs font-semibold text-[#00BFFF] hover:underline flex items-center gap-1"
            >
              {showFullDesc ? (
                <>Show less <ChevronUp className="w-3.5 h-3.5" /></>
              ) : (
                <>Read full overview <ChevronDown className="w-3.5 h-3.5" /></>
              )}
            </button>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {selectedApp.tags.map((tag, i) => (
              <span
                key={i}
                className={`text-xs px-3 py-1 rounded-full border ${
                  isDark ? 'bg-[#161820] border-[#252834] text-gray-300' : 'bg-slate-100 border-slate-200 text-slate-600'
                }`}
              >
                #{tag}
              </span>
            ))}
          </div>

        </div>

        {/* Play Store Exact Ratings Histogram & Breakdown */}
        <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-[#1f2229]">
          <h3 className={`text-lg font-bold font-['Space_Grotesk'] mb-4 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Ratings and Reviews
          </h3>

          <div className={`grid grid-cols-1 sm:grid-cols-3 gap-6 items-center p-4 rounded-2xl border mb-6 ${
            isDark ? 'bg-[#13151e] border-[#222530]' : 'bg-slate-50 border-slate-200'
          }`}>
            
            {/* Big Score */}
            <div className="text-center sm:border-r border-slate-200 dark:border-[#222530] sm:pr-4">
              <div className={`text-4xl sm:text-5xl font-black font-mono ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {selectedApp.rating}
              </div>
              <div className="flex items-center justify-center gap-1 my-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(selectedApp.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-400'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500">
                {selectedApp.ratingCount?.toLocaleString()} verified ratings
              </p>
            </div>

            {/* Distribution Bars */}
            <div className="sm:col-span-2 space-y-1.5 text-xs">
              {[5, 4, 3, 2, 1].map((star) => {
                const percent = (dist as any)[star] || 5;
                return (
                  <div key={star} className="flex items-center gap-3">
                    <span className="w-3 text-right font-mono text-gray-400">{star}</span>
                    <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-[#1e202a] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#00BFFF] shadow-xs"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="w-8 text-right font-mono text-gray-500 text-[11px]">{percent}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add a review form */}
          <form onSubmit={handleReviewSubmit} className={`mb-6 p-4 rounded-2xl border ${
            isDark ? 'bg-[#14151c] border-[#232632]' : 'bg-slate-50 border-slate-200'
          }`}>
            <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Rate this application
            </h4>

            {/* Interactive Stars */}
            <div className="flex items-center gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setNewRating(star)}
                  className="p-1 hover:scale-110 transition-transform focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= newRating
                        ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                        : 'text-gray-400'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs text-gray-500 ml-2 font-mono">
                {newRating} out of 5 stars
              </span>
            </div>

            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Tell others what you think of this application..."
              rows={2}
              className={`w-full rounded-xl p-3 text-xs sm:text-sm outline-none border focus:border-[#00BFFF] ${
                isDark ? 'bg-[#0d0e12] border-[#262832] text-white' : 'bg-white border-slate-300 text-slate-800'
              }`}
            />

            <div className="flex justify-end mt-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#00BFFF] text-black hover:bg-[#38bdf8] shadow-sm transition-all"
              >
                Submit Review
              </button>
            </div>
          </form>

          {/* Reviews List */}
          <div className="space-y-4">
            {appReviews.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No reviews yet. Be the first to review!</p>
            ) : (
              appReviews.map((rev) => (
                <div key={rev.id} className={`p-4 rounded-xl border ${
                  isDark ? 'bg-[#12141a] border-[#20232c]' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={rev.userAvatar || '/assets/aistudio/file_0000000093f081f5902b6fdd29762298_938e318c.png'}
                        alt={rev.userName}
                        className="w-7 h-7 rounded-full object-cover border border-[#00BFFF]/40"
                      />
                      <span className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{rev.userName}</span>
                    </div>
                    <span className="text-[11px] text-gray-400">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 mb-1.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-400'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 leading-relaxed">
                    {rev.comment}
                  </p>

                  <div className="flex items-center gap-3 mt-3 pt-2 border-t border-slate-200 dark:border-[#1a1c24] text-[11px] text-gray-400">
                    <span>Was this review helpful?</span>
                    <button
                      onClick={() => showToast('Helpful Feedback', 'Thank you for your feedback.', 'info')}
                      className="flex items-center gap-1 hover:text-[#00BFFF]"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>{rev.helpfulCount || 0}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Similar Apps Carousel */}
        {similarApps.length > 0 && (
          <div className="p-6 sm:p-8">
            <h3 className={`text-base font-bold mb-4 font-['Space_Grotesk'] ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Similar in {selectedApp.category}
            </h3>
            <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
              {similarApps.map((similar) => (
                <AppCard key={similar.id} app={similar} />
              ))}
            </div>
          </div>
        )}

      </motion.div>
    </div>
  );
};
