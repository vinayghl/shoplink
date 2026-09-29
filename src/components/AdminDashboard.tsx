import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Copy, 
  Check,
  ArrowLeft
} from 'lucide-react';
import { Product } from '../types';

interface AdminDashboardProps {
  products: Product[];
  onOpenAddModal: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => Promise<void>;
  onCloseDashboard: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  onOpenAddModal,
  onEditProduct,
  onDeleteProduct,
  onCloseDashboard
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Real Analytics based on actual user clicks
  const totalClicks = products.reduce((acc, p) => acc + (p.clicks || 0), 0);
  const totalFeatured = products.filter((p) => p.featured).length;
  
  const platformCounts: Record<string, number> = {};
  products.forEach((p) => {
    platformCounts[p.platform] = (platformCounts[p.platform] || 0) + 1;
  });

  const filteredProducts = products.filter((p) => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = selectedPlatform === 'All' || p.platform === selectedPlatform;
    return matchesSearch && matchesPlatform;
  });

  const handleCopyAffiliate = (id: string, url: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const confirmDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await onDeleteProduct(id);
      setDeleteConfirmId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="bg-slate-50/70 dark:bg-[#070b13] border-b border-slate-200 dark:border-slate-800 transition-colors duration-200 w-full min-w-0">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-5 sm:space-y-6">
        
        {/* Header with return button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <button
                onClick={onCloseDashboard}
                className="font-sweetpea inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline transition-colors"
                title="Return to Public Storefront"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Storefront</span>
              </button>
            </div>
            <h2 className="font-sweetpea text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Admin Product Manager
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Add new products, update prices and affiliate links, or remove items from your catalog.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAddModal}
              className="font-sweetpea flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-teal-600 dark:from-cyan-400 dark:to-teal-300 dark:text-slate-950 dark:font-extrabold rounded-xl shadow-xs dark:shadow-[0_0_14px_rgba(6,182,212,0.35)] transition-all touch-manipulation min-h-[40px]"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
            <button
              onClick={onCloseDashboard}
              className="font-sweetpea flex-1 sm:flex-none px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c121e] rounded-xl hover:bg-slate-100 dark:hover:bg-[#121b2d] transition-colors touch-manipulation min-h-[40px]"
            >
              Close Panel
            </button>
          </div>
        </div>

        {/* Metrics Row: 2x2 on mobile, 4 columns on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0c121e] border border-slate-200/90 dark:border-slate-800/90 shadow-2xs">
            <span className="font-sweetpea text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-bold">Total Products</span>
            <div className="font-sweetpea tabular-numbers text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {products.length}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0c121e] border border-slate-200/90 dark:border-slate-800/90 shadow-2xs">
            <span className="font-sweetpea text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-bold">Total Clicks</span>
            <div className="font-sweetpea tabular-numbers text-xl sm:text-2xl font-extrabold text-cyan-600 dark:text-cyan-400 mt-1">
              {totalClicks.toLocaleString()}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0c121e] border border-slate-200/90 dark:border-slate-800/90 shadow-2xs">
            <span className="font-sweetpea text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-bold">Featured Items</span>
            <div className="font-sweetpea tabular-numbers text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {totalFeatured}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0c121e] border border-slate-200/90 dark:border-slate-800/90 shadow-2xs">
            <span className="font-sweetpea text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-bold">Marketplaces</span>
            <div className="font-sweetpea tabular-numbers text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {Object.keys(platformCounts).length}
            </div>
          </div>
        </div>

        {/* Search & Marketplace Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search catalog products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="font-sweetpea w-full pl-8 pr-3 py-2 text-xs bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-slate-800 rounded-xl outline-hidden text-slate-900 dark:text-white focus:border-cyan-500 dark:focus:border-cyan-400 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <button
              onClick={() => setSelectedPlatform('All')}
              className={`font-sweetpea px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap shrink-0 transition-colors ${
                selectedPlatform === 'All'
                  ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white dark:from-cyan-400 dark:to-teal-300 dark:text-slate-950 dark:font-extrabold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-slate-800'
              }`}
            >
              All ({products.length})
            </button>
            {Object.keys(platformCounts).map((plat) => (
              <button
                key={plat}
                onClick={() => setSelectedPlatform(plat)}
                className={`font-sweetpea px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap shrink-0 transition-colors ${
                  selectedPlatform === plat
                    ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white dark:from-cyan-400 dark:to-teal-300 dark:text-slate-950 dark:font-extrabold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-slate-800'
                }`}
              >
                {plat} ({platformCounts[plat]})
              </button>
            ))}
          </div>
        </div>

        {/* MOBILE VIEW: Compact Cards with Sweet Pea style */}
        <div className="block md:hidden space-y-3">
          {filteredProducts.length === 0 ? (
            <div className="py-10 text-center text-xs font-sweetpea text-slate-400 dark:text-slate-500 bg-white dark:bg-[#0c121e] rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
              No products found. Tap &quot;Add Product&quot; to upload an item.
            </div>
          ) : (
            filteredProducts.map((p) => (
              <div 
                key={p.id}
                className="bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-4 space-y-3 shadow-2xs"
              >
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
                    <img
                      src={p.imageBase64}
                      alt={p.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-sweetpea text-[11px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                        {p.platform}
                      </span>
                      <span className="font-sweetpea tabular-numbers text-xs text-slate-400 dark:text-slate-500">
                        {p.clicks || 0} clicks
                      </span>
                    </div>
                    <h4 className="font-sweetpea font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1">
                      {p.title}
                    </h4>
                    <div className="flex items-baseline gap-2">
                      <span className="font-sweetpea tabular-numbers font-extrabold text-sm text-slate-900 dark:text-white">
                        {p.currency}{p.price.toLocaleString()}
                      </span>
                      {p.originalPrice && p.originalPrice > p.price && (
                        <span className="font-sweetpea tabular-numbers text-xs text-slate-400 dark:text-slate-500 line-through">
                          {p.currency}{p.originalPrice.toLocaleString()}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 font-sweetpea">· {p.category}</span>
                    </div>
                  </div>
                </div>

                {/* Mobile Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => onEditProduct(p)}
                    className="font-sweetpea flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#131d30] dark:hover:bg-[#1a2742] text-slate-800 dark:text-slate-200 transition-colors touch-manipulation min-h-[38px]"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-cyan-500" />
                    <span>Edit Product</span>
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(p.id)}
                    className="font-sweetpea flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 transition-colors touch-manipulation min-h-[38px]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* DESKTOP VIEW: Full Professional Table */}
        <div className="hidden md:block border border-slate-200 dark:border-slate-800/90 rounded-2xl overflow-hidden bg-white dark:bg-[#0c121e] shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-[#090f1a] border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-sweetpea font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Marketplace</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4 text-center">Clicks</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 dark:text-slate-500 font-sweetpea">
                      No products match your search. Click &quot;Add Product&quot; to upload an item.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => (
                    <tr 
                      key={p.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-[#111929]/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
                            <img
                              src={p.imageBase64}
                              alt={p.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="max-w-xs sm:max-w-sm">
                            <p className="font-sweetpea font-bold text-slate-900 dark:text-white truncate">
                              {p.title}
                            </p>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                              {p.description || 'No description provided'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-sweetpea font-bold text-cyan-600 dark:text-cyan-400">
                        {p.platform}
                      </td>

                      <td className="py-3 px-4 tabular-numbers font-sweetpea font-extrabold text-slate-900 dark:text-white">
                        {p.currency}{p.price.toLocaleString()}
                      </td>

                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-sweetpea">
                        {p.category}
                      </td>

                      <td className="py-3 px-4 tabular-numbers text-center text-slate-600 dark:text-slate-400 font-bold font-sweetpea">
                        {p.clicks || 0}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleCopyAffiliate(p.id, p.affiliateLink)}
                            className="p-1.5 text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 rounded-md transition-colors"
                            title="Copy Affiliate Link"
                          >
                            {copiedId === p.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <a
                            href={p.affiliateLink}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 rounded-md transition-colors"
                            title="Open Link"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => onEditProduct(p)}
                            className="p-1.5 text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 rounded-md transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(p.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 rounded-md transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 dark:bg-black/85 backdrop-blur-xs">
            <div className="w-full max-w-sm bg-white dark:bg-[#0c121e] rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="space-y-1">
                <h3 className="font-sweetpea text-base font-extrabold text-slate-900 dark:text-white">
                  Delete this product?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  This product will be permanently removed from your showcase and Firestore database.
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="font-sweetpea flex-1 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors touch-manipulation min-h-[40px]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmDelete(deleteConfirmId)}
                  disabled={isDeleting}
                  className="font-sweetpea flex-1 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl disabled:opacity-50 transition-colors touch-manipulation min-h-[40px]"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
