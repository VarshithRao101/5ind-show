import React from 'react';
import { motion } from 'framer-motion';
import { FiTrash2 } from 'react-icons/fi';
import { getPosterUrl } from '../config/tmdbImage';

const NowWatchingItem = ({ item, onRemove, onUpdateProgress, onClick }) => {
  const progressPercentage = (item.progress || 0) * 100;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex gap-4 bg-[#111216] rounded-xl p-4 hover:bg-[#1a1a1f] transition-colors border border-gray-800 hover:border-gray-700"
    >
      {/* Poster Thumbnail */}
      <div
        onClick={onClick}
        className="flex-shrink-0 w-20 sm:w-24 h-32 sm:h-36 rounded-lg overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 cursor-pointer group"
      >
        <img
          src={getPosterUrl(item.image || item.poster_path)}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Content Column */}
      <div className="flex-1 flex flex-col justify-between py-1">
        {/* Title and Meta */}
        <div>
          <h3
            onClick={onClick}
            className="text-white font-semibold text-base sm:text-lg truncate hover:text-[#E11D1D] transition-colors cursor-pointer"
          >
            {item.title}
          </h3>
          <p className="text-[#9AA0A6] text-xs sm:text-sm mt-1">
            {item.genre} • {item.year} • {item.runtime}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#9AA0A6]">Progress</span>
            <span className="text-xs font-semibold text-[#E11D1D]">{Math.round(progressPercentage)}%</span>
          </div>
          <motion.div
            className="relative h-2 bg-[#1A1A1D] rounded-full overflow-hidden"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const newProgress = (e.clientX - rect.left) / rect.width;
              onUpdateProgress?.(item.id, Math.max(0, Math.min(1, newProgress)));
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="h-full bg-[#E11D1D] rounded-full cursor-pointer"
            />
          </motion.div>
        </div>
      </div>

      {/* Remove Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onRemove?.(item.id)}
        className="flex-shrink-0 text-gray-500 hover:text-red-500 transition-colors p-2"
        aria-label="Remove from watchlist"
      >
        <FiTrash2 size={20} />
      </motion.button>
    </motion.div>
  );
};

export default NowWatchingItem;



