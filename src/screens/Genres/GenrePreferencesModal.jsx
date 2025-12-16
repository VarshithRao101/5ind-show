import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { getGenreArray } from '../../services/genres';
import { UserContext } from '../../context/UserContext';

const GenrePreferences = ({ onClose }) => {
  const navigate = useNavigate();
  const { preferredGenres, setGenrePreferences } = useContext(UserContext);
  const [selectedGenres, setSelectedGenres] = useState(preferredGenres);
  const [allGenres, setAllGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch genres from TMDb
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genres = await getGenreArray();
        setAllGenres(genres);
      } catch (err) {
        console.error('Error fetching genres:', err);
        setAllGenres([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGenres();
  }, []);

  const toggleGenre = (genreId) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((g) => g !== genreId)
        : [...prev, genreId]
    );
  };

  const handleShowResults = () => {
    setGenrePreferences(selectedGenres);
    // Get the genre names for display
    const genreNames = allGenres
      .filter(g => selectedGenres.includes(g.id))
      .map(g => g.name)
      .join(', ');
    navigate('/genre-results', {
      state: {
        genreIds: selectedGenres,
        genreName: genreNames || 'Selected Genres'
      }
    });
    onClose?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 bg-[#0F1115] z-50 overflow-y-auto pb-24"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Select Your Favorite Genres</h1>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <FiX size={24} className="text-white" />
          </motion.button>
        </div>

        {/* Description */}
        <p className="text-gray-400 mb-8">
          Choose one or more genres to personalize your movie recommendations
        </p>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-3 border-[#E11D1D]/30 border-t-[#E11D1D] rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Genre Selection Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8">
              {allGenres.map((genre) => (
                <motion.button
                  key={genre.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleGenre(genre.id)}
                  className={`p-4 rounded-xl font-medium transition-all border-2 ${selectedGenres.includes(genre.id)
                      ? 'bg-[#E11D1D] border-[#E11D1D] text-white shadow-lg shadow-[#E11D1D]/50'
                      : 'bg-[#111216] border-gray-700 text-gray-300 hover:border-gray-500'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{genre.name}</span>
                    {selectedGenres.includes(genre.id) && (
                      <span className="ml-2">✓</span>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </>
        )}

        {/* Selected Count */}
        <div className="mb-8 flex items-center justify-between">
          <p className="text-gray-400">
            {selectedGenres.length} genre{selectedGenres.length !== 1 ? 's' : ''} selected
          </p>
          {selectedGenres.length > 0 && (
            <p className="text-sm text-gray-500">
              {allGenres.filter(g => selectedGenres.includes(g.id)).map(g => g.name).join(', ')}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-[#0F1115]/95 backdrop-blur border-t border-gray-800 px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-4xl mx-auto flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="flex-1 py-3 px-6 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-semibold transition-all"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleShowResults}
              disabled={selectedGenres.length === 0}
              className="flex-1 py-3 px-6 rounded-lg bg-[#E11D1D] hover:bg-[#d01818] disabled:bg-gray-700 disabled:opacity-50 text-white font-semibold transition-all disabled:cursor-not-allowed"
            >
              Save Preferences
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GenrePreferences;



