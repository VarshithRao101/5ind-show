import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { getMediaRoute } from '../../utils/mediaUtils';
import { getRating } from '../../utils/getRating';
import { getPosterUrl } from '../../config/tmdbImage';

const SimilarSection = ({ items, title = 'Similar Content', mediaType = 'movie' }) => {
  const navigate = useNavigate();
  const { darkTheme } = useContext(UserContext);
  const scrollContainerRef = useRef(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(items?.length > 4);

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

  const handleItemClick = (item) => {
    const route = getMediaRoute(item);
    navigate(route);
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={`max-w-3xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 border-t ${darkTheme ? 'border-gray-800' : 'border-gray-200'
        }`}
    >
      <h2 className={`text-2xl font-bold mb-6 ${darkTheme ? 'text-white' : 'text-gray-900'
        }`}>
        {title}
      </h2>

      <div className="relative group">
        {showLeftScroll && (
          <button
            onClick={() => scroll('left')}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 border ${darkTheme
              ? 'bg-gray-900/80 hover:bg-gray-800 border-gray-700'
              : 'bg-white/80 hover:bg-gray-50 border-gray-200'
              } text-white`}
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
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="flex-shrink-0 w-40 sm:w-48 cursor-pointer group/card"
              onClick={() => handleItemClick(item)}
            >
              {/* Poster */}
              <div className={`relative mb-3 rounded-lg overflow-hidden shadow-lg group-hover/card:shadow-yellow-glow-lg transition-all ${darkTheme ? 'bg-gray-800' : 'bg-gray-200'
                }`}>
                <img
                  src={getPosterUrl(item.poster_path, 'w200')}
                  alt={item.title || item.name}
                  className="w-full h-60 object-cover group-hover/card:scale-110 transition-transform duration-300"
                  loading="lazy"
                />

                {/* Overlay Rating */}
                {item.vote_average > 0 && (
                  <div className="absolute top-2 right-2 bg-primary-yellow/90 px-2 py-1 rounded text-white text-xs font-bold">
                    ⭐ {getRating(item)}/10
                  </div>
                )}
              </div>

              {/* Content */}
              <h3 className={`font-bold line-clamp-2 mb-1 text-sm group-hover/card:text-primary-yellow transition-colors ${darkTheme ? 'text-white' : 'text-gray-900'
                }`}>
                {item.title || item.name}
              </h3>

              <p className={`text-xs ${darkTheme ? 'text-gray-400' : 'text-gray-600'
                }`}>
                {item.release_date
                  ? new Date(item.release_date).getFullYear()
                  : item.first_air_date
                    ? new Date(item.first_air_date).getFullYear()
                    : 'N/A'}
              </p>
            </motion.div>
          ))}
        </div>

        {showRightScroll && (
          <button
            onClick={() => scroll('right')}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 border ${darkTheme
              ? 'bg-gray-900/80 hover:bg-gray-800 border-gray-700'
              : 'bg-white/80 hover:bg-gray-50 border-gray-200'
              } text-white`}
            aria-label="Scroll right"
          >
            <FiChevronRight size={20} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default SimilarSection;



