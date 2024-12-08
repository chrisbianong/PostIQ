import { auth } from '@/lib/firebase';
import { 
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut
} from 'firebase/auth';

export const handleGoogleSignIn = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'select_account'
  });
  return signInWithPopup(auth, provider);
};

export const handleEmailSignIn = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const handleEmailSignUp = async (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const handleSignOut = async () => {
  return firebaseSignOut(auth);
};