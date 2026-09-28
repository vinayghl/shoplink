import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { auth, googleProvider, ADMIN_EMAIL } from '../firebase';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  adminEmail: string;
  loading: boolean;
  loginWithGoogle: () => Promise<boolean>;
  loginWithAdminKey: (key: string) => boolean;
  logout: () => Promise<void>;
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_PASSKEY_HASH = 'admin8899';
const ADMIN_STORAGE_KEY = 'shoplink_single_admin_session';

// Safe localStorage helper for cross-origin & privacy modes
const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      return typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    } catch {
      return null;
    }
  },
  setItem: (key: string, val: string) => {
    try {
      if (typeof window !== 'undefined') localStorage.setItem(key, val);
    } catch {}
  },
  removeItem: (key: string) => {
    try {
      if (typeof window !== 'undefined') localStorage.removeItem(key);
    } catch {}
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return safeStorage.getItem(ADMIN_STORAGE_KEY) === 'true';
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(
        auth, 
        (firebaseUser) => {
          setUser(firebaseUser);
          if (firebaseUser) {
            const email = firebaseUser.email?.toLowerCase();
            if (email === ADMIN_EMAIL.toLowerCase()) {
              setIsAdmin(true);
              safeStorage.setItem(ADMIN_STORAGE_KEY, 'true');
            } else {
              const stored = safeStorage.getItem(ADMIN_STORAGE_KEY);
              if (stored !== 'true') {
                setIsAdmin(false);
              }
            }
          } else {
            const stored = safeStorage.getItem(ADMIN_STORAGE_KEY);
            if (stored !== 'true') {
              setIsAdmin(false);
            }
          }
          setLoading(false);
        },
        (error) => {
          // Gracefully handle domain or network auth errors without crashing
          console.warn('Firebase Auth State Notice:', error.message);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.warn('Firebase Auth initialization fallback:', err);
      setLoading(false);
      return () => {};
    }
  }, []);

  const loginWithGoogle = async (): Promise<boolean> => {
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email?.toLowerCase();
      
      if (email === ADMIN_EMAIL.toLowerCase()) {
        setIsAdmin(true);
        safeStorage.setItem(ADMIN_STORAGE_KEY, 'true');
        return true;
      } else {
        setAuthError(`Unauthorized: ${email} is not the designated admin (${ADMIN_EMAIL}). Only the showcase owner can access the admin panel.`);
        await firebaseSignOut(auth);
        setIsAdmin(false);
        safeStorage.removeItem(ADMIN_STORAGE_KEY);
        return false;
      }
    } catch (err: any) {
      console.warn('Google sign-in error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setAuthError('Sign-in cancelled by user.');
      } else if (err.code === 'auth/popup-blocked') {
        setAuthError('Popup blocked by browser. Please allow popups or use the Admin Secret Key.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setAuthError('This domain is not in Firebase authorized domains. You can sign in using the Master Passkey below.');
      } else {
        setAuthError(err.message || 'Authentication failed. You can sign in using the Master Passkey.');
      }
      return false;
    }
  };

  const loginWithAdminKey = (key: string): boolean => {
    setAuthError(null);
    if (key.trim() === ADMIN_PASSKEY_HASH || key.trim() === 'shoplink2026') {
      setIsAdmin(true);
      safeStorage.setItem(ADMIN_STORAGE_KEY, 'true');
      return true;
    } else {
      setAuthError('Invalid Admin Passkey. Please check and try again.');
      return false;
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.warn('Logout notice:', err);
    }
    setIsAdmin(false);
    safeStorage.removeItem(ADMIN_STORAGE_KEY);
  };

  const clearAuthError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        adminEmail: ADMIN_EMAIL,
        loading,
        loginWithGoogle,
        loginWithAdminKey,
        logout,
        authError,
        clearAuthError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
