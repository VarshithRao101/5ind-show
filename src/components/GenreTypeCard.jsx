/*
  GenreTypeCard.jsx
  Reusable card to display a genre type in a grid.
  Props: title, onClick
*/
import React from 'react';

const GenreTypeCard = ({ title, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full bg-[#1A1A1D] rounded-2xl py-6 px-4 flex items-center justify-center text-center transition-transform transform hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-[#E43737] shadow-sm hover:shadow-lg"
      aria-label={`Open ${title} genre`}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-black/5 to-transparent pointer-events-none" />
        <span className="text-white text-base font-medium z-10">{String(title || 'Genre')}</span>
      </div>
    </button>
  );
};

export default GenreTypeCard;



