import React from 'react';
import { useStore } from '../context/StoreContext';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast, theme } = useStore();
  const isDark = theme === 'dark';

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-60 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl border backdrop-blur-md shadow-xl ${
              toast.type === 'success'
                ? isDark
                  ? 'bg-[#0f1922]/95 border-[#00BFFF]/60 shadow-[0_0_20px_rgba(0,191,255,0.25)] text-white'
                  : 'bg-white/95 border-[#0284c7]/50 shadow-lg text-slate-900'
                : toast.type === 'error'
                ? 'bg-rose-950/95 border-rose-500/60 text-white'
                : isDark
                ? 'bg-[#14151a]/95 border-[#C0C0C0]/30 text-[#C0C0C0]'
                : 'bg-white/95 border-slate-300 text-slate-800'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#00BFFF]" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-[#00BFFF]" />}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold tracking-wide">{toast.title}</h4>
              <p className="text-xs text-slate-500 dark:text-gray-300 mt-0.5 break-words">{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-gray-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
