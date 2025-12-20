// src/components/EpisodeCard.jsx
import React, { useState } from "react";
import { FiPlay } from "react-icons/fi";

import { getPoster } from "../utils/poster";

export default function EpisodeCard({ episode, onPlayTrailer, onWatchNow }) {
  const [expanded, setExpanded] = useState(false);

  if (!episode) return null;

  const thumb = getPoster(episode.still_path, 'w500');
  const title = episode.name || `Episode ${episode.episode_number}`;
  const number = episode.episode_number;
  const runtime = episode.runtime ? `${episode.runtime}m` : "";
  const airDate = episode.air_date ? new Date(episode.air_date).toLocaleDateString() : "TBA";
  const overview = episode.overview || "No description available.";

  // Truncation logic helper
  const isLongOverview = overview.length > 150;

  return (
    <div className="bg-[#1a1a1a] rounded-xl overflow-hidden shadow-lg border border-white/5 hover:border-white/10 transition-colors group flex flex-col h-full">
      {/* Thumbnail Area */}
      <div className="relative aspect-video bg-black rounded-t-xl overflow-hidden">
        {thumb ? (
          <img src={thumb} alt={title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600 bg-gray-900 text-xs uppercase tracking-widest font-bold">
            No Image
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={() => onWatchNow && onWatchNow(episode)}
            className="bg-white text-black rounded-full p-3 transform scale-90 group-hover:scale-100 transition-transform shadow-xl"
          >
            <FiPlay className="fill-black translate-x-0.5" size={24} />
          </button>
        </div>

        {/* Episode Number Badge */}
        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded">
          EP {number}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-base font-bold text-white leading-tight group-hover:text-primary-yellow transition-colors line-clamp-1" title={title}>
            {title}
          </h3>
          <span className="text-xs text-gray-400 font-mono whitespace-nowrap ml-2">{runtime}</span>
        </div>

        <div className="text-xs text-gray-500 mb-3 font-medium">
          Aired: {airDate}
        </div>

        {/* Overview with Truncate/Expand */}
        <div className="text-sm text-gray-300 leading-relaxed mb-4 flex-1">
          {expanded ? overview : (
            <>
              <span className="line-clamp-3">{overview}</span>
            </>
          )}
          {isLongOverview && (
            <button
              onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
              className="text-xs text-primary-yellow font-bold mt-1 hover:underline focus:outline-none"
            >
              {expanded ? "Show Less" : "Read More"}
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-auto pt-3 border-t border-white/5">
          <button
            onClick={() => onWatchNow && onWatchNow(episode)}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold py-2 rounded transition-colors"
          >
            Watch
          </button>
          <button
            onClick={() => onPlayTrailer && onPlayTrailer(episode)}
            className="px-3 bg-primary-yellow/10 hover:bg-primary-yellow/20 text-primary-yellow text-sm font-bold py-2 rounded transition-colors"
          >
            Trailer
          </button>
        </div>
      </div>
    </div>
  );
}



