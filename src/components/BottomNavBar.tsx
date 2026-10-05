import React from 'react';
import { SumoAppTab } from '../types';
import { Mic, Smartphone, Brain, Zap, Map, Sparkles } from 'lucide-react';

interface BottomNavBarProps {
  activeTab: SumoAppTab;
  onSelectTab: (tab: SumoAppTab) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const tabs = [
    { id: 'voice' as SumoAppTab, label: 'ভয়েস', icon: <Mic className="w-4 h-4" /> },
    { id: 'brain' as SumoAppTab, label: 'ব্রেইন', icon: <Brain className="w-4 h-4" /> },
    { id: 'android' as SumoAppTab, label: 'অ্যান্ড্রয়েড', icon: <Smartphone className="w-4 h-4" /> },
    { id: 'memory' as SumoAppTab, label: 'মেমোরি', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'commands' as SumoAppTab, label: 'কমান্ডস', icon: <Zap className="w-4 h-4" /> },
    { id: 'roadmap' as SumoAppTab, label: 'রোডম্যাপ', icon: <Map className="w-4 h-4" /> },
  ];

  return (
    <nav className="w-full max-w-md mx-auto px-4 pb-3 pt-1 z-40 select-none">
      <div className="flex items-center justify-around p-1.5 rounded-3xl bg-black/90 border border-red-950/80 shadow-2xl backdrop-blur-xl shadow-red-950/40">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-tr from-red-600 via-emerald-600 to-cyan-600 text-white font-bold shadow-lg shadow-emerald-500/30 border border-emerald-400/50'
                  : 'text-slate-400 hover:text-emerald-300'
              }`}
            >
              {tab.icon}
              <span className="text-[10px] font-cyber mt-0.5">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
