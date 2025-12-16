import React, { useContext } from 'react';
import { GenreContext } from '../context/GenreContext';

const GenreCardManage = ({ id, icon, title }) => {
  const { selectedGenres, toggleGenre } = useContext(GenreContext);
  const isSelected = selectedGenres.includes(id);

  return (
    <button
      onClick={() => toggleGenre(id)}
      className={`
        group relative h-32 rounded-xl overflow-hidden cursor-pointer
        transition-all duration-300 ease-out
        ${isSelected ? 'scale-105' : 'scale-100 hover:scale-102'}
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
      `}
    >
      {/* Background */}
      <div
        className={`
          absolute inset-0 rounded-xl transition-all duration-300
          ${isSelected ? 'bg-gray-800 border-2 border-red-500' : 'bg-[#1A1A1D] border-2 border-gray-700'}
        `}
      />

      {/* Glow Effect when selected */}
      {isSelected && (
        <div className="absolute inset-0 bg-red-600/20 blur-xl opacity-100 pointer-events-none rounded-xl" />
      )}

      {/* Shadow glow */}
      <div
        className={`
          absolute inset-0 rounded-xl transition-all duration-300
          ${isSelected ? 'shadow-lg shadow-red-500/50 ring-2 ring-red-500' : 'shadow-md shadow-black/30'}
        `}
      />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center p-3 text-center">
        {/* Icon */}
        <div
          className={`
            text-4xl mb-2 transition-transform duration-300
            ${isSelected ? 'scale-110' : 'group-hover:scale-105'}
          `}
        >
          {icon}
        </div>

        {/* Title */}
        <h3
          className={`
            text-sm font-bold transition-colors duration-300 truncate w-full px-1
            ${isSelected ? 'text-red-400' : 'text-gray-200'}
          `}
        >
          {title}
        </h3>
      </div>
    </button>
  );
};

export default GenreCardManage;



