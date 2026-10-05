import React from 'react';
import { Sparkles } from 'lucide-react';

interface InspirationChipsProps {
  onSelectPrompt: (prompt: string) => void;
  disabled: boolean;
}

const SUMO_PROMPTS = [
  { text: "SUMO", tag: "ওয়েক কল", en: "Wake Sumo" },
  { text: "ইউটিউবে বাংলা গান চালাও", tag: "অ্যান্ড্রয়েড", en: "Open YouTube" },
  { text: "আম্মুকে কল দাও", tag: "কল ওয়ার্কফ্লো", en: "Call Ammu" },
  { text: "আজকের তাজা খবর ও ক্রিকেট স্কোর কী?", tag: "ওয়েব সার্চ", en: "News & Scores" },
  { text: "মনে রাখো আমার প্রিয় খাবার বিরিয়ানি", tag: "মেমোরি", en: "Remember fact" },
  { text: "২৫ মিনিটের একটি ফোকাস টাইমার দাও", tag: "টাইমার", en: "Set Timer" },
  { text: "সুমো, তোমার আসল ক্ষমতা কী?", tag: "ব্রেইন", en: "Brain capabilities" },
];

export const InspirationChips: React.FC<InspirationChipsProps> = ({
  onSelectPrompt,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto px-4 z-20 select-none pb-2">
      <div className="flex items-center gap-1.5 text-[11px] font-cyber text-red-400 mb-1.5 px-1 font-mono">
        <Sparkles className="w-3 h-3 text-red-500 animate-pulse" />
        <span>&gt; ভয়েস প্রম্পট কমান্ডস (VOICE INSTRUCTIONS):</span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
        {SUMO_PROMPTS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPrompt(p.text)}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-950/40 hover:bg-red-900/40 border border-red-900/60 hover:border-red-500/60 text-xs text-red-200 hover:text-white transition-all duration-200 group active:scale-95 cursor-pointer shadow-[0_0_10px_rgba(239,68,68,0.15)]"
            title={`বলুন: "${p.text}"`}
          >
            <span className="text-[9px] font-cyber px-1.5 py-0.2 rounded bg-red-600/20 text-red-400 border border-red-500/30 group-hover:bg-red-600/30 uppercase font-semibold font-mono">
              {p.tag}
            </span>
            <span className="truncate max-w-[220px] font-medium">{p.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
