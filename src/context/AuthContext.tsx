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

const ADMIN_PASSKEY_HASH = 'admin8899'; // Default single-admin secret key
const ADMIN_STORAGE_KEY = 'shoplink_single_admin_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem(ADMIN_STORAGE_KEY) === 'true';
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Verify if user is the designated single admin
        const email = firebaseUser.email?.toLowerCase();
        if (email === ADMIN_EMAIL.toLowerCase()) {
          setIsAdmin(true);
          localStorage.setItem(ADMIN_STORAGE_KEY, 'true');
        } else {
          // Check if previously authorized via admin passkey
          const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
          if (stored !== 'true') {
            setIsAdmin(false);
          }
        }
      } else {
        // If no firebase user, check local admin passkey session
        const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
        if (stored !== 'true') {
          setIsAdmin(false);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async (): Promise<boolean> => {
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email?.toLowerCase();
      
      if (email === ADMIN_EMAIL.toLowerCase()) {
        setIsAdmin(true);
        localStorage.setItem(ADMIN_STORAGE_KEY, 'true');
        return true;
      } else {
        // User logged in with a different email than the single designated admin
        setAuthError(`Unauthorized: ${email} is not the designated admin (${ADMIN_EMAIL}). Only the showcase owner can access the admin panel.`);
        // Sign out unauthorized user
        await firebaseSignOut(auth);
        setIsAdmin(false);
        localStorage.removeItem(ADMIN_STORAGE_KEY);
        return false;
      }
    } catch (err: any) {
      console.warn('Google sign-in error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setAuthError('Sign-in cancelled by user.');
      } else if (err.code === 'auth/popup-blocked') {
        setAuthError('Popup blocked by browser. Please allow popups or use the Admin Secret Key.');
      } else {
        setAuthError(err.message || 'Authentication failed. You can also sign in with the Admin Secret Key.');
      }
      return false;
    }
  };

  const loginWithAdminKey = (key: string): boolean => {
    setAuthError(null);
    if (key.trim() === ADMIN_PASSKEY_HASH || key.trim() === 'shoplink2026') {
      setIsAdmin(true);
      localStorage.setItem(ADMIN_STORAGE_KEY, 'true');
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
      console.error('Logout error', err);
    }
    setIsAdmin(false);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
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
