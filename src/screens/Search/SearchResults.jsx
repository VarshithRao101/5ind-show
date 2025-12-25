import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiX, FiSearch } from 'react-icons/fi';
import { UserContext } from '../../context/UserContext';
import MovieCard from '../../components/MovieCard';
import { searchMovies } from '../../services/tmdb';
import { getGenreArray } from '../../services/genres';

const SearchResults = ({ onClose }) => {
  const navigate = useNavigate();
  const { darkTheme } = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [allGenres, setAllGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Fetch all genres on mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genresData = await getGenreArray();
        setAllGenres(genresData);
      } catch (err) {
        console.error('Error fetching genres:', err);
      }
    };
    fetchGenres();
  }, []);

  // Debounced search
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const timer = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        try {
          setLoading(true);
          setHasSearched(true);
          const results = await searchMovies(searchQuery);
          if (signal.aborted) return;

          // Filter by selected genres if any
          let filtered = results;
          if (selectedGenres.length > 0) {
            filtered = filtered.filter((item) =>
              selectedGenres.some((genreId) =>
                (item.genre_ids || []).includes(genreId) ||
                item.genres?.some(g =>
                  typeof g === 'object'
                    ? g.id === genreId
                    : allGenres.find(ag => ag.name === g)?.id === genreId
                )
              )
            );
          }

          // Limit to max 20
          setFilteredMovies(filtered.slice(0, 20));
        } catch (err) {
          if (!signal.aborted) {
            console.error('Error searching:', err);
            setFilteredMovies([]);
          }
        } finally {
          if (!signal.aborted) setLoading(false);
        }
      } else {
        setFilteredMovies([]);
        if (searchQuery.trim().length === 0) setHasSearched(false);
      }
    }, 400);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [searchQuery, selectedGenres, allGenres]);

  const toggleGenre = (genreId) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((g) => g !== genreId)
        : [...prev, genreId]
    );
  };

  const handleMovieClick = (item) => {
    const route = item.media_type === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`;
    navigate(route);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 ${darkTheme ? 'bg-app-bg-dark' : 'bg-app-bg-light'} z-50 overflow-y-auto transition-colors duration-300`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header with close button */}
        <div className="flex items-center justify-between mb-6">
          <h1 className={`text-2xl font-heading font-bold ${darkTheme ? 'text-white' : 'text-text-light'}`}>Search Movies</h1>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className={`p-2 ${darkTheme ? 'hover:bg-gray-800' : 'hover:bg-gray-200'} rounded-lg transition-colors`}
          >
            <FiX size={24} className={darkTheme ? 'text-white' : 'text-text-light'} />
          </motion.button>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative">
            <FiSearch className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkTheme ? 'text-gray-400' : 'text-gray-500'} pointer-events-none`} size={20} />
            <input
              autoFocus
              type="text"
              placeholder="Search for movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full ${darkTheme ? 'bg-card-bg-dark border-card-border-dark text-white placeholder-muted-text-dark' : 'bg-card-bg-light border-card-border-light text-text-light placeholder-muted-text-light'} border-2 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-primary-yellow focus:ring-2 focus:ring-primary-yellow/30 transition-all font-medium`}
            />
          </div>
        </motion.div>

        {/* Genre Filter */}
        {allGenres.length > 0 && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className={`text-lg font-heading font-bold ${darkTheme ? 'text-white' : 'text-text-light'} mb-3`}>Filter by Genre</h2>
            <div className="flex flex-wrap gap-2">
              {allGenres.map((genre) => (
                <motion.button
                  key={genre.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleGenre(genre.id)}
                  className={`px-4 py-2 rounded-xl font-bold transition-all border-2 ${selectedGenres.includes(genre.id)
                    ? 'bg-primary-yellow border-primary-yellow text-white shadow-yellow-glow'
                    : darkTheme
                      ? 'bg-card-bg-dark border-card-border-dark text-muted-text-dark hover:border-primary-yellow/50'
                      : 'bg-card-bg-light border-card-border-light text-muted-text-light hover:border-primary-yellow/50'
                    }`}
                >
                  {genre.name}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-3 border-primary-yellow/30 border-t-primary-yellow rounded-full animate-spin" />
          </div>
        )}

        {/* Results Count */}
        {hasSearched && !loading && (
          <div className="mb-6">
            <p className={darkTheme ? 'text-muted-text-dark' : 'text-muted-text-light'}>
              Found {filteredMovies.length} movie{filteredMovies.length !== 1 ? 's' : ''}
              {selectedGenres.length > 0 && ` in selected genres`}
            </p>
          </div>
        )}

        {/* Movie Results Grid */}
        {!loading && filteredMovies.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          >
            {filteredMovies.map((movie, index) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <MovieCard
                  movie={movie}
                  onClick={() => handleMovieClick(movie)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : !loading && hasSearched ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-16"
          >
            <p className={darkTheme ? 'text-muted-text-dark text-lg' : 'text-muted-text-light text-lg'}>
              {searchQuery ? 'No movies found. Try a different search.' : 'Start typing to search...'}
            </p>
          </motion.div>
        ) : null}
      </div>
    </motion.div>
  );
};

export default SearchResults;



