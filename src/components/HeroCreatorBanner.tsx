import React from 'react';
import { 
  Instagram, 
  Youtube, 
  Send, 
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { PLATFORMS, DEFAULT_CATEGORIES } from '../types';

interface HeroCreatorBannerProps {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedPlatform: string;
  setSelectedPlatform: (plat: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  totalProducts: number;
}

export const HeroCreatorBanner: React.FC<HeroCreatorBannerProps> = ({
  selectedCategory,
  setSelectedCategory,
  selectedPlatform,
  setSelectedPlatform,
  sortBy,
  setSortBy,
  totalProducts
}) => {
  return (
    <section className="bg-white/90 dark:bg-[#080d16]/95 border-b border-slate-200/80 dark:border-cyan-500/20 backdrop-blur-md transition-colors duration-200 w-full max-w-full min-w-0 overflow-hidden relative">
      
      {/* Decorative neon accent bar on top (inspired by the glowing diagonal cyan bars in Image 1) */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-80 dark:opacity-100" />

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-5 pb-4 sm:pt-7 sm:pb-6 space-y-4 sm:space-y-5">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-6 min-w-0">
          <div className="max-w-2xl space-y-1.5 sm:space-y-2 min-w-0">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold font-sweetpea bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30">
              <Sparkles className="w-3 h-3 text-cyan-500" />
              <span>Verified Creator Showcase</span>
            </div>
            <h1 className="font-sweetpea text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors">
              Curated Product Showcase
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed transition-colors">
              Direct affiliate links to hand-selected products featured in my campaigns. Click any item to explore specifications and purchase directly from the original marketplace.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs font-medium pt-1 md:pt-0 shrink-0">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="font-sweetpea inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 hover:border-cyan-400 dark:hover:border-cyan-500/50 bg-white dark:bg-[#0c121e] transition-all hover:-translate-y-0.5 active:scale-95 touch-manipulation min-h-[36px] shadow-2xs"
              aria-label="Instagram profile"
            >
              <Instagram className="w-3.5 h-3.5 text-pink-500 shrink-0" />
              <span>Instagram</span>
              <ArrowUpRight className="w-3 h-3 text-slate-400 shrink-0" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="font-sweetpea inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 hover:border-cyan-400 dark:hover:border-cyan-500/50 bg-white dark:bg-[#0c121e] transition-all hover:-translate-y-0.5 active:scale-95 touch-manipulation min-h-[36px] shadow-2xs"
              aria-label="YouTube channel"
            >
              <Youtube className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span>YouTube</span>
              <ArrowUpRight className="w-3 h-3 text-slate-400 shrink-0" />
            </a>
            <a
              href="https://telegram.org"
              target="_blank"
              rel="noreferrer"
              className="font-sweetpea inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 hover:border-cyan-400 dark:hover:border-cyan-500/50 bg-white dark:bg-[#0c121e] transition-all hover:-translate-y-0.5 active:scale-95 touch-manipulation min-h-[36px] shadow-2xs"
              aria-label="Telegram channel"
            >
              <Send className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span>Telegram</span>
              <ArrowUpRight className="w-3 h-3 text-slate-400 shrink-0" />
            </a>
          </div>
        </div>

        {/* Marketplace Selection Row */}
        <div className="pt-3 sm:pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2 min-w-0">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-sweetpea font-bold uppercase tracking-wider text-[11px] text-slate-500 dark:text-slate-400">
              Filter by Marketplace
            </span>
            <span className="font-sweetpea tabular-numbers text-[11px] font-semibold text-cyan-600 dark:text-cyan-400">
              {totalProducts} {totalProducts === 1 ? 'product' : 'products'} available
            </span>
          </div>

          {/* Glowing filter pills */}
          <div className="w-full max-w-full min-w-0 overflow-hidden">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden overscroll-x-contain touch-pan-x">
              <button
                onClick={() => setSelectedPlatform('All')}
                className={`font-sweetpea px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 whitespace-nowrap shrink-0 touch-manipulation min-h-[34px] ${
                  selectedPlatform === 'All'
                    ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-sm shadow-cyan-600/25 dark:from-cyan-400 dark:to-teal-300 dark:text-slate-950 dark:font-extrabold dark:shadow-[0_0_14px_rgba(6,182,212,0.4)]'
                    : 'bg-slate-100 dark:bg-[#0e1524] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-cyan-600 dark:hover:text-cyan-300 border border-transparent dark:border-slate-800'
                }`}
              >
                All Platforms
              </button>
              {Object.keys(PLATFORMS).map((plat) => {
                const isSelected = selectedPlatform === plat;
                return (
                  <button
                    key={plat}
                    onClick={() => setSelectedPlatform(plat)}
                    className={`font-sweetpea px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 whitespace-nowrap shrink-0 touch-manipulation min-h-[34px] ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-sm shadow-cyan-600/25 dark:from-cyan-400 dark:to-teal-300 dark:text-slate-950 dark:font-extrabold dark:shadow-[0_0_14px_rgba(6,182,212,0.4)]'
                        : 'bg-slate-100 dark:bg-[#0e1524] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-cyan-600 dark:hover:text-cyan-300 border border-transparent dark:border-slate-800'
                    }`}
                  >
                    {PLATFORMS[plat].label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Category & Sorting Row */}
        <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
          
          {/* Category Tabs with Sweet Pea styling */}
          <div className="w-full sm:w-auto max-w-full min-w-0 overflow-hidden">
            <div className="flex items-center gap-3.5 overflow-x-auto pb-1.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden border-b sm:border-b-0 border-slate-200 dark:border-slate-800 overscroll-x-contain touch-pan-x">
              {DEFAULT_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`font-sweetpea text-xs pb-1.5 border-b-2 whitespace-nowrap shrink-0 transition-all duration-150 touch-manipulation ${
                      isSelected
                        ? 'border-cyan-500 text-cyan-600 dark:text-cyan-300 dark:border-cyan-400 font-bold'
                        : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto text-xs">
            <span className="font-sweetpea text-slate-500 dark:text-slate-400 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="font-sweetpea py-1.5 px-3 bg-slate-50 dark:bg-[#0c121e] border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 outline-hidden focus:border-cyan-500 dark:focus:border-cyan-400 transition-colors touch-manipulation min-h-[34px]"
            >
              <option value="featured">Featured First</option>
              <option value="popular">Most Popular</option>
              <option value="newest">Recently Added</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

        </div>

      </div>
    </section>
  );
};
