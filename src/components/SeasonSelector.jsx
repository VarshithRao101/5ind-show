import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';

const SeasonSelector = ({ seasons, selectedSeason, onSeasonChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!seasons || seasons.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative w-full sm:w-64"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 rounded-xl bg-card-bg border border-card-border text-white font-semibold flex items-center justify-between hover:bg-card-bg/80 transition-all"
      >
        <span>
          {selectedSeason?.season_number !== undefined
            ? `Season ${selectedSeason.season_number}`
            : 'Select Season'}
        </span>
        <FiChevronDown
          size={20}
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="absolute top-full left-0 right-0 mt-2 bg-card-bg border border-card-border rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto"
        >
          {seasons.map((season) => (
            <button
              key={season.id}
              onClick={() => {
                onSeasonChange(season);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left font-semibold transition-colors ${
                selectedSeason?.id === season.id
                  ? 'bg-primary-yellow text-white'
                  : 'text-white hover:bg-primary-yellow/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>Season {season.season_number}</span>
                <span className="text-xs text-gray-400">
                  {season.episode_count} eps
                </span>
              </div>
            </button>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default SeasonSelector;



