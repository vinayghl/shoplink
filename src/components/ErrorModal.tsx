import React from 'react';
import { X, RefreshCw, ArrowLeft, WifiOff } from 'lucide-react';
import { themeImages } from '../assets/themeAssets';

export type ErrorType = '404' | 'offline' | 'empty' | 'server';

interface ErrorModalProps {
  type: ErrorType | null;
  onClose: () => void;
  onRetry?: () => void;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({
  type,
  onClose,
  onRetry
}) => {
  if (!type) return null;

  const contentMap: Record<ErrorType, {
    title: string;
    description: string;
    image: string;
    alt: string;
    actionText: string;
  }> = {
    '404': {
      title: 'Page or Product Not Found',
      description: 'The product, deal, or showcase link you are looking for has either expired, moved, or is no longer available.',
      image: themeImages.err404,
      alt: '404 Not Found Illustration',
      actionText: 'Return to Showcase'
    },
    'offline': {
      title: 'No Internet Connection',
      description: 'You appear to be offline. Please check your Wi-Fi or cellular network connection to browse live product deals.',
      image: themeImages.errNoInternet,
      alt: 'No Internet Connection Illustration',
      actionText: 'Retry Connection'
    },
    'empty': {
      title: 'No Matching Products Found',
      description: 'We could not find any products matching your search keywords or platform filter. Try resetting your filters.',
      image: themeImages.errEmptyBox,
      alt: 'Empty Box Illustration',
      actionText: 'Reset Filters'
    },
    'server': {
      title: 'Temporary Service Notice',
      description: 'Our catalog service encountered a momentary hiccup. Live links and product data are refreshing.',
      image: themeImages.errNoInternet,
      alt: 'Service Notice Illustration',
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

        {/* Custom Error Image */}
        <div className="w-36 h-36 sm:w-44 sm:h-44 mx-auto rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 shadow-inner flex items-center justify-center">
          <img
            src={current.image}
            alt={current.alt}
            className="w-full h-full object-contain p-2"
          />
        </div>

        {/* Text Content */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold font-sweetpea bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30">
            {type === 'offline' && <WifiOff className="w-3 h-3 text-cyan-500" />}
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
