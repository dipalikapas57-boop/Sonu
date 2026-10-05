import React, { useEffect, useState } from 'react';
import { ExternalLink, Compass, Clock, CheckCircle2, X, Sparkles } from 'lucide-react';
import { WebActionCard, ActiveTimer } from '../types';

interface ActionHUDCardProps {
  webCards: WebActionCard[];
  timers: ActiveTimer[];
  onDismissWebCard: (id: string) => void;
  onDismissTimer: (id: string) => void;
  onPreviewUrl: (url: string, title: string) => void;
}

export const ActionHUDCard: React.FC<ActionHUDCardProps> = ({
  webCards,
  timers,
  onDismissWebCard,
  onDismissTimer,
  onPreviewUrl,
}) => {
  const [, setTick] = useState(0);
  useEffect(() => {
    if (timers.length === 0) return;
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timers.length]);

  if (webCards.length === 0 && timers.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-24 sm:bottom-28 left-4 right-4 max-w-md mx-auto z-40 flex flex-col gap-2.5 pointer-events-none">
      {/* Timers list */}
      {timers.map((timer) => {
        const remaining = Math.max(0, Math.round((timer.endTime - Date.now()) / 1000));
        const isDone = remaining === 0;
        const progress = Math.max(0, Math.min(100, (remaining / timer.durationSeconds) * 100));

        return (
          <div
            key={timer.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-2xl border backdrop-blur-xl transition-all duration-300 shadow-xl ${
              isDone
                ? 'bg-red-950/90 border-red-500 text-red-200 shadow-red-600/30'
                : 'bg-black/90 border-red-500/60 text-red-100 shadow-red-950/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                  isDone
                    ? 'bg-red-600/30 border-red-400 text-red-300 animate-bounce'
                    : 'bg-red-600/20 border-red-500/50 text-red-300'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-5 h-5 text-red-400" /> : <Clock className="w-5 h-5 text-red-400 animate-pulse" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-cyber font-bold tracking-wide">
                    {timer.label || 'Timer'}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-600/20 text-red-300 font-mono border border-red-500/30">
                    {isDone ? 'COMPLETED' : `${remaining}s left`}
                  </span>
                </div>
                <div className="w-32 bg-red-950 h-1.5 rounded-full overflow-hidden mt-1.5 border border-red-900/60">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 to-rose-500 transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => onDismissTimer(timer.id)}
              className="p-1.5 rounded-lg text-red-400/60 hover:text-white hover:bg-red-900/40 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}

      {/* Web Action Cards */}
      {webCards.map((card) => (
        <div
          key={card.id}
          className="pointer-events-auto p-4 rounded-2xl bg-black/95 border border-red-500/70 shadow-2xl shadow-red-950/50 backdrop-blur-xl animate-in slide-in-from-bottom-3 duration-300"
        >
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
                <Compass className="w-4 h-4 animate-spin-slow" />
              </div>
              <div>
                <span className="text-[10px] font-cyber uppercase tracking-wider text-red-400 block font-mono">
                  [LIVE ACTION TRIGGER]
                </span>
                <h4 className="text-xs font-cyber font-bold text-white leading-tight truncate max-w-[220px]">
                  {card.title}
                </h4>
              </div>
            </div>
            <button
              onClick={() => onDismissWebCard(card.id)}
              className="p-1 rounded-md text-red-400/60 hover:text-white hover:bg-red-900/40 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {card.reason && (
            <p className="text-[11px] text-red-300/80 mb-3 leading-snug font-mono">
              &gt; {card.reason}
            </p>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPreviewUrl(card.url, card.title)}
              className="flex-1 py-1.5 px-3 rounded-xl bg-red-950/60 hover:bg-red-900/60 border border-red-900 text-red-200 text-xs font-cyber font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>ইন-অ্যাপ প্রিভিউ</span>
            </button>
            <a
              href={card.url}
              target="_blank"
              rel="noopener noreferrer"
              className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-cyber font-bold flex items-center justify-center gap-1 transition-colors shadow-md shadow-red-600/30 border border-red-400/40"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>ওপেন</span>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};
