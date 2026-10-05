import React, { useState } from 'react';
import { Crown, ShieldCheck, ShieldAlert, Mic, UserCheck, UserX, Sparkles, Volume2 } from 'lucide-react';

interface GuruVoiceprintGuardProps {
  isGuruVoiceVerified: boolean;
  onToggleVoiceMode: (isGuru: boolean) => void;
  onSimulateCallSumo: () => void;
}

export const GuruVoiceprintGuard: React.FC<GuruVoiceprintGuardProps> = ({
  isGuruVoiceVerified,
  onToggleVoiceMode,
  onSimulateCallSumo,
}) => {
  const [showTester, setShowTester] = useState(false);

  return (
    <div className="w-full max-w-xl mx-auto px-4 z-20 select-none pb-2">
      {/* Main Guard Card */}
      <div className={`p-3.5 rounded-3xl border transition-all duration-300 backdrop-blur-xl ${
        isGuruVoiceVerified
          ? 'bg-black/85 border-red-500/50 shadow-lg shadow-red-600/20'
          : 'bg-red-950/60 border-red-500 shadow-xl shadow-red-600/30'
      }`}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center border ${
              isGuruVoiceVerified
                ? 'bg-gradient-to-tr from-red-600/30 to-amber-600/30 border-red-500/60 text-red-300'
                : 'bg-red-600/30 border-red-500 text-red-200'
            }`}>
              {isGuruVoiceVerified ? (
                <Crown className="w-4 h-4 text-red-400 animate-pulse" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-red-400 animate-bounce" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-cyber font-bold text-white flex items-center gap-1">
                  {isGuruVoiceVerified ? '👑 গুরুর কণ্ঠ স্বীকৃত' : '⚠️ অননুমোদিত কণ্ঠ'}
                </span>
                <span className={`text-[9px] font-cyber px-1.5 py-0.2 rounded font-semibold uppercase tracking-wider font-mono ${
                  isGuruVoiceVerified
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                    : 'bg-red-600/30 text-white border border-red-500'
                }`}>
                  {isGuruVoiceVerified ? 'GURU AUTH' : 'SEC LOCKED'}
                </span>
              </div>
              <p className="text-[10px] text-red-300/70 mt-0.5 font-mono">
                {isGuruVoiceVerified
                  ? 'SUMO ডাকলে বলবে: "জি গুরু, বলুন।"'
                  : 'অন্য কেউ ডাকলে সুমো সম্পূর্ণ নীরব থাকবে / কাজ করবে না।'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Test Call SUMO Button */}
            <button
              onClick={onSimulateCallSumo}
              className={`px-3 py-1.5 rounded-xl font-cyber text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer ${
                isGuruVoiceVerified
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-red-600/40 border border-red-400/50'
                  : 'bg-red-700/80 hover:bg-red-700 text-white shadow-red-700/40 border border-red-500'
              }`}
              title='মুখে বলুন বা ট্যাপ করুন "SUMO"'
            >
              <Volume2 className="w-3.5 h-3.5 text-white" />
              <span className="font-mono">&quot;SUMO&quot;</span>
            </button>

            {/* Switch Voice Simulation */}
            <button
              onClick={() => onToggleVoiceMode(!isGuruVoiceVerified)}
              className="p-1.5 rounded-xl bg-red-950/60 hover:bg-red-900/60 text-red-300 hover:text-white text-[11px] font-cyber border border-red-900/80 transition-colors"
              title="কণ্ঠ সুইচ করুন (গুরুর কণ্ঠ বনাম অন্য ব্যক্তি)"
            >
              {isGuruVoiceVerified ? (
                <UserCheck className="w-4 h-4 text-emerald-400" />
              ) : (
                <UserX className="w-4 h-4 text-red-400" />
              )}
            </button>
          </div>
        </div>

        {/* Security Alert if Unauthorized */}
        {!isGuruVoiceVerified && (
          <div className="mt-2.5 p-2 rounded-xl bg-red-950/90 border border-red-500 text-[11px] text-red-100 flex items-center gap-2 animate-in slide-in-from-top-1 font-mono">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 animate-pulse" />
            <span>
              [ALERT] অননুমোদিত কণ্ঠ শনাক্ত! সুমো লকড। গুরুর কণ্ঠে সুইচ করতে পাশের আইকনে ট্যাপ করুন।
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
