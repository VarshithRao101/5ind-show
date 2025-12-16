// src/context/WatchlistContext.jsx
import React, { createContext, useState, useCallback, useEffect } from 'react';
import { useToast } from './ToastContext';

export const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  const { addToast } = useToast();
  // Only using 'savedForLater' as the main watchlist
  const [savedForLater, setSavedForLater] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('watchlist');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedForLater(parsed);
        } else if (parsed.savedForLater) {
          setSavedForLater(parsed.savedForLater);
        }
      } catch (e) {
        console.error('Failed to parse stored watchlist', e);
        setSavedForLater([]);
      }
    }

    // Load Notifications
    const storedNotifs = localStorage.getItem('notifications');
    if (storedNotifs) {
      try {
        const parsed = JSON.parse(storedNotifs);
        if (Array.isArray(parsed)) {
          setNotifications(parsed);
        } else {
          setNotifications([]);
        }
      } catch (e) {
        console.error('Failed to parse notifications', e);
        setNotifications([]);
      }
    }
  }, []);

  const persistWatchlist = useCallback((list) => {
    localStorage.setItem('watchlist', JSON.stringify({ savedForLater: list }));
  }, []);

  const persistNotifications = useCallback((list) => {
    localStorage.setItem('notifications', JSON.stringify(list));
    setNotifications(list);
  }, []);

  const addNotification = useCallback((title, message, image, type = 'info') => {
    const newNotif = {
      id: Date.now(),
      title,
      message,
      image,
      type, // 'success', 'info', 'alert', 'tv'
      timestamp: new Date().toISOString(),
      read: false
    };
    persistNotifications([newNotif, ...notifications].slice(0, 20)); // Keep last 20
  }, [notifications, persistNotifications]);

  const removeNotification = useCallback((id) => {
    const updated = notifications.filter(n => n.id !== id);
    persistNotifications(updated);
  }, [notifications, persistNotifications]);

  const markNotificationsRead = useCallback(() => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    persistNotifications(updated);
  }, [notifications, persistNotifications]);

  const addToWatchlist = useCallback((movie) => {
    setSavedForLater((prev) => {
      if (prev.find((p) => p.id === movie.id)) return prev;

      const isTv = movie.media_type === 'tv' || movie.name;
      const title = movie.title || movie.name;

      // Toast Feedback
      addToast(`Added to Watchlist: ${title}`, 'success');

      addNotification(
        "Added to Watchlist",
        title,
        movie.poster_path,
        isTv ? 'tv' : 'success'
      );

      const updated = [{
        id: movie.id,
        // Store strictly what we need for display & fallback
        poster_path: movie.poster_path, // Key for MovieCard
        backdrop_path: movie.backdrop_path, // Fallback
        image: movie.poster_path || movie.backdrop_path, // Legacy support
        title: title,
        genres: movie.genres,
        year: movie.year || new Date(movie.release_date || movie.first_air_date || Date.now()).getFullYear(),
        runtime: movie.runtime || '',
        vote_average: movie.vote_average,
        media_type: isTv ? 'tv' : 'movie',
        addedAt: Date.now()
      }, ...prev];
      persistWatchlist(updated);
      return updated;
    });
  }, [persistWatchlist, addNotification, addToast]);

  const removeFromWatchlist = useCallback((id) => {
    setSavedForLater((prev) => {
      const item = prev.find(p => p.id === id);
      if (item) {
        // Toast Feedback
        addToast(`Removed from Watchlist`, 'info');
        addNotification("Removed from Watchlist", item.title, item.poster_path, 'alert');
      }
      const updated = prev.filter((p) => p.id !== id);
      persistWatchlist(updated);
      return updated;
    });
  }, [persistWatchlist, addNotification, addToast]);

  const checkIfInWatchlist = useCallback((id) => {
    return savedForLater.some(item => item.id === id);
  }, [savedForLater]);

  const value = {
    currentlyWatching: [],
    savedForLater,
    notifications: notifications || [],
    addToWatchlist,
    removeFromWatchlist,
    checkIfInWatchlist,
    isInWatchlist: checkIfInWatchlist,
    markNotificationsRead,
    removeNotification,
    unreadCount: (notifications || []).filter(n => !n.read).length
  };

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
};
