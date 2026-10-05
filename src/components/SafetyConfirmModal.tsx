import React from 'react';
import { SafetyConfirmationPrompt } from '../types';
import { ShieldAlert, Phone, Send, Trash2, X, Check } from 'lucide-react';

interface SafetyConfirmModalProps {
  prompt: SafetyConfirmationPrompt | null;
}

export const SafetyConfirmModal: React.FC<SafetyConfirmModalProps> = ({ prompt }) => {
  if (!prompt) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-sm rounded-3xl bg-black/95 border border-red-500/70 p-5 shadow-2xl shadow-red-950/60 text-red-100 animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-red-600/20 border border-red-500/50 flex items-center justify-center text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
            {prompt.type === 'call' ? (
              <Phone className="w-5 h-5 animate-pulse text-red-400" />
            ) : prompt.type === 'sms' ? (
              <Send className="w-5 h-5 animate-pulse text-rose-400" />
            ) : prompt.type === 'delete_memory' ? (
              <Trash2 className="w-5 h-5 text-red-400" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-red-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-cyber uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-600/20 text-red-300 border border-red-500/40 font-mono">
                [V9 SECURITY GUARD]
              </span>
            </div>
            <h3 className="text-base font-bold font-cyber text-white mt-0.5">
              {prompt.title}
            </h3>
          </div>
        </div>

        <p className="text-xs text-red-300/80 leading-relaxed mb-4 font-mono">
          {prompt.description}
        </p>

        {prompt.messageContent && (
          <div className="p-3 rounded-xl bg-black border border-red-900/60 text-xs font-mono text-red-300 mb-4 whitespace-pre-wrap">
            &quot;{prompt.messageContent}&quot;
          </div>
        )}

        <div className="flex items-center gap-2.5">
          <button
            onClick={prompt.onCancel}
            className="flex-1 py-2.5 rounded-xl bg-red-950/60 hover:bg-red-900/60 text-red-300 font-cyber text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-red-900"
          >
            <X className="w-4 h-4" />
            <span>বাতিল (Cancel)</span>
          </button>
          <button
            onClick={prompt.onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-cyber text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-red-600/40 border border-red-400/50 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>অনুমোদন দিন (Confirm)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
