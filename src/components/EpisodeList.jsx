import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { UserContext } from '../context/UserContext';
import { getRating } from '../utils/getRating';
import EpisodeModal from './EpisodeModal';

const EpisodeList = ({ episodes, selectedSeason, loadingEpisodes }) => {
  const { darkTheme } = useContext(UserContext);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleEpisodeClick = (episode) => {
    setSelectedEpisode(episode);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setTimeout(() => setSelectedEpisode(null), 300);
  };

  if (loadingEpisodes) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-yellow mx-auto mb-4"></div>
        <p className={darkTheme ? 'text-gray-400' : 'text-gray-600'}>Loading episodes...</p>
      </div>
    );
  }

  if (!episodes || episodes.length === 0) {
    return (
      <div className={`text-center py-12 rounded-xl border ${
        darkTheme
          ? 'bg-card-bg/50 border-card-border text-gray-400'
          : 'bg-gray-50 border-gray-200 text-gray-600'
      }`}>
        <p className="text-lg font-semibold">No episodes found for this season.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-1">
        {episodes.map((episode, index) => {
          const seasonNum = selectedSeason?.season_number || selectedSeason;
          const stillUrl = episode.still_path
            ? `https://image.tmdb.org/t/p/w300${episode.still_path}`
            : '/assets/placeholder-episode.png';

          return (
            <motion.div
              key={`${seasonNum}-${episode.episode_number}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleEpisodeClick(episode)}
              className={`flex gap-4 border-b p-4 cursor-pointer transition-all hover:bg-primary-yellow/5 ${
                darkTheme
                  ? 'border-gray-800 hover:border-primary-yellow/50'
                  : 'border-gray-200 hover:border-primary-yellow/50'
              }`}
            >
              {/* Episode Still */}
              <div className="flex-shrink-0">
                <img
                  src={stillUrl}
                  alt={`S${seasonNum}E${episode.episode_number}: ${episode.name}`}
                  className="w-48 h-28 rounded-lg object-cover border border-gray-700 cursor-pointer hover:opacity-80 transition-opacity"
                  onError={(e) => {
                    e.currentTarget.src = '/assets/placeholder-episode.png';
                  }}
                />
              </div>

              {/* Episode Details */}
              <div className="flex-1 flex flex-col justify-start">
                {/* Episode Title */}
                <p className={`text-lg font-bold mb-2 ${
                  darkTheme ? 'text-white' : 'text-gray-900'
                }`}>
                  S{String(seasonNum).padStart(2, '0')} • E{String(episode.episode_number).padStart(2, '0')} — {episode.name || 'Untitled'}
                </p>

                {/* Episode Meta */}
                <p className={`text-sm mb-2 ${
                  darkTheme ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {episode.air_date
                    ? new Date(episode.air_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : 'Unknown date'}
                  {episode.runtime && ` • ${episode.runtime} min`}
                  {episode.vote_average ? ` • ⭐ ${getRating(episode)}` : ''}
                </p>

                {/* Episode Overview */}
                <p className={`max-w-3xl line-clamp-2 ${
                  darkTheme ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {episode.overview || 'No overview available.'}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Episode Modal */}
      <EpisodeModal
        isOpen={modalOpen}
        episode={selectedEpisode}
        seasonNumber={selectedSeason?.season_number || selectedSeason}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default EpisodeList;



