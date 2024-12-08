import { FirebaseError } from 'firebase/app';

export const getAuthErrorMessage = (error: FirebaseError): string => {
  switch (error.code) {
    case 'auth/popup-blocked':
      return 'Popup was blocked. Please enable popups for this site and try again.';
    case 'auth/popup-closed-by-user':
      return 'Sign in was cancelled. Please try again.';
    case 'auth/invalid-email':
      return 'Invalid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    default:
      return 'An error occurred during authentication. Please try again.';
  }
};