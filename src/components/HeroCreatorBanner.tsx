import React from 'react';
import { 
  Instagram, 
  Youtube, 
  Send, 
  ArrowUpRight
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
    <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6 space-y-6">
        
        {/* Professional Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors">
              Curated Product Showcase
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">
              Direct affiliate links to verified products featured in my campaigns. Click any item to explore specifications and purchase directly from the original marketplace.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-2.5 text-xs font-medium">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800 transition-all hover:-translate-y-0.5"
            >
              <Instagram className="w-3.5 h-3.5 text-pink-500" />
              <span>Instagram</span>
              <ArrowUpRight className="w-3 h-3 text-slate-400" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800 transition-all hover:-translate-y-0.5"
            >
              <Youtube className="w-3.5 h-3.5 text-red-500" />
              <span>YouTube</span>
              <ArrowUpRight className="w-3 h-3 text-slate-400" />
            </a>
            <a
              href="https://telegram.org"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800 transition-all hover:-translate-y-0.5"
            >
              <Send className="w-3.5 h-3.5 text-blue-500" />
              <span>Telegram</span>
              <ArrowUpRight className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>

        {/* Marketplace Selection Row */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-400 dark:text-slate-500">
              Filter by Marketplace
            </span>
            <span className="tabular-numbers">
              {totalProducts} products available
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedPlatform('All')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 whitespace-nowrap ${
                selectedPlatform === 'All'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
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
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 whitespace-nowrap ${
                    isSelected
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {PLATFORMS[plat].label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category & Sorting Row */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none border-b sm:border-b-0 border-slate-200 dark:border-slate-800">
            {DEFAULT_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs font-medium pb-1.5 border-b-2 whitespace-nowrap transition-all duration-150 ${
                    isSelected
                      ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white font-semibold'
                      : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto text-xs">
            <span className="text-slate-500 dark:text-slate-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-1 px-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 outline-hidden focus:border-slate-400 dark:focus:border-slate-500 transition-colors"
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
