import React from 'react';
import { motion } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';

const GenreChip = ({ genre, isSelected, onClick }) => {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      className={`relative px-6 py-3.5 rounded-2xl font-bold text-sm sm:text-base transition-all border-2 ${
        isSelected
          ? 'bg-primary-yellow border-primary-yellow text-white shadow-yellow-glow'
          : 'bg-card-bg border-card-border text-muted-text hover:border-primary-yellow/50 hover:bg-card-bg/80'
      }`}
    >
      <span className="flex items-center gap-2 justify-center">
        {genre}
        {isSelected && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            <FiCheck size={18} strokeWidth={3} />
          </motion.div>
        )}
      </span>
    </motion.button>
  );
};

export default GenreChip;



