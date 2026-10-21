import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Battery,
  Wifi,
  Sparkles,
  Zap,
  Play,
  Pause,
  Send,
  Volume2,
  Sword,
  Shield,
  RotateCcw
} from 'lucide-react';
import { TransformerLogo } from './TransformerLogo';

export const AppSandboxModal: React.FC = () => {
  const { launchedApp, setLaunchedApp, showToast } = useStore();

  // State for interactive mini-demos
  // Game states:
  const [combo, setCombo] = useState(0);
  const [energy, setEnergy] = useState(100);
  const [lastAction, setLastAction] = useState('Standby');

  // AI assistant chat state:
  const [chatLog, setChatLog] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    { sender: 'ai', text: 'NeuralOS Copilot online. How may I augment your tasks today?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Audio player state:
  const [isPlayingAudio, setIsPlayingAudio] = useState(true);

  if (!launchedApp) return null;

  const handleSlash = () => {
    setCombo(prev => prev + 1);
    setEnergy(prev => Math.max(0, prev - 10));
    setLastAction('High-Frequency Katana Strike! +150 DMG');
    if (energy <= 10) {
      setTimeout(() => setEnergy(100), 1200);
    }
  };

  const handleParry = () => {
    setCombo(prev => prev + 2);
    setLastAction('Deflected Particle Beam! Perfect Parry');
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const msg = chatInput.trim();
    setChatInput('');
    setChatLog(prev => [...prev, { sender: 'user', text: msg }]);

    setTimeout(() => {
      const responses = [
        `Analysis complete for "${msg}". Routing query through localized quantum neural grid.`,
        `Synthesized brief generated. All sub-processes synchronized.`,
        `Telemetry confirmed. Memory buffers optimized by 34%.`
      ];
      const pick = responses[Math.floor(Math.random() * responses.length)];
      setChatLog(prev => [...prev, { sender: 'ai', text: pick }]);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        className="w-full max-w-2xl bg-[#0d0e14] border-2 border-[#00BFFF]/60 rounded-3xl shadow-[0_0_60px_rgba(0,191,255,0.4)] overflow-hidden flex flex-col h-[640px] text-[#C0C0C0] relative"
      >
        {/* Device Status Header */}
        <div className="bg-[#12141c] px-4 py-2 border-b border-[#22252c] flex items-center justify-between text-[11px] text-gray-400 font-mono">
          <div className="flex items-center gap-2">
            <TransformerLogo size={18} glow={false} />
            <span className="text-white font-bold">{launchedApp.name}</span>
            <span className="text-[#00BFFF]">LIVE SANDBOX</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-emerald-400 font-bold">120 FPS</span>
            <Wifi className="w-3.5 h-3.5 text-[#00BFFF]" />
            <div className="flex items-center gap-1 text-white">
              <span>98%</span>
              <Battery className="w-4 h-4 text-emerald-400" />
            </div>
            <button
              onClick={() => setLaunchedApp(null)}
              className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white ml-2"
              title="Close Sandbox"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sandbox Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gradient-to-b from-[#0a0a0c] via-[#10121a] to-[#0a0a0c] flex flex-col">
          
          {/* Game Sandbox: CyberBlade or other games */}
          {launchedApp.category === 'Games' ? (
            <div className="flex-1 flex flex-col justify-between items-center text-center space-y-4">
              <div className="w-full flex items-center justify-between px-2">
                <div className="text-left">
                  <span className="text-[10px] text-gray-400 font-mono">COMBO MULTIPLIER</span>
                  <div className="text-3xl font-extrabold text-[#00BFFF] font-['Space_Grotesk']">
                    {combo}x HITS
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-gray-400 font-mono">ENERGY CORE</span>
                  <div className="w-32 h-3 rounded-full bg-gray-800 overflow-hidden mt-1">
                    <div
                      className="h-full bg-gradient-to-r from-[#00BFFF] to-cyan-300 transition-all duration-200"
                      style={{ width: `${energy}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Main Combat Stage */}
              <div className="relative w-full max-w-md h-52 rounded-2xl overflow-hidden border border-[#00BFFF]/40 shadow-[0_0_30px_rgba(0,191,255,0.2)] flex items-center justify-center bg-black/60">
                <img
                  src={launchedApp.screenshots[0]}
                  alt="Game Arena"
                  className="absolute inset-0 w-full h-full object-cover opacity-40 filter blur-xs"
                />
                
                <div className="relative z-10 space-y-2 text-center p-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-[#00BFFF]/20 border border-[#00BFFF] flex items-center justify-center text-[#00BFFF] shadow-[0_0_20px_#00BFFF]">
                    <Sword className="w-8 h-8 animate-pulse" />
                  </div>
                  <p className="text-xs text-white font-mono bg-black/70 px-3 py-1 rounded-full border border-white/20 inline-block">
                    {lastAction}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4 w-full max-w-sm justify-center">
                <button
                  onClick={handleSlash}
                  className="flex-1 py-3 rounded-2xl font-bold text-sm bg-[#00BFFF] hover:bg-[#38bdf8] text-black shadow-[0_0_20px_rgba(0,191,255,0.5)] transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Sword className="w-4 h-4" />
                  <span>Slash (Attack)</span>
                </button>

                <button
                  onClick={handleParry}
                  className="flex-1 py-3 rounded-2xl font-bold text-sm bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Shield className="w-4 h-4" />
                  <span>Deflect / Parry</span>
                </button>
              </div>

              <p className="text-[11px] text-gray-500">
                Simulated running in AR Engine v2.4 (Ultra 120 FPS Ray Tracing Mode)
              </p>
            </div>
          ) : launchedApp.category === 'AI & AR' || launchedApp.category === 'Productivity' || launchedApp.category === 'Tools' ? (
            /* Interactive AI / Tool Terminal */
            <div className="flex-1 flex flex-col justify-between space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#14151f] border border-[#232636]">
                <img
                  src={launchedApp.iconUrl}
                  alt={launchedApp.name}
                  className="w-10 h-10 rounded-xl object-cover border border-[#00BFFF]/40"
                />
                <div>
                  <h4 className="text-xs font-bold text-white">{launchedApp.name} Active Enclave</h4>
                  <p className="text-[11px] text-[#00BFFF]">Quantum Neural Session Connected</p>
                </div>
              </div>

              {/* Chat / Terminal Window */}
              <div className="flex-1 overflow-y-auto space-y-2 p-3 rounded-2xl bg-[#0a0b10] border border-[#1f222e] max-h-72">
                {chatLog.map((c, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${c.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-xs sm:max-w-sm p-3 rounded-2xl text-xs ${
                        c.sender === 'user'
                          ? 'bg-[#00BFFF] text-black font-medium'
                          : 'bg-[#181a24] text-white border border-[#2b2e3c]'
                      }`}
                    >
                      {c.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendChat} className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={`Send query to ${launchedApp.name}...`}
                  className="flex-1 bg-[#141520] border border-[#262836] focus:border-[#00BFFF] rounded-xl px-3 py-2.5 text-xs text-white outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-[#00BFFF] hover:bg-[#38bdf8] text-black font-bold text-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Query</span>
                </button>
              </form>
            </div>
          ) : (
            /* Audio / Entertainment Sandbox */
            <div className="flex-1 flex flex-col justify-between items-center text-center space-y-6">
              <div className="w-36 h-36 rounded-3xl overflow-hidden border-2 border-[#00BFFF]/50 shadow-[0_0_35px_rgba(0,191,255,0.4)] mt-4">
                <img src={launchedApp.iconUrl} alt="Album Art" className="w-full h-full object-cover" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white font-['Space_Grotesk']">{launchedApp.name}</h3>
                <p className="text-xs text-[#00BFFF] font-mono mt-0.5">384kHz 32-bit Lossless Studio Stream</p>
              </div>

              {/* Equalizer Frequency Bars */}
              <div className="flex items-end gap-1.5 h-16">
                {[40, 75, 55, 90, 65, 80, 45, 95, 70, 85, 60, 90, 50, 75].map((h, i) => (
                  <div
                    key={i}
                    className="w-2 rounded-full bg-gradient-to-t from-[#00BFFF] to-[#38bdf8] transition-all duration-300"
                    style={{ height: isPlayingAudio ? `${h}%` : '15%' }}
                  />
                ))}
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="w-14 h-14 rounded-full bg-[#00BFFF] hover:bg-[#38bdf8] text-black flex items-center justify-center shadow-[0_0_20px_rgba(0,191,255,0.6)]"
                >
                  {isPlayingAudio ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#10121a] border-t border-[#1f2229] flex items-center justify-between text-[11px] text-gray-500">
          <span>AR-STORE Sandbox Environment v2.0</span>
          <button
            onClick={() => setLaunchedApp(null)}
            className="text-[#00BFFF] hover:underline"
          >
            Exit to Store
          </button>
        </div>

      </motion.div>
    </div>
  );
};
