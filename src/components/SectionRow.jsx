import React, { useRef, useState, memo } from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import MovieCard from './MovieCard';
import { getGenreName } from '../utils/genreMap';

const SectionRow = memo(({ title, movies, onMovieClick }) => {
  const scrollContainerRef = useRef(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftScroll(scrollLeft > 0);
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="mb-10"
    >
      <div className="flex items-center gap-3 mb-6 px-4 sm:px-6">
        <div className="w-1 h-8 bg-primary-yellow rounded-full shadow-yellow-glow"></div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-wide">{title}</h2>
        </div>
      </div>

      <div className="relative group">
        {/* Left Scroll Button */}
        {showLeftScroll && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 glassmorphism hover:bg-primary-yellow/20 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-lg"
            aria-label="Scroll left"
          >
            <FiChevronLeft size={28} />
          </motion.button>
        )}

        {/* Scroll Container */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-4 sm:px-6 pb-2"
        >
          {(movies || []).map((movie) => (
            <div
              key={movie?.id}
              className="flex-shrink-0 w-40 sm:w-48"
            >
              <MovieCard
                id={movie.id}
                title={movie.title || movie.name}
                posterPath={movie.poster_path}
                rating={movie.vote_average ? movie.vote_average.toFixed(1) : "NR"}
                genre={getGenreName(movie.genre_ids?.[0])}
                year={(movie.release_date || movie.first_air_date || "").substring(0, 4)}
                onClick={() => onMovieClick?.(movie)}
              />
            </div>
          ))}
        </div>

        {/* Right Scroll Button */}
        {showRightScroll && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 glassmorphism hover:bg-primary-yellow/20 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-lg"
            aria-label="Scroll right"
          >
            <FiChevronRight size={28} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
});

export default SectionRow;



