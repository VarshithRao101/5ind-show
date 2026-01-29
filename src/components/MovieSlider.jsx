import React, { useRef, memo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiRefreshCw } from 'react-icons/fi';
import MovieCard from './MovieCard';
import SkeletonCard from './skeletons/SkeletonCard';
import { WatchlistContext } from '../context/WatchlistContext';
import { AuthContext } from '../context/AuthContext';
import { getRating } from '../utils/getRating';
import { getGenreName } from '../utils/genreMap';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { type: "spring", stiffness: 100, damping: 20 }
    }
};

const MovieSlider = ({
    title,
    subtitle = "",
    movies = [],
    showCount = 20,
    fullWidth = false,
    onRefresh = null,
    loading = false,
    ranked = false
}) => {
    const navigate = useNavigate();
    const sliderRef = useRef(null);
    const { savedForLater, currentlyWatching, addToWatchlist, removeFromWatchlist } = useContext(WatchlistContext);
    const { isGuest } = useContext(AuthContext);

    const scroll = (direction) => {
        if (sliderRef.current) {
            const { current } = sliderRef;
            const scrollAmount = direction === 'left' ? -current.offsetWidth / 2 : current.offsetWidth / 2;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    if (!loading && (!movies || movies.length === 0)) return null;

    const handleWatchlist = (movie, inList) => {
        if (isGuest) {
            navigate('/login');
            return;
        }
        inList ? removeFromWatchlist(movie.id) : addToWatchlist(movie);
    };

    return (
        <section className="mb-8 relative group pl-4 md:pl-12 overflow-hidden">

            {/* Header Section */}
            <div className="flex items-end gap-3 mb-6 pr-12 z-10 relative">
                <div className="flex flex-col pl-4 border-l-4 border-primary-yellow">
                    <motion.h2
                        initial={{ x: -20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-2xl md:text-3xl font-heading font-bold text-white tracking-wide cursor-pointer group/title flex items-center gap-2"
                    >
                        {title}
                    </motion.h2>
                    {subtitle && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-sm md:text-base text-gray-400 font-medium mt-1 leading-relaxed"
                        >
                            {subtitle}
                        </motion.p>
                    )}
                </div>

                {onRefresh && (
                    <button
                        onClick={onRefresh}
                        className={`mb-1 p-2 rounded-full hover:bg-white/10 transition-colors ${loading ? 'animate-spin' : ''}`}
                        title="Refresh"
                    >
                        <FiRefreshCw size={14} className="text-gray-500 hover:text-white" />
                    </button>
                )}
            </div>

            <div className="relative -ml-4 md:-ml-12 perspective-1000">
                {/* Left Arrow */}
                <div className="absolute left-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-r from-[#0f0f0f] to-transparent z-20 flex items-center justify-start pl-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                    <button
                        onClick={() => scroll('left')}
                        className="bg-black/80 hover:bg-primary-yellow hover:text-black text-white rounded-full p-3 backdrop-blur-md border border-white/10 transition-all shadow-lg hover:scale-110"
                    >
                        <FiChevronLeft size={24} />
                    </button>
                </div>

                {/* Slider Container */}
                <motion.div
                    ref={sliderRef}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "100px" }}
                    className={`flex gap-4 overflow-x-auto overflow-y-hidden px-4 md:px-12 pb-12 pt-4 scroll-smooth snap-x snap-mandatory ${ranked ? 'items-end' : 'items-center'} scrollbar-hide md:[&::-webkit-scrollbar]:block`}
                >
                    {loading ? (
                        [...Array(6)].map((_, i) => (
                            <div key={i} className="snap-start flex-shrink-0">
                                <SkeletonCard />
                            </div>
                        ))
                    ) : (
                        Array.isArray(movies) && movies.slice(0, showCount).map((movie, index) => {
                            const inList = [...savedForLater, ...currentlyWatching].some(item => item.id === movie.id);
                            return (
                                <motion.div
                                    key={`${movie.id}-${index}`}
                                    variants={itemVariants}
                                    className={`${ranked ? 'min-w-[260px]' : 'min-w-[160px] md:min-w-[170px]'} snap-start flex-shrink-0 transform transition-transform hover:z-30 origin-center`}
                                >
                                    <MovieCard
                                        id={movie.id}
                                        title={movie.title || movie.name}
                                        posterPath={movie.poster_path}
                                        rating={getRating(movie)}
                                        genre={getGenreName(movie.genre_ids?.[0]) || "Movie"}
                                        year={(movie.release_date || movie.first_air_date || "").substring(0, 4)}
                                        rank={ranked ? index + 1 : null}
                                        isInWatchlist={inList}
                                        onToggleWatchlist={() => handleWatchlist(movie, inList)}
                                        onNavigate={() => navigate(movie.media_type === 'tv' ? `/tv/${movie.id}` : `/movie/${movie.id}`)}
                                    />
                                </motion.div>
                            );
                        })
                    )}

                    {/* Spacer for right padding */}
                    <div className="min-w-[20px] md:min-w-[40px] flex-shrink-0" />
                </motion.div>

                {/* Right Arrow */}
                <div className="absolute right-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-l from-[#0f0f0f] to-transparent z-20 flex items-center justify-end pr-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                    <button
                        onClick={() => scroll('right')}
                        className="bg-black/80 hover:bg-primary-yellow hover:text-black text-white rounded-full p-3 backdrop-blur-md border border-white/10 transition-all shadow-lg hover:scale-110"
                    >
                        <FiChevronRight size={24} />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default memo(MovieSlider);



