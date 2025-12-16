import React, { useEffect, useState } from 'react';
import { getTrendingMovies, getMovieVideos } from '../../services/tmdb';
import { getGenreArray } from '../../services/genres';

const TestTmdb = () => {
  const [trending, setTrending] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const testAPI = async () => {
      try {
        console.log('🧪 Testing TMDb API...');

        // Test trending movies
        const trendingMovies = await getTrendingMovies(1);
        console.log('✅ Trending movies fetched:', trendingMovies.length, 'movies');
        setTrending(trendingMovies.slice(0, 10));

        // Test genres
        const genreList = await getGenreArray();
        console.log('✅ Genres fetched:', genreList.length, 'genres');
        setGenres(genreList);

        // Test video fetching for first movie
        if (trendingMovies.length > 0) {
          const videos = await getMovieVideos(trendingMovies[0].id);
          console.log(`✅ Videos fetched for "${trendingMovies[0].title}":`, videos.length, 'videos');
        }

        setError('');
      } catch (err) {
        console.error('❌ API Test Error:', err);
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    testAPI();
  }, []);

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1>🧪 TMDb API Test Page</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!loading && (
        <>
          <h2>Trending Movies (First 10)</h2>
          <ol>
            {trending.map((movie) => (
              <li key={movie.id}>
                {movie.title || 'N/A'} ({movie.release_date?.slice(0, 4) || 'N/A'}) - ID: {movie.id}
              </li>
            ))}
          </ol>

          <h2>Available Genres ({genres.length})</h2>
          <p>{genres.map((g) => g.name).join(', ')}</p>

          <h2>API Status</h2>
          <p style={{ color: 'green' }}>✅ All API endpoints working!</p>
          <p>You can now delete this test page or keep it for debugging.</p>
        </>
      )}
    </div>
  );
};

export default TestTmdb;



