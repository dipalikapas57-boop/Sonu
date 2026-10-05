import React, { useState } from 'react';
import { 
  Youtube, 
  MessageSquare, 
  Phone, 
  Send, 
  Globe, 
  MapPin, 
  Camera, 
  Music, 
  Settings, 
  StickyNote, 
  Clock, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { AndroidAppItem } from '../types';

interface AndroidControlHubProps {
  onLaunchApp: (app: AndroidAppItem, customUrl?: string) => void;
  onRequestCall: (contactName: string, phoneNumber?: string) => void;
  onRequestSms: (contactName: string, message: string) => void;
}

const APPS: AndroidAppItem[] = [
  { id: 'youtube', name: 'YouTube', nameBn: 'ইউটিউব', iconName: 'youtube', category: 'media', defaultUrl: 'https://www.youtube.com' },
  { id: 'whatsapp', name: 'WhatsApp', nameBn: 'হোয়াটসঅ্যাপ', iconName: 'whatsapp', category: 'social', defaultUrl: 'https://web.whatsapp.com' },
  { id: 'browser', name: 'Chrome', nameBn: 'ব্রাউজার', iconName: 'browser', category: 'utility', defaultUrl: 'https://www.google.com' },
  { id: 'dialer', name: 'Phone', nameBn: 'ফোন ডায়ালার', iconName: 'phone', category: 'system' },
  { id: 'sms', name: 'Messages', nameBn: 'মেসেজ', iconName: 'sms', category: 'social' },
  { id: 'maps', name: 'Google Maps', nameBn: 'ম্যাপস', iconName: 'maps', category: 'utility', defaultUrl: 'https://maps.google.com' },
  { id: 'camera', name: 'Camera', nameBn: 'ক্যামেরা', iconName: 'camera', category: 'system' },
  { id: 'spotify', name: 'Spotify', nameBn: 'স্পটিফাই', iconName: 'spotify', category: 'media', defaultUrl: 'https://open.spotify.com' },
  { id: 'notes', name: 'Notes', nameBn: 'নোটবুক', iconName: 'notes', category: 'utility' },
  { id: 'clock', name: 'Clock/Timer', nameBn: 'ঘড়ি ও টাইমার', iconName: 'clock', category: 'system' },
];

export const AndroidControlHub: React.FC<AndroidControlHubProps> = ({
  onLaunchApp,
  onRequestCall,
  onRequestSms,
}) => {
  const [callContact, setCallContact] = useState('');
  const [smsContact, setSmsContact] = useState('');
  const [smsText, setSmsText] = useState('');
  const [ytQuery, setYtQuery] = useState('');

  const renderIcon = (name: string) => {
    switch (name) {
      case 'youtube': return <Youtube className="w-5 h-5 text-red-400" />;
      case 'whatsapp': return <MessageSquare className="w-5 h-5 text-emerald-400" />;
      case 'browser': return <Globe className="w-5 h-5 text-blue-400" />;
      case 'phone': return <Phone className="w-5 h-5 text-emerald-400" />;
      case 'sms': return <Send className="w-5 h-5 text-indigo-400" />;
      case 'maps': return <MapPin className="w-5 h-5 text-amber-400" />;
      case 'camera': return <Camera className="w-5 h-5 text-purple-400" />;
      case 'spotify': return <Music className="w-5 h-5 text-green-400" />;
      case 'notes': return <StickyNote className="w-5 h-5 text-yellow-400" />;
      default: return <Clock className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4 space-y-5 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="p-4 rounded-3xl bg-black/85 border border-red-900/60 flex items-center justify-between shadow-lg shadow-red-950/20">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold font-cyber text-white">অ্যান্ড্রয়েড কন্ট্রোল হাব</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-cyber uppercase tracking-wider bg-red-600/20 text-red-400 border border-red-500/40 font-mono">
              [V5 DEVICE HACK]
            </span>
          </div>
          <p className="text-xs text-red-300/70 mt-0.5 font-mono">
            &gt; সুমো এআই ব্রেইন ভয়েস বা ম্যানুয়াল ট্যাপ দিয়ে অ্যাপস ও কল/এসএমএস কন্ট্রোল করতে পারে।
          </p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
          <ShieldCheck className="w-5 h-5" />
        </div>
      </div>

      {/* Grid of Android Apps */}
      <div>
        <h3 className="text-xs font-cyber font-bold text-red-400 uppercase tracking-wider mb-2.5 px-1 font-mono">
          &gt; সিস্টেম ও ইনস্টলড অ্যাপস
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {APPS.map((app) => (
            <button
              key={app.id}
              onClick={() => {
                if (app.id === 'dialer') {
                  onRequestCall('আম্মু (Home)', '01700000000');
                } else if (app.id === 'sms') {
                  onRequestSms('অফিস বস', 'গুরু, প্রজেক্ট রিপোর্ট প্রস্তুত!');
                } else {
                  onLaunchApp(app);
                }
              }}
              className="p-3 rounded-2xl bg-red-950/20 hover:bg-red-950/50 border border-red-900/40 hover:border-red-500/70 flex flex-col items-center justify-center text-center transition-all group active:scale-95 cursor-pointer shadow-[0_4px_15px_rgba(220,38,38,0.1)]"
            >
              <div className="w-10 h-10 rounded-xl bg-black border border-red-950 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform group-hover:border-red-500/40">
                {renderIcon(app.iconName)}
              </div>
              <span className="text-xs font-semibold text-red-100 group-hover:text-white">
                {app.nameBn}
              </span>
              <span className="text-[10px] text-red-400/70 font-mono">
                {app.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Call & SMS Workflow Testing Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Call Workflow with Safety */}
        <div className="p-4 rounded-2xl bg-black/85 border border-red-900/60 flex flex-col justify-between shadow-[0_4px_20px_rgba(220,38,38,0.15)]">
          <div>
            <div className="flex items-center gap-2 text-red-400 mb-1.5">
              <Phone className="w-4 h-4 text-red-500 animate-pulse" />
              <h4 className="text-xs font-cyber font-bold">কল ওয়ার্কফ্লো টেস্ট (V5 + V9)</h4>
            </div>
            <p className="text-[11px] text-red-300/70 mb-3 font-mono">
              সুমো কল দেয়ার আগে নিরাপত্তার জন্য কনফার্মেশন নিবে।
            </p>
            <input
              type="text"
              placeholder="কাকে কল দিবেন? (যেমন: আম্মু, বন্ধু)"
              value={callContact}
              onChange={(e) => setCallContact(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black border border-red-900/60 text-xs text-red-100 placeholder-red-400/40 focus:outline-none focus:border-red-500 font-mono"
            />
          </div>
          <button
            onClick={() => {
              if (callContact.trim()) {
                onRequestCall(callContact.trim());
                setCallContact('');
              } else {
                onRequestCall('আম্মু');
              }
            }}
            className="mt-3 w-full py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-cyber text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-red-600/30 border border-red-400/40 cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>কল ইনিশিয়েট করুন</span>
          </button>
        </div>

        {/* SMS Workflow with Safety */}
        <div className="p-4 rounded-2xl bg-black/85 border border-red-900/60 flex flex-col justify-between shadow-[0_4px_20px_rgba(220,38,38,0.15)]">
          <div>
            <div className="flex items-center gap-2 text-rose-400 mb-1.5">
              <Send className="w-4 h-4 text-rose-500 animate-pulse" />
              <h4 className="text-xs font-cyber font-bold">এসএমএস ওয়ার্কফ্লো টেস্ট (V5 + V9)</h4>
            </div>
            <p className="text-[11px] text-red-300/70 mb-2 font-mono">
              কনটেন্ট ভেরিফাই করার পরই সেন্ড প্রসেস হবে।
            </p>
            <input
              type="text"
              placeholder="প্রাপক (যেমন: রাজু, বস)"
              value={smsContact}
              onChange={(e) => setSmsContact(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-black border border-red-900/60 text-xs text-red-100 placeholder-red-400/40 focus:outline-none focus:border-red-500 mb-2 font-mono"
            />
            <input
              type="text"
              placeholder="মেসেজ লিখুন..."
              value={smsText}
              onChange={(e) => setSmsText(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-black border border-red-900/60 text-xs text-red-100 placeholder-red-400/40 focus:outline-none focus:border-red-500 font-mono"
            />
          </div>
          <button
            onClick={() => {
              const recipient = smsContact.trim() || 'বন্ধু';
              const body = smsText.trim() || 'গুরু, আমি রাস্তায় আছি, ৫ মিনিটে আসছি!';
              onRequestSms(recipient, body);
              setSmsContact('');
              setSmsText('');
            }}
            className="mt-3 w-full py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-cyber text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-red-600/30 border border-red-400/40 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>মেসেজ তৈরি করুন</span>
          </button>
        </div>
      </div>
    </div>
  );
};
