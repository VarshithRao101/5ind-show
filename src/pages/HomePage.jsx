import React, { useEffect, useState, useContext } from 'react';
import { isMobileDevice } from "../utils/isMobile";
import MobileMovieGrid from "../components/MobileMovieGrid";
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlay, FiInfo, FiPlus, FiCheck, FiX } from 'react-icons/fi';
import {
    getTrendingAll,
    getTopRatedMovies,
    getNowPlayingMovies,
    getTopIndiaMovies,
    getFilteredResults,
} from '../services/tmdb';
import MovieSlider from '../components/MovieSlider';
import MovieCard from '../components/MovieCard';
import SkeletonCard from '../components/skeletons/SkeletonCard';
import { WatchlistContext } from '../context/WatchlistContext';
import { UserContext } from '../context/UserContext';
import { FilterContext } from '../context/FilterContext';
import { getPoster } from "../utils/poster";

// Hero Slide Component
const HeroSlide = ({ movie }) => {
    const navigate = useNavigate();
    const { addToWatchlist, removeFromWatchlist, checkIfInWatchlist } = useContext(WatchlistContext);
    const inList = checkIfInWatchlist(movie?.id);
    const background = movie?.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : getPoster(movie?.poster_path, 'w780');

    if (!movie) return null;

    return (
        <div className="relative w-full h-[85vh] md:h-[90vh] overflow-hidden">
            {/* Background Image with Zoom Effect */}
            <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 10, ease: "easeOut" }}
                className="absolute inset-0"
            >
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${background})` }}
                />
            </motion.div>

            {/* Polished Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f] via-[#0f0f0f]/30 to-transparent" />

            {/* Content Container */}
            <div className="absolute inset-0 flex items-center">
                <div className="w-full max-w-7xl mx-auto px-6 md:px-12 pt-32 md:pt-0 flex flex-col justify-center h-full">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="max-w-3xl space-y-6"
                    >
                        {/* Title */}
                        <h1 className="text-4xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-tight drop-shadow-2xl font-heading">
                            {movie.title || movie.name}
                        </h1>

                        {/* Metadata Row */}
                        <div className="flex items-center gap-4 text-sm md:text-base font-semibold text-gray-300">
                            <span className="text-[#FFD400] tracking-wider uppercase">Top Pick</span>
                            <span>•</span>
                            <span>{movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-[#FFD400]">
                                ★ {movie.vote_average?.toFixed(1)}
                            </span>
                        </div>

                        {/* Overview */}
                        <p className="text-gray-200 text-base md:text-xl line-clamp-3 leading-relaxed max-w-2xl font-medium drop-shadow-md">
                            {movie.overview}
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-wrap items-center gap-4 pt-6">
                            <button
                                onClick={() => navigate(movie.media_type === 'tv' ? `/tv/${movie.id}` : `/movie/${movie.id}`)}
                                className="flex items-center gap-3 bg-[#FFD400] text-black px-8 py-3.5 rounded-xl hover:bg-[#e3b616] transition-all font-bold text-lg hover:scale-105 active:scale-95 shadow-lg shadow-yellow-500/20"
                            >
                                <FiPlay size={22} fill="black" />
                                Play
                            </button>

                            <button
                                onClick={() => navigate(movie.media_type === 'tv' ? `/tv/${movie.id}` : `/movie/${movie.id}`)}
                                className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-3.5 rounded-xl hover:bg-white/20 transition-all font-bold text-lg hover:scale-105 active:scale-95"
                            >
                                <FiInfo size={22} />
                                More Info
                            </button>

                            {(movie.media_type !== 'tv') && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (inList) removeFromWatchlist(movie.id);
                                        else addToWatchlist(movie);
                                    }}
                                    className="p-3.5 rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
                                    title={inList ? "Remove from List" : "Add to List"}
                                >
                                    {inList ? <FiCheck size={22} /> : <FiPlus size={22} />}
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default function HomePage() {
    const isMobile = isMobileDevice();
    const [heroMovie, setHeroMovie] = useState(null);
    const { filters } = useContext(FilterContext);
    const { darkTheme } = useContext(UserContext);

    // Sections Data
    const [trending, setTrending] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [nowPlaying, setNowPlaying] = useState([]);
    const [indiaTop, setIndiaTop] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    // Safety Timeout
    useEffect(() => {
        const safety = setTimeout(() => {
            setLoading(false);
        }, 6000);
        return () => clearTimeout(safety);
    }, []);

    // Load Movies
    useEffect(() => {
        let mounted = true;

        const loadMovies = async () => {
            setLoading(true);
            try {
                // Check Cache
                const cached = sessionStorage.getItem('homeData_v2');
                if (cached) {
                    const data = JSON.parse(cached);
                    if (Date.now() - data.timestamp < 3600000) {
                        if (mounted) {
                            setTrending(data.trending || []);
                            setIndiaTop(data.indiaTop || []);
                            setTopRated(data.topRated || []);
                            setNowPlaying(data.nowPlaying || []);

                            if (data.trending && data.trending.length > 0) {
                                setHeroMovie(data.trending[Math.floor(Math.random() * Math.min(6, data.trending.length))]);
                            }
                        }
                        return;
                    }
                }

                // Guarded fetches
                const fetchTrending = getTrendingAll(1).catch(() => []);
                const fetchIndia = getTopIndiaMovies(10).catch(() => []);
                const fetchTop = getTopRatedMovies(1).catch(() => []);
                const fetchNow = getNowPlayingMovies(1).catch(() => []);

                const [trend, ind, top, now] = await Promise.all([fetchTrending, fetchIndia, fetchTop, fetchNow]);

                if (mounted) {
                    setTrending(trend || []);
                    setIndiaTop(ind || []);
                    setTopRated(top || []);
                    setNowPlaying(now || []);

                    if (trend && trend.length > 0) {
                        setHeroMovie(trend[Math.floor(Math.random() * Math.min(6, trend.length))]);
                    }

                    // Cache Update
                    sessionStorage.setItem('homeData_v2', JSON.stringify({
                        timestamp: Date.now(),
                        trending: trend || [],
                        indiaTop: ind || [],
                        topRated: top || [],
                        nowPlaying: now || []
                    }));
                }
            } catch (error) {
                // Silent catch
                if (mounted) {
                    setTrending((prev) => prev || []);
                    setIndiaTop((prev) => prev || []);
                    setTopRated((prev) => prev || []);
                    setNowPlaying((prev) => prev || []);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };

        loadMovies();

        return () => {
            mounted = false;
        };
    }, []);

    // Filter Logic
    useEffect(() => {
        let mounted = true;

        const loadFiltered = async () => {
            const isDefault = filters.sortBy === 'popularity' && filters.contentType === 'all';
            if (isDefault) {
                if (mounted) setFilteredMovies([]);
                return;
            }

            setLoading(true);
            try {
                let apiSort = 'popularity.desc';
                const type = filters.contentType === 'all' ? 'movie' : filters.contentType;
                if (filters.sortBy === 'rating') apiSort = 'vote_average.desc';
                if (filters.sortBy === 'date') apiSort = (type === 'tv') ? 'first_air_date.desc' : 'primary_release_date.desc';

                let yFrom = null, yTo = null;
                if (filters.year) {
                    if (filters.year.includes('-')) [yFrom, yTo] = filters.year.split('-');
                    else { yFrom = filters.year; yTo = filters.year; }
                }

                const results = await getFilteredResults({
                    type: type,
                    sortBy: apiSort,
                    genre: filters.genreId,
                    language: filters.language,
                    yearFrom: yFrom,
                    yearTo: yTo,
                    page: 1
                });

                if (mounted) {
                    setFilteredMovies(results || []);
                }
            } catch (error) {
                // Silent catch
                if (mounted) setFilteredMovies([]);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        loadFiltered();

        return () => {
            mounted = false;
        };
    }, [filters]);


    // Local Components
    const SkeletonHero = () => (
        <div className="w-full h-[85vh] md:h-[90vh] bg-[#1f1f1f] animate-pulse relative">
            <div className="absolute bottom-20 left-6 md:left-12 space-y-6 w-full max-w-3xl">
                <div className="h-10 md:h-16 w-3/4 bg-white/5 rounded-lg"></div>
                <div className="flex gap-4">
                    <div className="h-6 w-24 bg-white/5 rounded"></div>
                    <div className="h-6 w-24 bg-white/5 rounded"></div>
                </div>
                <div className="h-4 w-full bg-white/5 rounded"></div>
                <div className="h-4 w-2/3 bg-white/5 rounded"></div>
                <div className="flex gap-4 pt-4">
                    <div className="h-14 w-40 bg-white/5 rounded-xl"></div>
                    <div className="h-14 w-40 bg-white/5 rounded-xl"></div>
                </div>
            </div>
        </div>
    );

    const SkeletonRow = () => (
        <div className="w-full space-y-4 pl-6 md:pl-12 my-8">
            <div className="h-8 w-48 bg-white/5 rounded mb-4"></div>
            <div className="flex gap-4 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex-shrink-0">
                        <SkeletonCard />
                    </div>
                ))}
            </div>
        </div>
    );

    const EmptyState = ({ message }) => (
        <div className="py-12 flex flex-col items-center justify-center text-gray-500 bg-white/5 rounded-xl mx-6 md:mx-12 border border-white/5">
            <div className="text-4xl mb-4">🎬</div>
            <p className="font-medium text-lg">{message}</p>
        </div>
    );

    const isFiltered = filteredMovies.length > 0;

    return (
        <>
            {isMobile ? (
                <div className="min-h-screen pt-16 bg-[#0f0f0f]">
                    {loading && <div className="text-center mt-10 text-gray-400">Loading movies…</div>}
                    {!loading && <MobileMovieGrid movies={isFiltered ? filteredMovies : trending} />}
                    {!loading && (isFiltered ? filteredMovies : trending).length === 0 && (
                        <div className="text-center text-gray-400 mt-8">
                            Nothing to show right now
                        </div>
                    )}
                </div>
            ) : (
                <div className={`min-h-screen pb-24 ${darkTheme ? 'bg-[#0f0f0f]' : 'bg-gray-100'} overflow-x-hidden relative`}>
                    {/* Ambient Background */}
                    <div className="fixed inset-0 pointer-events-none z-0">
                        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#FFD400]/5 blur-[150px] rounded-full mix-blend-screen" />
                    </div>

                    <AnimatePresence>
                        {/* Hero Section */}
                        {loading && !heroMovie && !isFiltered && <SkeletonHero />}

                        {!isFiltered && heroMovie && (
                            <HeroSlide movie={heroMovie} />
                        )}

                        {!loading && !heroMovie && !isFiltered && (
                            <div className="h-[50vh] flex items-center justify-center text-gray-500">
                                <EmptyState message="No featured movie available" />
                            </div>
                        )}
                    </AnimatePresence>

                    <div className={`relative z-10 pb-12 bg-[#0f0f0f] min-h-[500px] ${isFiltered ? 'pt-24' : ''}`}>

                        {/* FILTERED VIEW */}
                        {isFiltered ? (
                            <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 animate-fade-in-up">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-3xl font-heading font-bold text-white flex items-center gap-3">
                                        <span className="w-1.5 h-8 bg-[#FFD400] rounded-full"></span>
                                        Filtered Results <span className="text-gray-500 text-lg">({filteredMovies.length})</span>
                                    </h2>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all flex items-center gap-2"
                                    >
                                        <FiX /> Clear Filters
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                                    {filteredMovies.map(movie => (
                                        <MovieCard key={movie.id} movie={movie} />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            /* STANDARD ROWS VIEW */
                            <div className="space-y-16 pt-12">
                                {/* 1. Top 10 India (Ranked) */}
                                <div className="relative z-20">
                                    {loading && !indiaTop.length && <SkeletonRow />}
                                    {!loading && indiaTop.length === 0 && (
                                        <div className="pl-6 md:pl-12">
                                            <h3 className="text-xl font-bold text-white mb-4">Top 10 in India Today</h3>
                                            <EmptyState message="No movies available right now" />
                                        </div>
                                    )}
                                    {indiaTop.length > 0 && (
                                        <MovieSlider
                                            title="Top 10 in India Today"
                                            movies={indiaTop}
                                            ranked={true}
                                        />
                                    )}
                                </div>

                                {/* 2. Trending */}
                                <div>
                                    {loading && !trending.length && <SkeletonRow />}
                                    {!loading && trending.length === 0 && (
                                        <div className="pl-6 md:pl-12">
                                            <h3 className="text-xl font-bold text-white mb-4">Trending Now</h3>
                                            <EmptyState message="No trending movies right now" />
                                        </div>
                                    )}
                                    {trending.length > 0 && <MovieSlider title="Trending Now" movies={trending} />}
                                </div>

                                {/* 3. Critically Acclaimed (Deferred) */}
                                <div className={`transition-opacity duration-1000 ${topRated.length > 0 || loading ? 'opacity-100' : 'opacity-0 h-0'}`}>
                                    {loading && !topRated.length && <SkeletonRow />}
                                    {!loading && topRated.length === 0 && null}
                                    {topRated.length > 0 && (
                                        <MovieSlider title="Critically Acclaimed" movies={topRated} />
                                    )}
                                </div>

                                {/* 4. Recommended For You (Deferred) */}
                                <div className={`transition-opacity duration-1000 ${nowPlaying.length > 0 || loading ? 'opacity-100' : 'opacity-0 h-0'}`}>
                                    {loading && !nowPlaying.length && <SkeletonRow />}
                                    {nowPlaying.length > 0 && (
                                        <MovieSlider title="Recommended For You" movies={nowPlaying} />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
