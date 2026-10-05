import React from 'react';
import { LiveState, SumoEmotion, VoiceOption } from '../types';
import { Sparkles, Bell, Radio, Mic, MicOff, Globe, Terminal } from 'lucide-react';

interface SumoHeaderProps {
  state: LiveState;
  emotion: SumoEmotion;
  voice: VoiceOption;
  isMuted: boolean;
  userLanguage: 'bn' | 'en' | 'auto';
  wakeWordActive: boolean;
  unreadNotifications: number;
  matrixRainActive?: boolean;
  onToggleMatrixRain?: () => void;
  onToggleMute: () => void;
  onToggleWakeWord: () => void;
  onToggleLanguage: () => void;
  onOpenNotifications: () => void;
  onOpenGuruSettings: () => void;
}

export const SumoHeader: React.FC<SumoHeaderProps> = ({
  state,
  emotion,
  isMuted,
  userLanguage,
  wakeWordActive,
  unreadNotifications,
  matrixRainActive = true,
  onToggleMatrixRain,
  onToggleMute,
  onToggleWakeWord,
  onToggleLanguage,
  onOpenNotifications,
  onOpenGuruSettings,
}) => {
  const getEmotionBadge = (em: SumoEmotion) => {
    switch (em) {
      case 'loyal':
        return { text: 'অনুগত (Loyal)', emoji: '🫡', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'witty':
        return { text: 'রসিক (Witty)', emoji: '😄', bg: 'bg-pink-500/20 text-pink-300 border-pink-500/30' };
      case 'serious':
      case 'focused':
        return { text: 'সিরিয়াস (Focused)', emoji: '🎯', bg: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
      case 'empathetic':
        return { text: 'সহানুভূতি (Care)', emoji: '❤️', bg: 'bg-teal-500/20 text-teal-300 border-teal-500/30' };
      case 'clarifying':
        return { text: 'যাচাইকরণ (Clarify)', emoji: '🔍', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'explaining':
        return { text: 'সহজ ব্যাখ্যা (Steps)', emoji: '🧩', bg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' };
      case 'advising':
        return { text: 'পরামর্শক (Advice)', emoji: '💡', bg: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' };
      case 'smart':
        return { text: 'ইন্টেলিজেন্ট', emoji: '🧠', bg: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
      case 'thinking':
        return { text: 'ভাবছে...', emoji: '💭', bg: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
      default:
        return { text: 'প্রস্তুত (Ready)', emoji: '✨', bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' };
    }
  };

  const badge = getEmotionBadge(emotion);

  return (
    <header className="w-full flex items-center justify-between px-3 sm:px-6 py-3.5 z-40 select-none border-b border-red-950/80 bg-black/80 backdrop-blur-xl">
      {/* Brand Identity */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenGuruSettings}
          className="flex items-center gap-2 group text-left cursor-pointer focus:outline-none"
        >
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 via-emerald-500 to-cyan-500 p-[1.5px] shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-cyber font-bold text-base sm:text-lg tracking-tight rgb-text-gradient">
                সুমো এআই
              </span>
              <span className="text-[10px] font-cyber px-1.5 py-0.2 rounded bg-gradient-to-r from-red-600/30 to-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-bold uppercase tracking-wider shadow-[0_0_12px_rgba(16,185,129,0.3)] font-mono">
                RGB MATRIX
              </span>
            </div>
            <p className="text-[10px] text-red-400/80 -mt-0.5 hidden sm:block font-mono">
              [RED-GREEN CYBERNETIC GURU CORE]
            </p>
          </div>
        </button>
      </div>

      {/* Center Status & Emotion */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {state !== 'disconnected' && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-red-950/60 border border-red-900/80 text-[10px] sm:text-[11px] backdrop-blur-md">
            <span
              className={`w-2 h-2 rounded-full ${
                state === 'speaking'
                  ? 'bg-red-400 animate-ping'
                  : state === 'listening'
                  ? 'bg-rose-500 animate-pulse'
                  : state === 'thinking'
                  ? 'bg-amber-400 animate-bounce'
                  : 'bg-red-500 animate-spin'
              }`}
            />
            <span className="text-red-200 font-cyber font-medium capitalize">
              {state === 'listening'
                ? 'লিসনিং'
                : state === 'speaking'
                ? 'স্পিকিং'
                : state === 'thinking'
                ? 'থিংকিং'
                : state}
            </span>
          </div>
        )}

        <div
          className={`flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border text-[10px] sm:text-[11px] font-medium backdrop-blur-md transition-all duration-300 ${badge.bg}`}
        >
          <span>{badge.emoji}</span>
          <span className="font-cyber">{badge.text}</span>
        </div>
      </div>

      {/* Right Action Icons */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Matrix Rain Dropping Toggle */}
        {onToggleMatrixRain && (
          <button
            onClick={onToggleMatrixRain}
            className={`p-2 rounded-lg border text-xs transition-all ${
              matrixRainActive
                ? 'bg-emerald-600/20 border-emerald-500/60 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                : 'bg-black/60 border-red-950/60 text-slate-500 hover:text-slate-300'
            }`}
            title={matrixRainActive ? 'রেড-গ্রীন হ্যাকিং রেইন সক্রিয়' : 'রেড-গ্রীন হ্যাকিং রেইন বন্ধ'}
          >
            <Terminal className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Language Switcher */}
        <button
          onClick={onToggleLanguage}
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-red-950/40 border border-red-900/60 hover:border-red-500/50 text-xs font-cyber text-red-200 transition-colors"
          title="ভাষা পরিবর্তন (Language)"
        >
          <Globe className="w-3.5 h-3.5 text-red-400" />
          <span className="text-[11px] font-bold font-mono">
            {userLanguage === 'bn' ? 'বাংলা' : userLanguage === 'en' ? 'EN' : 'AUTO'}
          </span>
        </button>

        {/* Wake Word Toggle (V3) */}
        <button
          onClick={onToggleWakeWord}
          className={`px-2 py-1.5 rounded-lg border text-xs font-cyber flex items-center gap-1 transition-all ${
            wakeWordActive
              ? 'bg-red-600/20 border-red-500/50 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.25)]'
              : 'bg-slate-950/80 border-red-950/60 text-slate-500 hover:text-slate-300'
          }`}
          title={wakeWordActive ? 'ওয়েক ওয়ার্ড সক্রিয় ("SUMO")' : 'ওয়েক ওয়ার্ড নিষ্ক্রিয়'}
        >
          <Radio className="w-3.5 h-3.5 text-red-400" />
          <span className="text-[10px] hidden sm:inline font-mono">SUMO WAKE</span>
        </button>

        {/* Notification Bell (V5) */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-lg bg-red-950/40 border border-red-900/60 text-red-300 hover:text-white hover:border-red-500/50 transition-colors"
          title="নোটিফিকেশন ড্রয়ার"
        >
          <Bell className="w-4 h-4 text-red-400" />
          {unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white font-cyber text-[9px] font-bold flex items-center justify-center animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]">
              {unreadNotifications}
            </span>
          )}
        </button>

        {/* Mic Mute Toggle */}
        <button
          onClick={onToggleMute}
          disabled={state === 'disconnected'}
          className={`p-2 rounded-lg border text-xs transition-all ${
            isMuted
              ? 'bg-red-600/30 border-red-500 text-red-300'
              : 'bg-red-950/40 border-red-900/60 text-red-300 hover:text-white hover:border-red-500/50'
          } ${state === 'disconnected' ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
          title={isMuted ? 'আনমিউট' : 'মিউট'}
        >
          {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
