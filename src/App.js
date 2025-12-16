/*
  src/App.js
  Main app shell with context providers and routing.
*/
import React, { useContext } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { UserProvider, UserContext } from './context/UserContext';
import { FilterProvider } from './context/FilterContext';
import { GenreProvider, GenreContext } from './context/GenreContext';
import { WatchlistProvider } from './context/WatchlistContext';
import { ToastProvider } from './context/ToastContext';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import { AppRoutes } from './AppRoutes';
import FilterModal from './components/FilterModal';
import ChatBot from './components/ChatBot/ChatBot';
import OfflineBanner from './components/OfflineBanner';
import LoadingScreen from './components/LoadingScreen';

const AppContent = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const { selectedGenres } = useContext(GenreContext);
  const { darkTheme } = useContext(UserContext);
  const location = useLocation();

  // Pages where header/footer should not appear
  const hideHeaderFooterPaths = ['/login', '/signup', '/genres'];
  const showHeaderFooter =
    isAuthenticated &&
    !hideHeaderFooterPaths.includes(location.pathname) &&
    location.pathname !== '/';

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkTheme ? 'bg-app-bg-dark text-white' : 'bg-app-bg-light text-text-light'}`}>
      <OfflineBanner />
      {showHeaderFooter && <Header />}

      <FilterModal />

      <div>
        <AppRoutes
          isAuthenticated={isAuthenticated}
          hasSelectedGenres={selectedGenres && selectedGenres.length > 0}
        />
      </div>

      {isAuthenticated && <ChatBot />}
      {showHeaderFooter && <BottomNav />}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <FilterProvider>
            <GenreProvider>
              <ToastProvider>
                <WatchlistProvider>
                  <AppContent />
                </WatchlistProvider>
              </ToastProvider>
            </GenreProvider>
          </FilterProvider>
        </UserProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
