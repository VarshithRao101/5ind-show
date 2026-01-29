import React, { useContext, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import GenreChip from '../../components/GenreChip';
import { GenreContext } from '../../context/GenreContext';
import { getGenreArray } from '../../services/genres';
import { UserContext } from '../../context/UserContext';

const GenreSelection = () => {
  const { selectedGenres, toggleGenre } = useContext(GenreContext);
  const { darkTheme } = useContext(UserContext);
  const navigate = useNavigate();

  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch genres from TMDb
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const list = await getGenreArray();
        setGenres(list);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching genres:', err);
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  const handleContinue = useCallback(() => {
    if (selectedGenres.length >= 3) {
      navigate('/home');
    }
  }, [selectedGenres.length, navigate]);

  const handleSelectAll = useCallback(() => {
    genres.forEach((genre) => {
      if (!selectedGenres.includes(genre.id)) {
        toggleGenre(genre.id);
      }
    });
  }, [selectedGenres, toggleGenre, genres]);

  const handleClearAll = useCallback(() => {
    selectedGenres.forEach((genreId) => {
      toggleGenre(genreId);
    });
  }, [selectedGenres, toggleGenre]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 300, damping: 25 },
    },
  };

  return (
    <div className={`min-h-screen ${darkTheme ? 'bg-app-bg-dark' : 'bg-app-bg-light'} relative overflow-hidden pb-40 fade-in`}>
      {/* Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 right-0 w-96 h-96 ${darkTheme ? 'bg-primary-yellow/10' : 'bg-primary-yellow/5'} rounded-full blur-3xl`} />
        <div className={`absolute bottom-0 left-0 w-96 h-96 ${darkTheme ? 'bg-primary-yellow/10' : 'bg-primary-yellow/5'} rounded-full blur-3xl`} />
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className={`text-4xl sm:text-5xl font-heading font-bold ${darkTheme ? 'text-white' : 'text-text-light'} mb-4`}>
            Choose Your <span className="text-gradient-yellow">Favorite Genres</span>
          </h1>
          <p className={`text-lg ${darkTheme ? 'text-muted-text-dark' : 'text-muted-text-light'} max-w-xl mx-auto`}>
            Personalize your experience by selecting genres you love. Pick at least 3 to get started.
          </p>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-3 border-primary-yellow/30 border-t-primary-yellow rounded-full animate-spin mx-auto mb-4" />
              <p className={darkTheme ? 'text-white' : 'text-text-light'}>Loading genres...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Genre Grid with Stagger Animation */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 mb-12"
            >
              {genres.map((genre) => (
                <motion.div key={genre.id} variants={itemVariants}>
                  <GenreChip
                    genre={genre.name}
                    isSelected={selectedGenres.includes(genre.id)}
                    onClick={() => toggleGenre(genre.id)}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Selection Counter & Helper Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className={`flex flex-col sm:flex-row items-center justify-between gap-6 mb-12 p-6 rounded-2xl ${darkTheme
                ? 'glassmorphism shadow-card'
                : 'bg-white/40 border border-white/20 shadow-lg'
                }`}
            >
              {/* Counter */}
              <div className="flex-1 text-center sm:text-left">
                <p className={`text-sm mb-1 ${darkTheme ? 'text-muted-text-dark' : 'text-muted-text-light'}`}>Selected Genres</p>
                <p className={`text-3xl font-heading font-bold ${darkTheme ? 'text-white' : 'text-text-light'}`}>
                  {selectedGenres.length}
                  <span className={`text-lg ml-2 ${darkTheme ? 'text-muted-text-dark' : 'text-muted-text-light'}`}>of {genres.length}</span>
                </p>
                {selectedGenres.length < 3 && (
                  <p className="text-primary-yellow text-xs mt-2 font-medium">
                    Select {3 - selectedGenres.length} more to continue
                  </p>
                )}
              </div>

              {/* Helper Buttons */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSelectAll}
                  className="px-5 py-2 rounded-xl bg-card-bg text-muted-text hover:text-white hover:bg-primary-yellow/20 border border-card-border transition-all text-sm font-bold"
                >
                  Select All
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClearAll}
                  className="px-5 py-2 rounded-xl bg-card-bg text-muted-text hover:text-white hover:bg-primary-yellow/20 border border-card-border transition-all text-sm font-bold"
                >
                  Clear All
                </motion.button>
              </div>
            </motion.div>

            {/* Info Section */}
            {selectedGenres.length >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center p-4 rounded-xl bg-primary-yellow/10 border border-primary-yellow/30 shadow-yellow-glow"
              >
                <p className="text-primary-yellow font-bold text-sm">✓ Ready to go! Click Continue to explore movies.</p>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Continue Button - Fixed at Bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-24 left-0 right-0 z-50 px-4 sm:px-6"
      >
        <div className="max-w-6xl mx-auto">
          <motion.button
            whileHover={selectedGenres.length >= 3 ? { scale: 1.02 } : {}}
            whileTap={selectedGenres.length >= 3 ? { scale: 0.98 } : {}}
            onClick={handleContinue}
            disabled={selectedGenres.length < 3}
            type="button"
            className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all ${selectedGenres.length >= 3
              ? 'bg-primary-yellow hover:bg-primary-yellow-hover text-white shadow-yellow-glow-lg cursor-pointer'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-50'
              }`}
          >
            {selectedGenres.length >= 3 ? 'Continue to Home' : `Select ${3 - selectedGenres.length} more`}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default GenreSelection;



