import React, { useState } from 'react';
import { Lock, Key, X, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ isOpen, onClose }) => {
  const { loginWithGoogle, loginWithAdminKey, adminEmail, authError, clearAuthError } = useAuth();
  const [activeTab, setActiveTab] = useState<'passkey' | 'google'>('passkey');
  const [passkey, setPasskey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    clearAuthError();
    const success = await loginWithGoogle();
    setIsSubmitting(false);
    if (success) {
      setSuccessMsg('Authenticated as Showcase Admin.');
      setTimeout(() => {
        onClose();
        setSuccessMsg(null);
      }, 700);
    }
  };

  const handlePasskeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passkey.trim()) return;
    setIsSubmitting(true);
    const success = loginWithAdminKey(passkey);
    setIsSubmitting(false);
    if (success) {
      setSuccessMsg('Admin access verified.');
      setTimeout(() => {
        onClose();
        setSuccessMsg(null);
        setPasskey('');
      }, 700);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs">
      <div 
        className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Administrator Login
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Restricted to authorized showcase owner
            </p>
          </div>
          <button
            onClick={() => {
              clearAuthError();
              onClose();
            }}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold">
          <button
            onClick={() => {
              setActiveTab('passkey');
              clearAuthError();
            }}
            className={`py-1.5 rounded-md transition-colors ${
              activeTab === 'passkey'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Master Passkey
          </button>
          <button
            onClick={() => {
              setActiveTab('google');
              clearAuthError();
            }}
            className={`py-1.5 rounded-md transition-colors ${
              activeTab === 'google'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Google Sign In
          </button>
        </div>

        {authError && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{authError}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {activeTab === 'passkey' ? (
          <form onSubmit={handlePasskeySubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Admin Master Passkey
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="password"
                  placeholder="Enter administrator passkey"
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  required
                  autoFocus
                  className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-hidden text-slate-900 dark:text-white focus:border-slate-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !passkey}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
            >
              <span>Unlock Administrator Panel</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Verify using your Google account (<span className="font-semibold text-slate-700 dark:text-slate-300">{adminEmail}</span>).
            </p>

            <button
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Verifying...' : 'Sign in with Google'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="pt-1 text-center text-[11px] text-slate-400">
          Admin session will be safely remembered on this browser.
        </div>
      </div>
    </div>
  );
};
