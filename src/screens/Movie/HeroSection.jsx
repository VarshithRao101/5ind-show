import React from 'react';
import { motion } from 'framer-motion';
import { FiPlay, FiBookmark } from 'react-icons/fi';
import { backdropUrl } from '../../api/tmdbImages';
import { getRating } from '../../utils/getRating';

const HeroSection = ({ movie, onWatch, onBookmark, isBookmarked, onTrailerClick }) => {
  const backdrop = backdropUrl(movie.backdrop_path) || backdropUrl(movie.poster_path);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative w-full h-96 sm:h-[500px] md:h-[600px] overflow-hidden rounded-b-3xl"
    >
      {/* Backdrop Image - with actual img tag for better loading */}
      <img
        src={backdrop}
        alt="backdrop"
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />

      {/* Backdrop Image - fallback via background-image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-gray-900"
        style={{
          backgroundImage: `url(${backdrop})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        {/* Gradient Overlay - bottom to top */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1115] via-[#0F1115]/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full px-4 sm:px-6 lg:px-12 flex flex-col justify-end pb-8 sm:pb-12">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="max-w-3xl"
        >
          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-[#9AA0A6]">
            <span className="font-semibold">{
              movie?.release_date
                ? new Date(movie.release_date).getFullYear()
                : movie?.first_air_date
                  ? new Date(movie.first_air_date).getFullYear()
                  : 'TBA'
            }</span>
            <span>•</span>
            <span>{movie?.runtime || '128'} min</span>
            <span>•</span>
            <span>{typeof movie?.genres?.[0] === 'object' ? movie.genres[0]?.name : (movie?.genres?.[0] || 'Drama')}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight line-clamp-2">
            {movie?.title || movie?.name}
          </h1>

          {/* Rating Badges */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-2 bg-[#F5C518] text-black px-3 py-1 rounded-full text-sm font-bold">
              IMDb <span className="ml-1">{getRating(movie)}/10</span>
            </div>
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold text-white ${(movie?.rottenTomatoesScore || 75) >= 70
                ? 'bg-green-600'
                : 'bg-red-600'
                }`}
            >
              RT <span className="ml-1">{movie?.rottenTomatoesScore || 75}%</span>
            </div>
          </div>

          {/* Overview Preview */}
          <p className="text-gray-300 text-sm sm:text-base mb-8 max-w-2xl line-clamp-2">
            {movie?.overview || 'An incredible cinematic experience'}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onTrailerClick?.()}
              className="flex items-center gap-2 bg-[#E11D1D] hover:bg-[#d01818] text-white px-6 sm:px-8 py-3 rounded-lg font-semibold transition-all shadow-lg"
            >
              <FiPlay size={20} fill="currentColor" />
              Watch Trailer
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onBookmark?.()}
              className={`flex items-center gap-2 px-6 sm:px-8 py-3 rounded-lg font-semibold transition-all border ${isBookmarked
                ? 'bg-[#E11D1D]/20 border-[#E11D1D] text-[#E11D1D]'
                : 'bg-[#111216] border-gray-700 text-white hover:border-gray-500'
                }`}
            >
              <FiBookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
              {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HeroSection;



