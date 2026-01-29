import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiCheck, FiStar } from 'react-icons/fi';
import { getPosterUrl } from '../utils/imageUtils';
import { PLACEHOLDER_POSTER } from '../utils/imageConstants';
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

  // Animation Variants
  const rankedCardVariants = {
    rest: { y: 0, scale: 1, boxShadow: "0 4px 6px rgba(0,0,0,0.1)" },
    hover: { y: -8, scale: 1, boxShadow: "0 10px 15px rgba(0,0,0,0.4)", transition: { duration: 0.3 } },
    tap: { scale: 0.98 }
  };

  const standardCardVariants = {
    rest: { y: 0 },
    hover: { y: -8, transition: { duration: 0.3 } },
    tap: { scale: 0.98 }
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
          variants={rankedCardVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
        >
          <img
            src={getPosterUrl(posterPath, isMobile)}
            alt={title}
            className="w-full h-full object-cover rounded-xl"
            loading="lazy"
            onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_POSTER; }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />

          <div className="absolute inset-0 p-4 flex flex-col justify-end items-center text-center z-20">
            <h4 className="text-white font-bold text-sm leading-tight line-clamp-2 mb-1">
              {title}
            </h4>
            <p className="text-[10px] text-gray-300 mb-2">{genre}</p>

            <div className="flex items-center gap-1 text-[#FFD400] text-xs font-medium mb-3">
              <FiStar fill="#FFD400" /> {rating}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ----------------------------------------------------------------
  // STANDARD CARD LAYOUT (Text Below Image)
  // ----------------------------------------------------------------
  return (
    <motion.div
      className="relative flex flex-col gap-3 w-[160px] sm:w-[170px] cursor-pointer group mb-2"
      variants={standardCardVariants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      onClick={handleCardClick}
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full bg-[#121212] rounded-xl overflow-hidden shadow-md border border-white/5 group-hover:shadow-2xl transition-all duration-300">
        <img
          src={getPosterUrl(posterPath, isMobile)}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_POSTER; }}
        />

        {/* Watchlist Button */}
        <div
          role="button"
          tabIndex={0}
          className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md border border-white/10 z-30 shadow-lg transition-colors duration-200
            ${isInWatchlist ? 'bg-[#FFD400] text-black' : 'bg-black/40 text-white hover:bg-[#FFD400] hover:text-black'}
          `}
          onClick={handleWatchlistToggle}
        >
          {isInWatchlist ? <FiCheck size={12} /> : <FiPlus size={12} />}
        </div>
      </div>

      {/* Details Below Poster */}
      <div className="flex flex-col px-0.5 space-y-1">
        <h4 className="text-gray-100 font-bold text-[13px] leading-tight line-clamp-2 group-hover:text-[#FFD400] transition-colors duration-200">
          {title}
        </h4>
        <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium">
          <div className="flex items-center gap-2">
            {rating && rating !== "N/A" && rating !== "NR" && (
              <>
                <span className="flex items-center gap-1 text-[#FFD400]">
                  <FiStar size={10} fill="#FFD400" /> {rating}
                </span>
                <span className="text-gray-600">•</span>
              </>
            )}
            <span className="truncate max-w-[80px]">{genre}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default MovieCard;
