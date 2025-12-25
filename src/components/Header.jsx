import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiSearch, FiFilter, FiUser, FiZap, FiX, FiBell, FiHeart, FiTv, FiAlertCircle, FiCheckSquare } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { UserContext } from '../context/UserContext';
import { AuthContext } from '../context/AuthContext';
import { FilterContext } from '../context/FilterContext';
import { WatchlistContext } from '../context/WatchlistContext';
import SmartImage from './SmartImage';
import { getTrendingAll } from '../services/tmdb';

// Helper
const getTimeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

// NAVIGATION FEATURES RESTORED - PROMPT A
const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkTheme } = useContext(UserContext);
  const { username, userAvatar } = useContext(AuthContext);
  const { openModal } = useContext(FilterContext);
  const { notifications, markNotificationsRead, unreadCount, removeNotification } = useContext(WatchlistContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef(null);

  // Scroll Listener
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click Outside Listener (Notifs only)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handlers
  const handleLogoClick = () => {
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterClick = () => {
    openModal();
  };

  const handleSurpriseClick = async () => {
    try {
      const results = await getTrendingAll();
      if (results && results.length > 0) {
        const randomItem = results[Math.floor(Math.random() * results.length)];
        if (randomItem.id) {
          const type = randomItem.media_type === 'tv' ? 'tv' : 'movie';
          navigate(`/${type}/${randomItem.id}`);
        }
      }
    } catch (error) {
      console.warn('Surprise failed', error);
    }
  };

  const toggleNotifs = () => {
    setShowNotifs(!showNotifs);
    if (!showNotifs && unreadCount > 0) {
      markNotificationsRead();
    }
  };


  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-[#0f0f0f]/95 backdrop-blur-md shadow-lg py-3'
        : 'bg-gradient-to-b from-black/80 to-transparent py-5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between gap-4">

        {/* 1. Logo */}
        <div
          onClick={handleLogoClick}
          className="flex items-center gap-2 cursor-pointer group flex-shrink-0"
        >
          <span className="font-heading font-black text-2xl tracking-tighter text-white">
            5IND<span className="text-primary-yellow">SHOW</span>
          </span>
        </div>

        {/* 2. Search Trigger (Fake Input) */}
        {location.pathname !== '/search' && (
          <div className="flex-1 max-w-xl relative px-4">
            <button
              onClick={() => navigate('/search')}
              className="w-full flex items-center bg-[#1f1f1f] border border-white/10 rounded-full px-4 py-2.5 transition-all duration-300 hover:border-primary-yellow hover:shadow-[0_0_15px_rgba(255,212,0,0.15)] group text-left outline-none"
            >
              <FiSearch className="text-gray-400 group-hover:text-primary-yellow transition-colors mr-3" size={20} />
              <span className="text-gray-500 font-medium">Search movies & TV...</span>
            </button>
          </div>
        )}

        {/* 3. Actions (Right) */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">

          {/* Random / Surprise Me */}
          <button
            onClick={handleSurpriseClick}
            className="p-2.5 rounded-full text-gray-300 hover:text-primary-yellow hover:bg-white/10 transition-all relative"
            title="Surprise Me"
          >
            <FiZap size={20} />
          </button>


          {/* Filter Modal Trigger */}
          <button
            onClick={handleFilterClick}
            className="p-2.5 rounded-full text-gray-300 hover:text-primary-yellow hover:bg-white/10 transition-all relative"
            title="Filters"
          >
            <FiFilter size={20} />
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={toggleNotifs}
              className="p-2.5 rounded-full text-gray-300 hover:text-primary-yellow hover:bg-white/10 transition-all relative"
              title="Notifications"
            >
              <FiBell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse ring-2 ring-[#0f0f0f]"></span>
              )}
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifs && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-[#181818] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 origin-top-right"
                >
                  <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#202020]">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-sm uppercase tracking-wide">Notifications</h3>
                      {unreadCount > 0 && <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded-full font-bold">{unreadCount}</span>}
                    </div>
                    {notifications.length > 0 && (
                      <button onClick={markNotificationsRead} className="text-xs text-primary-yellow hover:text-white flex items-center gap-1 transition-colors">
                        <FiCheckSquare /> Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center flex flex-col items-center justify-center text-gray-500">
                        <FiBell size={32} className="mb-2 opacity-20" />
                        <p className="text-sm">No notifications yet</p>
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <div key={notif.id} className={`p-4 hover:bg-white/5 border-b border-white/5 flex gap-3 relative group transition-colors ${!notif.read ? 'bg-white/[0.03]' : ''}`}>
                          {/* Icon/Image */}
                          <div className="w-12 h-16 bg-gray-800 rounded-md overflow-hidden flex-shrink-0 relative border border-white/10">
                            {notif.image ? (
                              <img src={`https://image.tmdb.org/t/p/w92${notif.image}`} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-700">
                                <FiBell className="text-gray-400" />
                              </div>
                            )}
                            {/* Type Icon Overlay */}
                            <div className="absolute bottom-0 right-0 bg-black/80 p-1 rounded-tl-md">
                              {notif.type === 'success' ? <FiHeart size={10} className="text-red-500" /> :
                                notif.type === 'tv' ? <FiTv size={10} className="text-blue-500" /> :
                                  notif.type === 'alert' ? <FiAlertCircle size={10} className="text-gray-400" /> :
                                    <FiBell size={10} className="text-yellow-500" />}
                            </div>
                          </div>

                          <div className="flex-1 min-w-0 pr-6">
                            <p className="text-xs font-bold text-gray-300 mb-0.5 line-clamp-1">{notif.title}</p>
                            <p className="text-sm text-white line-clamp-2 leading-snug">{notif.message}</p>
                            <p className="text-[10px] text-gray-500 mt-1.5 flex items-center gap-1">
                              {getTimeAgo(notif.timestamp)}
                              {!notif.read && <span className="w-1.5 h-1.5 rounded-full bg-primary-yellow inline-block ml-1"></span>}
                            </p>
                          </div>

                          {/* Dismiss Button */}
                          <button
                            onClick={(e) => { e.stopPropagation(); removeNotification(notif.id); }}
                            className="absolute top-2 right-2 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                            title="Dismiss"
                          >
                            <FiX size={14} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>


          {/* Profile */}
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 ml-2 pl-4 border-l border-white/10"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border border-white/20 flex items-center justify-center text-sm font-bold text-white hover:border-primary-yellow hover:shadow-yellow-glow transition-all overflow-hidden">
              {userAvatar ? (
                <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                username ? username[0].toUpperCase() : <FiUser />
              )}
            </div>
          </button>
        </div>

      </div>
    </header>
  );
};

export default Header;
