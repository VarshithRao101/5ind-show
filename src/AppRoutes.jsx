/*
  src/AppRoutes.jsx
  Central route definitions for the app.
*/
import React, { useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthContext } from './context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';

// Auth screens
import Login from './screens/Auth/LoginNew';
import Signup from './screens/Auth/SignupNew';
import FinishSignUp from './screens/Auth/FinishSignUp';

// Main screens
import HomePage from './pages/HomePage';
import MovieDetails from './pages/MovieDetails';
import SeriesPage from "./pages/SeriesPage";
import Watchlist from './screens/Watchlist/Watchlist';
import Profile from './screens/Profile/Profile';
import RandomMovieFeed from './screens/RandomMovieFeed';
import TestTmdb from './screens/Test/TestTmdb';

// NEW Pages (Genre & Language Overhaul)
import GenresPage from './pages/GenresPage';
import GenreDetail from './pages/GenreDetail';
import LanguageDetail from './pages/LanguageDetail';
import DubbedDetail from './pages/DubbedDetail';
import SearchPage from './pages/SearchPage';
import FilterPage from './pages/FilterPage';
import UnifiedResultsPage from './pages/UnifiedResultsPage';
import ActorPage from './pages/ActorPage';
import LanguagesPage from './pages/LanguagesPage';

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
        <Route path="/finishSignUp" element={<PageTransition><FinishSignUp /></PageTransition>} />

        {/* Test route - for debugging */}
        <Route path="/test-tmdb" element={<TestTmdb />} />

        {/* Protected routes - require authentication */}
        {isAuthenticated ? (
          <>
            {/* Main authenticated routes */}
            <Route path="/home" element={<PageTransition><ProtectedRoute><HomePage /></ProtectedRoute></PageTransition>} />

            {/* 
                NEW GENRE & LANGUAGE ROUTES 
            */}
            <Route path="/genres" element={<PageTransition><ProtectedRoute><GenresPage /></ProtectedRoute></PageTransition>} />
            <Route path="/genre/:genreId" element={<PageTransition><ProtectedRoute><GenreDetail /></ProtectedRoute></PageTransition>} />
            <Route path="/language/:langCode" element={<PageTransition><ProtectedRoute><LanguageDetail /></ProtectedRoute></PageTransition>} />
            <Route path="/dubbed/:langCode" element={<PageTransition><ProtectedRoute><DubbedDetail /></ProtectedRoute></PageTransition>} />
            <Route path="/languages" element={<PageTransition><ProtectedRoute><LanguagesPage /></ProtectedRoute></PageTransition>} />
            <Route path="/series/:id" element={<PageTransition><ProtectedRoute><SeriesPage /></ProtectedRoute></PageTransition>} />


            <Route path="/movie/:id" element={<PageTransition><ProtectedRoute><MovieDetails /></ProtectedRoute></PageTransition>} />
            <Route path="/tv/:id" element={<PageTransition><ProtectedRoute><SeriesPage /></ProtectedRoute></PageTransition>} />
            <Route path="/search" element={<PageTransition><ProtectedRoute><SearchPage /></ProtectedRoute></PageTransition>} />
            <Route path="/filters" element={<PageTransition><ProtectedRoute><FilterPage /></ProtectedRoute></PageTransition>} />
            <Route path="/results" element={<PageTransition><ProtectedRoute><UnifiedResultsPage /></ProtectedRoute></PageTransition>} />
            <Route path="/actor/:personId" element={<PageTransition><ProtectedRoute><ActorPage /></ProtectedRoute></PageTransition>} />


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

            <Route path="/random" element={<PageTransition><ProtectedRoute><RandomMovieFeed /></ProtectedRoute></PageTransition>} />

            {/* Default authenticated route - Always go to home */}
            <Route
              path="/"
              element={<Navigate to="/home" replace />}
            />

            {/* Catch all for authenticated users */}
            <Route path="*" element={<Navigate to="/home" replace />} />
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



