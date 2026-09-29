import React, { useState } from 'react';
import { 
  X, 
  ArrowUpRight, 
  Copy, 
  Check,
  Sparkles
} from 'lucide-react';
import { Product } from '../types';
import { useAuth } from '../context/AuthContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onBuyClick: (product: Product) => void;
  onEdit?: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onBuyClick,
  onEdit
}) => {
  const { isAdmin } = useAuth();
  const [copied, setCopied] = useState(false);

  if (!product) return null;

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const savingsAmount = product.originalPrice && product.originalPrice > product.price
    ? product.originalPrice - product.price
    : 0;

  const handleShare = () => {
    const textToCopy = `${product.title}\nPrice: ${product.currency}${product.price} on ${product.platform}\n${product.affiliateLink}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/70 dark:bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div 
        className="w-full max-w-3xl bg-white dark:bg-[#0c121e] rounded-3xl shadow-2xl border border-slate-200 dark:border-cyan-500/30 my-4 sm:my-8 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-150 min-w-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between min-w-0 bg-slate-50/50 dark:bg-[#090f1a]/80">
          <div className="flex items-center gap-2 text-xs font-sweetpea font-bold text-slate-500 dark:text-slate-400 min-w-0">
            <span className="text-cyan-700 dark:text-cyan-300 font-extrabold uppercase tracking-wide truncate">{product.platform}</span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700 shrink-0">·</span>
            <span className="truncate">{product.category}</span>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            {isAdmin && onEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(product);
                }}
                className="font-sweetpea px-3 py-1 text-xs font-bold text-cyan-600 dark:text-cyan-300 hover:underline transition-colors"
              >
                Edit Product
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors touch-manipulation min-h-[36px] min-w-[36px] flex items-center justify-center"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 max-h-[82vh] overflow-y-auto min-w-0">
          
          {/* Image */}
          <div className="space-y-3 min-w-0">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <img
                src={product.imageBase64}
                alt={product.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              {product.featured && (
                <div className="absolute top-3 left-3 px-3 py-0.5 bg-white/95 text-cyan-800 border border-cyan-200 dark:bg-slate-950/90 dark:text-cyan-300 dark:border-cyan-400/60 rounded-full text-[11px] font-bold font-sweetpea shadow-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-500" />
                  <span>Featured</span>
                </div>
              )}
              {discountPercent > 0 && (
                <div className="absolute top-3 right-3 px-2.5 py-0.5 bg-emerald-600 text-white text-xs font-bold font-sweetpea rounded-full shadow-xs">
                  {discountPercent}% OFF
                </div>
              )}
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#070b13] border border-slate-200 dark:border-slate-800 text-xs font-sweetpea">
              <span className="text-slate-500 dark:text-slate-400">Share deal link:</span>
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 font-bold text-cyan-700 dark:text-cyan-300 hover:text-cyan-800 dark:hover:text-cyan-200 transition-colors touch-manipulation min-h-[32px]"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-cyan-500" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Details & CTA */}
          <div className="flex flex-col justify-between space-y-5 sm:space-y-6 min-w-0">
            <div className="space-y-3 sm:space-y-4 min-w-0">
              
              <h2 className="font-sweetpea text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-snug">
                {product.title}
              </h2>

              {/* Pricing Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-50/60 to-slate-50 dark:from-[#0f1728] dark:to-[#090e1a] border border-cyan-100 dark:border-cyan-500/20 space-y-1.5">
                <div className="flex flex-wrap items-baseline gap-2.5 sm:gap-3">
                  <span className="tabular-numbers text-2xl sm:text-3xl font-extrabold font-sweetpea text-slate-900 dark:text-white">
                    {product.currency}{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="tabular-numbers text-xs sm:text-sm font-sweetpea text-slate-400 dark:text-slate-500 line-through">
                      {product.currency}{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span className="text-xs font-bold font-sweetpea text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      Save {product.currency}{savingsAmount.toLocaleString()} ({discountPercent}%)
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Verified live pricing on {product.platform}. Subject to availability.
                </p>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <h3 className="font-sweetpea text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
                  Product Overview
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {product.description || 'Verified product details from official marketplace.'}
                </p>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {product.tags.map((tag, i) => (
                    <span key={i} className="font-sweetpea text-xs px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-700">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Purchase CTA Button: Sweet Pea font with high-contrast electric gradient */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <button
                onClick={() => onBuyClick(product)}
                className="font-sweetpea w-full min-h-[46px] flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-extrabold text-sm tracking-wide transition-all shadow-md active:scale-[0.98] touch-manipulation bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-700 hover:from-cyan-500 hover:to-teal-500 text-white shadow-cyan-600/25 dark:from-cyan-400 dark:via-teal-300 dark:to-cyan-400 dark:text-slate-950 dark:shadow-[0_0_20px_rgba(6,182,212,0.4)] dark:hover:shadow-[0_0_28px_rgba(6,182,212,0.55)]"
              >
                <span>Buy Now on {product.platform}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center leading-normal">
                Opens directly in official {product.platform} store. Purchases may earn an affiliate commission at no extra charge to you.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
