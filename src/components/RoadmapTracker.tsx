import React from 'react';
import { 
  Brain, 
  Mic, 
  Radio, 
  Database, 
  Smartphone, 
  Globe, 
  Crown, 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';

export const RoadmapTracker: React.FC = () => {
  const steps = [
    {
      version: 'V1',
      title: 'এআই ব্রেইন ও রিজনিং',
      titleEn: 'AI Brain & Reasoning',
      desc: 'প্রশ্নোত্তর, ডিপ রিজনিং, টাস্ক বোঝা ও সিদ্ধান্ত গ্রহণ।',
      icon: <Brain className="w-5 h-5 text-purple-400" />,
      color: 'border-purple-500/30 bg-purple-500/10 text-purple-300',
      status: 'সম্পন্ন (Active)',
    },
    {
      version: 'V2',
      title: 'দ্বিভাষিক ভয়েস সিস্টেম',
      titleEn: 'Bilingual Voice Engine',
      desc: 'বাংলা ও ইংরেজি স্বতঃস্ফূর্ত রিয়েল-টাইম ভয়েস ইনপুট ও আউটপুট।',
      icon: <Mic className="w-5 h-5 text-cyan-400" />,
      color: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
      status: 'সম্পন্ন (Active)',
    },
    {
      version: 'V3',
      title: 'সুমো ওয়েক ওয়ার্ড',
      titleEn: 'Sumo Wake Word Engine',
      desc: '"Hey Sumo" বা "সুমো" শুনলেই ব্যাকগ্রাউন্ড থেকে অ্যাক্টিভ হওয়া।',
      icon: <Radio className="w-5 h-5 text-emerald-400" />,
      color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
      status: 'সম্পন্ন (Active)',
    },
    {
      version: 'V4',
      title: 'মেমোরি ও কনটেক্সট সিস্টেম',
      titleEn: 'Memory Bank & Recall',
      desc: 'গুরুর বলা পছন্দ, তথ্য, শিডিউল মনে রাখা এবং কথায় প্রয়োগ করা।',
      icon: <Database className="w-5 h-5 text-blue-400" />,
      color: 'border-blue-500/30 bg-blue-500/10 text-blue-300',
      status: 'সম্পন্ন (Active)',
    },
    {
      version: 'V5',
      title: 'অ্যান্ড্রয়েড অ্যাকশন ও অ্যাপস',
      titleEn: 'Android Device Workflows',
      desc: 'ইউটিউব, হোয়াটসঅ্যাপ, ক্যামেরা, ম্যাপস, কল ও এসএমএস কন্ট্রোল।',
      icon: <Smartphone className="w-5 h-5 text-teal-400" />,
      color: 'border-teal-500/30 bg-teal-500/10 text-teal-300',
      status: 'সম্পন্ন (Active)',
    },
    {
      version: 'V6',
      title: 'ওয়েব সার্চ ও লাইভ ইনফো',
      titleEn: 'Live Web Grounding',
      desc: 'তাজা খবর, আবহাওয়া, ক্রিকেট স্কোর ও সাম্প্রতিক তথ্য সংগ্রহ।',
      icon: <Globe className="w-5 h-5 text-sky-400" />,
      color: 'border-sky-500/30 bg-sky-500/10 text-sky-300',
      status: 'সম্পন্ন (Active)',
    },
    {
      version: 'V7',
      title: 'ওনার / গুরু সিস্টেম',
      titleEn: 'Guru Personalization',
      desc: 'শ্রদ্ধাশীল ও অনুগত অ্যাসিস্ট্যান্ট পার্সোনা, গুরু সম্মোধন।',
      icon: <Crown className="w-5 h-5 text-amber-400" />,
      color: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
      status: 'সম্পন্ন (Active)',
    },
    {
      version: 'V8',
      title: 'কমান্ড লার্নিং সিস্টেম',
      titleEn: 'Custom Command Macros',
      desc: 'নিজের ইচ্ছেমতো কাস্টম রুটিন ও কমান্ড তৈরি করে অটোমেশন।',
      icon: <Zap className="w-5 h-5 text-indigo-400" />,
      color: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300',
      status: 'সম্পন্ন (Active)',
    },
    {
      version: 'V9',
      title: 'পারমিশন ও সিকিউরিটি গার্ডরেল',
      titleEn: 'Safety & Verification',
      desc: 'কল, এসএমএস বা স্পর্শকাতর কাজে গুরুর প্রত্যক্ষ অনুমতি কনফার্মেশন।',
      icon: <ShieldCheck className="w-5 h-5 text-rose-400" />,
      color: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
      status: 'সম্পন্ন (Active)',
    },
  ];

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4 space-y-4 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="p-4 rounded-3xl bg-black/85 border border-red-900/60 flex items-center justify-between shadow-lg shadow-red-950/20">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold font-cyber text-white">সুমো এআই আর্কিটেকচার রোডম্যাপ</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-cyber uppercase tracking-wider bg-red-600/20 text-red-400 border border-red-500/40 flex items-center gap-1 font-mono">
              <Sparkles className="w-3 h-3 text-red-400" />
              <span>V1 – V9 ACTIVE</span>
            </span>
          </div>
          <p className="text-xs text-red-300/70 mt-1 font-mono">
            &gt; আপনার নির্দেশিত সম্পূর্ণ ৯টি মডুলার সিস্টেম রেড হ্যাকিং আর্কিটেকচারে সক্রিয় রয়েছে।
          </p>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-2.5">
        {steps.map((s, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-2xl bg-red-950/20 hover:bg-red-950/40 border border-red-900/40 hover:border-red-500/60 flex items-center justify-between gap-3 transition-colors shadow-[0_4px_15px_rgba(220,38,38,0.08)]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center shrink-0 border border-red-900/60 shadow-[0_0_10px_rgba(239,68,68,0.15)]">
                {s.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-cyber font-bold px-1.5 py-0.2 rounded bg-black text-red-400 border border-red-900/50 font-mono">
                    {s.version}
                  </span>
                  <h4 className="text-xs font-cyber font-bold text-red-100">
                    {s.title}
                  </h4>
                </div>
                <p className="text-[11px] text-red-300/70 mt-0.5 leading-snug font-mono">
                  {s.desc}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-cyber text-emerald-400 shrink-0 font-medium font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Active</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
