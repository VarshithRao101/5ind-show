/*
  GenreList.jsx
  Shows all genres from TMDb in a responsive grid.
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
    const encoded = encodeURIComponent(genre.name);
    navigate(`/genre/${encoded}`, { state: { genreId: genre.id, genreName: genre.name } });
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
        ) : genres.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400">No genres found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-8">
            {genres.map((genre) => (
              <GenreTypeCard
                key={genre.id}
                title={genre.name}
                onClick={() => openGenre(genre)}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default GenreList;



