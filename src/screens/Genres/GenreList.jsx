/*
  GenreList.jsx
  Shows all genres from TMDb in a responsive grid.
  // GENRE SYSTEM HARD RESET COMPLETE
*/
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import GenreTypeCard from '../../components/GenreTypeCard';
import { getGenreArray } from '../../services/genres';

const GenreList = () => {
  const navigate = useNavigate();
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true);
        const list = await getGenreArray();
        setGenres(list);
      } catch (err) {
        console.error('Error fetching genres:', err);
        setError('Failed to load genres');
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  const goBack = () => {
    navigate(-1);
  };

  const openGenre = (genre) => {
    navigate(`/genres/${genre.id}`);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Top bar */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={goBack} className="p-2.5 rounded-full bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-all border border-white/5">
            <FiArrowLeft size={22} />
          </button>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">All Genres</h1>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-10 h-10 border-3 border-primary-yellow/20 border-t-primary-yellow rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-12 pb-24">
            {/* 1. Main Genres Grid */}
            <section>
              <h2 className="text-lg font-bold mb-4 text-gray-400 uppercase tracking-widest text-xs">Browse by Genre</h2>
              <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {genres.map((genre) => (
                  <GenreTypeCard
                    key={genre.id}
                    title={genre.name}
                    onClick={() => openGenre(genre)}
                  />
                ))}
              </div>
            </section>

            {/* 2. Indian Subbed Section */}
            <section>
              <h2 className="text-xl font-bold mb-6 text-gray-200 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-primary-yellow rounded-full"></span>
                Indian Originals
              </h2>
              <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
                {['te', 'ta', 'hi', 'ml', 'kn', 'bn'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => navigate(`/genres/india/sub/${lang}/all`)}
                    className="p-4 bg-[#1a1a1a] border border-white/5 rounded-2xl hover:bg-white/5 hover:border-primary-yellow/30 transition-all font-bold text-center uppercase text-sm sm:text-base group"
                  >
                    <span className="block text-gray-400 group-hover:text-white transition-colors">
                        {lang === 'te' ? 'Telugu' : lang === 'ta' ? 'Tamil' : lang === 'hi' ? 'Hindi' : lang === 'ml' ? 'Malayalam' : lang === 'kn' ? 'Kannada' : 'Bengali'}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* 3. Indian Dubbed Section */}
            <section>
              <h2 className="text-xl font-bold mb-6 text-gray-200 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                Indian Dubbed
              </h2>
              <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
                {['te', 'ta', 'hi', 'ml', 'kn', 'bn'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => navigate(`/genres/india/dub/${lang}/all`)}
                    className="p-4 bg-[#1a1a1a] border border-white/5 rounded-2xl hover:bg-white/5 hover:border-blue-500/30 transition-all font-bold text-center uppercase text-sm sm:text-base group"
                  >
                    <span className="block text-gray-400 group-hover:text-white transition-colors">
                        {lang === 'te' ? 'Telugu' : lang === 'ta' ? 'Tamil' : lang === 'hi' ? 'Hindi' : lang === 'ml' ? 'Malayalam' : lang === 'kn' ? 'Kannada' : 'Bengali'}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

      </div>
    </div>
  );
};

export default GenreList;



