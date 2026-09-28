import React from 'react';
import { 
  Instagram, 
  Youtube, 
  Send, 
  ArrowUpRight,
  Lock,
  LogOut,
  ShoppingBag,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface FooterProps {
  onOpenAuthModal: () => void;
  onOpenAdminDashboard: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAuthModal,
  onOpenAdminDashboard
}) => {
  const { isAdmin, adminEmail, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center">
                <ShoppingBag className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-base text-slate-900 dark:text-white">
                ShopLink
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              Curated product showcase with direct links to verified marketplace retailers including Amazon, Meesho, Flipkart, and Myntra.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>Instagram</span>
                <ArrowUpRight className="w-3 h-3 text-slate-400" />
              </a>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>YouTube</span>
                <ArrowUpRight className="w-3 h-3 text-slate-400" />
              </a>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
              <a
                href="https://telegram.org"
                target="_blank"
                rel="noreferrer"
                className="hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>Telegram</span>
                <ArrowUpRight className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Affiliate Disclosure */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Affiliate Disclosure
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              When you purchase through our links, we may receive an affiliate commission from the retailer at zero additional cost to you. Orders, payments, shipping, and returns are handled directly by the respective marketplace.
            </p>
          </div>

          {/* Admin Access */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Administrator
            </h4>
            {isAdmin ? (
              <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
                <p>Signed in as <span className="font-medium text-slate-900 dark:text-white">{adminEmail}</span></p>
                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={onOpenAdminDashboard}
                    className="font-semibold text-slate-900 dark:text-white hover:underline"
                  >
                    Open Admin Dashboard
                  </button>
                  <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                  <button
                    onClick={logout}
                    className="text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-1"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                <p>Website administrator portal for uploading and managing product deals.</p>
                <button
                  onClick={onOpenAuthModal}
                  className="inline-flex items-center gap-1 font-semibold text-slate-900 dark:text-white hover:underline pt-1"
                >
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span>Admin Sign In</span>
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 dark:text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} ShopLink Showcase. All brand trademarks belong to their respective marketplace owners.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Switch to Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-600" />
                  <span>Switch to Dark Mode</span>
                </>
              )}
            </button>
            <p>Optimized for all devices</p>
          </div>
        </div>

      </div>
    </footer>
  );
};
