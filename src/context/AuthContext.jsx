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
  // GUEST-FIRST DEFAULT STATE (Non-blocking)
  // We assume Guest mode immediately so the UI renders without waiting.
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // No longer blocking
  const [error, setError] = useState(null);
  const [isGuest, setIsGuest] = useState(true); // Default to True
  const [username, setUsername] = useState('Guest'); // Default to Guest
  const [userAvatar, setUserAvatar] = useState(null);

  // Load user data from Firestore (Username + Avatar)
  // NON-BLOCKING: This updates the UI *after* initial render if data exists.
  const loadUserDataFromFirestore = useCallback(async (uid) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      // Timeout after 3s to prevent background hangs (doesn't block UI)
      const userDocSnap = await withTimeout(getDoc(userDocRef), 3000);
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
      // Don't throw, just log. We don't want to break the app flow.
    }
  }, []);

  // Listen for auth state changes (Side Effect)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // User detected - Upgrade from Guest to User
          setUser(firebaseUser);
          setIsGuest(false);

          // Optimistic defaults while fetching Firestore
          const defaultName = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User';
          setUsername(defaultName);
          setUserAvatar(firebaseUser.photoURL || null);

          // Fetch robust details in background (does not block UI)
          loadUserDataFromFirestore(firebaseUser.uid).then((userData) => {
            if (userData) {
              if (userData.username) setUsername(userData.username);
              if (userData.avatar) setUserAvatar(userData.avatar);
            }
          }).catch(e => console.warn("Background profile fetch failed", e));

          localStorage.removeItem('guestMode');
        } else {
          // No user - Fallback to Guest (or effectively remain Guest)
          // We only check localStorage to see if they explicitly "Logged out" vs "Never logged in"
          // But for "Guest First", we just stay as Guest.
          setUser(null);
          setIsGuest(true);
          setUsername('Guest');
          setUserAvatar(null);
        }
      } catch (err) {
        console.error('Auth check error - Failing Open to Guest', err);
        // Fail Open: Ensure we are at least in Guest mode
        setIsGuest(true);
        setUsername('Guest');
      }
    });

    return () => unsubscribe();
  }, [loadUserDataFromFirestore]);

  // Send login/signup link via email
  const sendLoginLink = useCallback(async (email) => {
    setError(null);
    try {
      const actionCodeSettings = {
        url: "https://5ind-show.vercel.app",
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

  // AUTO SIGN-IN ON APP LOAD (Step 2)
  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem("emailForSignIn");
      if (!email) {
        email = window.prompt("Please confirm your email to complete sign in");
      }
      signInWithEmailLink(auth, email, window.location.href)
        .then((result) => {
          window.localStorage.removeItem("emailForSignIn");
          console.log("Email link auto login successful");
          setUser(result.user); // Ensure state updates immediately
        })
        .catch((err) => console.error("Email link login failed", err));
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
        // "Logout" from guest just resets defaults, though effectively same state
        console.log("Guest logout (noop)");
      } else if (user) {
        await signOut(auth);
      }
      // Force state reset
      setUser(null);
      setIsGuest(true);
      setUsername('Guest');
      setUserAvatar(null);
      localStorage.removeItem('guestMode');
    } catch (err) {
      setError(err.message);
      // Even if error, force guest mode locally
      setIsGuest(true);
    }
  }, [isGuest, user]);

  // Login as guest
  const loginAsGuest = useCallback(async () => {
    // Explicit guest entry
    setIsGuest(true);
    setUsername('Guest');
    setUserAvatar(null);
    setUser(null);
    localStorage.setItem('guestMode', 'true');
    return { success: true, message: 'Logged in as guest' };
  }, []);

  // Update username
  const updateUsername = useCallback(async (newUsername) => {
    setError(null);
    try {
      if (!user) throw new Error('No user logged in');

      setUsername(newUsername);

      // Attempt generic updates with timeout - NON BLOCKING catch
      saveUserDataToFirestore(user.uid, { username: newUsername }).catch(e => console.warn("Firestore save failed", e));
      updateProfile(user, { displayName: newUsername }).catch(e => console.warn("Profile update failed", e));

      return { success: true, message: 'Username updated' };
    } catch (err) {
      console.warn("Username sync warning:", err);
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

      // 2. Background Sync
      Promise.all([
        saveUserDataToFirestore(user.uid, { avatar: newAvatarUrl }),
        updateProfile(user, { photoURL: newAvatarUrl })
      ]).catch(syncErr => {
        console.warn("Avatar sync timed out - changes saved locally", syncErr);
      });

      return { success: true };
    } catch (err) {
      console.error("Critical Avatar update error:", err);
      // Revert if critical? No, allow local update.
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
      loading, // Dependent components might still check this, it's always false now
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
