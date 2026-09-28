import React, { useState } from 'react';
import { Lock, Key, X, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ isOpen, onClose }) => {
  const { loginWithGoogle, loginWithAdminKey, adminEmail, authError, clearAuthError } = useAuth();
  const [activeTab, setActiveTab] = useState<'google' | 'passkey'>('google');
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
      }, 900);
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
      }, 900);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h3 className="font-display text-base font-bold text-zinc-900 dark:text-white">
              Single Admin Sign-in
            </h3>
            <p className="text-[11px] text-zinc-400">
              Only {adminEmail} is authorized
            </p>
          </div>
          <button
            onClick={() => {
              clearAuthError();
              onClose();
            }}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="grid grid-cols-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-xs font-semibold">
          <button
            onClick={() => {
              setActiveTab('google');
              clearAuthError();
            }}
            className={`py-1.5 rounded-md transition-colors ${
              activeTab === 'google'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-2xs'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Google Login
          </button>
          <button
            onClick={() => {
              setActiveTab('passkey');
              clearAuthError();
            }}
            className={`py-1.5 rounded-md transition-colors ${
              activeTab === 'passkey'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-2xs'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Master Key
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

        {activeTab === 'google' ? (
          <div className="space-y-3">
            <p className="text-xs text-zinc-500 leading-relaxed">
              Verify your identity with your Google account. We match against your administrator address: <span className="font-mono text-zinc-800 dark:text-zinc-200 font-semibold">{adminEmail}</span>.
            </p>

            <button
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Verifying...' : 'Sign in with Google'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <form onSubmit={handlePasskeySubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Admin Passkey
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                <input
                  type="password"
                  placeholder="Enter secret key (e.g. shoplink2026)"
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  required
                  className="w-full pl-8 pr-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg outline-hidden text-zinc-900 dark:text-white focus:border-zinc-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !passkey}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
            >
              <span>Verify Access</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        <div className="pt-2 text-center text-[11px] text-zinc-400">
          Once authenticated, your session is remembered on this device.
        </div>
      </div>
    </div>
  );
};
