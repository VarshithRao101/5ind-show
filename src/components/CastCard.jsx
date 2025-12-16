import React from 'react';
import { profileUrl } from '../api/tmdbImages';

const CastCard = ({ actor }) => {
  return (
    <div className="w-28 flex-shrink-0">
      <div className="flex flex-col items-center">
        <img src={profileUrl(actor.profile_path)} alt={actor.name} className="w-20 h-20 rounded-full object-cover" />
        <div className="mt-2 text-sm font-semibold text-white text-center truncate w-full">{actor.name}</div>
        <div className="text-xs text-gray-400 text-center truncate w-full">as {actor.character}</div>
      </div>
    </div>
  );
};

export default CastCard;



