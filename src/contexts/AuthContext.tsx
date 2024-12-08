import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  GoogleAuthProvider,
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/router';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
  signOut: async () => {},
  clearError: () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const clearError = () => setError(null);

  const signInWithGoogle = async () => {
    try {
      clearError();
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Google sign in error:', error);
      setError(error.message);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      clearError();
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Email sign in error:', error);
      setError(error.message);
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      clearError();
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Email sign up error:', error);
      setError(error.message);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      router.push('/login');
    } catch (error: any) {
      console.error('Sign out error:', error);
      setError(error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading,
      error,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      signOut,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);