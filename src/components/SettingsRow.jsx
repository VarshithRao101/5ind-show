import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { FiChevronRight } from 'react-icons/fi';
import { UserContext } from '../context/UserContext';

const SettingsRow = ({ icon: Icon, title, subtitle, onClick, isDestructive = false, rightElement }) => {
  const { darkTheme } = useContext(UserContext);

  return (
    <motion.div
      role="button"
      tabIndex={0}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (onClick) onClick();
        }
      }}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${isDestructive
          ? 'bg-primary-yellow/10 hover:bg-primary-yellow/15 border-primary-yellow/30 shadow-yellow-glow'
          : darkTheme
            ? 'bg-card-bg-dark border-card-border-dark hover:shadow-card hover:border-primary-yellow/20'
            : 'bg-card-bg-light border-card-border-light hover:shadow-card-light hover:border-primary-yellow/20'
        }`}
    >
      {/* Left Icon */}
      <div
        className={`flex-shrink-0 p-3 rounded-xl ${isDestructive
            ? 'bg-primary-yellow/20 text-primary-yellow'
            : 'bg-primary-yellow/10 text-primary-yellow'
          }`}
      >
        <Icon size={22} />
      </div>

      {/* Title and Subtitle */}
      <div className="flex-1 text-left">
        <h3
          className={`font-bold text-base ${isDestructive ? 'text-primary-yellow' : darkTheme ? 'text-white' : 'text-text-light'
            }`}
        >
          {title}
        </h3>
        {subtitle && (
          <p className={`text-sm mt-0.5 ${darkTheme ? 'text-muted-text-dark' : 'text-muted-text-light'}`}>{subtitle}</p>
        )}
      </div>

      {/* Right Element or Arrow */}
      {rightElement ? (
        <div className="flex-shrink-0">{rightElement}</div>
      ) : (
        <FiChevronRight size={20} className={`flex-shrink-0 ${darkTheme ? 'text-muted-text-dark' : 'text-muted-text-light'}`} />
      )}
    </motion.div>
  );
};

export default SettingsRow;



