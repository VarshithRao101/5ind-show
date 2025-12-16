import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiPlus, FiCheck } from 'react-icons/fi';
import {
  getSeriesDetails,
  getSeriesCredits,
  getSeriesVideos,
  getSeasonEpisodes,
  getSimilarSeries,
  getWatchProviders,
} from '../../services/tmdb';
import { getPosterUrl } from '../../config/tmdbImage';
import { getProviderLogo } from '../../config/tmdbProviders';
import { backdropUrl } from '../../api/tmdbImages';
import { sanitizeMediaItem } from '../../utils/mediaUtils';
import HeroSection from '../Movie/HeroSection';
import OverviewSection from '../Movie/OverviewSection';
import CastSection from '../Movie/CastSection';
import SimilarSection from '../Movie/SimilarSection';
import TrailerModal from '../../components/TrailerModal';
import SeasonSelector from '../../components/SeasonSelector';
import SeasonCarousel from '../../components/SeasonCarousel';
import EpisodeList from '../../components/EpisodeList';
import EpisodeCard from '../../components/EpisodeCard';
import { WatchlistContext } from '../../context/WatchlistContext';
import { UserContext } from '../../context/UserContext';
import { AuthContext } from '../../context/AuthContext';
import { getRating } from '../../utils/getRating';


const TVDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToWatchlist, removeFromWatchlist, checkIfInWatchlist } = useContext(WatchlistContext);
  const { darkTheme } = useContext(UserContext);
  const { isGuest } = useContext(AuthContext);

  const [tv, setTV] = useState(null);
  const [cast, setCast] = useState([]);
  const [providers, setProviders] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [trailerId, setTrailerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [similarShows, setSimilarShows] = useState([]);

  const isInWatchlist = tv ? checkIfInWatchlist(tv.id) : false;

  // Fetch TV details
  useEffect(() => {
    const fetchTVData = async () => {
      try {
        setLoading(true);
        setError('');

        // Main Details
        const tvResponse = await getSeriesDetails(id);
        const tvData = tvResponse.data;
        setTV(tvData);

        // Set Seasons
        if (tvData.seasons && tvData.seasons.length > 0) {
          setSeasons(tvData.seasons);

          // Auto-select season 1 if available, otherwise first one
          const season1 = tvData.seasons.find(s => s.season_number === 1);
          const initialSeason = season1 || tvData.seasons[0];
          setSelectedSeason(initialSeason);
        }

        // Parallel fetch for other data
        const [videosRes, creditsRes, similarRes, providersRes] = await Promise.allSettled([
          getSeriesVideos(id),
          getSeriesCredits(id),
          getSimilarSeries(id),
          getWatchProviders(id, 'tv')
        ]);

        // Process Videos (Trailer)
        if (videosRes.status === 'fulfilled') {
          const videos = videosRes.value.data.results || [];
          const trailer = videos.find((v) => v.type === 'Trailer' && v.site === 'YouTube');
          setTrailerId(trailer?.key || null);
        }

        // Process Cast
        if (creditsRes.status === 'fulfilled') {
          setCast(creditsRes.value.data.cast?.slice(0, 5) || []);
        }

        // Process Similar (using sanitizeMediaItem so routing works)
        if (similarRes.status === 'fulfilled') {
          const similarItems = similarRes.value.data.results || [];
          // Force media_type 'tv' for sanitization if missing, since this is TV details
          const secureSimilar = similarItems.map(item => ({ ...item, media_type: 'tv' })).map(sanitizeMediaItem);
          setSimilarShows(secureSimilar.slice(0, 8));
        }

        // Process Providers (IN flatrate only)
        if (providersRes.status === 'fulfilled') {
          const allProviders = providersRes.value.data.results || {};
          const inProviders = allProviders.IN?.flatrate || [];
          console.log("OTT Providers:", inProviders);
          setProviders(inProviders);
        }

      } catch (err) {
        console.error('Error fetching TV data:', err);
        setError('Failed to load TV series');
      } finally {
        setLoading(false);
      }
    };

    fetchTVData();
  }, [id]);

  // Fetch episodes when season changes
  useEffect(() => {
    if (selectedSeason && tv) {
      const fetchEpisodes = async () => {
        try {
          setLoadingEpisodes(true);
          const seasonNum = typeof selectedSeason === 'object'
            ? selectedSeason.season_number
            : selectedSeason;
          const episodesResponse = await getSeasonEpisodes(tv.id, seasonNum);
          const episodesData = episodesResponse.data;
          setEpisodes(episodesData.episodes || []);
        } catch (err) {
          console.error('Error fetching episodes:', err);
          setEpisodes([]);
        } finally {
          setLoadingEpisodes(false);
        }
      };

      fetchEpisodes();
    }
  }, [selectedSeason, tv]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSelectSeason = (season) => {
    // Handle both season objects and season numbers
    const seasonNum = typeof season === 'object' ? season.season_number : season;
    setSelectedSeason(season);
    // Episodes will be fetched by the useEffect when selectedSeason changes
  };

  const handleBookmark = () => {
    if (isGuest) {
      navigate('/login');
      alert('Create an account to use Watchlist');
      return;
    }

    if (isInWatchlist) {
      removeFromWatchlist(tv.id);
    } else {
      addToWatchlist({
        id: tv.id,
        title: tv.name,
        image: tv.poster_path,
        year: tv.first_air_date ? new Date(tv.first_air_date).getFullYear() : 'TBA',
      });
    }
  };

  const handleWatch = () => {
    if (trailerId) {
      setIsTrailerOpen(true);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${darkTheme ? 'bg-app-bg-dark text-white' : 'bg-app-bg-light text-text-light'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-yellow mx-auto mb-4"></div>
          <p>Loading TV series...</p>
        </div>
      </div>
    );
  }

  if (!tv) {
    return (
      <div className={`min-h-screen ${darkTheme ? 'bg-app-bg-dark text-white' : 'bg-app-bg-light text-text-light'} flex items-center justify-center`}>
        <p className={`text-xl ${darkTheme ? 'text-muted-text-dark' : 'text-muted-text-light'}`}>Series not found</p>
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
        movie={tv}
        onWatch={handleWatch}
        onBookmark={handleBookmark}
        isBookmarked={isInWatchlist}
        onTrailerClick={() => setIsTrailerOpen(true)}
      />

      {/* Overview Section */}
      <OverviewSection
        title="Overview"
        overview={tv.overview || 'An incredible television series that will keep you engaged.'}
      />

      {/* Provider Section (Inline OTT) */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-primary-yellow rounded-full"></span> Available On
        </h3>
        {providers && providers.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {providers.map((p) => (
              <a
                key={p.provider_id}
                href={`https://www.themoviedb.org/tv/${tv.id}/watch?locale=IN`}
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-transform hover:scale-105"
              >
                <img
                  src={getProviderLogo(p.logo_path)}
                  alt={p.provider_name}
                  title={p.provider_name}
                  loading="lazy"
                  className="w-12 h-12 rounded-lg bg-white/10"
                />
              </a>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-400 italic">
            Not available for streaming
          </div>
        )}
      </div>

      {/* Cast Section */}
      <CastSection cast={cast} />

      {/* Similar Series Section */}
      <SimilarSection
        items={similarShows}
        title="Similar Series"
        mediaType="tv"
      />

      {/* Season Carousel */}
      {(seasons?.length || 0) > 0 && (
        <SeasonCarousel
          seasons={seasons?.filter(s => s?.season_number !== 0) || []}
          selectedSeason={selectedSeason}
          onSeasonChange={handleSelectSeason}
        />
      )}

      {/* Seasons & Episodes Section */}
      {(tv?.seasons?.length || 0) > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="px-4 sm:px-6 mb-12"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-heading font-bold text-white">Episodes</h2>
            <SeasonSelector
              seasons={tv?.seasons?.filter(s => s?.season_number !== 0) || []}
              selectedSeason={selectedSeason}
              onSeasonChange={handleSelectSeason}
            />
          </div>

          {/* Episodes List */}
          <EpisodeList
            episodes={episodes || []}
            selectedSeason={selectedSeason}
            loadingEpisodes={loadingEpisodes}
          />
        </motion.div>
      )}

      {/* Floating Action Button for Watchlist */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleBookmark}
        className={`fixed bottom-32 right-6 z-40 w-16 h-16 rounded-full text-white shadow-yellow-glow-lg flex items-center justify-center transition-all ${isInWatchlist
          ? 'bg-green-600 hover:bg-green-700'
          : 'bg-primary-yellow hover:bg-primary-yellow-hover'
          }`}
        aria-label={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
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

export default TVDetails;



