// src/pages/HomePage.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlay, FiInfo, FiPlus, FiCheck, FiX, FiRefreshCw } from 'react-icons/fi';
import {
    getTrendingAll,
    getTopRatedMovies,
    getNowPlayingMovies,
    getTopIndiaMovies,
    getFilteredResults,
} from '../services/tmdb';
import MovieSlider from '../components/MovieSlider';
import MovieCard from '../components/MovieCard';
import GlobalLoader from '../components/GlobalLoader';
import { WatchlistContext } from '../context/WatchlistContext';
import { UserContext } from '../context/UserContext';
import { FilterContext } from '../context/FilterContext';
import { getPosterUrl } from "../config/tmdbImage";

// Hero Slide Component
const HeroSlide = ({ movie }) => {
    const navigate = useNavigate();
    const { addToWatchlist, removeFromWatchlist, checkIfInWatchlist } = useContext(WatchlistContext);
    const inList = checkIfInWatchlist(movie?.id);
    const background = movie?.backdrop_path ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` : getPosterUrl(movie?.poster_path, 'w342');

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

    useEffect(() => {
        let mounted = true;
        const fetchData = async () => {
            const cached = sessionStorage.getItem('homeData_v2');
            if (cached) {
                const data = JSON.parse(cached);
                if (Date.now() - data.timestamp < 3600000) {
                    // 1. Critical IO (Cache)
                    setTrending(data.trending);
                    setIndiaTop(data.indiaTop);
                    if (data.trending.length > 0) {
                        setHeroMovie(data.trending[Math.floor(Math.random() * Math.min(6, data.trending.length))]);
                    }
                    setLoading(false);

                    // 2. Deferred IO (Cache)
                    setTimeout(() => {
                        if (mounted) {
                            setTopRated(data.topRated);
                            setNowPlaying(data.nowPlaying);
                        }
                    }, 500);
                    return;
                }
            }

            try {
                // 1. Critical Network Request (Top India + Trending)
                const [trend, ind] = await Promise.all([
                    getTrendingAll(1),
                    getTopIndiaMovies(10)
                ]);

                if (mounted) {
                    setTrending(trend);
                    setIndiaTop(ind);
                    if (trend.length > 0) {
                        setHeroMovie(trend[Math.floor(Math.random() * Math.min(6, trend.length))]);
                    }
                    setLoading(false); // Render Critical Content First
                }

                // 2. Deferred Network Request (Critically Acclaimed + Now Playing)
                // Delayed to prioritize mobile rendering performance
                setTimeout(async () => {
                    if (!mounted) return;
                    try {
                        const [top, now] = await Promise.all([
                            getTopRatedMovies(1),
                            getNowPlayingMovies(1)
                        ]);
                        if (mounted) {
                            setTopRated(top);
                            setNowPlaying(now);

                            // Update Cache with Full Data
                            sessionStorage.setItem('homeData_v2', JSON.stringify({
                                timestamp: Date.now(),
                                trending: trend,
                                indiaTop: ind,
                                topRated: top,
                                nowPlaying: now
                            }));
                        }
                    } catch (err) { console.error("Deferred fetch failed", err); }
                }, 1500);

            } catch (error) {
                console.error("Home load failed", error);
                if (mounted) setLoading(false);
            }
        };

        fetchData();
        return () => { mounted = false; };
    }, []);

    const fetchFiltered = React.useCallback(async () => {
        const isDefault = filters.sortBy === 'popularity' && filters.contentType === 'all';
        if (isDefault) {
            setFilteredMovies([]);
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

            setFilteredMovies(results);
        } catch (e) {
            console.error("Filter fetch failed", e);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchFiltered();
    }, [fetchFiltered]);

    if (loading && !heroMovie && filteredMovies.length === 0) return <GlobalLoader />;
    const isFiltered = filteredMovies.length > 0;

    return (
        <div className={`min-h-screen pb-24 ${darkTheme ? 'bg-[#0f0f0f]' : 'bg-gray-100'} overflow-x-hidden relative`}>
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#FFD400]/5 blur-[150px] rounded-full mix-blend-screen" />
            </div>

            <AnimatePresence>
                {!isFiltered && heroMovie && <HeroSlide movie={heroMovie} />}
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
                            <MovieSlider
                                title="Top 10 in India Today"
                                movies={indiaTop}
                                ranked={true}
                            />
                        </div>

                        {/* 2. Trending */}
                        <MovieSlider title="Trending Now" movies={trending} />

                        {/* 3. Critically Acclaimed (Deferred) */}
                        <div className={`transition-opacity duration-1000 ${topRated.length > 0 ? 'opacity-100' : 'opacity-0 h-0'}`}>
                            {topRated.length > 0 && (
                                <MovieSlider title="Critically Acclaimed" movies={topRated} />
                            )}
                        </div>

                        {/* 4. Recommended For You (Deferred) */}
                        <div className={`transition-opacity duration-1000 ${nowPlaying.length > 0 ? 'opacity-100' : 'opacity-0 h-0'}`}>
                            {nowPlaying.length > 0 && (
                                <MovieSlider title="Recommended For You" movies={nowPlaying} />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
