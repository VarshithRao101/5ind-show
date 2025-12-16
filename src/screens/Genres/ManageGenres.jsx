import React, { useContext } from 'react';
import GenreCardManage from '../../components/GenreCardManage';
import { GenreContext } from '../../context/GenreContext';

const GENRES = [
  { id: 1, icon: '🔫', title: 'Action' },
  { id: 2, icon: '🎭', title: 'Drama' },
  { id: 3, icon: '😂', title: 'Comedy' },
  { id: 4, icon: '😱', title: 'Thriller' },
  { id: 5, icon: '🚀', title: 'Sci-Fi' },
  { id: 6, icon: '💕', title: 'Romance' },
  { id: 7, icon: '👻', title: 'Horror' },
  { id: 8, icon: '🎨', title: 'Animation' },
  { id: 9, icon: '📚', title: 'Documentary' },
  { id: 10, icon: '✨', title: 'Fantasy' },
  { id: 11, icon: '🎬', title: 'Mystery' },
  { id: 12, icon: '🏆', title: 'Biography' },
  { id: 13, icon: '🎪', title: 'Adventure' },
  { id: 14, icon: '🎵', title: 'Musical' },
  { id: 15, icon: '🔬', title: 'Noir' },
  { id: 16, icon: '🌍', title: 'War' },
  { id: 17, icon: '😆', title: 'Crime' },
  { id: 18, icon: '🎯', title: 'Western' },
];

const ManageGenres = ({ onSave = () => {} }) => {
  const { selectedGenres } = useContext(GenreContext);

  const handleSave = () => {
    onSave(selectedGenres);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] relative overflow-hidden pb-24">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-transparent to-transparent pointer-events-none" />

      {/* Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between pt-6 mb-8">
          {/* Back Button */}
          <button
            className="
              p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700 text-white
              transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500
              group
            "
            aria-label="Go back"
          >
            <svg
              className="w-6 h-6 transition-transform group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Manage Genres
          </h1>

          {/* Logo */}
          <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">5</span>
          </div>
        </div>

        {/* Subtitle Section */}
        <div className="mb-8">
          <p className="text-gray-300 text-lg mb-4">
            Select your favorite genres to personalize your movie recommendations
          </p>

          {/* Counter Line */}
          <div className="text-sm text-gray-400">
            <span className="font-semibold text-red-400">{selectedGenres.length} selected</span>
            {' | '}
            <span>{GENRES.length} total</span>
          </div>
        </div>

        {/* Genre Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
          {GENRES.map((genre) => (
            <GenreCardManage
              key={genre.id}
              id={genre.id}
              icon={genre.icon}
              title={genre.title}
            />
          ))}
        </div>
      </div>

      {/* Save Button - Fixed at Bottom */}
      <div className="fixed bottom-24 left-0 right-0 bg-gradient-to-t from-[#0D0D0F] via-[#0D0D0F]/95 to-transparent pt-6 pb-6 px-4 z-50">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleSave}
            className={`
              w-full py-3 px-6 rounded-lg font-semibold text-lg
              transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
              ${
                selectedGenres.length > 0
                  ? 'bg-red-600 hover:bg-red-700 text-white cursor-pointer shadow-lg shadow-red-600/50'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageGenres;



