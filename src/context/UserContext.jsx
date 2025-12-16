/*
  UserContext.jsx
  User profile and preferences with localStorage persistence.
*/
import React, { createContext, useState, useCallback, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    avatarUrl: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22150%22 height=%22150%22%3E%3Crect fill=%22%23333%22 width=%22150%22 height=%22150%22/%3E%3Ctext x=%2275%22 y=%2275%22 font-family=%22Arial%22 font-size=%2248%22 fill=%22%23888%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3EAJ%3C/text%3E%3C/svg%3E',
    bio: 'Movie lover · Curator of late-night watchlists',
  });

  const [darkTheme, setDarkTheme] = useState(true);
  const [notifications, setNotifications] = useState(true);
  // Load preferences from localStorage on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem('darkTheme');
    const storedNotifications = localStorage.getItem('notifications');
    if (storedTheme !== null) setDarkTheme(JSON.parse(storedTheme));
    if (storedNotifications !== null) setNotifications(JSON.parse(storedNotifications));
  }, []);

  const toggleDarkTheme = useCallback(() => {
    setDarkTheme((v) => {
      const next = !v;
      localStorage.setItem('darkTheme', JSON.stringify(next));
      return next;
    });
  }, []);

  const toggleNotifications = useCallback(() => {
    setNotifications((v) => {
      const next = !v;
      localStorage.setItem('notifications', JSON.stringify(next));
      return next;
    });
  }, []);

  const signOut = useCallback(() => {
    // Sign out logic
  }, []);

  const updateUser = useCallback((updates) => {
    setUser((u) => ({ ...u, ...updates }));
  }, []);

  const value = {
    user,
    darkTheme,
    notifications,
    toggleDarkTheme,
    toggleNotifications,
    signOut,
    updateUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};



