/*
  src/AppRoutes.jsx
  Central route definitions for the app.
  // GENRE SYSTEM HARD RESET COMPLETE
*/
import React, { useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthContext } from './context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';

// Auth screens
import Login from './screens/Auth/LoginNew';
import Signup from './screens/Auth/SignupNew';

// Main screens
import HomePage from './pages/HomePage';
import MovieDetails from './pages/MovieDetails';
import SeriesDetails from './pages/SeriesDetails'; // Added
import Watchlist from './screens/Watchlist/Watchlist';
import Profile from './screens/Profile/Profile';
import SearchPage from './pages/SearchPage';
import GenreList from './screens/Genres/GenreList';
import IndianGenreResults from './screens/Genres/IndianGenreResults';
import ActorPage from './pages/ActorPage';

// Helper for Animations
const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

export const AppRoutes = ({ isAuthenticated }) => {
  const { isGuest } = useContext(AuthContext);
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Auth routes - public */}
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />

        {/* Protected routes - require authentication */}
        {isAuthenticated ? (
          <>
            {/* Main authenticated routes */}
            <Route path="/" element={<PageTransition><ProtectedRoute><HomePage /></ProtectedRoute></PageTransition>} />
            <Route path="/movie/:id" element={<PageTransition><ProtectedRoute><MovieDetails /></ProtectedRoute></PageTransition>} />
            <Route path="/tv/:id" element={<PageTransition><ProtectedRoute><SeriesDetails /></ProtectedRoute></PageTransition>} />
            <Route path="/series/:id" element={<PageTransition><ProtectedRoute><SeriesDetails /></ProtectedRoute></PageTransition>} />
            <Route path="/search" element={<PageTransition><ProtectedRoute><SearchPage /></ProtectedRoute></PageTransition>} />
            <Route path="/genres" element={<PageTransition><ProtectedRoute><GenreList /></ProtectedRoute></PageTransition>} />
            <Route path="/genres/:genreId" element={<PageTransition><ProtectedRoute><IndianGenreResults /></ProtectedRoute></PageTransition>} />
            <Route path="/genres/india/:type/:language/:genreId" element={<PageTransition><ProtectedRoute><IndianGenreResults /></ProtectedRoute></PageTransition>} />
            <Route path="/actor/:id" element={<PageTransition><ProtectedRoute><ActorPage /></ProtectedRoute></PageTransition>} />

            {/* Protected routes - require non-guest login */}
            <Route
              path="/watchlist"
              element={
                isGuest ? (
                  <Navigate to="/login" replace />
                ) : (
                  <PageTransition><ProtectedRoute><Watchlist /></ProtectedRoute></PageTransition>
                )
              }
            />
            <Route
              path="/profile"
              element={
                isGuest ? (
                  <Navigate to="/login" replace />
                ) : (
                  <PageTransition><ProtectedRoute><Profile /></ProtectedRoute></PageTransition>
                )
              }
            />

            {/* Catch all for authenticated users */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            {/* Default unauthenticated route - go to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Catch all for unauthenticated users */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}
      </Routes>
    </AnimatePresence>
  );
};



