import { useState, useCallback } from "react";
import { 
  signInWithEmailAndPassword, 
  signInWithRedirect, 
  getRedirectResult,
  createUserWithEmailAndPassword, 
  updateProfile, 
  sendPasswordResetEmail, 
  confirmPasswordReset,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword as firebaseUpdatePassword,
  type User
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "../service/firebase";
import { getAuthErrorMessage } from "../data/authMessages";

export const useAuthActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUserDocument = useCallback(async (user: User) => {
    const userRef = doc(db, "users", user.uid);
    const snapshot = await getDoc(userRef);
    if (!snapshot.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        name: user.displayName || user.email?.split("@")[0],
        balance: 0,
        createdAt: new Date().toISOString(),
      });
    }
  }, []);

  // Handle redirect result automatically
  const handleRedirectCallback = useCallback(async (onSuccess?: () => void) => {
    setLoading(true);
    try {
      const result = await getRedirectResult(auth);
      if (result) {
        await createUserDocument(result.user);
        onSuccess?.();
      }
    } catch (err: any) {
      console.error("Redirect Auth Error:", err);
      setError(getAuthErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  }, [createUserDocument]);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      return true;
    } catch (err: any) {
      setError(getAuthErrorMessage(err.code));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      // Switch from Popup to Redirect to avoid browser blocking
      await signInWithRedirect(auth, googleProvider);
      return true;
    } catch (err: any) {
      setError(getAuthErrorMessage(err.code));
      setLoading(false);
      return false;
    }
  };

  const register = async (email: string, pass: string) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const user = userCredential.user;
      
      const displayName = email.split("@")[0];
      await updateProfile(user, { displayName });
      await createUserDocument(user);
      
      return true;
    } catch (err: any) {
      setError(getAuthErrorMessage(err.code));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetPasswordEmail = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      const actionCodeSettings = {
        url: `${globalThis.location.origin}/auth/ResetPass`,
        handleCodeInApp: true,
      };
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      return true;
    } catch (err: any) {
      setError(getAuthErrorMessage(err.code));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const finalizePasswordReset = async (oobCode: string, newPass: string) => {
    setLoading(true);
    setError(null);
    try {
      await confirmPasswordReset(auth, oobCode, newPass);
      return true;
    } catch (err: any) {
      setError(getAuthErrorMessage(err.code));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (oldPass: string, newPass: string) => {
    const user = auth.currentUser;
    if (!user?.email) {
      setError("User session not found.");
      return false;
    }

    setLoading(true);
    setError(null);
    try {
      const credential = EmailAuthProvider.credential(user.email, oldPass);
      await reauthenticateWithCredential(user, credential);
      await firebaseUpdatePassword(user, newPass);
      return true;
    } catch (err: any) {
      setError(getAuthErrorMessage(err.code));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await auth.signOut();
      return true;
    } catch (err: any) {
      setError(getAuthErrorMessage(err.code));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    login,
    loginWithGoogle,
    register,
    resetPasswordEmail,
    finalizePasswordReset,
    changePassword,
    setError,
    handleRedirectCallback,
    logout
  };
};
