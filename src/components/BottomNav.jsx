import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IoHome, IoBookmark, IoPersonCircle, IoGrid, IoShuffle } from 'react-icons/io5';
import { UserContext } from '../context/UserContext';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkTheme } = useContext(UserContext);

  const navItems = [
    { icon: IoHome, label: 'Home', path: '/home' },
    { icon: IoShuffle, label: 'Random', path: '/random' },
    { icon: IoGrid, label: 'Genres', path: '/genres' },
    { icon: IoBookmark, label: 'Watchlist', path: '/watchlist' },
    { icon: IoPersonCircle, label: 'Profile', path: '/profile' },
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Bottom Navigation Bar */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring', damping: 20 }}
        className="fixed bottom-6 left-0 right-0 z-50 flex items-center justify-center px-4 pointer-events-none"
      >
        <div className={`pointer-events-auto w-full max-w-sm ${darkTheme ? 'bg-[#1f1f1f]/80' : 'bg-white/80'} backdrop-blur-xl border ${darkTheme ? 'border-white/10' : 'border-black/5'} rounded-full shadow-2xl relative transition-all duration-300`}>
          <div className="flex items-center justify-between p-2">
            {navItems.map(({ icon: Icon, label, path, action }) => {
              const active = path ? isActive(path) : false;
              return (
                <motion.button
                  key={label}
                  onClick={() => (action ? action() : path && navigate(path))}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative flex items-center justify-center h-12 rounded-full transition-all duration-300 ${active ? 'flex-1 bg-white/5' : 'w-12 hover:bg-white/5'}`}
                  type="button"
                >
                  {/* Active Glow Background */}
                  {active && (
                    <motion.div
                      layoutId="activeGlow"
                      className="absolute inset-0 bg-primary-yellow/10 rounded-full"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}

                  {/* Icon & Label Container */}
                  <div className="flex items-center gap-2 px-2 z-10">
                    <Icon
                      size={22}
                      className={`transition-colors duration-300 ${active ? 'text-primary-yellow drop-shadow-[0_0_8px_rgba(245,197,24,0.5)]' : 'text-gray-400'}`}
                    />

                    <AnimatePresence>
                      {active && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.3, ease: 'easeOut' }}
                          className="text-[11px] font-bold text-primary-yellow whitespace-nowrap overflow-hidden leading-none"
                        >
                          {label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Active Indicator Dot */}
                  {active && (
                    <motion.div
                      layoutId="activeDot"
                      className="absolute -bottom-1 w-1 h-1 bg-primary-yellow rounded-full shadow-[0_0_8px_primary-yellow]"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Spacer to prevent content overlap */}
      <div className="h-24" />
    </>
  );
};

export default BottomNav;



