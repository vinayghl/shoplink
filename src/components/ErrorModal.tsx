import React from 'react';
import { X, RefreshCw, ArrowLeft, WifiOff, Sparkles } from 'lucide-react';

export type ErrorType = '404' | 'offline' | 'empty' | 'server';

interface ErrorModalProps {
  type: ErrorType | null;
  onClose: () => void;
  onRetry?: () => void;
}

// Resilient inline SVG graphics that can NEVER break or show broken image icons [x]
const ErrorIllustrations: Record<ErrorType, React.ReactNode> = {
  '404': (
    <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="85" fill="currentColor" className="text-cyan-500/10 dark:text-cyan-400/10" />
      {/* Shopping bag character with 404 badge */}
      <rect x="58" y="70" width="84" height="90" rx="18" fill="currentColor" className="text-slate-900 dark:text-slate-800" stroke="#06b6d4" strokeWidth="3" />
      {/* Handles */}
      <path d="M78 70V52C78 40.9543 86.9543 32 98 32H102C113.046 32 122 40.9543 122 52V70" stroke="#06b6d4" strokeWidth="4" strokeLinecap="round" />
      {/* 404 Text */}
      <text x="100" y="125" textAnchor="middle" fill="#06b6d4" fontSize="24" fontWeight="800" fontFamily="sans-serif">404</text>
      {/* Sad cute eyes */}
      <circle cx="85" cy="95" r="4" fill="#ffffff" />
      <circle cx="115" cy="95" r="4" fill="#ffffff" />
      {/* Sparkles */}
      <path d="M152 48L155 40L158 48L166 51L158 54L155 62L152 54L144 51L152 48Z" fill="#22d3ee" />
      <path d="M42 120L44 114L46 120L52 122L46 124L44 130L42 124L36 122L42 120Z" fill="#22d3ee" />
    </svg>
  ),
  'offline': (
    <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="85" fill="currentColor" className="text-cyan-500/10 dark:text-cyan-400/10" />
      {/* Cloud body */}
      <path d="M60 135H145C161.569 135 175 121.569 175 105C175 89.2806 162.887 76.3888 147.5 75.1436C145.405 53.6492 127.351 37 105 37C87.4916 37 72.6393 47.2343 65.7533 62.0673C63.2687 61.3713 60.6723 61 58 61C40.3269 61 26 75.3269 26 93C26 109.845 39.0601 123.639 55.5 124.908" fill="currentColor" className="text-slate-900 dark:text-slate-800" stroke="#06b6d4" strokeWidth="3.5" strokeLinejoin="round" />
      {/* Sleepy / searching cute eyes */}
      <path d="M85 85Q93 88 101 85" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
      <path d="M115 85Q123 88 131 85" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
      {/* Disconnected wire plugs */}
      <path d="M85 140V160" stroke="#06b6d4" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M115 140V160" stroke="#06b6d4" strokeWidth="3.5" strokeLinecap="round" />
      {/* Disconnection cross */}
      <path d="M92 150L108 150" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="100" cy="150" r="14" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="3 3" />
    </svg>
  ),
  'empty': (
    <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="85" fill="currentColor" className="text-cyan-500/10 dark:text-cyan-400/10" />
      {/* Open Gift / Box */}
      <path d="M50 90L100 65L150 90L100 115L50 90Z" fill="currentColor" className="text-slate-900 dark:text-slate-800" stroke="#06b6d4" strokeWidth="3" />
      <path d="M50 90V135L100 160V115L50 90Z" fill="currentColor" className="text-slate-800 dark:text-slate-700" stroke="#06b6d4" strokeWidth="3" />
      <path d="M150 90V135L100 160V115L150 90Z" fill="currentColor" className="text-slate-900 dark:text-slate-800" stroke="#06b6d4" strokeWidth="3" />
      {/* Magnifier glass inside */}
      <circle cx="100" cy="65" r="18" stroke="#22d3ee" strokeWidth="3.5" fill="none" />
      <path d="M113 78L126 91" stroke="#22d3ee" strokeWidth="4" strokeLinecap="round" />
      {/* Floating sparkles */}
      <path d="M60 45L62 38L64 45L71 47L64 49L62 56L60 49L53 47L60 45Z" fill="#06b6d4" />
      <path d="M140 45L142 38L144 45L151 47L144 49L142 56L140 49L133 47L140 45Z" fill="#06b6d4" />
    </svg>
  ),
  'server': (
    <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="85" fill="currentColor" className="text-cyan-500/10 dark:text-cyan-400/10" />
      <rect x="50" y="60" width="100" height="30" rx="8" fill="currentColor" className="text-slate-900 dark:text-slate-800" stroke="#06b6d4" strokeWidth="3" />
      <rect x="50" y="105" width="100" height="30" rx="8" fill="currentColor" className="text-slate-900 dark:text-slate-800" stroke="#06b6d4" strokeWidth="3" />
      <circle cx="70" cy="75" r="4" fill="#22d3ee" />
      <circle cx="85" cy="75" r="4" fill="#22d3ee" />
      <circle cx="70" cy="120" r="4" fill="#22d3ee" />
      <circle cx="85" cy="120" r="4" fill="#22d3ee" />
      <path d="M125 75H135" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" />
      <path d="M125 120H135" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
};

export const ErrorModal: React.FC<ErrorModalProps> = ({
  type,
  onClose,
  onRetry
}) => {
  if (!type) return null;

  const contentMap: Record<ErrorType, {
    title: string;
    description: string;
    actionText: string;
  }> = {
    '404': {
      title: 'Page or Product Not Found',
      description: 'The product, deal, or showcase link you are looking for has either expired, moved, or is no longer available.',
      actionText: 'Return to Showcase'
    },
    'offline': {
      title: 'Offline Browsing Mode',
      description: 'You are currently offline or have an intermittent connection. All previously loaded products remain available.',
      actionText: 'Retry Connection'
    },
    'empty': {
      title: 'No Matching Products Found',
      description: 'We could not find any products matching your search keywords or platform filter. Try resetting your filters.',
      actionText: 'Reset Filters'
    },
    'server': {
      title: 'Temporary Service Notice',
      description: 'Our catalog service encountered a momentary hiccup. Live links and product data are refreshing.',
      actionText: 'Reload Showcase'
    }
  };

  const current = contentMap[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 dark:bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white dark:bg-[#0c121e] rounded-3xl shadow-2xl border border-slate-200 dark:border-cyan-500/30 p-6 sm:p-7 text-center space-y-5 animate-in zoom-in-95 duration-150 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glowing cyan top accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors touch-manipulation min-h-[36px] min-w-[36px] flex items-center justify-center"
          aria-label="Close error notice"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Resilient vector illustration: Guaranteed to render with zero load errors */}
        <div className="w-36 h-36 sm:w-44 sm:h-44 mx-auto rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 p-2 shadow-inner flex items-center justify-center">
          {ErrorIllustrations[type]}
        </div>

        {/* Text Content */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold font-sweetpea bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30">
            {type === 'offline' ? (
              <WifiOff className="w-3 h-3 text-cyan-500" />
            ) : (
              <Sparkles className="w-3 h-3 text-cyan-500" />
            )}
            <span>{type === '404' ? 'Error 404' : type === 'offline' ? 'Offline Mode' : 'Notice'}</span>
          </div>

          <h3 className="font-sweetpea text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
            {current.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
            {current.description}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
          <button
            onClick={() => {
              if (onRetry) onRetry();
              onClose();
            }}
            className="font-sweetpea w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-700 hover:from-cyan-500 hover:to-teal-500 shadow-md shadow-cyan-600/25 dark:from-cyan-400 dark:via-teal-300 dark:to-cyan-400 dark:text-slate-950 dark:font-extrabold dark:shadow-[0_0_16px_rgba(6,182,212,0.4)] transition-all active:scale-[0.98] touch-manipulation min-h-[42px] flex items-center justify-center gap-2"
          >
            {type === 'offline' ? <RefreshCw className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
            <span>{current.actionText}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
