import React, { useState } from 'react';
import { MemoryItem } from '../types';
import { Brain, Plus, Trash2, Tag, Calendar, Heart, Shield, Sparkles } from 'lucide-react';

interface MemoryBankModalProps {
  memories: MemoryItem[];
  onAddMemory: (key: string, value: string, category: MemoryItem['category']) => void;
  onDeleteMemory: (id: string, key: string) => void;
}

export const MemoryBankModal: React.FC<MemoryBankModalProps> = ({
  memories,
  onAddMemory,
  onDeleteMemory,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newCategory, setNewCategory] = useState<MemoryItem['category']>('preference');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) return;
    onAddMemory(newKey.trim(), newValue.trim(), newCategory);
    setNewKey('');
    setNewValue('');
    setShowAddForm(false);
  };

  const getCategoryBadge = (cat: MemoryItem['category']) => {
    switch (cat) {
      case 'preference':
        return { label: 'পছন্দ', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
      case 'schedule':
        return { label: 'শিডিউল', color: 'bg-red-500/20 text-red-300 border-red-500/40' };
      case 'person':
        return { label: 'ব্যক্তি', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      case 'rule':
        return { label: 'নিয়ম', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' };
      default:
        return { label: 'নোট', color: 'bg-orange-500/20 text-orange-300 border-orange-500/40' };
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4 space-y-4 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="p-4 rounded-3xl bg-black/85 border border-red-900/60 flex items-center justify-between shadow-lg shadow-red-950/20">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold font-cyber text-white">সুমো মেমোরি সিস্টেম</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-cyber uppercase tracking-wider bg-red-600/20 text-red-400 border border-red-500/40 font-mono">
              [V4 NEURAL BANK]
            </span>
          </div>
          <p className="text-xs text-red-300/70 mt-0.5 font-mono">
            &gt; গুরুর তথ্য সুমোর সাবকন্সাসে সেভ থাকে এবং কনটেক্সট হিসেবে ব্যবহৃত হয়।
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-cyber text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-lg shadow-red-600/30 border border-red-400/40 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline font-mono">নতুন মেমোরি</span>
        </button>
      </div>

      {/* Add Memory Form */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="p-4 rounded-2xl bg-black/90 border border-red-500/60 space-y-3 animate-in slide-in-from-top-2 duration-150 shadow-xl shadow-red-950/30"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-cyber font-bold text-red-300 font-mono">&gt; নতুন মেমোরি এনক্রিপ্ট করুন</span>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as any)}
              className="px-2.5 py-1 rounded-lg bg-black border border-red-900/60 text-xs text-red-300 focus:outline-none focus:border-red-500 font-mono"
            >
              <option value="preference">পছন্দ (Preference)</option>
              <option value="schedule">শিডিউল (Schedule)</option>
              <option value="person">ব্যক্তি (Person)</option>
              <option value="rule">নিয়ম (Rule)</option>
              <option value="note">সাধারণ নোট (Note)</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="বিষয় বা শিরোনাম (যেমন: প্রিয় খাবার, কাজের সময়)"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-black border border-red-900/60 text-xs text-red-100 placeholder-red-400/40 focus:outline-none focus:border-red-500 font-mono"
          />

          <textarea
            placeholder="বিস্তারিত তথ্য লিখুন যা সুমো মনে রাখবে..."
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 rounded-xl bg-black border border-red-900/60 text-xs text-red-100 placeholder-red-400/40 focus:outline-none focus:border-red-500 font-mono"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 rounded-xl text-xs text-red-400/70 hover:text-white"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-cyber text-xs font-bold transition-colors shadow-md shadow-red-600/30 border border-red-400/40"
            >
              মেমরিতে সেভ করুন
            </button>
          </div>
        </form>
      )}

      {/* Memory Items List */}
      <div className="space-y-2.5">
        {memories.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-black/60 border border-red-950/60">
            <Brain className="w-8 h-8 text-red-800 mx-auto mb-2" />
            <p className="text-xs text-red-400">এখনো কোনো মেমোরি সেভ নেই।</p>
            <p className="text-[11px] text-red-500/70 mt-1 font-mono">
              ভয়েস কলে বলুন &quot;SUMO, মনে রাখো আমার জন্মদিন ১০ মার্চ&quot; অথবা উপরের বাটন দিয়ে যোগ করুন।
            </p>
          </div>
        ) : (
          memories.map((m) => {
            const badge = getCategoryBadge(m.category);
            return (
              <div
                key={m.id}
                className="p-3.5 rounded-2xl bg-red-950/20 hover:bg-red-950/40 border border-red-900/40 hover:border-red-500/60 flex items-start justify-between gap-3 transition-colors group shadow-[0_4px_15px_rgba(220,38,38,0.08)]"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-cyber font-bold text-red-100">
                      {m.key}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded border font-cyber font-mono ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>
                  <p className="text-xs text-red-200/90 leading-relaxed">
                    {m.value}
                  </p>
                  <span className="text-[10px] text-red-400/60 font-mono mt-1 block">
                    সংরক্ষিত: {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <button
                  onClick={() => onDeleteMemory(m.id, m.key)}
                  className="p-1.5 rounded-lg text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="ডিলিট করুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
