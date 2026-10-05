import React, { useState } from 'react';
import { 
  Brain, 
  MessageSquareQuote, 
  Crown, 
  Smile, 
  Search, 
  Lightbulb, 
  Layers, 
  Target, 
  Sparkles, 
  ChevronRight,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { CognitiveInsight, SumoEmotion } from '../types';

interface IntelligentCognitiveLabProps {
  currentInsight: CognitiveInsight | null;
  onRunTestPrompt: (prompt: string, tone: SumoEmotion, pillar: string) => void;
}

const SUPERPOWERS = [
  {
    id: 'context',
    icon: <Brain className="w-4 h-4 text-purple-400" />,
    name: 'কনটেক্সট অনুধাবন',
    nameEn: 'Context Reasoning',
    desc: 'কথার গভীরে গিয়ে উদ্দেশ্য ও বর্তমান মানসিক অবস্থা বোঝে।',
    samplePrompt: 'আজকে সারাদিন কাজের অনেক চাপ গেল, একদম ক্লান্ত লাগছে।',
    tone: 'empathetic' as SumoEmotion,
    badge: '🧠 Context Aware',
  },
  {
    id: 'continuity',
    icon: <MessageSquareQuote className="w-4 h-4 text-cyan-400" />,
    name: 'পূর্ববর্তী কথার সূত্র',
    nameEn: 'Dialogue Continuity',
    desc: 'আগের আলোচনার সূত্র ধরে সর্বনাম ও রেফারেন্স বজায় রাখে।',
    samplePrompt: 'আমরা একটু আগে যে মিটিংয়ের কথা বলছিলাম, ওটা কখন শুরু হবে?',
    tone: 'smart' as SumoEmotion,
    badge: '💬 Continuity',
  },
  {
    id: 'honor',
    icon: <Crown className="w-4 h-4 text-amber-400" />,
    name: 'গুরুর সম্মান ও আনুগত্য',
    nameEn: 'Guru Respect Ritual',
    desc: 'সবসময় অত্যন্ত শ্রদ্ধার সাথে "গুরু" সম্বোধন ও আনুগত্য বজায় রাখে।',
    samplePrompt: 'SUMO',
    tone: 'loyal' as SumoEmotion,
    badge: '👑 Guru Loyalty',
  },
  {
    id: 'tone',
    icon: <Smile className="w-4 h-4 text-pink-400" />,
    name: 'পরিস্থিতি অনুযায়ী টোন বদল',
    nameEn: 'Dynamic Tone Modulation',
    desc: 'মজার কথায় রসিক, কাজের কথায় সিরিয়াস, মন খারাপে সহানুভূতিশীল।',
    samplePrompt: 'গুরু যদি আজকে সব কাজ ফাঁকি দিয়ে আড্ডা দেয়, তবে সুমোর কী মত?',
    tone: 'witty' as SumoEmotion,
    badge: '😄 Tone Switch',
  },
  {
    id: 'clarify',
    icon: <Search className="w-4 h-4 text-emerald-400" />,
    name: 'অস্পষ্ট প্রশ্ন পরিষ্কারকরণ',
    nameEn: 'Proactive Clarification',
    desc: 'অসম্পূর্ণ আদেশে ভুল না করে আগে বিনীতভাবে নিশ্চিত হয়ে নেয়।',
    samplePrompt: 'একজনকে একটা জরুরি মেসেজ পাঠাতে হবে, রেডি হও।',
    tone: 'clarifying' as SumoEmotion,
    badge: '🔍 Clarification',
  },
  {
    id: 'advice',
    icon: <Lightbulb className="w-4 h-4 text-yellow-400" />,
    name: 'পরামর্শ ও বাস্তব উদাহরণ',
    nameEn: 'Advice + Examples',
    desc: 'শুধু শুকনো উত্তর নয়, সাথে কাজের টিপস ও উদাহরণ তুলে ধরে।',
    samplePrompt: 'কাজের প্রোডাক্টিভিটি কীভাবে দ্বিগুণ করা যায়, উদাহরণসহ বলো।',
    tone: 'advising' as SumoEmotion,
    badge: '💡 Advice & Examples',
  },
  {
    id: 'step_by_step',
    icon: <Layers className="w-4 h-4 text-indigo-400" />,
    name: 'ধাপে ধাপে সহজ ব্যাখ্যা',
    nameEn: 'Step-by-Step Breakdown',
    desc: 'জটিল প্রযুক্তি বা বিষয়কে ধাপ ১, ২, ৩ করে পানির মতো সহজ করে দেয়।',
    samplePrompt: 'কোয়ান্টাম কম্পিউটিং কী, আমাকে একদম সাধারণ ভাষায় বুঝিয়ে দাও।',
    tone: 'explaining' as SumoEmotion,
    badge: '🧩 Step-by-Step',
  },
  {
    id: 'direct_action',
    icon: <Target className="w-4 h-4 text-rose-400" />,
    name: 'উদ্দেশ্য বুঝে সরাসরি সমাধান',
    nameEn: 'Intent-Driven Directness',
    desc: 'অপ্রয়োজনীয় ভূমিকা বাদ দিয়ে সরাসরি কাঙ্ক্ষিত অ্যাকশন সম্পন্ন করে।',
    samplePrompt: 'ইউটিউবে সুন্দর কিছু বাংলা লিরিক্যাল গান খুঁজে দাও।',
    tone: 'focused' as SumoEmotion,
    badge: '🎯 Direct Action',
  },
];

export const IntelligentCognitiveLab: React.FC<IntelligentCognitiveLabProps> = ({
  currentInsight,
  onRunTestPrompt,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto px-4 py-3 space-y-3.5 animate-in fade-in duration-200">
      {/* Live Cognitive HUD Pill in Red Hacker Style */}
      {currentInsight && (
        <div className="p-3 rounded-2xl bg-gradient-to-r from-red-950/90 via-black to-red-950/90 border border-red-500/60 shadow-xl shadow-red-950/40 backdrop-blur-xl animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-cyber uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-600/20 text-red-300 border border-red-500/40 font-bold font-mono">
                {currentInsight.pillar}
              </span>
              <span className="text-xs font-cyber font-bold text-white capitalize">
                টোন: {currentInsight.tone}
              </span>
            </div>
            <span className="text-[10px] text-red-400 font-mono">
              {new Date(currentInsight.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
          <p className="text-xs text-red-100 font-medium">
            &quot;{currentInsight.summary}&quot;
          </p>
        </div>
      )}

      {/* Lab Header */}
      <div className="p-4 rounded-3xl bg-black/85 border border-red-900/60 flex items-center justify-between shadow-lg shadow-red-950/20">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold font-cyber text-white">সুমো রেড হ্যাকিং ব্রেইন ল্যাব</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-cyber uppercase tracking-wider bg-red-600/20 text-red-400 border border-red-500/40 flex items-center gap-1 font-mono">
              <Flame className="w-3 h-3 text-red-500" />
              <span>৮টি সুপারপাওয়ার</span>
            </span>
          </div>
          <p className="text-xs text-red-300/70 mt-1 font-mono">
            [NEURAL REASONING MATRIX] কনটেক্সট, ধারাবাহিকতা, টোন ও উদাহরণের জীবন্ত টেস্টবেঞ্চ।
          </p>
        </div>
      </div>

      {/* 8 Superpowers Grid in Red Hacker Aesthetic */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {SUPERPOWERS.map((sp) => (
          <div
            key={sp.id}
            onClick={() => onRunTestPrompt(sp.samplePrompt, sp.tone, sp.badge)}
            className="p-3.5 rounded-2xl bg-red-950/30 hover:bg-red-950/60 border border-red-900/50 hover:border-red-500/70 transition-all cursor-pointer group active:scale-98 flex flex-col justify-between shadow-[0_4px_20px_rgba(220,38,38,0.1)]"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-black flex items-center justify-center border border-red-900/60 group-hover:border-red-500/50 transition-colors">
                    {sp.icon}
                  </div>
                  <h4 className="text-xs font-cyber font-bold text-red-100 group-hover:text-red-400 transition-colors">
                    {sp.name}
                  </h4>
                </div>
                <span className="text-[9px] font-cyber px-1.5 py-0.2 rounded bg-black text-red-400 border border-red-900/60 font-mono">
                  {sp.badge}
                </span>
              </div>
              <p className="text-[11px] text-red-300/80 leading-snug line-clamp-2">
                {sp.desc}
              </p>
            </div>

            <div className="mt-2.5 pt-2 border-t border-red-950/80 flex items-center justify-between text-[11px] font-cyber text-red-400 group-hover:text-red-300">
              <span className="truncate max-w-[200px] text-red-200/80 font-normal">
                &quot;{sp.samplePrompt}&quot;
              </span>
              <ChevronRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-0.5 transition-transform text-red-500" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
