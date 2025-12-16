import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser } from 'react-icons/fi';
import HeroBanner from '../../components/HeroBanner';
import SectionRow from '../../components/SectionRow';
import { getPosterUrl } from '../../config/tmdbImage';

import { GenreContext } from '../../context/GenreContext';
import { WatchlistContext } from '../../context/WatchlistContext';
import { UserContext } from '../../context/UserContext';
import { AuthContext } from '../../context/AuthContext';
import { getTrendingMovies, getTrendingAll, getPopularTV, getTVAiringToday } from '../../services/tmdb';
import { generateRecommendations } from '../../services/recommendationEngine';
import { getRating } from '../../utils/getRating';

const HomeScreen = () => {
  const { selectedGenres } = useContext(GenreContext);
  const { addToWatchlist } = useContext(WatchlistContext);
  const { darkTheme } = useContext(UserContext);
  const { username, user, isGuest } = useContext(AuthContext);
  const navigate = useNavigate();

  const [trendingMovies, setTrendingMovies] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [recMessage, setRecMessage] = useState('');
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch standard sections
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch trending (mixed movies and TV)
        const trendingData = await getTrendingAll(1);
        console.log("Sample movie:", trendingData[0]);
        setTrendingMovies(trendingData.slice(0, 8));

        // Fetch popular movies + popular TV shows and mix them
        const [popularMoviesData, popularTVData] = await Promise.all([
          getTrendingMovies(2),
          getPopularTV(1),
        ]);
        const mixedPopular = [...popularMoviesData, ...popularTVData].slice(0, 8);
        setPopularMovies(mixedPopular);

        // Fetch airing today for "new releases"
        const airingTodayData = await getTVAiringToday(1);
        setTopRatedMovies(airingTodayData.slice(0, 8));
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Failed to load movies. Using mock data.');
        setTopRatedMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [selectedGenres]);

  // Personalized Recommendations
  useEffect(() => {
    const loadRecs = async () => {
      if (isGuest || !user) {
        setRecommendedMovies([]);
        setRecMessage("Log in to get personalized recommendations.");
        return;
      }

      setRecMessage("Generating recommendations...");
      try {
        const recs = await generateRecommendations(user);
        if (recs && recs.length > 0) {
          setRecommendedMovies(recs);
          setRecMessage('');
        } else {
          setRecommendedMovies([]);
          setRecMessage("Not enough watch history to generate recommendations yet.");
        }
      } catch (e) {
        setRecommendedMovies([]);
        setRecMessage("Could not load recommendations.");
      }
    };

    loadRecs();
  }, [user, isGuest]);

  const featured = trendingMovies[0];

  const handleMovieClick = (movie) => {
    const route = movie.media_type === 'tv' ? `/tv/${movie.id}` : `/movie/${movie.id}`;
    navigate(route);
  };

  const handleAddToWatchlist = (movie) => {
    if (isGuest) {
      navigate('/login');
      return;
    }

    addToWatchlist({
      id: movie.id,
      title: movie.title || movie.name,
      image: movie.poster_path,
      genre: movie.genres?.[0] || 'Unknown',
      year: movie.release_date
        ? new Date(movie.release_date).getFullYear()
        : movie.first_air_date
          ? new Date(movie.first_air_date).getFullYear()
          : new Date().getFullYear(),
      runtime: movie.runtime || '120 min',
      progress: 0,
      media_type: movie.media_type || 'movie'
    });
  };

  const handleWatch = (movie) => {
    // Default to movie if media_type missing (for featured)
    const route = (movie.media_type === 'tv') ? `/tv/${movie.id}` : `/movie/${movie.id}`;
    navigate(route);
  };

  return (
    <div className={`min-h-screen ${darkTheme ? 'bg-app-bg-dark text-white' : 'bg-app-bg-light text-text-light'} pb-32 fade-in transition-colors duration-300`}>
      {/* Profile Icon - Top Right */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/profile')}
        className="fixed top-6 right-6 z-40 w-12 h-12 rounded-full bg-gradient-to-br from-primary-yellow to-primary-yellow-dark flex items-center justify-center text-white shadow-yellow-glow-lg"
      >
        <FiUser size={24} />
      </motion.button>

      {/* Error Banner */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 sm:px-6 mt-4 mb-4"
        >
          <div className={`p-4 rounded-xl border-2 ${darkTheme ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' : 'bg-yellow-500/5 border-yellow-500/30 text-yellow-600'}`}>
            <p className="text-sm font-medium">⚠️ {error}</p>
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className={`text-center ${darkTheme ? 'text-white' : 'text-text-light'}`}>
            <div className="w-12 h-12 border-3 border-primary-yellow/30 border-t-primary-yellow rounded-full animate-spin mx-auto mb-4" />
            <p>Loading movies...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Main Content Container */}
          <div className="max-w-7xl mx-auto">
            {/* Hero Banner Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="px-4 sm:px-6 pt-6"
            >
              <HeroBanner
                movie={featured}
                onWatch={handleWatch}
                onAdd={handleAddToWatchlist}
              />
            </motion.div>

            {/* Sections Container */}
            <div className="space-y-10 pb-8 mt-8">
              {/* Trending Now */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <SectionRow
                  title="🔥 Trending Now"
                  movies={trendingMovies}
                  onMovieClick={handleMovieClick}
                />
              </motion.div>

              {/* Popular Movies */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <SectionRow
                  title="Popular Movies"
                  movies={popularMovies}
                  onMovieClick={handleMovieClick}
                />
              </motion.div>

              {/* Recommended For You */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                {recommendedMovies.length > 0 ? (
                  <SectionRow
                    title="Recommended For You"
                    movies={recommendedMovies}
                    onMovieClick={handleMovieClick}
                  />
                ) : (
                  <div className="px-6 py-8 mx-6 rounded-xl bg-white/5 border border-white/10 text-center">
                    <h3 className="text-lg font-bold text-white mb-2">Recommended For You</h3>
                    <p className="text-gray-400 text-sm">{recMessage || "Start watching to get recommendations."}</p>
                  </div>
                )}
              </motion.div>

              {/* Top Rated Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="px-4 sm:px-6"
              >
                <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-6">🏆 New Releases</h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                  {topRatedMovies.map((movie) => (
                    <motion.div
                      key={`top-${movie.id}`}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleMovieClick(movie)}
                      className="cursor-pointer group"
                    >
                      <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-card-bg shadow-card">
                        <img
                          src={getPosterUrl(movie.poster_path)}
                          alt={movie.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
                        <div className="absolute top-2 right-2 bg-primary-yellow text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-yellow-glow">
                          ⭐ {getRating(movie)}
                        </div>
                      </div>
                      <h3 className="text-white text-xs sm:text-sm font-bold mt-2 truncate group-hover:text-primary-yellow transition-colors">
                        {movie.title || movie.name}
                      </h3>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HomeScreen;




