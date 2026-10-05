import React from 'react';
import { AndroidNotification } from '../types';
import { Bell, X, CheckCheck, Sparkles, Smartphone } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  notifications: AndroidNotification[];
  onClose: () => void;
  onClearAll: () => void;
  onTriggerTest: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  notifications,
  onClose,
  onClearAll,
  onTriggerTest,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-3xl bg-black/95 border border-red-900/80 shadow-2xl shadow-red-950/50 overflow-hidden animate-in slide-in-from-top-4 duration-200">
        {/* Header */}
        <div className="p-4 bg-red-950/30 border-b border-red-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center border border-red-500/40">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-cyber font-bold text-white">অ্যান্ড্রয়েড নোটিফিকেশন শেড</h3>
              <p className="text-[10px] text-red-300/70 font-mono">[RED MATRIX ALERT FEED]</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-red-400 hover:text-white hover:bg-red-900/40 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action bar */}
        <div className="px-4 py-2 bg-black/80 border-b border-red-950 flex items-center justify-between text-xs">
          <button
            onClick={onTriggerTest}
            className="text-[11px] font-cyber text-red-400 hover:text-red-300 flex items-center gap-1 font-mono"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>&gt; টেস্ট অ্যালার্ট পাঠান</span>
          </button>
          {notifications.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-[11px] font-cyber text-red-400/60 hover:text-red-300 flex items-center gap-1 font-mono"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>ক্লিয়ার করুন</span>
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="p-3 max-h-80 overflow-y-auto space-y-2">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-red-400/50 text-xs font-mono">
              <Bell className="w-7 h-7 mx-auto mb-1.5 opacity-40 text-red-500" />
              <span>কোনো নতুন নোটিফিকেশন নেই</span>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className="p-3 rounded-2xl bg-red-950/20 border border-red-900/50 flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center shrink-0 border border-red-500/40">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-cyber font-bold text-white truncate">
                      {n.title}
                    </span>
                    <span className="text-[10px] text-red-400/70 font-mono">
                      {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-red-200 mt-0.5 leading-snug">
                    {n.message}
                  </p>
                  <span className="text-[9px] uppercase font-cyber text-red-400/60 mt-1 block font-mono">
                    [{n.appName}]
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
