import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { UserContext } from '../context/UserContext';
import EpisodeCard from './EpisodeCard';
import SeasonSelector from './SeasonSelector';
import TrailerModal from './TrailerModal';

const EpisodesSection = ({ tvId, seasons, episodes, onEpisodeSelect }) => {
  const { darkTheme } = useContext(UserContext);
  const [selectedSeason, setSelectedSeason] = useState(seasons?.[0] || null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState(null);

  if (!seasons || seasons.length === 0) {
    return null;
  }

  const seasonEpisodes = episodes || [];

  const handlePlayTrailer = (episode) => {
    setSelectedEpisode(episode);
    setIsTrailerOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="px-4 sm:px-6 mb-12"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-heading font-bold text-white">Episodes</h2>
        <SeasonSelector
          seasons={seasons}
          selectedSeason={selectedSeason}
          onSeasonChange={setSelectedSeason}
        />
      </div>

      {/* Episodes Grid */}
      {seasonEpisodes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {seasonEpisodes.map((episode, index) => (
            <EpisodeCard
              key={`${episode.season_number}-${episode.episode_number}`}
              episode={episode}
              index={index}
              onPlayTrailer={handlePlayTrailer}
            />
          ))}
        </div>
      ) : (
        <div className={`text-center py-8 rounded-xl border ${
          darkTheme
            ? 'bg-card-bg border-card-border text-gray-400'
            : 'bg-gray-100 border-gray-300 text-gray-600'
        }`}>
          <p className="text-lg font-semibold">No episodes available</p>
          <p className="text-sm mt-1">Episodes for this season will be available soon.</p>
        </div>
      )}

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        videoId={selectedEpisode?.videos?.[0]?.key}
      />
    </motion.div>
  );
};

export default EpisodesSection;



