import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  LogOut, 
  Plus, 
  X, 
  Lock, 
  LayoutGrid, 
  Sun, 
  Moon, 
  Store 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onOpenAddModal: () => void;
  onOpenAuthModal: () => void;
  onOpenAdminDashboard: () => void;
  isAdminDashboardOpen: boolean;
  totalProductsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onOpenAddModal,
  onOpenAuthModal,
  onOpenAdminDashboard,
  isAdminDashboardOpen,
  totalProductsCount
}) => {
  const { isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#070b13]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-2xs transition-colors duration-200 w-full max-w-full min-w-0">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4 min-w-0">
          
          {/* Brand Logo with Sweet Pea font & glowing cyan shopping bag icon */}
          <div className="flex items-center gap-4 md:gap-6 min-w-0 shrink-0">
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                setSearchQuery('');
                setSelectedCategory('All');
                if (isAdminDashboardOpen) onOpenAdminDashboard();
              }}
              className="flex items-center gap-2 group transition-transform hover:scale-[1.02] shrink-0"
              aria-label="ShopLink Home"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-500 dark:from-cyan-400 dark:to-teal-300 text-white dark:text-slate-950 flex items-center justify-center shadow-xs dark:shadow-[0_0_12px_rgba(6,182,212,0.4)] transition-all shrink-0">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="font-sweetpea text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors">
                Shop<span className="text-cyan-600 dark:text-cyan-400">Link</span>
              </span>
            </a>

            {/* Navigation Links for desktop */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-sweetpea font-semibold text-slate-600 dark:text-slate-300">
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className={`hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors ${
                  selectedCategory === 'All' && !searchQuery
                    ? 'text-cyan-600 dark:text-cyan-400 font-bold'
                    : ''
                }`}
              >
                All Products
              </button>
              <button
                onClick={() => setSelectedCategory('Fashion & Apparel')}
                className={`hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors ${
                  selectedCategory === 'Fashion & Apparel'
                    ? 'text-cyan-600 dark:text-cyan-400 font-bold'
                    : ''
                }`}
              >
                Fashion
              </button>
              <button
                onClick={() => setSelectedCategory('Electronics & Tech')}
                className={`hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors ${
                  selectedCategory === 'Electronics & Tech'
                    ? 'text-cyan-600 dark:text-cyan-400 font-bold'
                    : ''
                }`}
              >
                Electronics
              </button>
              <button
                onClick={() => setSelectedCategory('Home & Decor')}
                className={`hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors ${
                  selectedCategory === 'Home & Decor'
                    ? 'text-cyan-600 dark:text-cyan-400 font-bold'
                    : ''
                }`}
              >
                Home &amp; Living
              </button>
            </nav>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Desktop Search Input with WebMCP Declarative Tool annotations */}
            <form 
              role="search"
              aria-label="Product search"
              // @ts-expect-error WebMCP declarative attribute
              toolname="search_products"
              tooldescription="Search products and creator deals by keyword, category, or marketplace platform"
              onSubmit={(e) => e.preventDefault()}
              className="hidden sm:flex relative items-center w-48 lg:w-60"
            >
              <Search className="absolute left-3 w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                name="query"
                // @ts-expect-error WebMCP parameter
                toolparam="query"
                aria-label="Search products"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="font-sweetpea w-full pl-8 pr-7 py-1.5 text-xs bg-slate-100 dark:bg-[#0c121e] border border-slate-200 dark:border-slate-800 focus:border-cyan-500 dark:focus:border-cyan-400 focus:bg-white dark:focus:bg-[#070b13] rounded-xl outline-hidden text-slate-900 dark:text-white placeholder-slate-400 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="sm:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors touch-manipulation min-h-[36px] min-w-[36px] flex items-center justify-center"
              title="Search"
              aria-label="Open search input"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Theme Toggle Switch */}
            <button
              onClick={toggleTheme}
              type="button"
              role="switch"
              aria-checked={theme === 'dark'}
              aria-label="Toggle dark mode"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-100 hover:bg-slate-200 dark:bg-[#0c121e] dark:hover:bg-[#111929] text-slate-700 dark:text-slate-200 text-xs font-medium transition-all shadow-2xs cursor-pointer select-none touch-manipulation min-h-[36px]"
            >
              {theme === 'dark' ? (
                <>
                  <div className="w-4 h-4 rounded-full bg-cyan-400/20 text-cyan-300 flex items-center justify-center">
                    <Sun className="w-3 h-3 text-cyan-300" />
                  </div>
                  <span className="hidden md:inline text-[11px] font-sweetpea font-bold text-cyan-300">Dark</span>
                </>
              ) : (
                <>
                  <div className="w-4 h-4 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center">
                    <Moon className="w-3 h-3" />
                  </div>
                  <span className="hidden md:inline text-[11px] font-sweetpea font-bold">Light</span>
                </>
              )}
            </button>

            {/* Admin Controls */}
            {isAdmin ? (
              <div className="flex items-center gap-1 sm:gap-1.5">
                <button
                  onClick={onOpenAddModal}
                  className="font-sweetpea flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-teal-600 dark:from-cyan-400 dark:to-teal-300 dark:text-slate-950 dark:font-extrabold rounded-xl shadow-xs dark:shadow-[0_0_12px_rgba(6,182,212,0.35)] transition-all whitespace-nowrap touch-manipulation min-h-[36px]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Add</span>
                </button>

                <button
                  onClick={onOpenAdminDashboard}
                  className={`font-sweetpea flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all whitespace-nowrap touch-manipulation min-h-[36px] ${
                    isAdminDashboardOpen
                      ? 'bg-cyan-600 text-white border-cyan-600 dark:bg-cyan-400 dark:text-slate-950 dark:border-cyan-400'
                      : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title={isAdminDashboardOpen ? 'Switch to Storefront view' : 'Open Admin Workspace'}
                >
                  {isAdminDashboardOpen ? (
                    <>
                      <Store className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Storefront</span>
                    </>
                  ) : (
                    <>
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Manage</span>
                      <span className="text-[11px] opacity-80">({totalProductsCount})</span>
                    </>
                  )}
                </button>

                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors touch-manipulation min-h-[36px] min-w-[36px] flex items-center justify-center rounded-xl"
                  title="Sign out from Admin"
                  aria-label="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="font-sweetpea flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-300 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c121e] rounded-xl transition-colors whitespace-nowrap touch-manipulation min-h-[36px] shadow-2xs"
              >
                <Lock className="w-3 h-3 text-cyan-500" />
                <span>Admin Login</span>
              </button>
            )}

          </div>

        </div>

        {/* Mobile Search Expandable */}
        {isSearchOpen && (
          <div className="sm:hidden pb-3 pt-1">
            <form 
              role="search"
              aria-label="Mobile product search"
              onSubmit={(e) => e.preventDefault()}
              className="relative"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                name="query_mobile"
                aria-label="Search products"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="font-sweetpea w-full pl-9 pr-8 py-2 text-xs bg-slate-100 dark:bg-[#0c121e] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white outline-hidden"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  aria-label="Clear mobile search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>
          </div>
        )}

      </div>
    </header>
  );
};
