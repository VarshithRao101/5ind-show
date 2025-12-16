import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import MovieCard from '../../components/MovieCard';

const SimilarMoviesSection = ({ movies, onMovieClick }) => {
  const scrollContainerRef = useRef(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(movies?.length > 4);

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

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 border-t border-gray-800"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Similar Movies</h2>

      <div className="relative group">
        {showLeftScroll && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-[#111216] hover:bg-[#1a1a1f] text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 border border-gray-700"
            aria-label="Scroll left"
          >
            <FiChevronLeft size={20} />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="flex-shrink-0 w-40 sm:w-48 cursor-pointer"
              onClick={() => onMovieClick?.(movie)}
            >
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>

        {showRightScroll && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-[#111216] hover:bg-[#1a1a1f] text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 border border-gray-700"
            aria-label="Scroll right"
          >
            <FiChevronRight size={20} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default SimilarMoviesSection;



