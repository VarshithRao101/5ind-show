import React from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiStar } from 'react-icons/fi';

const EpisodeList = ({ episodes = [], selectedSeason, loadingEpisodes }) => {
  const seasonNum = typeof selectedSeason === 'object'
    ? selectedSeason?.season_number
    : selectedSeason;

  if (loadingEpisodes) {
    return (
      <div className="space-y-3">
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="h-28 sm:h-32 bg-[#1a1a1a] rounded-xl animate-pulse border border-white/5" />
        ))}
      </div>
    );
  }

  if (!episodes || episodes.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 bg-[#1a1a1a] rounded-xl border border-dashed border-white/10">
        No episodes found for this season.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {episodes.map((ep, index) => (
        <motion.div
          key={ep.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.04, duration: 0.3 }}
          className="bg-[#1a1a1a] rounded-xl border border-white/5 hover:border-primary-yellow/30 transition-all duration-300 group overflow-hidden hover:shadow-lg hover:shadow-primary-yellow/5"
        >
          <div className="flex gap-0">
            {/* Episode Still / Thumbnail */}
            <div className="flex-shrink-0 w-[130px] sm:w-[180px] md:w-[210px] aspect-video relative overflow-hidden rounded-l-xl bg-[#111]">
              {ep.still_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w300${ep.still_path}`}
                  alt={ep.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const fallback = e.target.parentElement?.querySelector('.ep-fallback');
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              ) : null}

              {/* Fallback placeholder */}
              <div
                className="ep-fallback absolute inset-0 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-[#1f1f1f] to-[#111]"
                style={{ display: ep.still_path ? 'none' : 'flex' }}
              >
                <span className="text-3xl font-black text-white/10">
                  {ep.episode_number?.toString().padStart(2, '0')}
                </span>
                <span className="text-[10px] text-gray-600 uppercase tracking-widest">No Image</span>
              </div>

              {/* Episode number badge */}
              <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold text-primary-yellow border border-primary-yellow/30">
                {seasonNum && `S${String(seasonNum).padStart(2, '0')} · `}E{ep.episode_number?.toString().padStart(2, '0')}
              </div>

              {/* Runtime badge */}
              {ep.runtime && (
                <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] text-gray-300 flex items-center gap-1">
                  <FiClock size={9} /> {ep.runtime}m
                </div>
              )}
            </div>

            {/* Episode Details */}
            <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between min-w-0">
              <div>
                <h4 className="text-sm sm:text-base font-bold text-gray-100 group-hover:text-primary-yellow transition-colors leading-tight line-clamp-2 mb-1.5">
                  {ep.name || `Episode ${ep.episode_number}`}
                </h4>
                <p className="text-xs sm:text-sm text-gray-400 line-clamp-2 sm:line-clamp-3 leading-relaxed">
                  {ep.overview || 'No description available.'}
                </p>
              </div>

              <div className="flex items-center justify-between mt-2 gap-2 flex-wrap">
                <span className="text-[10px] sm:text-xs text-gray-600 font-medium">
                  {ep.air_date ? `Aired: ${ep.air_date}` : ''}
                </span>
                {ep.vote_average > 0 && (
                  <span className="text-[10px] sm:text-xs text-primary-yellow font-bold flex items-center gap-1">
                    <FiStar size={10} fill="currentColor" /> {ep.vote_average.toFixed(1)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default EpisodeList;
