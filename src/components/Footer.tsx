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
  Moon,
  AlertTriangle,
  WifiOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface FooterProps {
  onOpenAuthModal: () => void;
  onOpenAdminDashboard: () => void;
  onOpenErrorModal?: (type: '404' | 'offline') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAuthModal,
  onOpenAdminDashboard,
  onOpenErrorModal
}) => {
  const { isAdmin, adminEmail, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <footer className="bg-white/85 dark:bg-[#070b13]/85 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200 mt-12 sm:mt-16 w-full max-w-full min-w-0">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6 sm:space-y-8 min-w-0">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 min-w-0">
          
          {/* Brand */}
          <div className="space-y-2.5 sm:space-y-3 min-w-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-500 dark:from-cyan-400 dark:to-teal-300 text-white dark:text-slate-950 flex items-center justify-center shadow-xs shrink-0">
                <ShoppingBag className="w-3.5 h-3.5" />
              </div>
              <span className="font-sweetpea font-bold text-base text-slate-900 dark:text-white">
                Shop<span className="text-cyan-600 dark:text-cyan-400">Link</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              Curated product showcase with direct links to verified marketplace retailers including Amazon, Meesho, Flipkart, and Myntra.
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="font-sweetpea hover:text-cyan-600 dark:hover:text-cyan-400 flex items-center gap-1 transition-colors"
                aria-label="Instagram profile"
              >
                <span>Instagram</span>
                <ArrowUpRight className="w-3 h-3 text-slate-400 shrink-0" />
              </a>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="font-sweetpea hover:text-cyan-600 dark:hover:text-cyan-400 flex items-center gap-1 transition-colors"
                aria-label="YouTube channel"
              >
                <span>YouTube</span>
                <ArrowUpRight className="w-3 h-3 text-slate-400 shrink-0" />
              </a>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
              <a
                href="https://telegram.org"
                target="_blank"
                rel="noreferrer"
                className="font-sweetpea hover:text-cyan-600 dark:hover:text-cyan-400 flex items-center gap-1 transition-colors"
                aria-label="Telegram channel"
              >
                <span>Telegram</span>
                <ArrowUpRight className="w-3 h-3 text-slate-400 shrink-0" />
              </a>
            </div>
          </div>

          {/* Affiliate Disclosure */}
          <div className="space-y-1.5 sm:space-y-2 min-w-0">
            <h4 className="font-sweetpea text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Affiliate Disclosure
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              When you purchase through our links, we may receive an affiliate commission from the retailer at zero additional cost to you. Orders, payments, shipping, and returns are handled directly by the respective marketplace.
            </p>
          </div>

          {/* Admin & System Access */}
          <div className="space-y-1.5 sm:space-y-2 min-w-0">
            <h4 className="font-sweetpea text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              System &amp; Admin
            </h4>
            {isAdmin ? (
              <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
                <p>Signed in as <span className="font-medium text-slate-900 dark:text-white">{adminEmail}</span></p>
                <div className="flex flex-wrap items-center gap-2 pt-1 font-sweetpea">
                  <button
                    onClick={onOpenAdminDashboard}
                    className="font-bold text-cyan-600 dark:text-cyan-400 hover:underline min-h-[36px] flex items-center touch-manipulation"
                  >
                    Admin Dashboard
                  </button>
                  <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                  <button
                    onClick={logout}
                    className="text-slate-500 dark:text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1 min-h-[36px] touch-manipulation"
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
                  className="font-sweetpea inline-flex items-center gap-1 font-bold text-cyan-600 dark:text-cyan-400 hover:underline pt-1 min-h-[36px] touch-manipulation"
                >
                  <Lock className="w-3 h-3 text-cyan-500" />
                  <span>Admin Sign In</span>
                </button>
              </div>
            )}

            {/* Custom Error Page Preview Triggers */}
            {onOpenErrorModal && (
              <div className="flex items-center gap-2 pt-2 text-[11px] font-sweetpea text-slate-500 dark:text-slate-400">
                <span className="opacity-70">Error Screens:</span>
                <button
                  onClick={() => onOpenErrorModal('404')}
                  className="text-cyan-600 dark:text-cyan-400 hover:underline inline-flex items-center gap-0.5"
                  title="View custom 404 error page"
                >
                  <AlertTriangle className="w-3 h-3" />
                  <span>404 Page</span>
                </button>
                <span>·</span>
                <button
                  onClick={() => onOpenErrorModal('offline')}
                  className="text-cyan-600 dark:text-cyan-400 hover:underline inline-flex items-center gap-0.5"
                  title="View offline notice"
                >
                  <WifiOff className="w-3 h-3" />
                  <span>No Internet</span>
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Bottom */}
        <div className="pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-400 dark:text-slate-500 gap-3 min-w-0">
          <p>© {new Date().getFullYear()} ShopLink Showcase. All brand trademarks belong to their respective marketplace owners.</p>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={toggleTheme}
              className="font-sweetpea flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#0c121e] hover:bg-slate-200 dark:hover:bg-[#121c2e] text-slate-700 dark:text-slate-300 font-bold transition-colors touch-manipulation min-h-[34px] border border-slate-200/80 dark:border-slate-800"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Light Theme</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-600" />
                  <span>Dark Theme</span>
                </>
              )}
            </button>
            <p className="font-sweetpea text-[11px]">Dynamic Theme Backgrounds</p>
          </div>
        </div>

      </div>
    </footer>
  );
};
