import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import { Product } from '../types';

interface AffiliateRedirectModalProps {
  product: Product | null;
  onClose: () => void;
}

export const AffiliateRedirectModal: React.FC<AffiliateRedirectModalProps> = ({
  product,
  onClose
}) => {
  const [countdown, setCountdown] = useState(2);

  useEffect(() => {
    if (!product) return;
    setCountdown(2);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.open(product.affiliateLink, '_blank', 'noopener,noreferrer');
          return 0;
        }
        return prev - 1;
      });
    }, 800);

    return () => clearInterval(timer);
  }, [product]);

  if (!product) return null;

  const handleManualRedirect = () => {
    window.open(product.affiliateLink, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-1">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
            Connecting to Retailer
          </div>
          <h3 className="font-display text-lg font-bold text-zinc-900 dark:text-white">
            Opening {product.platform}
          </h3>
          <p className="text-xs text-zinc-500 line-clamp-2 max-w-xs mx-auto">
            {product.title}
          </p>
        </div>

        <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/80">
          <div className="font-mono-num text-xl font-bold text-zinc-900 dark:text-white">
            {product.currency}{product.price.toLocaleString()}
          </div>
          <div className="text-[11px] text-zinc-400 mt-0.5">Verified Affiliate Deal</div>
        </div>

        <div className="space-y-2 pt-1">
          <button
            onClick={handleManualRedirect}
            className="w-full flex items-center justify-between py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 text-white font-semibold text-xs rounded-lg transition-colors"
          >
            <span>Proceed to {product.platform}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClose}
            className="w-full py-1.5 text-xs text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            Back to Lookbook
          </button>
        </div>

        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
          <span>Official merchant referral</span>
        </div>
      </div>
    </div>
  );
};
