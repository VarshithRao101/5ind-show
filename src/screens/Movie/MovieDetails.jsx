import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoLanguage } from 'react-icons/io5';
import HeroSection from './HeroSection';
import OverviewSection from './OverviewSection';
import ProviderSection from './ProviderSection';
import CastSection from './CastSection';
import SimilarSection from './SimilarSection';
import TrailerModal from '../../components/TrailerModal';

import { WatchlistContext } from '../../context/WatchlistContext';
import { UserContext } from '../../context/UserContext';
import { AuthContext } from '../../context/AuthContext';
import { FiPlus, FiCheck, FiArrowLeft } from 'react-icons/fi';
import { getRating } from '../../utils/getRating';
import { getProcesedProviders } from '../../utils/providerUtils';
import { getMediaRoute, sanitizeMediaItem } from '../../utils/mediaUtils';
import {
  getMovieDetails,
  getMovieVideos,
  getMovieCredits,
  getSimilarMovies,
  getMovieProviders,
} from '../../services/tmdb';

import { updateHistory } from '../../services/user';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToWatchlist, removeFromWatchlist, checkIfInWatchlist } = useContext(WatchlistContext);
  const { darkTheme } = useContext(UserContext);
  const { isGuest, user } = useContext(AuthContext);

  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState('movie');
  const [similar, setSimilar] = useState([]);
  const [cast, setCast] = useState([]);
  const [providers, setProviders] = useState([]);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [trailerId, setTrailerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Update History
  useEffect(() => {
    if (user && !isGuest && id) {
      updateHistory(user.uid, id);
    }
  }, [user, isGuest, id]);

  // Check if media is already in watchlist
  const isInWatchlist = media ? checkIfInWatchlist(media.id) : false;

  // Fetch movie details and related data
  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        setError('');
        setMediaType('movie');

        // Main Details
        const movieResponse = await getMovieDetails(id);
        setMedia(movieResponse.data);

        // Fetch other data in parallel
        const [videosRes, creditsRes, similarRes, providersRes] = await Promise.allSettled([
          getMovieVideos(id),
          getMovieCredits(id),
          getSimilarMovies(id),
          getMovieProviders(id)
        ]);

        // Process Videos
        if (videosRes.status === 'fulfilled') {
          const videos = videosRes.value.data.results || [];
          // Try to find official trailer, then any trailer, then teaser
          const trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube') ||
            videos.find(v => v.type === 'Teaser' && v.site === 'YouTube') ||
            videos.find(v => v.site === 'YouTube');
          setTrailerId(trailer?.key || null);
        }

        // Process Cast
        if (creditsRes.status === 'fulfilled') {
          setCast(creditsRes.value.data.cast?.slice(0, 5) || []);
        }

        // Process Similar (using sanitizeMediaItem)
        if (similarRes.status === 'fulfilled') {
          const similarData = similarRes.value.data.results || [];
          setSimilar(similarData.map(sanitizeMediaItem).slice(0, 8));
        }

        // Process Providers (using helper)
        if (providersRes.status === 'fulfilled') {
          const processed = getProcesedProviders(providersRes.value.data.results);
          setProviders(processed);
        }

      } catch (err) {
        console.error('Error fetching movie data:', err);
        setError('Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  const handleBookmark = () => {
    // Guard: Check if guest user trying to add to watchlist
    if (isGuest) {
      navigate('/login');
      alert('Create an account to use Watchlist');
      return;
    }

    if (isInWatchlist) {
      removeFromWatchlist(media.id);
    } else {
      addToWatchlist(media);
    }
  };

  const handleWatch = () => {
    if (trailerId) {
      setIsTrailerOpen(true);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${darkTheme ? 'bg-app-bg-dark text-white' : 'bg-app-bg-light text-text-light'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-primary-yellow/30 border-t-primary-yellow rounded-full animate-spin mx-auto mb-4" />
          <p className={`text-xl ${darkTheme ? 'text-muted-text-dark' : 'text-muted-text-light'}`}>Loading {mediaType === 'tv' ? 'series' : 'movie'} details...</p>
        </div>
      </div>
    );
  }

  if (!media) {
    return (
      <div className={`min-h-screen ${darkTheme ? 'bg-app-bg-dark text-white' : 'bg-app-bg-light text-text-light'} flex items-center justify-center`}>
        <p className={`text-xl ${darkTheme ? 'text-muted-text-dark' : 'text-muted-text-light'}`}>Content not found</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkTheme ? 'bg-app-bg-dark text-white' : 'bg-app-bg-light text-text-light'} pb-32 fade-in transition-colors duration-300`}>
      {/* Back Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleBack}
        className="fixed top-6 left-6 z-50 p-3 rounded-xl glassmorphism hover:bg-primary-yellow/20 text-white shadow-lg"
        aria-label="Go back"
      >
        <FiArrowLeft size={24} />
      </motion.button>

      {/* Hero Section */}
      <HeroSection
        movie={media}
        onWatch={handleWatch}
        onBookmark={handleBookmark}
        isBookmarked={isInWatchlist}
        onTrailerClick={() => setIsTrailerOpen(true)}
      />

      {/* Overview Section */}
      <OverviewSection
        title="Overview"
        overview={
          media.description || media.overview ||
          'An incredible cinematic experience that will keep you on the edge of your seat. This movie combines stunning visuals with compelling storytelling.'
        }
      />

      {/* Languages Section */}
      {(media.spoken_languages || media.languages) && (media.spoken_languages || media.languages).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="px-4 sm:px-6 mb-8"
        >
          <h2 className="text-xl font-heading font-bold text-white mb-4 flex items-center gap-2">
            <IoLanguage size={24} className="text-primary-yellow" />
            Available Languages
          </h2>
          <div className="flex flex-wrap gap-2">
            {(media.spoken_languages || media.languages).map((lang) => (
              <span
                key={typeof lang === 'object' ? (lang.iso_639_1 || lang.name) : lang}
                className="px-4 py-2 rounded-xl bg-card-bg border border-card-border text-white font-semibold text-sm"
              >
                {typeof lang === 'object' ? (lang.english_name || lang.name) : lang}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Provider Section */}
      <ProviderSection providers={providers} mediaTitle={media.title || media.name} />

      {/* Cast Section */}
      <CastSection cast={cast.length > 0 ? cast : []} />

      {/* Similar Movies Section */}
      <SimilarSection
        items={similar}
        title="Similar Movies"
        mediaType="movie"
      />

      {/* Floating Action Button for Watchlist */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleBookmark}
        className={`fixed bottom-32 right-6 z-40 w-16 h-16 rounded-full text-white shadow-yellow-glow-lg flex items-center justify-center transition-all ${isInWatchlist
          ? 'bg-green-600 hover:bg-green-700'
          : 'bg-primary-yellow hover:bg-primary-yellow-hover'
          }`}
        aria-label={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
      >
        {isInWatchlist ? (
          <FiCheck size={30} />
        ) : (
          <FiPlus size={30} />
        )}
      </motion.button>

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        videoId={trailerId}
      />
    </div>
  );
};

export default MovieDetails;



