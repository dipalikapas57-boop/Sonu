import React, { useMemo } from 'react';
import { LiveState, SumoEmotion } from '../types';
import { Mic, Power, Volume2, Radio, Brain, Flame, Sparkles } from 'lucide-react';

interface VisualizerCoreProps {
  state: LiveState;
  emotion: SumoEmotion;
  micVolume: number;
  isMuted: boolean;
  onTogglePower: () => void;
}

export const VisualizerCore: React.FC<VisualizerCoreProps> = ({
  state,
  emotion,
  micVolume,
  isMuted,
  onTogglePower,
}) => {
  const dynamicScale = useMemo(() => {
    if (state === 'listening') {
      const boost = Math.min(1.35, 1 + micVolume * 2.8);
      return boost;
    }
    if (state === 'speaking') {
      return 1.15;
    }
    if (state === 'thinking') {
      return 1.08;
    }
    return 1;
  }, [state, micVolume]);

  const emotionGlowColor = useMemo(() => {
    switch (emotion) {
      case 'loyal':
        return 'from-red-600 via-emerald-600 to-rose-700';
      case 'witty':
        return 'from-emerald-500 via-teal-500 to-red-600';
      case 'serious':
      case 'focused':
        return 'from-red-700 via-red-600 to-emerald-700';
      case 'empathetic':
        return 'from-emerald-600 via-rose-600 to-cyan-600';
      case 'clarifying':
        return 'from-red-600 via-emerald-500 to-amber-600';
      default:
        return 'from-red-600 via-emerald-600 to-cyan-600';
    }
  }, [emotion]);

  return (
    <div className="relative flex flex-col items-center justify-center my-auto select-none">
      {/* Outer ambient RGB / Red-Green glow field */}
      <div
        className={`absolute -inset-16 rounded-full blur-3xl transition-all duration-700 pointer-events-none ${
          state === 'speaking'
            ? 'bg-gradient-to-r from-red-600 via-emerald-600 to-cyan-600 opacity-75 scale-135'
            : state === 'listening'
            ? 'bg-gradient-to-r from-red-600 via-emerald-500 to-red-500 opacity-70 scale-120'
            : state === 'thinking'
            ? 'bg-gradient-to-r from-emerald-900 via-red-950 to-cyan-900 opacity-65 scale-115'
            : state === 'connecting'
            ? 'bg-red-600 opacity-55 scale-100'
            : 'bg-gradient-to-tr from-red-950/40 via-emerald-950/30 to-black opacity-40 scale-90'
        }`}
      />

      {/* Ripple Wave effects during speaking & listening in Red & Green Matrix theme */}
      {(state === 'speaking' || (state === 'listening' && micVolume > 0.04)) && (
        <>
          <div
            className="absolute w-72 h-72 rounded-full border border-red-500/60 animate-ripple pointer-events-none shadow-[0_0_25px_rgba(239,68,68,0.5)]"
          />
          <div
            className="absolute w-80 h-80 rounded-full border border-emerald-400/50 animate-ripple [animation-delay:1.1s] pointer-events-none shadow-[0_0_25px_rgba(16,185,129,0.4)]"
          />
        </>
      )}

      {/* Outer rotating cyber hacker rings with RGB Red-Green chromatic edges */}
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
        {/* Red & Green Crosshair HUD corner brackets */}
        <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-red-500/80 pointer-events-none shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
        <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-emerald-400/80 pointer-events-none shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
        <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-emerald-400/80 pointer-events-none shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
        <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-red-500/80 pointer-events-none shadow-[0_0_8px_rgba(239,68,68,0.5)]" />

        {/* Ring 1 - Outermost dashed orbit (Red & Green alternating segments) */}
        <div
          className={`absolute inset-0 rounded-full border border-dashed transition-all duration-1000 ${
            state === 'connecting'
              ? 'border-emerald-400 animate-spin-fast shadow-[0_0_15px_rgba(16,185,129,0.4)]'
              : state === 'speaking'
              ? 'border-red-500/70 animate-spin-slow shadow-[0_0_25px_rgba(239,68,68,0.5)]'
              : state === 'listening'
              ? 'border-emerald-500/70 animate-spin-slow shadow-[0_0_20px_rgba(16,185,129,0.4)]'
              : state === 'thinking'
              ? 'border-cyan-400 animate-spin-fast'
              : 'border-red-900/50'
          }`}
          style={{ borderSpacing: '8px' }}
        />

        {/* Ring 2 - Segmented counter-rotating RGB ring */}
        <div
          className={`absolute inset-4 rounded-full border border-t-2 border-b-2 transition-all duration-1000 ${
            state === 'speaking'
              ? 'border-emerald-500/60 border-t-red-500 border-b-cyan-400 animate-spin-reverse'
              : state === 'listening'
              ? 'border-red-600/60 border-t-emerald-400 border-b-red-400 animate-spin-reverse'
              : state === 'thinking'
              ? 'border-cyan-500/60 border-t-emerald-400 border-b-red-400 animate-spin-fast'
              : state === 'connecting'
              ? 'border-red-500/70 border-t-emerald-400 animate-spin-fast'
              : 'border-red-950/70'
          }`}
        />

        {/* Ring 3 - Glowing particle accents */}
        <div
          className={`absolute inset-8 rounded-full border transition-all duration-700 ${
            state === 'speaking'
              ? 'border-red-500/60 shadow-[0_0_25px_rgba(239,68,68,0.6)]'
              : state === 'listening'
              ? 'border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
              : state === 'thinking'
              ? 'border-cyan-400/40 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
              : 'border-transparent'
          }`}
        />

        {/* Core Button / Interactive Red-Green RGB Reactor */}
        <button
          onClick={onTogglePower}
          type="button"
          aria-label={state === 'disconnected' ? 'SUMO জাগ্রত করুন' : 'ডিসকানেক্ট'}
          style={{ transform: `scale(${dynamicScale})` }}
          className="relative z-10 w-44 h-44 sm:w-52 sm:h-52 rounded-full flex flex-col items-center justify-center cursor-pointer transition-transform duration-200 outline-none focus:outline-none group active:scale-95"
        >
          {/* Internal Plasma Glow in Red-Green RGB Matrix */}
          <div
            className={`absolute inset-0 rounded-full transition-all duration-700 bg-gradient-to-tr ${
              state === 'disconnected'
                ? 'from-red-950 via-black to-emerald-950 border border-red-800/60 group-hover:border-emerald-500/80 shadow-[0_0_35px_rgba(220,38,38,0.3)]'
                : state === 'connecting'
                ? 'from-red-900 via-emerald-950 to-red-600 animate-pulse border-2 border-emerald-400 neon-glow-rgb'
                : state === 'speaking'
                ? `${emotionGlowColor} opacity-95 animate-pulse-glow neon-glow-rgb border-2 border-white`
                : state === 'thinking'
                ? 'from-emerald-950 via-black to-red-900 animate-pulse border-2 border-cyan-400 neon-glow-matrix-green'
                : 'from-red-600 via-rose-700 to-emerald-600 opacity-95 border-2 border-emerald-400 neon-glow-rgb'
            }`}
          />

          {/* Internal Cyber Grid & Target Crosshair Overlay */}
          <div className="absolute inset-2 rounded-full overflow-hidden opacity-45 pointer-events-none">
            <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,102,0.4)_0%,transparent_70%)]" />
            <div className="absolute inset-0 hacker-grid opacity-60" />
          </div>

          {/* Center Icon & Status Feedback */}
          <div className="relative z-20 flex flex-col items-center text-center px-4">
            {state === 'disconnected' ? (
              <>
                <div className="w-14 h-14 rounded-full bg-red-600/20 border border-red-500/50 flex items-center justify-center text-red-400 group-hover:text-emerald-300 group-hover:scale-110 transition-all duration-300 mb-2 shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                  <Power className="w-7 h-7" />
                </div>
                <span className="text-xs uppercase tracking-widest font-bold text-red-100 group-hover:text-emerald-300 font-cyber">
                  &quot;SUMO&quot; বলুন
                </span>
                <span className="text-[10px] text-emerald-400/90 mt-0.5 font-mono">
                  [SYSTEM ONLINE]
                </span>
              </>
            ) : state === 'connecting' ? (
              <>
                <div className="w-14 h-14 rounded-full bg-emerald-500/30 border border-emerald-400 flex items-center justify-center text-emerald-200 animate-spin mb-2 shadow-[0_0_25px_rgba(16,185,129,0.6)]">
                  <Radio className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold tracking-widest uppercase text-white font-cyber">
                  কানেক্টিং
                </span>
                <span className="text-[10px] text-emerald-300 mt-0.5 font-mono">
                  [SYNCING RGB CORE...]
                </span>
              </>
            ) : state === 'speaking' ? (
              <>
                <div className="w-16 h-16 rounded-full bg-white/25 backdrop-blur-md border border-white/70 flex items-center justify-center text-white mb-2 shadow-inner">
                  <Volume2 className="w-8 h-8 animate-pulse text-white drop-shadow" />
                </div>
                <span className="text-xs font-black tracking-widest uppercase text-white font-cyber drop-shadow">
                  সুমো এআই
                </span>
                <span className="text-[10px] font-medium text-emerald-100 mt-0.5 font-mono">
                  [TRANSMITTING...]
                </span>
              </>
            ) : state === 'thinking' ? (
              <>
                <div className="w-16 h-16 rounded-full bg-emerald-500/25 border border-emerald-400 flex items-center justify-center text-emerald-200 mb-2 animate-bounce shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                  <Brain className="w-8 h-8" />
                </div>
                <span className="text-xs font-bold tracking-widest uppercase text-emerald-100 font-cyber">
                  থিংকিং মোড
                </span>
                <span className="text-[10px] text-emerald-300 mt-0.5 font-mono">
                  [PROCESSING...]
                </span>
              </>
            ) : (
              // Listening state
              <>
                <div className="w-16 h-16 rounded-full bg-black/80 border-2 border-emerald-400 flex items-center justify-center text-white mb-2 shadow-[0_0_30px_rgba(16,185,129,0.6)]">
                  <Mic
                    className={`w-8 h-8 transition-transform duration-150 ${
                      micVolume > 0.05 ? 'scale-125 text-emerald-300' : 'scale-100 text-red-400'
                    }`}
                  />
                </div>
                <span className="text-xs font-bold tracking-widest uppercase text-white font-cyber drop-shadow">
                  জি গুরু, বলুন
                </span>
                <span className="text-[10px] text-emerald-300 mt-0.5 font-mono">
                  {isMuted ? '[MIC MUTED]' : '[LISTENING TO GURU]'}
                </span>
              </>
            )}
          </div>
        </button>
      </div>

      {/* State prompt feedback text in Red & Green Matrix theme */}
      <div className="mt-7 text-center px-4 max-w-sm">
        {state === 'disconnected' && (
          <p className="text-xs text-red-200/80 font-mono">
            ট্যাপ করুন অথবা বলুন <span className="text-emerald-400 font-bold">&quot;SUMO&quot;</span>
          </p>
        )}
        {state === 'connecting' && (
          <p className="text-xs text-emerald-400 font-medium animate-pulse font-mono">
            &gt; আরজিবি রেড-গ্রীন হ্যাকিং কোরে সংযোগ স্থাপন হচ্ছে...
          </p>
        )}
        {state === 'listening' && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/85 border border-emerald-500/60 text-emerald-300 text-xs shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono">জি গুরু, শুনছি — আদেশ দিন</span>
          </div>
        )}
        {state === 'speaking' && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/85 border border-red-500/60 text-red-200 text-xs shadow-[0_0_25px_rgba(239,68,68,0.4)]">
            <Flame className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            <span className="font-mono">যেকোনো সময় কথা বলে ইন্টারাপ্ট করতে পারেন</span>
          </div>
        )}
        {state === 'thinking' && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/85 border border-cyan-500/60 text-cyan-300 text-xs shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <Brain className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="font-mono">&gt; ব্রেইন রিজনিং সম্পন্ন হচ্ছে...</span>
          </div>
        )}
      </div>
    </div>
  );
};
