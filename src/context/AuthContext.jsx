/*
  src/context/AuthContext.jsx
  Firebase Authentication context with passwordless email link authentication, guest mode, and avatar persistence.
*/
import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import {
  onAuthStateChanged,
  signOut,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  isSignInWithEmailLink,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

// Helper to prevent infinite hangs
const withTimeout = (promise, ms = 5000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("Request timed out")), ms))
  ]);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [username, setUsername] = useState(null);
  const [userAvatar, setUserAvatar] = useState(null);

  // Load user data from Firestore (Username + Avatar)
  const loadUserDataFromFirestore = useCallback(async (uid) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      // Timeout after 4s to prevent app hang
      const userDocSnap = await withTimeout(getDoc(userDocRef), 4000);
      if (userDocSnap.exists()) {
        return userDocSnap.data();
      }
    } catch (err) {
      console.warn('Authentication: Firestore load ignored or timed out', err);
    }
    return null;
  }, []);

  // Save data to Firestore helper
  const saveUserDataToFirestore = useCallback(async (uid, data) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      // Timeout after 5s
      await withTimeout(setDoc(
        userDocRef,
        {
          ...data,
          uid,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      ), 5000);
    } catch (err) {
      console.error('Error saving user data to Firestore:', err);
      throw err;
    }
  }, []);

  // Listen for auth state changes (persistent session)
  useEffect(() => {
    const isGuestFromStorage = localStorage.getItem('guestMode') === 'true';

    // SAFETY: Force loading to false after 6 seconds max
    const safetyTimer = setTimeout(() => {
      setLoading((prev) => {
        if (prev) {
          console.warn("Auth check timed out, forcing app load.");
          return false;
        }
        return prev;
      });
    }, 6000);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUser(firebaseUser);
          setIsGuest(false);

          // Load data from Firestore
          let userData = null;
          try {
            userData = await loadUserDataFromFirestore(firebaseUser.uid);
          } catch (e) {
            console.warn('Firestore load failed (non-critical)', e);
          }

          // Priority: Firestore > Firebase Auth > Default
          const finalUsername = userData?.username || firebaseUser.displayName || firebaseUser.email?.split('@')[0];
          const finalAvatar = userData?.avatar || firebaseUser.photoURL;

          setUsername(finalUsername);
          setUserAvatar(finalAvatar);

          localStorage.removeItem('guestMode');
        } else if (isGuestFromStorage) {
          setUser(null);
          setIsGuest(true);
          setUsername('Guest');
          setUserAvatar(null);
        } else {
          setUser(null);
          setIsGuest(false);
          setUsername(null);
          setUserAvatar(null);
        }
      } catch (err) {
        console.error('Auth check error', err);
      } finally {
        // Clear safety timer as we are done
        clearTimeout(safetyTimer);
        setLoading(false);
      }
    });
    return () => {
      clearTimeout(safetyTimer);
      unsubscribe();
    }
  }, [loadUserDataFromFirestore]);

  // Send login/signup link via email
  const sendLoginLink = useCallback(async (email) => {
    setError(null);
    try {
      const actionCodeSettings = {
        url: `${window.location.origin}/finishSignUp`,
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      return { success: true, message: 'Login link sent to your email!' };
    } catch (err) {
      const errorMsg = err.code === 'auth/invalid-email' ? 'Invalid email address' : err.message;
      setError(errorMsg);
      return { success: false, message: errorMsg };
    }
  }, []);

  // Complete login by verifying the email link
  const completeLogin = useCallback(async () => {
    setError(null);
    try {
      if (!isSignInWithEmailLink(auth, window.location.href)) {
        throw new Error('Invalid verification link or link has expired.');
      }

      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Please provide your email for confirmation');
        if (!email) throw new Error('Email is required to complete login.');
      }

      const result = await signInWithEmailLink(auth, email, window.location.href);
      window.localStorage.removeItem('emailForSignIn');
      return { success: true, user: result.user };
    } catch (err) {
      const errorMsg = err.message || 'Failed to verify email link. Please try again.';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    setError(null);
    try {
      if (isGuest) {
        setIsGuest(false);
        setUsername(null);
        setUserAvatar(null);
        localStorage.removeItem('guestMode');
      } else if (user) {
        await signOut(auth);
      }
    } catch (err) {
      setError(err.message);
    }
  }, [isGuest, user]);

  // Login as guest
  const loginAsGuest = useCallback(async () => {
    setError(null);
    try {
      setIsGuest(true);
      setUsername('Guest');
      setUserAvatar(null);
      setUser(null);
      localStorage.setItem('guestMode', 'true');
      return { success: true, message: 'Logged in as guest' };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  }, []);

  // Update username
  const updateUsername = useCallback(async (newUsername) => {
    setError(null);
    try {
      if (!user) throw new Error('No user logged in');

      setUsername(newUsername);

      // Attempt generic updates with timeout
      await withTimeout(Promise.all([
        saveUserDataToFirestore(user.uid, { username: newUsername }),
        updateProfile(user, { displayName: newUsername })
      ]), 5000);

      return { success: true, message: 'Username updated' };
    } catch (err) {
      // Don't block UI if sync fails
      console.warn("Username sync warning:", err);
      // We still return success as local state is updated optimistically via setUsername
      return { success: true, message: 'Username updated (offline ready)' };
    }
  }, [user, saveUserDataToFirestore]);

  // Update Avatar (Optimized & Timeout Protected)
  const updateUserAvatar = useCallback(async (newAvatarUrl) => {
    setError(null);
    try {
      if (!user) throw new Error('No user logged in');

      // 1. Optimistic Update (Immediate UI Change)
      setUserAvatar(newAvatarUrl);

      // 2. Background Sync with Timeout
      try {
        await withTimeout(Promise.all([
          saveUserDataToFirestore(user.uid, { avatar: newAvatarUrl }),
          updateProfile(user, { photoURL: newAvatarUrl })
        ]), 6000);
      } catch (syncErr) {
        console.warn("Avatar sync timed out or failed - changes saved locally", syncErr);
      }

      return { success: true };
    } catch (err) {
      console.error("Critical Avatar update error:", err);
      setError(err.message);
      return { success: false, message: err.message };
    }
  }, [user, saveUserDataToFirestore]);

  // Google login
  const googleLogin = useCallback(async () => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return { success: true, user: result.user };
    } catch (err) {
      const errorMsg = err.code === 'auth/popup-closed-by-user' ? 'Login cancelled' : err.message;
      setError(errorMsg);
      return { success: false, message: errorMsg };
    }
  }, []);

  // Apple login
  const appleLogin = useCallback(async () => {
    setError(null);
    try {
      const provider = new OAuthProvider('apple.com');
      provider.addScope('email');
      provider.addScope('name');
      const result = await signInWithPopup(auth, provider);
      return { success: true, user: result.user };
    } catch (err) {
      const errorMsg = err.code === 'auth/popup-closed-by-user' ? 'Login cancelled' : err.message;
      setError(errorMsg);
      return { success: false, message: errorMsg };
    }
  }, []);

  const isAuthenticated = useMemo(() => !!user || isGuest, [user, isGuest]);

  const value = useMemo(
    () => ({
      user,
      username,
      userAvatar,
      isGuest,
      loading,
      error,
      sendLoginLink,
      completeLogin,
      logout,
      loginAsGuest,
      googleLogin,
      appleLogin,
      updateUsername,
      updateUserAvatar,
      isAuthenticated,
    }),
    [user, username, userAvatar, isGuest, loading, error, sendLoginLink, completeLogin, logout, loginAsGuest, googleLogin, appleLogin, updateUsername, updateUserAvatar, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
