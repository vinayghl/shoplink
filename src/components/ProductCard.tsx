import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  Share2, 
  Check, 
  Edit3, 
  Trash2,
  Eye
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

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetail,
  onBuyClick,
  onEdit,
  onDelete
}) => {
  const { isAdmin } = useAuth();
  const [copied, setCopied] = useState(false);

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = `${product.title}\nBuy on ${product.platform}: ${product.affiliateLink}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBuyClick(product);
  };

  return (
    <article 
      onClick={() => onOpenDetail(product)}
      className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs hover:shadow-md transition-all duration-200 ease-out flex flex-col justify-between overflow-hidden cursor-pointer hover:-translate-y-0.5"
    >
      {/* Product Image */}
      <div className="relative aspect-square w-full bg-slate-50 dark:bg-slate-800 overflow-hidden">
        <img
          src={product.imageBase64}
          alt={product.title}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-300 ease-out"
        />

        {/* Featured Tag */}
        {product.featured && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-slate-900/90 dark:bg-white/95 text-white dark:text-slate-900 rounded-md backdrop-blur-xs">
              Featured
            </span>
          </div>
        )}

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-2.5 right-2.5 z-10">
            <span className="px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 rounded-md">
              {discountPercent}% OFF
            </span>
          </div>
        )}

        {/* Hover Quick Actions */}
        <div className="absolute inset-0 bg-slate-900/20 dark:bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetail(product);
            }}
            className="p-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg shadow-sm hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:scale-105"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={handleShare}
            className="p-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg shadow-sm hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:scale-105"
            title="Copy Link"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Admin Quick Actions */}
        {isAdmin && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 z-20">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(product);
                }}
                className="p-1.5 bg-white/95 dark:bg-slate-800/95 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white rounded-md shadow-xs border border-slate-200 dark:border-slate-700 text-xs transition-colors"
                title="Edit Product"
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
                className="p-1.5 bg-white/95 dark:bg-slate-800/95 text-slate-700 dark:text-slate-200 hover:text-red-600 dark:hover:text-red-400 rounded-md shadow-xs border border-slate-200 dark:border-slate-700 text-xs transition-colors"
                title="Delete Product"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Product Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Metadata */}
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <span>{product.platform}</span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
            <span>{product.category}</span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {product.title}
          </h3>
        </div>

        {/* Pricing and Action */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="tabular-numbers text-base font-bold text-slate-900 dark:text-white">
                {product.currency}{product.price.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="tabular-numbers text-xs text-slate-400 dark:text-slate-500 line-through">
                  {product.currency}{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              on {product.platform}
            </span>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleBuy}
            className="w-full flex items-center justify-between py-2 px-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold rounded-lg shadow-xs transition-all duration-150 whitespace-nowrap active:scale-[0.99]"
          >
            <span>Buy on {product.platform}</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </article>
  );
};
