import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { getPosterUrl } from '../../config/tmdbImage';

const CastSection = ({ cast }) => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(cast?.length > 4);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftScroll(scrollLeft > 0);
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!cast || cast.length === 0) {
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
      <h2 className="text-2xl font-bold text-white mb-6">Top Cast</h2>

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
          {cast.map((actor) => (
            <motion.div
              key={actor.id}
              whileHover={{ scale: 1.05 }}
              className="flex-shrink-0 flex flex-col items-center text-center cursor-pointer"
              onClick={() => navigate(`/actor/${actor.id}`)}
            >

              {/* Circular Image */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-[#111216] border-2 border-gray-700 hover:border-[#E11D1D] transition-colors flex items-center justify-center flex-shrink-0">
                <img
                  src={getPosterUrl(actor.profile_path, 'w185')}
                  alt={actor.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Name and Role */}
              <p className="text-white font-semibold text-sm mt-3 max-w-[120px] truncate">
                {actor.name}
              </p>
              <p className="text-[#9AA0A6] text-xs max-w-[120px] truncate">
                {actor.character || 'Character'}
              </p>
            </motion.div>
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

export default CastSection;



