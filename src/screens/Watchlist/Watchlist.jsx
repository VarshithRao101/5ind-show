// src/screens/Watchlist/Watchlist.jsx
import React, { useContext, useMemo } from 'react';
import { WatchlistContext } from '../../context/WatchlistContext';
import { useNavigate } from 'react-router-dom';
import { FiArchive, FiTrash2 } from 'react-icons/fi';

// 1. Import SmartImage (add at top)
import { getPosterUrl } from '../../config/tmdbImage';
import SmartImage from '../../components/SmartImage';

// ...
import MovieCard from '../../components/MovieCard';

// ... (existing helper function removal)

export default function Watchlist() {
  const { savedForLater, removeFromWatchlist } = useContext(WatchlistContext);
  const navigate = useNavigate();

  // Allow Movies AND TV
  const watchlistItems = useMemo(() => {
    return savedForLater; // Display everything in watchlist
  }, [savedForLater]);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white pt-24 px-4 md:px-8 pb-12">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold mb-2 text-white">My Watchlist</h1>
            <p className="text-gray-400">Your collection of movies and shows.</p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-[#1f1f1f] rounded-lg border border-white/10 text-gray-300">
            <FiArchive />
            <span className="font-bold text-primary-yellow">{watchlistItems.length}</span> Items
          </div>
        </div>

        {/* Content Grid */}
        {watchlistItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-x-6 gap-y-10">
            {watchlistItems.map((item) => (
              <MovieCard
                key={item.id}
                movie={item}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-white/5 rounded-2xl bg-white/5 text-center">
            <div className="text-6xl mb-4 opacity-20">🎬</div>
            <h3 className="text-2xl font-bold mb-2">Your watchlist is empty</h3>
            <p className="text-gray-500 mb-6 max-w-md">
              Ready to start your movie marathon? Browse our catalog and add movies you like.
            </p>
            <button onClick={() => navigate('/home')} className="px-8 py-3 bg-primary-yellow rounded-lg font-bold text-black hover:bg-primary-yellow-hover transition-colors shadow-yellow-glow">
              Browse Movies
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
