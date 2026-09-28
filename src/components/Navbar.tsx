import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  LogOut, 
  Plus, 
  X,
  Lock,
  LayoutGrid
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                setSearchQuery('');
                setSelectedCategory('All');
                if (isAdminDashboardOpen) onOpenAdminDashboard();
              }}
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                ShopLink
              </span>
            </a>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className={`hover:text-slate-900 transition-colors ${
                  selectedCategory === 'All' && !searchQuery
                    ? 'text-slate-900 font-bold'
                    : ''
                }`}
              >
                All Products
              </button>
              <button
                onClick={() => setSelectedCategory('Fashion & Apparel')}
                className={`hover:text-slate-900 transition-colors ${
                  selectedCategory === 'Fashion & Apparel'
                    ? 'text-slate-900 font-bold'
                    : ''
                }`}
              >
                Fashion
              </button>
              <button
                onClick={() => setSelectedCategory('Electronics & Tech')}
                className={`hover:text-slate-900 transition-colors ${
                  selectedCategory === 'Electronics & Tech'
                    ? 'text-slate-900 font-bold'
                    : ''
                }`}
              >
                Electronics
              </button>
              <button
                onClick={() => setSelectedCategory('Home & Decor')}
                className={`hover:text-slate-900 transition-colors ${
                  selectedCategory === 'Home & Decor'
                    ? 'text-slate-900 font-bold'
                    : ''
                }`}
              >
                Home &amp; Living
              </button>
            </nav>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="hidden sm:flex relative items-center w-56 lg:w-64">
              <Search className="absolute left-3 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-100 border border-slate-200 focus:border-slate-400 focus:bg-white rounded-lg outline-hidden text-slate-900 placeholder-slate-400 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="sm:hidden p-2 text-slate-600 hover:text-slate-900"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Admin Buttons */}
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenAddModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Product</span>
                </button>

                <button
                  onClick={onOpenAdminDashboard}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap ${
                    isAdminDashboardOpen
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Manage ({totalProductsCount})</span>
                </button>

                <button
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                  title="Sign out from Admin"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 bg-white rounded-lg transition-colors whitespace-nowrap"
              >
                <Lock className="w-3 h-3 text-slate-400" />
                <span>Admin Login</span>
              </button>
            )}

          </div>

        </div>

        {/* Mobile Search Expandable */}
        {isSearchOpen && (
          <div className="sm:hidden pb-3 pt-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-9 pr-8 py-2 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-900 outline-hidden"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
