import React from 'react';
import { 
  Instagram, 
  Youtube, 
  Send, 
  ArrowUpRight,
  Lock,
  LogOut,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface FooterProps {
  onOpenAuthModal: () => void;
  onOpenAdminDashboard: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAuthModal,
  onOpenAdminDashboard
}) => {
  const { isAdmin, adminEmail, logout } = useAuth();

  return (
    <footer className="bg-white border-t border-slate-200 transition-colors mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                <ShoppingBag className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-base text-slate-900">
                ShopLink
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Curated product showcase with direct links to verified marketplace retailers including Amazon, Meesho, Flipkart, and Myntra.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-slate-900 flex items-center gap-1 transition-colors"
              >
                <span>Instagram</span>
                <ArrowUpRight className="w-3 h-3 text-slate-400" />
              </a>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-slate-900 flex items-center gap-1 transition-colors"
              >
                <span>YouTube</span>
                <ArrowUpRight className="w-3 h-3 text-slate-400" />
              </a>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <a
                href="https://telegram.org"
                target="_blank"
                rel="noreferrer"
                className="hover:text-slate-900 flex items-center gap-1 transition-colors"
              >
                <span>Telegram</span>
                <ArrowUpRight className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Affiliate Disclosure */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Affiliate Disclosure
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              When you purchase through our links, we may receive an affiliate commission from the retailer at zero additional cost to you. Orders, payments, shipping, and returns are handled directly by the respective marketplace.
            </p>
          </div>

          {/* Admin Access */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Administrator
            </h4>
            {isAdmin ? (
              <div className="text-xs text-slate-600 space-y-1.5">
                <p>Signed in as <span className="font-medium text-slate-900">{adminEmail}</span></p>
                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={onOpenAdminDashboard}
                    className="font-semibold text-slate-900 hover:underline"
                  >
                    Open Admin Dashboard
                  </button>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <button
                    onClick={logout}
                    className="text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 space-y-1">
                <p>Website administrator portal for uploading and managing product deals.</p>
                <button
                  onClick={onOpenAuthModal}
                  className="inline-flex items-center gap-1 font-semibold text-slate-900 hover:underline pt-1"
                >
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span>Admin Sign In</span>
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <p>© {new Date().getFullYear()} ShopLink Showcase. All brand trademarks belong to their respective marketplace owners.</p>
          <p>Optimized for mobile, tablet &amp; desktop.</p>
        </div>

      </div>
    </footer>
  );
};
