import { useState, useCallback } from "react";
import { 
  signInWithEmailAndPassword,
  getRedirectResult,
  createUserWithEmailAndPassword, 
  updateProfile, 
  sendPasswordResetEmail, 
  confirmPasswordReset,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword as firebaseUpdatePassword,
  signInWithCredential,
  GoogleAuthProvider,
  type User
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../service/firebase";
import { getAuthErrorMessage } from "../data/authMessages";
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { AUTH_CONFIG } from "../service/authConfig";
import { Capacitor } from "@capacitor/core";

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
      const isNative = Capacitor.isNativePlatform();
      
      console.log("Initializing Google Auth...");
      await GoogleAuth.initialize({
        clientId: AUTH_CONFIG.GOOGLE_WEB_CLIENT_ID,
        ...(isNative ? { serverClientId: AUTH_CONFIG.GOOGLE_WEB_CLIENT_ID } : {}),
        scopes: ['profile', 'email'],
      });

      console.log("Starting Google Sign-In via Plugin...");
      const googleUser = await GoogleAuth.signIn();
      const idToken = googleUser.authentication.idToken;
      
      console.log("Google Auth Result found:", !!googleUser);
      
      if (!idToken) {
        throw new Error("Google login berhasil, tapi ID Token kosong. Pastikan Web Client ID di Firebase Console sudah benar dan sesuai dengan yang ada di capacitor.config.ts.");
      }

      console.log("Signing in with Firebase Credential...");
      const credential = GoogleAuthProvider.credential(idToken);
      const result = await signInWithCredential(auth, credential);
      
      console.log("Firebase Login Success, UID:", result.user.uid);
      await createUserDocument(result.user);
      
      return true;
    } catch (err: any) {
      console.error("CRITICAL: Google Login Error:", err);
      const errorMsg = err.message || (err.code ? getAuthErrorMessage(err.code) : "Unknown Error");
      setError(`Login Gagal: ${errorMsg}`);
      return false;
    } finally {
      setLoading(false);
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
      // Clear cached data before signing out
      const { useTransactionStore } = await import("../store/useTransactionStore");
      const { useChatStore } = await import("../store/useChatStore");
      useTransactionStore.getState().reset();
      useChatStore.getState().reset();

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
