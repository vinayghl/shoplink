import React, { useState } from 'react';
import { 
  X, 
  ArrowUpRight, 
  Copy, 
  Check, 
  ShieldCheck
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
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-slate-200 my-8 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="text-slate-900 font-bold uppercase">{product.platform}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>{product.category}</span>
          </div>
          
          <div className="flex items-center gap-2">
            {isAdmin && onEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(product);
                }}
                className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-md transition-colors"
              >
                Edit Product
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[80vh] overflow-y-auto">
          
          {/* Image */}
          <div className="space-y-3">
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-50 border border-slate-200">
              <img
                src={product.imageBase64}
                alt={product.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              {discountPercent > 0 && (
                <div className="absolute top-3 left-3 px-2 py-0.5 bg-emerald-600 text-white text-xs font-bold rounded-md">
                  {discountPercent}% OFF
                </div>
              )}
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-500">Share product link:</span>
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 font-semibold text-slate-800 hover:text-slate-950 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Details & CTA */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              <h2 className="text-xl font-bold text-slate-900 leading-snug">
                {product.title}
              </h2>

              {/* Pricing Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-baseline gap-3">
                  <span className="tabular-numbers text-3xl font-bold text-slate-900">
                    {product.currency}{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="tabular-numbers text-sm text-slate-400 line-through">
                      {product.currency}{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Save {product.currency}{savingsAmount.toLocaleString()} ({discountPercent}%)
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  Marketplace deal price on {product.platform}. Subject to retailer stock and coupons.
                </p>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Product Details
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {product.description || 'Verified product details from official marketplace.'}
                </p>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {product.tags.map((tag, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Purchase CTA */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <button
                onClick={() => onBuyClick(product)}
                className="w-full flex items-center justify-center gap-2 py-3 px-5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs"
              >
                <span>Buy Now on {product.platform}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-slate-400 text-center leading-normal">
                Opens directly in official {product.platform} store. Purchases may earn an affiliate commission at no extra charge to you.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
