import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiCheck, FiStar } from 'react-icons/fi';
import { POSTER_BASE, PLACEHOLDER_POSTER } from '../utils/imageConstants';
import { isMobileDevice } from '../utils/isMobile';

const MovieCard = memo(({
  id,
  title,
  posterPath,
  rating,
  genre,
  year,
  rank,
  isInWatchlist,
  onToggleWatchlist,
  onNavigate
}) => {

  const isMobile = isMobileDevice();

  const handleWatchlistToggle = (e) => {
    e.stopPropagation();
    if (onToggleWatchlist) onToggleWatchlist();
  };

  const handleCardClick = () => {
    if (onNavigate) onNavigate();
  };

  // Animation Variants (Mobile Safe)
  const containerVariants = {
    rest: {
      y: 0,
      boxShadow: isMobile ? "none" : "0 4px 6px rgba(0, 0, 0, 0.1)"
    },
    hover: {
      y: isMobile ? 0 : -8,
      boxShadow: isMobile ? "none" : "0 10px 15px -3px rgba(0, 0, 0, 0.4)",
      transition: { duration: 0.3, ease: "easeOut" }
    },
    tap: { scale: 0.98 }
  };

  const overlayVariants = {
    rest: { opacity: 0 },
    hover: {
      opacity: isMobile ? 1 : 1,
      opacity: 1, // Simplified as decided
      transition: { duration: 0.2, ease: "easeOut" }
    }
  };

  // ----------------------------------------------------------------
  // RANKED CARD LAYOUT (Top 10)
  // ----------------------------------------------------------------
  if (rank) {
    return (
      <div
        className="relative group cursor-pointer flex items-end w-[240px] h-[260px] sm:w-[260px] sm:h-[300px] flex-shrink-0"
        onClick={handleCardClick}
      >
        {/* Huge Faded Number Behind */}
        <div className="absolute -left-8 bottom-0 z-0 h-full flex items-end pointer-events-none select-none">
          <span
            className="text-[180px] sm:text-[220px] leading-[0.8] font-black tracking-tighter text-[#121212] drop-shadow-lg"
            style={{
              WebkitTextStroke: '4px #444',
              color: '#121212',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            {rank}
          </span>
        </div>

        {/* Card Itself (Shifted Right) */}
        <motion.div
          className="relative z-10 w-[160px] aspect-[2/3] bg-[#121212] rounded-xl overflow-hidden ml-auto border border-white/10 shadow-lg"
          variants={containerVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
        >
          <img
            src={posterPath ? POSTER_BASE + posterPath : PLACEHOLDER_POSTER}
            alt={title}
            className="w-full h-full object-cover rounded-xl"
            loading="lazy"
            onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_POSTER; }}
          />

          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"
            variants={{ rest: { opacity: 0 }, hover: { opacity: 0.8, transition: { duration: 0.2 } } }}
          />

          <motion.div
            className="absolute inset-0 p-4 flex flex-col justify-end items-center text-center z-20"
            variants={overlayVariants}
          >
            <h4 className="text-white font-bold text-sm leading-tight line-clamp-2 mb-1">
              {title}
            </h4>
            <p className="text-[10px] text-gray-300 mb-2">{genre}</p>

            <div className="flex items-center gap-1 text-[#FFD400] text-xs font-medium mb-3">
              <FiStar fill="#FFD400" /> {rating}
            </div>

            <button className="bg-black/60 hover:bg-[#FFD400] hover:text-black text-white text-[10px] font-semibold py-1.5 px-3 rounded-full transition-colors duration-200 w-full">
              View Details
            </button>
          </motion.div>
        </motion.div>
      </div>
    );
  }




  return (
    <motion.div
      className="relative w-[160px] sm:w-[170px] aspect-[2/3] bg-[#121212] rounded-xl overflow-hidden cursor-pointer shadow-md border border-white/5"
      variants={containerVariants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      onClick={handleCardClick}
    >
      {/* Poster with Zoom */}
      <img
        src={posterPath ? POSTER_BASE + posterPath : PLACEHOLDER_POSTER}
        alt={title}
        className="w-full h-full object-cover rounded-xl"
        loading="lazy"
        onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_POSTER; }}
      />

      {/* Dark Gradient Overlay - Fades to 0.7 opacity */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none"
        variants={{
          rest: { opacity: 0 },
          hover: { opacity: 0.9, transition: { duration: 0.2 } }
        }}
      />

      {/* Content Overlay */}
      <motion.div
        className="absolute inset-0 p-3 z-20 flex flex-col justify-end items-start"
        variants={overlayVariants}
      >
        {/* Title */}
        <h4 className="text-white font-bold text-sm leading-tight line-clamp-2 drop-shadow-md mb-1 w-full text-left">
          {title}
        </h4>

        {/* Rating & Genre */}
        <div className="flex items-center justify-between w-full text-xs text-gray-300 font-medium mb-3">
          <span className="flex items-center gap-1 text-[#FFD400]">
            <FiStar size={10} fill="#FFD400" /> {rating}
          </span>
          <span className="opacity-80 truncate max-w-[80px] text-right">
            {genre}
          </span>
        </div>

        {/* View Details Button */}
        <div className="w-full">
          <button className="w-full bg-white/10 hover:bg-[#FFD400] hover:text-black border border-white/20 text-white text-xs font-semibold py-2 rounded-lg transition-colors duration-200">
            View Details
          </button>
        </div>
      </motion.div>

      {/* Watchlist Button */}
      <motion.div
        role="button"
        tabIndex={0}
        className={`absolute top-2 right-2 p-2 rounded-full border border-white/10 shadow-lg z-30 transition-colors
          ${isInWatchlist ? 'bg-[#FFD400] text-black' : 'bg-black/60 text-white hover:bg-[#FFD400] hover:text-black'}
        `}
        variants={{
          rest: { opacity: isInWatchlist ? 1 : 0, scale: 0.8 },
          hover: { opacity: 1, scale: 1, transition: { duration: 0.2 } }
        }}
        onClick={handleWatchlistToggle}
      >
        {isInWatchlist ? <FiCheck size={14} /> : <FiPlus size={14} />}
      </motion.div>

    </motion.div>
  );
});

export default MovieCard;
