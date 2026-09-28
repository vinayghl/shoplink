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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs">
      <div 
        className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-1">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Connecting to Retailer
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Opening {product.platform}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 max-w-xs mx-auto">
            {product.title}
          </p>
        </div>

        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <div className="tabular-numbers text-xl font-bold text-slate-900 dark:text-white">
            {product.currency}{product.price.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Verified Affiliate Deal</div>
        </div>

        <div className="space-y-2 pt-1">
          <button
            onClick={handleManualRedirect}
            className="w-full flex items-center justify-between py-2.5 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs"
          >
            <span>Proceed to {product.platform}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClose}
            className="w-full py-1.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            Back to Catalog
          </button>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
          <span>Official merchant referral</span>
        </div>
      </div>
    </div>
  );
};
