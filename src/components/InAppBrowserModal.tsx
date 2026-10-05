import React, { useState } from 'react';
import { X, ExternalLink, Globe, Lock, RotateCcw, AlertCircle } from 'lucide-react';

interface InAppBrowserModalProps {
  url: string | null;
  title: string | null;
  onClose: () => void;
}

export const InAppBrowserModal: React.FC<InAppBrowserModalProps> = ({
  url,
  title,
  onClose,
}) => {
  const [iframeKey, setIframeKey] = useState(0);
  const [hasError, setHasError] = useState(false);

  if (!url) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full sm:max-w-2xl h-[85vh] sm:h-[80vh] bg-black border border-red-900/80 rounded-t-3xl sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl shadow-red-950/60 animate-in slide-in-from-bottom-5 duration-300">
        {/* Browser Top HUD */}
        <div className="p-3 bg-red-950/40 border-b border-red-900/60 flex items-center justify-between gap-2 select-none">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center border border-red-500/30">
              <Globe className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0 bg-black border border-red-900/60 px-3 py-1 rounded-xl flex items-center gap-2">
              <Lock className="w-3 h-3 text-red-400 shrink-0" />
              <span className="text-xs text-red-200 truncate font-mono">
                {url}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setHasError(false);
                setIframeKey((k) => k + 1);
              }}
              title="Reload preview"
              className="p-1.5 rounded-lg text-red-400 hover:text-white hover:bg-red-900/40 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              title="Open in new window"
              className="p-1.5 rounded-lg text-red-400 hover:text-red-200 hover:bg-red-900/40 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-red-400 hover:text-white hover:bg-red-900/40 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Browser Content */}
        <div className="relative flex-1 bg-black">
          {hasError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-cyber font-bold text-white mb-1">
                Embedded Preview Restricted
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mb-4">
                Some sites like Google or YouTube forbid direct iframe embedding for security. You can open it in a clean browser tab without dropping your call with Mahi.
              </p>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-cyber font-semibold flex items-center gap-2 shadow-lg shadow-pink-600/30 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open &quot;{title || 'Website'}&quot; in Tab</span>
              </a>
            </div>
          ) : (
            <iframe
              key={iframeKey}
              src={url}
              title={title || 'Mahi In-App Browser'}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              onError={() => setHasError(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
};
