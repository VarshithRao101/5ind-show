import React from 'react';
import { motion } from 'framer-motion';

const ThemeToggle = ({ enabled, onChange }) => {
  return (
    <motion.div
      role="button"
      tabIndex={0}
      initial={false}
      animate={{ backgroundColor: enabled ? '#E11D1D' : '#4B5563' }}
      transition={{ duration: 0.2 }}
      onClick={() => onChange(!enabled)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onChange(!enabled);
        }
      }}
      className="relative inline-flex h-8 w-14 items-center rounded-full bg-gray-700 transition-colors focus:outline-none cursor-pointer"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ x: enabled ? 28 : 4 }}
        transition={{ type: 'spring', stiffness: 500, damping: 40 }}
        className="inline-block h-6 w-6 transform rounded-full bg-white shadow-lg"
      />
    </motion.div>
  );
};

export default ThemeToggle;



