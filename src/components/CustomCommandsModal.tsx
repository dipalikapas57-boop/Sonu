import React, { useState } from 'react';
import { CustomCommand } from '../types';
import { Zap, Plus, Play, Trash2, Sparkles, CheckCircle2 } from 'lucide-react';

interface CustomCommandsModalProps {
  commands: CustomCommand[];
  onExecuteCommand: (cmd: CustomCommand) => void;
  onAddCommand: (cmd: CustomCommand) => void;
  onDeleteCommand: (id: string) => void;
}

export const CustomCommandsModal: React.FC<CustomCommandsModalProps> = ({
  commands,
  onExecuteCommand,
  onAddCommand,
  onDeleteCommand,
}) => {
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [trigger, setTrigger] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trigger.trim() || !title.trim()) return;

    const newCmd: CustomCommand = {
      id: Math.random().toString(),
      title: title.trim(),
      triggerPhrase: trigger.trim(),
      description: description.trim() || 'কাস্টম ইউজার কমান্ড',
      actions: [
        {
          type: 'speak',
          payload: { text: `জি গুরু, ${title} কমান্ড কার্যকর করা হচ্ছে!` },
        },
      ],
    };

    onAddCommand(newCmd);
    setTitle('');
    setTrigger('');
    setDescription('');
    setShowAdd(false);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4 space-y-4 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="p-4 rounded-3xl bg-black/85 border border-red-900/60 flex items-center justify-between shadow-lg shadow-red-950/20">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold font-cyber text-white">কমান্ড লার্নিং স্টুডিও</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-cyber uppercase tracking-wider bg-red-600/20 text-red-400 border border-red-500/40 font-mono">
              [V8 MACRO OVERRIDE]
            </span>
          </div>
          <p className="text-xs text-red-300/70 mt-0.5 font-mono">
            &gt; নিজের ভাষায় পছন্দের কাস্টম কমান্ড বা রুটিন শেখান, সুমো স্বয়ংক্রিয়ভাবে এক্সিকিউট করবে।
          </p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="p-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-cyber text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-lg shadow-red-600/30 border border-red-400/40 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline font-mono">নতুন কমান্ড</span>
        </button>
      </div>

      {/* Add Command Form */}
      {showAdd && (
        <form
          onSubmit={handleAdd}
          className="p-4 rounded-2xl bg-black/90 border border-red-500/60 space-y-3 animate-in slide-in-from-top-2 duration-150 shadow-xl shadow-red-950/30"
        >
          <span className="text-xs font-cyber font-bold text-red-400 block font-mono">
            &gt; নতুন রুটিন বা ম্যাক্রো শেখান
          </span>

          <input
            type="text"
            placeholder="কমান্ডের নাম (যেমন: রাতের রুটিন)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-black border border-red-900/60 text-xs text-red-100 placeholder-red-400/40 focus:outline-none focus:border-red-500 font-mono"
          />

          <input
            type="text"
            placeholder="ট্রিগার ফ্রেইজ (যা বললে সুমো চালাবে, যেমন: শুভ রাত্রি)"
            value={trigger}
            onChange={(e) => setTrigger(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-black border border-red-900/60 text-xs text-red-100 placeholder-red-400/40 focus:outline-none focus:border-red-500 font-mono"
          />

          <input
            type="text"
            placeholder="সংক্ষিপ্ত বিবরণ"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-black border border-red-900/60 text-xs text-red-100 placeholder-red-400/40 focus:outline-none focus:border-red-500 font-mono"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="px-3 py-1.5 rounded-xl text-xs text-red-400/70 hover:text-white"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-cyber text-xs font-bold transition-colors shadow-md shadow-red-600/30 border border-red-400/40"
            >
              কমান্ড সেভ করুন
            </button>
          </div>
        </form>
      )}

      {/* Commands List */}
      <div className="space-y-2.5">
        {commands.map((cmd) => (
          <div
            key={cmd.id}
            className="p-4 rounded-2xl bg-red-950/20 hover:bg-red-950/40 border border-red-900/40 hover:border-red-500/60 flex items-center justify-between gap-3 transition-colors group shadow-[0_4px_15px_rgba(220,38,38,0.08)]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-black border border-red-900/60 flex items-center justify-center text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.2)]">
                <Zap className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-cyber font-bold text-red-100">
                    {cmd.title}
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-black text-red-400 font-mono border border-red-900/50">
                    &quot;{cmd.triggerPhrase}&quot;
                  </span>
                </div>
                <p className="text-[11px] text-red-300/70 mt-0.5 font-mono">
                  {cmd.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onExecuteCommand(cmd)}
                className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-cyber text-xs font-semibold flex items-center gap-1 transition-colors shadow-md shadow-red-600/30 border border-red-400/40 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>চালাও</span>
              </button>
              <button
                onClick={() => onDeleteCommand(cmd.id)}
                className="p-1.5 rounded-lg text-red-400/50 hover:text-red-400 transition-colors"
                title="ডিলিট"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
