import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { FiPlay, FiPlus } from 'react-icons/fi';
import { backdropUrl } from '../api/tmdbImages';
import { UserContext } from '../context/UserContext';
import { getRating } from '../utils/getRating';

const HeroBanner = ({ movie, onWatch, onAdd }) => {
  const { darkTheme } = useContext(UserContext);
  if (!movie) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] mb-10 overflow-hidden rounded-3xl shadow-yellow-glow-lg group"
    >
      {/* Background with blur overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transform group-hover:scale-105 transition-transform duration-700"
        style={{
          backgroundImage: `url(${backdropUrl(movie.backdrop_path) || backdropUrl(movie.poster_path)})`,
          backgroundPosition: 'center',
        }}
      >
        <div className={`absolute inset-0 ${darkTheme ? 'bg-gradient-to-r from-black via-black/60 to-transparent' : 'bg-gradient-to-r from-black/70 via-black/40 to-transparent'}`} />
        <div className={`absolute inset-0 ${darkTheme ? 'bg-gradient-to-t from-black via-transparent to-transparent' : 'bg-gradient-to-t from-black/80 via-transparent to-transparent'}`} />
      </div>

      {/* Content */}
      <div className="relative h-full px-6 sm:px-10 lg:px-16 flex flex-col justify-end pb-10 sm:pb-14 lg:pb-20">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="max-w-3xl"
        >
          {/* Genres */}
          {(movie?.genres?.length || 0) > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {movie?.genres?.slice(0, 3).map((genre, idx) => (
                <span
                  key={genre?.id || idx}
                  className="px-3 py-1 text-xs font-semibold rounded-full glassmorphism text-white border border-white/10"
                >
                  {typeof genre === 'string' ? genre : genre?.name}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-heading font-bold text-white mb-4 drop-shadow-2xl line-clamp-2">
            {movie?.title || movie?.name || 'Loading...'}
          </h1>

          {/* Rating & Year */}
          <div className="flex items-center gap-4 mb-5">
            <div className="bg-primary-yellow text-black px-4 py-2 rounded-xl text-base font-bold flex items-center gap-2 shadow-yellow-glow">
              ⭐ {getRating(movie)}
            </div>
            <span className="text-white/90 text-lg font-semibold">{
              movie?.release_date
                ? new Date(movie.release_date).getFullYear()
                : movie?.first_air_date
                  ? new Date(movie.first_air_date).getFullYear()
                  : 'TBA'
            }</span>
          </div>

          {/* Description */}
          <p className="text-white/80 text-base sm:text-lg mb-8 max-w-2xl line-clamp-3 leading-relaxed">
            {movie?.description || movie?.overview || 'An incredible cinematic experience awaits you.'}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onWatch?.(movie)}
              className="flex items-center gap-3 bg-primary-yellow hover:bg-primary-yellow-hover text-black px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-yellow-glow-lg"
            >
              <FiPlay size={24} fill="currentColor" />
              Watch Now
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onAdd?.(movie)}
              className="flex items-center gap-3 glassmorphism hover:bg-white/10 text-white border-2 border-white/20 px-8 py-4 rounded-2xl font-bold text-lg transition-all"
            >
              <FiPlus size={24} />
              Add to List
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HeroBanner;



