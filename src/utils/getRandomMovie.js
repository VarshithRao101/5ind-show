// Utility to supply a random movie. Uses TMDB.
import { getRandomPopularMovie } from "../services/tmdb";

// Helper to normalize a TMDB movie object to the shape used in UI
const normalizeMovie = (m) => {
  if (!m) return null;
  const releaseYear = m.release_date ? new Date(m.release_date).getFullYear() : null;
  return {
    id: m.id,
    title: m.title || m.name,
    poster_path: m.poster_path,
    vote_average: m.vote_average,
    genre_ids: m.genre_ids,
    genres: m.genres?.map((g) => (typeof g === "string" ? g : g.name)) || [],
    release_date: m.release_date,
    runtime: m.runtime,
    overview: m.overview,
    release_year: releaseYear,
  };
};

export async function getRandomMovie() {
  // Try API
  try {
    if (typeof getRandomPopularMovie === "function") {
      const movie = await getRandomPopularMovie();
      if (movie) return normalizeMovie(movie);
    }
  } catch (e) {
    console.error("Error getting random movie:", e);
  }
  return null;
}

export default getRandomMovie;
