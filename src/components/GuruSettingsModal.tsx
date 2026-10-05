import React from 'react';
import { X, Crown, Globe, Radio, Volume2, Shield } from 'lucide-react';
import { VoiceOption } from '../types';

interface GuruSettingsModalProps {
  isOpen: boolean;
  guruName: string;
  honorificMode: 'respectful' | 'casual' | 'professional';
  userLanguage: 'bn' | 'en' | 'auto';
  voice: VoiceOption;
  wakeWordActive: boolean;
  onClose: () => void;
  onUpdateGuruName: (name: string) => void;
  onUpdateHonorific: (mode: 'respectful' | 'casual' | 'professional') => void;
  onUpdateLanguage: (lang: 'bn' | 'en' | 'auto') => void;
  onUpdateVoice: (voice: VoiceOption) => void;
  onToggleWakeWord: () => void;
}

export const GuruSettingsModal: React.FC<GuruSettingsModalProps> = ({
  isOpen,
  guruName,
  honorificMode,
  userLanguage,
  voice,
  wakeWordActive,
  onClose,
  onUpdateGuruName,
  onUpdateHonorific,
  onUpdateLanguage,
  onUpdateVoice,
  onToggleWakeWord,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-black/95 border border-red-900/80 rounded-3xl p-5 shadow-2xl shadow-red-950/50 space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-red-950">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center border border-red-500/40 shadow-[0_0_12px_rgba(239,68,68,0.3)]">
              <Crown className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-sm font-cyber font-bold text-white">ওনার / গুরু সেটিংস (V7)</h3>
              <p className="text-[10px] text-red-300/70 font-mono">[GURU PROFILE OVERRIDE]</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-red-400 hover:text-white hover:bg-red-900/40 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Guru Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-cyber text-red-200">
            সুমো আপনাকে কী নামে ডাকবে?
          </label>
          <input
            type="text"
            value={guruName}
            onChange={(e) => onUpdateGuruName(e.target.value)}
            placeholder="যেমন: গুরু, স্যার, বস"
            className="w-full px-3 py-2 rounded-xl bg-black border border-red-900/60 text-xs text-white placeholder-red-400/40 focus:outline-none focus:border-red-500 font-mono"
          />
        </div>

        {/* Honorific Tone */}
        <div className="space-y-1.5">
          <label className="text-xs font-cyber text-red-200">
            কথা বলার ভঙ্গি (Tone)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'respectful', label: 'শ্রদ্ধাশীল' },
              { id: 'casual', label: 'বন্ধুসুলভ' },
              { id: 'professional', label: 'স্মার্ট ও প্রফেশনাল' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => onUpdateHonorific(t.id as any)}
                className={`py-2 px-2 rounded-xl text-xs font-cyber border transition-all text-center ${
                  honorificMode === t.id
                    ? 'bg-red-600/30 border-red-500 text-red-200 font-bold shadow-[0_0_10px_rgba(239,68,68,0.25)]'
                    : 'bg-black border-red-950 text-red-400/60 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Language Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-cyber text-red-200 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-red-400" />
            <span>প্রধান ভাষা</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'bn', label: 'বাংলা (Bengali)' },
              { id: 'en', label: 'English' },
              { id: 'auto', label: 'স্বয়ংক্রিয় (Auto)' },
            ].map((l) => (
              <button
                key={l.id}
                onClick={() => onUpdateLanguage(l.id as any)}
                className={`py-2 px-2 rounded-xl text-xs font-cyber border transition-all text-center font-mono ${
                  userLanguage === l.id
                    ? 'bg-red-600/30 border-red-500 text-red-200 font-bold shadow-[0_0_10px_rgba(239,68,68,0.25)]'
                    : 'bg-black border-red-950 text-red-400/60 hover:text-white'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Voice Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-cyber text-red-200 flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-red-400" />
            <span>ভয়েস মডেল (Gemini Live)</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['Aoede', 'Kore', 'Puck', 'Zephyr'] as VoiceOption[]).map((v) => (
              <button
                key={v}
                onClick={() => onUpdateVoice(v)}
                className={`py-2 px-3 rounded-xl text-xs font-cyber border transition-all text-left flex items-center justify-between ${
                  voice === v
                    ? 'bg-red-600/30 border-red-500 text-red-200 font-bold shadow-[0_0_10px_rgba(239,68,68,0.25)]'
                    : 'bg-black border-red-950 text-red-400/60 hover:text-white'
                }`}
              >
                <span className="font-mono">{v}</span>
                <span className="text-[10px] text-red-400/60">
                  {v === 'Aoede' ? 'স্মার্ট ও প্রাণবন্ত' : v === 'Kore' ? 'শান্ত ও গম্ভীর' : v === 'Puck' ? 'উৎফুল্ল' : 'মৃদু'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Wake Word Switch */}
        <div className="p-3 rounded-2xl bg-black border border-red-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-red-400" />
            <div>
              <h4 className="text-xs font-cyber font-bold text-white">ওয়েক ওয়ার্ড ডিটেকশন (V3)</h4>
              <p className="text-[10px] text-red-300/70 font-mono">&quot;SUMO&quot; শুনলেই ওয়েক আপ করবে</p>
            </div>
          </div>
          <button
            onClick={onToggleWakeWord}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
              wakeWordActive ? 'bg-red-600 shadow-[0_0_10px_rgba(239,68,68,0.6)]' : 'bg-red-950'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                wakeWordActive ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-cyber text-xs font-bold transition-colors shadow-lg shadow-red-600/40 border border-red-400/50 cursor-pointer"
        >
          সেটিংস সংরক্ষণ করুন
        </button>
      </div>
    </div>
  );
};
