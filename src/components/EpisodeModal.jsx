import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPlay } from 'react-icons/fi';
import { UserContext } from '../context/UserContext';
import { getRating } from '../utils/getRating';

const EpisodeModal = ({ isOpen, episode, seasonNumber, onClose }) => {
  const { darkTheme } = useContext(UserContext);

  if (!episode) return null;

  const stillUrl = episode.still_path
    ? `https://image.tmdb.org/t/p/w780${episode.still_path}`
    : '/assets/placeholder-episode.png';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl ${
              darkTheme ? 'bg-gray-900' : 'bg-white'
            }`}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-primary-yellow/20 hover:bg-primary-yellow/40 text-white transition-all"
            >
              <FiX size={24} />
            </button>

            {/* Still Image */}
            <div className="w-full aspect-video overflow-hidden">
              <img
                src={stillUrl}
                alt={episode.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/assets/placeholder-episode.png';
                }}
              />
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8">
              {/* Title */}
              <h2 className={`text-2xl sm:text-3xl font-bold mb-2 ${
                darkTheme ? 'text-white' : 'text-gray-900'
              }`}>
                S{String(seasonNumber || '?').padStart(2, '0')} • E{String(episode.episode_number || '?').padStart(2, '0')} — {episode.name || 'Untitled Episode'}
              </h2>

              {/* Meta Information */}
              <div className={`flex flex-wrap gap-4 mb-6 pb-4 border-b ${
                darkTheme ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-600'
              }`}>
                <div>
                  <p className="text-xs font-semibold mb-1">Air Date</p>
                  <p className={darkTheme ? 'text-white' : 'text-gray-900'}>
                    {episode.air_date
                      ? new Date(episode.air_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'Unknown air date'}
                  </p>
                </div>

                {episode.runtime && (
                  <div>
                    <p className="text-xs font-semibold mb-1">Runtime</p>
                    <p className={darkTheme ? 'text-white' : 'text-gray-900'}>{episode.runtime} min</p>
                  </div>
                )}

                {episode.vote_average > 0 && (
                  <div>
                    <p className="text-xs font-semibold mb-1">Rating</p>
                    <p className={darkTheme ? 'text-white' : 'text-gray-900'}>
                      ⭐ {getRating(episode)}/10
                    </p>
                  </div>
                )}
              </div>

              {/* Overview */}
              <div className="mb-6">
                <h3 className={`text-lg font-bold mb-2 ${
                  darkTheme ? 'text-white' : 'text-gray-900'
                }`}>
                  Overview
                </h3>
                <p className={`leading-relaxed ${
                  darkTheme ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {episode.overview || 'No overview available.'}
                </p>
              </div>

              {/* Action Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full flex items-center justify-center gap-2 bg-primary-yellow hover:bg-primary-yellow-hover text-white font-bold py-3 rounded-lg transition-all"
              >
                <FiPlay size={20} fill="currentColor" />
                Play Trailer (Coming Soon)
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EpisodeModal;



