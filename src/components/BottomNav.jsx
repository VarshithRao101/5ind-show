import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { IoHome, IoBookmark, IoPersonCircle, IoGrid } from 'react-icons/io5';
import { UserContext } from '../context/UserContext';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkTheme } = useContext(UserContext);

  const navItems = [
    { icon: IoHome, label: 'Home', path: '/' },
    { icon: IoGrid, label: 'Genres', path: '/genres' },
    { icon: IoBookmark, label: 'Watchlist', path: '/watchlist' },
    { icon: IoPersonCircle, label: 'Profile', path: '/profile' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Bottom Navigation Bar */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        className="fixed bottom-6 left-0 right-0 z-50 flex items-center justify-center px-4 pointer-events-none"
      >
        <div className={`pointer-events-auto flex items-center gap-3 md:gap-4 p-2.5 rounded-[28px] ${darkTheme ? 'bg-[#121212]/70' : 'bg-white/70'} backdrop-blur-3xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.3)]`}>
          <LayoutGroup>
            {navItems.map(({ icon: Icon, label, path }) => {
              const active = isActive(path);

              return (
                <motion.button
                  key={label}
                  layout
                  onClick={() => navigate(path)}
                  className={`relative flex items-center justify-center h-12 md:h-14 rounded-[24px] px-4 md:px-6 overflow-hidden transition-colors duration-300 isolate`}
                  initial={false}
                  animate={{
                    width: active ? 'auto' : 56, // Slightly wider inactive touch target
                    backgroundColor: active ? '#FFD400' : 'transparent'
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Icon */}
                  <motion.div
                    layout="position"
                    className="z-10 flex items-center justify-center"
                  >
                    <Icon
                      size={24}
                      className={`transition-colors duration-300 ${active ? 'text-black' : 'text-gray-300 group-hover:text-white'
                        }`}
                    />
                  </motion.div>

                  {/* Label (Only visible when active) */}
                  <AnimatePresence mode='popLayout'>
                    {active && (
                      <motion.span
                        initial={{ opacity: 0, x: -8, width: 0 }}
                        animate={{ opacity: 1, x: 0, width: 'auto' }}
                        exit={{ opacity: 0, x: -8, width: 0 }}
                        transition={{
                          duration: 0.3,
                        }}
                        className="ml-2.5 text-sm font-bold text-black whitespace-nowrap z-10"
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Hover State (Subtle) */}
                  {!active && (
                    <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity rounded-[24px] -z-10" />
                  )}
                </motion.button>
              );
            })}
          </LayoutGroup>
        </div>
      </motion.div>

      {/* Spacer */}
      <div className="h-24 md:hidden" />
    </>
  );
};

export default BottomNav;



