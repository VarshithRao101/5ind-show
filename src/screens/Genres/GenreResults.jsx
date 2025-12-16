import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';
import { UserContext } from '../../context/UserContext';
import MovieCard from '../../components/MovieCard';
import { getTopMoviesByGenre, getTopMoviesByLanguage } from '../../services/tmdb';
import { getGenreArray, getGenreMap, mapGenreIdsToNames } from '../../services/genres';
import { getMediaRoute, sanitizeMediaItem } from '../../utils/mediaUtils';

const GenreResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkTheme } = useContext(UserContext);

  // State
  const [activeGenreId, setActiveGenreId] = useState(null);
  const [activeGenreName, setActiveGenreName] = useState('');
  const [activeLanguage, setActiveLanguage] = useState(null);

  const [genresList, setGenresList] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Fetch Genres List & Handle Initial Selection
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const list = await getGenreArray();
        setGenresList(list);

        // Logic to determine initial Genre
        if (location.state?.genreId) {
          setActiveGenreId(location.state.genreId);
          setActiveGenreName(location.state.genreName || location.state.name || 'Genre');
        } else if (location.state?.genreIds) {
          const ids = location.state.genreIds;
          const initialId = Array.isArray(ids) ? ids[0] : ids;
          setActiveGenreId(initialId);
          setActiveGenreName(location.state.genreName || 'Selected Genre');
        } else if (list.length > 0 && !activeGenreId) {
          const defaultGenre = list.find(g => g.name === 'Action') || list[0];
          setActiveGenreId(defaultGenre.id);
          setActiveGenreName(defaultGenre.name);
        }
      } catch (e) {
        console.error('Failed to load genres', e);
        setError('Failed to load genres.');
      }
    };
    fetchGenres();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Handle selections
  const handleGenreClick = (genre) => {
    setActiveGenreId(genre.id);
    setActiveGenreName(genre.name);
    // If language is active, we might want to keep it or clear it. 
    // The user instruction "When a language is selected ... replace API calls" implies a switch.
    // I'll clear language when genre is picked to show genre results purely, 
    // or keep language if we want to filter genre BY language (which is better UX).
    // BUT user instruction Part 3 says: "const results = await getMoviesByLanguage(code);"
    // This implies language selection is a PRIMARY filter now.
    // So if I click a genre, I should probably clear language to avoid confusion, 
    // OR if I click language, I clear genre?
    // Let's assume they act as independent modes for now based on the requested API calls.
    // Allow mixing genre + language
    // if (activeLanguage) setActiveLanguage(null); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLanguageClick = (langCode) => {
    const newLang = activeLanguage === langCode ? null : langCode;
    setActiveLanguage(newLang);
    // If we select a language, we use getMoviesByLanguage(code), so genre is ignored in that call.
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    async function load() {
      setLoading(true);

      let movies = [];

      try {
        if (activeLanguage) {
          movies = await getTopMoviesByLanguage(activeLanguage, activeGenreId);
        } else {
          movies = await getTopMoviesByGenre(activeGenreId);
        }

        // Minimal sanitization to ensure UI doesn't break (posters/genre names)
        const genreMap = await getGenreMap();
        const validMovies = movies.filter(m => m.poster_path).map(m => ({
          ...sanitizeMediaItem(m),
          genre_names: mapGenreIdsToNames(m.genre_ids, genreMap)
        }));

        setMovies(validMovies);
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    }

    load();
  }, [activeLanguage, activeGenreId]);


  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white pb-32 fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/home')}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white hover:text-primary-yellow"
          >
            <FiArrowLeft size={24} />
          </motion.button>
          <div className="flex flex-col">
            <h1 className="text-3xl lg:text-4xl font-black font-heading tracking-tight text-white/90">
              {activeLanguage
                ? `${['Telugu', 'Hindi', 'Tamil', 'Malayalam', 'Kannada', 'English'].find(l =>
                  l.startsWith(activeLanguage.charAt(0).toUpperCase())
                ) || activeLanguage.toUpperCase()} Movies`
                : (activeGenreName || 'Discover')}
            </h1>
            <p className="text-sm font-medium text-gray-500 mt-1 uppercase tracking-widest">
              {loading ? 'Curating List...' : `${movies.length} TITLES`}
            </p>
          </div>
        </div>

        {/* Filters Container */}
        <div className="space-y-6 mb-12">

          {/* Genre List (Grid/Scroll Hybrid) */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 pl-1">Genres</h3>
            <div className="overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex gap-3 w-max">
                {genresList.map((g) => {
                  const isActive = activeGenreId === g.id && !activeLanguage;
                  return (
                    <button
                      key={g.id}
                      onClick={() => handleGenreClick(g)}
                      className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap border ${isActive
                          ? 'bg-primary-yellow text-black border-primary-yellow shadow-yellow-glow scale-105'
                          : 'bg-[#181818] border-white/5 text-gray-400 hover:border-white/20 hover:text-white'
                        }`}
                    >
                      {g.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Language Filters */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 pl-1">Filter by Language</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setActiveLanguage(null)}
                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all border ${!activeLanguage
                    ? 'bg-white text-black border-white'
                    : 'bg-[#181818] border-white/5 text-gray-400 hover:bg-white/5'
                  }`}
              >
                All
              </button>
              {[
                { code: 'te', name: 'Telugu' },
                { code: 'hi', name: 'Hindi' },
                { code: 'ta', name: 'Tamil' },
                { code: 'ml', name: 'Malayalam' },
                { code: 'kn', name: 'Kannada' },
                { code: 'en', name: 'English' }
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageClick(lang.code)}
                  className={`px-5 py-2 rounded-lg text-sm font-bold transition-all border ${activeLanguage === lang.code
                      ? 'bg-primary-yellow text-black border-primary-yellow shadow-yellow-glow'
                      : 'bg-[#181818] border-white/5 text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 rounded-xl bg-red-900/20 border border-red-500/30 text-red-400 mb-8 max-w-lg mx-auto text-center font-bold">
            {error}
          </div>
        )}

        {/* Movie Grid */}
        {loading && movies.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-[#1f1f1f] rounded-xl shimmer border border-white/5" />
            ))}
          </div>
        ) : movies.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
          >
            {movies.map((movie, index) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <MovieCard
                  movie={movie}
                  onClick={() => navigate(getMediaRoute(movie))}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-gray-600 bg-[#181818] rounded-2xl border border-white/5">
            <p className="text-xl font-bold mb-2 text-gray-400">No movies found</p>
            <p className="text-sm">Try selecting a different genre or language.</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default GenreResults;



