import React from 'react';
import { motion } from 'framer-motion';
import { FiFilm } from 'react-icons/fi';

const EmptyWatchlistState = ({ onBrowse }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-20 px-4"
    >
      {/* Icon */}
      <div className="mb-6">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-6xl text-[#9AA0A6] opacity-50"
        >
          <FiFilm size={80} />
        </motion.div>
      </div>

      {/* Text */}
      <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-2">
        No movies added yet
      </h2>
      <p className="text-[#9AA0A6] text-center mb-8 max-w-md">
        Add movies to your watchlist to see them here. Start exploring and save your favorite films!
      </p>

      {/* CTA Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBrowse}
        className="bg-[#E11D1D] hover:bg-[#d01818] text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-lg"
      >
        Browse Movies
      </motion.button>
    </motion.div>
  );
};

export default EmptyWatchlistState;



