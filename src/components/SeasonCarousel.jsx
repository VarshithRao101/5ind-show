import React from 'react';
import { getPosterUrl } from '../config/tmdbImage';
import { motion } from 'framer-motion';

const SeasonCarousel = ({ seasons, selectedSeason, onSeasonChange }) => {
  if (!seasons || seasons.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-8 px-4 sm:px-6"
    >
      <h3 className="text-xl font-bold text-white mb-6">Select Season</h3>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {seasons.map((season) => {
          const isSelected =
            (typeof selectedSeason === 'object' && selectedSeason?.season_number === season.season_number) ||
            (typeof selectedSeason === 'number' && selectedSeason === season.season_number);

          return (
            <motion.div
              key={season.season_number}
              onClick={() => onSeasonChange(season)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className={`cursor-pointer rounded-xl p-3 border transition-all flex-shrink-0 ${isSelected
                ? 'border-primary-yellow bg-primary-yellow/10 shadow-lg shadow-primary-yellow/50'
                : 'border-gray-700 bg-gray-800/40 hover:border-gray-600'
                }`}
            >
              <img
                src={getPosterUrl(season.poster_path, 'w200')}
                alt={`Season ${season.season_number}`}
                className="w-32 h-48 object-cover rounded-lg"
                loading="lazy"
              />
              <div className="text-center mt-2">
                <p className="text-sm font-semibold text-white">
                  Season {season.season_number}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {season.episode_count || 0} Episodes
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default SeasonCarousel;



