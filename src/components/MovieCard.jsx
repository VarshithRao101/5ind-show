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
        className="relative group cursor-pointer flex items-end w-[200px] h-[220px] sm:w-[260px] sm:h-[300px] flex-shrink-0"
        onClick={handleCardClick}
      >
        <div className="absolute -left-6 bottom-0 z-0 h-full flex items-end pointer-events-none select-none">
          <span
            className="text-[140px] sm:text-[220px] leading-[0.8] font-black tracking-tighter text-[#121212] drop-shadow-lg"
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
          className="relative z-10 w-[140px] sm:w-[160px] aspect-[2/3] bg-[#121212] rounded-xl overflow-hidden ml-auto border border-white/10 shadow-lg"
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
      className="relative flex flex-col gap-2 sm:gap-3 w-full cursor-pointer group mb-4"
      variants={standardCardVariants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      onClick={handleCardClick}
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full bg-[#1a1a1a] rounded-xl overflow-hidden shadow-lg border border-white/5 group-hover:shadow-yellow-glow/20 transition-all duration-300">
        <img
          src={getPosterUrl(posterPath, isMobile)}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_POSTER; }}
        />

        {/* Watchlist Button */}
        <div
          role="button"
          tabIndex={0}
          className={`absolute top-2 right-2 p-1.5 sm:p-2 rounded-full backdrop-blur-md border border-white/10 z-30 shadow-xl transition-all duration-200 active:scale-90
            ${isInWatchlist ? 'bg-primary-yellow text-black' : 'bg-black/60 text-white hover:bg-primary-yellow hover:text-black'}
          `}
          onClick={handleWatchlistToggle}
        >
          {isInWatchlist ? <FiCheck size={14} /> : <FiPlus size={14} />}
        </div>

        {/* Rating Overlay (Mobile Only - Bottom Left) */}
        {isMobile && rating && rating !== "N/A" && (
            <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/70 backdrop-blur-sm rounded-md text-[#FFD400] text-[10px] font-bold flex items-center gap-1 border border-white/10">
                <FiStar size={10} fill="#FFD400" /> {rating}
            </div>
        )}
      </div>

      {/* Details Below Poster */}
      <div className="flex flex-col px-1 space-y-0.5 sm:space-y-1">
        <h4 className="text-gray-100 font-bold text-xs sm:text-sm md:text-base leading-tight line-clamp-1 sm:line-clamp-2 group-hover:text-primary-yellow transition-colors duration-200">
          {title}
        </h4>
        <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-500 font-medium">
          <div className="flex items-center gap-2">
            {!isMobile && rating && rating !== "N/A" && (
              <>
                <span className="flex items-center gap-1 text-primary-yellow">
                  <FiStar size={10} fill="#FFD400" /> {rating}
                </span>
                <span className="text-gray-700">•</span>
              </>
            )}
            <span className="truncate">{genre}</span>
            {year && <><span className="text-gray-700">•</span><span>{year}</span></>}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default MovieCard;
