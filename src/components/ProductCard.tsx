import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  Share2, 
  Check, 
  Edit3, 
  Trash2, 
  Eye,
  Sparkles
} from 'lucide-react';
import { Product } from '../types';
import { useAuth } from '../context/AuthContext';

interface ProductCardProps {
  product: Product;
  onOpenDetail: (product: Product) => void;
  onBuyClick: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
}

function formatDisplayTitle(rawTitle: string): string {
  if (!rawTitle) return '';
  return rawTitle.replace(/\b[iI]\s+phone\b/g, 'iPhone');
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetail,
  onBuyClick,
  onEdit,
  onDelete
}) => {
  const { isAdmin } = useAuth();
  const [copied, setCopied] = useState(false);

  // Mathematically rounded discount percentage
  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = `${product.title}\nBuy on ${product.platform}: ${product.affiliateLink}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBuyClick(product);
  };

  return (
    <article 
      onClick={() => onOpenDetail(product)}
      className="group bg-white dark:bg-[#0c121e] rounded-2xl border border-slate-200/90 dark:border-slate-800/90 hover:border-cyan-500/50 dark:hover:border-cyan-400/60 shadow-sm hover:shadow-[0_8px_30px_rgba(6,182,212,0.14)] dark:hover:shadow-[0_0_24px_rgba(6,182,212,0.22)] transition-all duration-300 ease-out flex flex-col justify-between overflow-hidden cursor-pointer hover:-translate-y-1 w-full min-w-0"
    >
      {/* Product Image */}
      <div className="relative aspect-[4/3] sm:aspect-square w-full bg-slate-100 dark:bg-slate-900/80 overflow-hidden">
        <img
          src={product.imageBase64}
          alt={product.title}
          loading="lazy"
          decoding="async"
          width="400"
          height="400"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-300 ease-out"
        />

        {/* Featured Tag: Sweet Pea style with subtle cyan glow */}
        {product.featured && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="font-sweetpea inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold tracking-wide bg-white/95 text-cyan-700 border border-cyan-200 dark:bg-slate-950/90 dark:text-cyan-300 dark:border-cyan-400/60 rounded-full shadow-xs backdrop-blur-xs">
              <Sparkles className="w-3 h-3 text-cyan-500 dark:text-cyan-400" />
              <span>Featured</span>
            </span>
          </div>
        )}

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-2.5 right-2.5 z-10">
            <span className="font-sweetpea px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/90 border border-emerald-300 dark:border-emerald-700/80 rounded-full shadow-xs">
              {discountPercent}% OFF
            </span>
          </div>
        )}

        {/* Quick Actions overlay */}
        <div className="absolute inset-0 bg-slate-950/30 dark:bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 p-4 pointer-events-none group-hover:pointer-events-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetail(product);
            }}
            className="p-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-full shadow-md hover:text-cyan-600 dark:hover:text-cyan-300 hover:scale-105 transition-all touch-manipulation"
            title="View Details"
            aria-label="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={handleShare}
            className="p-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-full shadow-md hover:text-cyan-600 dark:hover:text-cyan-300 hover:scale-105 transition-all touch-manipulation"
            title="Copy Link"
            aria-label="Copy Link"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Admin Quick Actions: strictly for authenticated admin */}
        {isAdmin && (
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 z-20">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(product);
                }}
                className="p-2 bg-white/95 dark:bg-slate-800/95 text-slate-700 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-300 rounded-lg shadow-xs border border-slate-200 dark:border-slate-700 text-xs transition-colors active:scale-95 touch-manipulation min-h-[34px] min-w-[34px] flex items-center justify-center"
                title="Edit Product"
                aria-label="Edit Product"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(product.id);
                }}
                className="p-2 bg-white/95 dark:bg-slate-800/95 text-slate-700 dark:text-slate-200 hover:text-red-600 dark:hover:text-red-400 rounded-lg shadow-xs border border-slate-200 dark:border-slate-700 text-xs transition-colors active:scale-95 touch-manipulation min-h-[34px] min-w-[34px] flex items-center justify-center"
                title="Delete Product"
                aria-label="Delete Product"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Product Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 min-w-0">
        <div className="space-y-1.5 min-w-0">
          {/* Metadata */}
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400 min-w-0">
            <span className="truncate">{product.platform}</span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700 shrink-0">·</span>
            <span className="truncate text-slate-500 dark:text-slate-400 font-semibold">{product.category}</span>
          </div>

          {/* Title with Sweet Pea heading charm */}
          <h3 className="font-sweetpea font-bold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
            {formatDisplayTitle(product.title)}
          </h3>
        </div>

        {/* Pricing and Action */}
        <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
          <div className="flex items-baseline justify-between min-w-0">
            <div className="flex items-baseline gap-2 min-w-0">
              <span className="tabular-numbers text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-sweetpea">
                {product.currency}{product.price.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="tabular-numbers text-xs text-slate-400 dark:text-slate-500 line-through">
                  {product.currency}{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <span className="font-sweetpea text-[11px] text-slate-500 dark:text-slate-400 font-medium shrink-0">
              on {product.platform}
            </span>
          </div>

          {/* CTA Button: High-energy electric cyan & teal matching the images */}
          <button
            onClick={handleBuy}
            className="font-sweetpea w-full min-h-[44px] flex items-center justify-between py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 whitespace-nowrap active:scale-[0.98] touch-manipulation bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-700 hover:from-cyan-500 hover:to-teal-500 text-white shadow-md shadow-cyan-600/20 dark:from-cyan-400 dark:via-teal-300 dark:to-cyan-400 dark:text-slate-950 dark:font-extrabold dark:shadow-[0_0_18px_rgba(6,182,212,0.35)] dark:hover:shadow-[0_0_24px_rgba(6,182,212,0.5)] dark:hover:brightness-105"
          >
            <span>Buy on {product.platform}</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </article>
  );
};
