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
        <div className="flex items-center justify-between mb-4">
          <button onClick={goBack} className="p-2 rounded-md bg-transparent text-gray-300 hover:text-white focus:outline-none">
            <FiArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">All Genres</h1>
          <div className="w-8" />
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-4 p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-12 h-12 border-3 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-12 pb-12">
            {/* 1. Main Genres Grid */}
            <section>
              <h2 className="text-xl font-bold mb-6 text-gray-200">Browse by Genre</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
              <h2 className="text-xl font-bold mb-6 text-gray-200 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary-yellow rounded-full"></span>
                Indian Subbed Movies (Original)
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {['te', 'ta', 'hi', 'ml', 'kn', 'bn'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => navigate(`/genres/india/sub/${lang}/all`)}
                    className="p-4 bg-[#1f1f1f] border border-white/5 rounded-xl hover:bg-white/10 hover:border-primary-yellow/50 transition-all font-bold text-center uppercase"
                  >
                    {lang === 'te' ? 'Telugu' : lang === 'ta' ? 'Tamil' : lang === 'hi' ? 'Hindi' : lang === 'ml' ? 'Malayalam' : lang === 'kn' ? 'Kannada' : 'Bengali'}
                  </button>
                ))}
              </div>
            </section>

            {/* 3. Indian Dubbed Section */}
            <section>
              <h2 className="text-xl font-bold mb-6 text-gray-200 flex items-center gap-2">
                <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                Indian Dubbed Movies
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {['te', 'ta', 'hi', 'ml', 'kn', 'bn'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => navigate(`/genres/india/dub/${lang}/all`)}
                    className="p-4 bg-[#1f1f1f] border border-white/5 rounded-xl hover:bg-white/10 hover:border-blue-500/50 transition-all font-bold text-center uppercase"
                  >
                    {lang === 'te' ? 'Telugu' : lang === 'ta' ? 'Tamil' : lang === 'hi' ? 'Hindi' : lang === 'ml' ? 'Malayalam' : lang === 'kn' ? 'Kannada' : 'Bengali'}
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



