import axios from "axios";
import { shuffleArray } from "../utils/shuffle";
import cache from "../utils/cache";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY || "e3af0171bcb844881fd1b0506b9d1c8a";

const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    language: 'en-US',
  },
  timeout: 5000,
});

tmdb.interceptors.request.use((config) => {
  config.params = config.params || {};
  config.params.api_key = API_KEY;
  return config;
});

// Helper: Shuffle Array (Fisher-Yates)
export function shuffle(arr) {
  if (!arr) return [];
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---------------------------------------------------------
// OTHER HELPERS (Trending, Transforms, etc.)
// ---------------------------------------------------------

const genreMap = {
  28: 'Action', 35: 'Comedy', 27: 'Horror', 53: 'Thriller',
  10749: 'Romance', 878: 'Science Fiction', 18: 'Drama',
  10751: 'Family', 14: 'Fantasy', 36: 'History', 10402: 'Music',
  9648: 'Mystery', 80: 'Crime', 12: 'Adventure'
};

const transformGenres = (genres) => {
  if (!genres) return [];
  if (typeof genres[0] === 'string') return genres;
  return genres.map((g) => (typeof g === 'object' ? g.name : genreMap[g] || 'Unknown'));
};

export async function fetchGenreList() {
  const res = await tmdb.get("/genre/movie/list", { params: { language: "en-US" } });
  const genres = res.data?.genres || [];
  const map = {};
  genres.forEach(g => (map[g.id] = g.name));
  return map;
}

// get details for movie or tv with append_to_response for videos,credits,similar,recommendations,watch/providers
export async function getMovieDetails(type = "movie", id) {
  // type = "movie" or "tv"
  if (!id) return null;
  // If only one arg is passed and it's an ID (legacy call), default to movie
  if (typeof type !== 'string' && id === undefined) {
    id = type;
    type = "movie";
  }

  const key = `details_${type}_${id}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const res = await tmdb.get(`/${type}/${id}`, {
    params: {
      append_to_response: "videos,credits,similar,recommendations,watch/providers",
      language: "en-US"
    }
  });
  const data = res.data;
  if (data.genres) data.genres = transformGenres(data.genres);
  cache.set(key, data, 600);
  return data;
}

// convenience: similar (array)
export async function getSimilarMovies(type = "movie", id, limit = 12) {
  if (!id) return [];
  try {
    const res = await tmdb.get(`/${type}/${id}/similar`, { params: { page: 1 } });
    return (res.data?.results || []).slice(0, limit);
  } catch (e) { return []; }
}

// ---------------------------------------------------------
// provider info (returns cluster for country code or fallback)
// DEPRECATED - Use getWatchProviders
// ---------------------------------------------------------
export async function getProviders(type = "movie", id, country = "IN") {
  return null;
}

export const getWatchProviders = (id, type = "movie") =>
  tmdb.get(`/${type}/${id}/watch/providers`);

// credits (cast + crew)
export async function getCredits(type = "movie", id) {
  if (!id) return null;
  try {
    const res = await tmdb.get(`/${type}/${id}/credits`);
    return res.data || null;
  } catch (e) { return { cast: [], crew: [] }; }
}

// If type === "tv": fetch episode details for specific season/episode
export async function getTvEpisodeDetails(tvId, seasonNumber, episodeNumber) {
  if (!tvId || seasonNumber == null || episodeNumber == null) return null;
  const res = await tmdb.get(`/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}`, {
    params: { append_to_response: "videos,credits" }
  });
  return res.data || null;
}

export async function getTvSeasonDetails(tvId, seasonNumber) {
  if (!tvId || seasonNumber == null) return null;
  try {
    const res = await tmdb.get(`/tv/${tvId}/season/${seasonNumber}`);
    return res.data || null;
  } catch (e) {
    return null;
  }
}

// Corrected Trending Endpoint
export const getTrendingMovies = async (page = 1) => {
  try {
    const response = await tmdb.get('/trending/movie/week', { params: { page } });
    return (response.data.results || []).map(m => ({ ...m, genres: transformGenres(m.genre_ids) }));
  } catch (error) { return []; }
};

export const getTrendingAll = async (page = 1) => {
  try {
    const response = await tmdb.get('/trending/all/week', { params: { page } });
    return (response.data.results || []).map(item => ({ ...item, genres: transformGenres(item.genre_ids) }));
  } catch (error) { return []; }
};

export const getPopularTV = async (page = 1) => {
  try {
    const response = await tmdb.get('/tv/popular', { params: { page } });
    return (response.data.results || []).map(show => ({ ...show, media_type: 'tv', genres: transformGenres(show.genre_ids) }));
  } catch (error) { return []; }
};

export const getTVAiringToday = async (page = 1) => {
  try {
    const response = await tmdb.get('/tv/airing_today', { params: { page } });
    return (response.data.results || []).map(show => ({ ...show, media_type: 'tv', genres: transformGenres(show.genre_ids) }));
  } catch (error) { return []; }
};

export const getRecommendedMovies = async (movieId) => {
  try {
    const response = await tmdb.get(`/movie/${movieId}/recommendations`);
    return (response.data.results || []).map(m => ({ ...m, genres: transformGenres(m.genre_ids) }));
  } catch (error) { return []; }
};

export const getMovieVideos = async (movieId) => {
  try {
    const response = await tmdb.get(`/movie/${movieId}/videos`);
    return { data: response.data };
  } catch (error) { return { data: { results: [] } }; }
};

export const getMovieCredits = async (movieId) => {
  try {
    const response = await tmdb.get(`/movie/${movieId}/credits`);
    return { data: response.data };
  } catch (error) { return { data: { cast: [] } }; }
};



export const getMovieProviders = async (movieId) => {
  try {
    const response = await tmdb.get(`/movie/${movieId}/watch/providers`);
    return { data: response.data };
  } catch (error) { return { data: { results: {} } }; }
};

// Aliases for TV
export const getSeriesDetails = async (tvId) => {
  try {
    const response = await tmdb.get(`/tv/${tvId}`);
    const data = response.data;
    if (data.genres) data.genres = transformGenres(data.genres);
    return { data };
  } catch (error) { throw error; }
};
export const getTVDetails = getSeriesDetails;

export const getSeriesVideos = async (tvId) => {
  try {
    const response = await tmdb.get(`/tv/${tvId}/videos`);
    return { data: response.data };
  } catch (error) { return { data: { results: [] } }; }
};
export const getTVVideos = getSeriesVideos;

export const getSeriesCredits = async (tvId) => {
  try {
    const response = await tmdb.get(`/tv/${tvId}/credits`);
    return { data: response.data };
  } catch (error) { return { data: { cast: [] } }; }
};
export const getTVCredits = getSeriesCredits;

export const getSeasonEpisodes = async (tvId, seasonNumber) => {
  try {
    const response = await tmdb.get(`/tv/${tvId}/season/${seasonNumber}`);
    return { data: response.data };
  } catch (error) { return { data: { episodes: [] } }; }
};
export const getTVEpisodes = getSeasonEpisodes;

export const getSimilarSeries = async (tvId) => {
  try {
    const response = await tmdb.get(`/tv/${tvId}/similar`);
    return { data: response.data };
  } catch (error) { return { data: { results: [] } }; }
};

export const getSeriesProviders = async (tvId) => {
  try {
    const response = await tmdb.get(`/tv/${tvId}/watch/providers`);
    return { data: response.data };
  } catch (error) { return { data: { results: {} } }; }
};

export const searchMulti = async (query) => {
  try {
    const response = await tmdb.get('/search/multi', {
      params: {
        query,
        include_adult: false,
        language: 'en-US',
        page: 1
      }
    });
    return (response.data.results || []).map(item => ({
      ...item,
      genres: transformGenres(item.genre_ids),
      media_type: item.media_type
    }));
  } catch (e) { return []; }
};

export const getGenres = async () => {
  const map = await fetchGenreList();
  return { data: { genres: Object.entries(map).map(([id, name]) => ({ id: parseInt(id), name })) } };
};

// ---------------------------------------------------------
// NEW / UPDATED HELPERS
// ---------------------------------------------------------

/**
 * Fetch Movies by Genre with Page Support
 */

// Fetch discover results (single page for speed) and dedupe
export async function fetchDiscoverOnce(params = {}) {
  const safeParams = { ...params, page: params.page || 1, include_adult: false };
  const res = await tmdb.get("/discover/movie", { params: safeParams });
  return res.data?.results || [];
}

// Strict: return up to `limit` movies having genreId in their genre_ids array
export async function getTopMoviesByGenre(genreId, limit = 30, randomize = true, page = 1) {
  if (!genreId) return [];
  const results = await fetchDiscoverOnce({ with_genres: String(genreId), sort_by: "popularity.desc", page });
  const filtered = results.filter(m => Array.isArray(m.genre_ids) && m.genre_ids.includes(Number(genreId)));
  const final = randomize ? shuffleArray(filtered) : filtered;
  return final.slice(0, limit);
}

// Original language movies (e.g., te, hi, ta)
export async function getTopMoviesByLanguage(langCode, limit = 30, randomize = true, page = 1) {
  if (!langCode) return [];
  const results = await fetchDiscoverOnce({ with_original_language: langCode, sort_by: "popularity.desc", page });
  const final = randomize ? shuffleArray(results) : results;
  return final.slice(0, limit);
}

// Dubbed: attempts discover with with_language (shows movies available in that language)
export async function getDubbedMovies(langCode, limit = 30, randomize = true, page = 1) {
  if (!langCode) return [];
  // Prefer discover with language filter (TMDB's way to return availability translations)
  try {
    const res = await tmdb.get("/discover/movie", {
      params: {
        with_original_language: undefined,
        with_release_type: undefined,
        with_language: langCode,
        sort_by: "popularity.desc",
        page
      }
    });
    let results = res.data?.results || [];
    // Fallback: also run a lightweight search "dubbed" query to catch more
    if (results.length < limit) {
      const s = await tmdb.get("/search/movie", { params: { query: `${langCode} dubbed`, page: 1 } });
      results = [...results, ...(s.data?.results || [])];
    }
    const uniq = Array.from(new Map(results.map(m => [m.id, m])).values());
    const final = randomize ? shuffleArray(uniq) : uniq;
    return final.slice(0, limit);
  } catch (e) {
    // fallback safe search
    const s = await tmdb.get("/search/movie", { params: { query: `${langCode} dubbed`, page: 1 } });
    const results = s.data?.results || [];
    return (randomize ? shuffleArray(results) : results).slice(0, limit);
  }
}

// Generic helper to pick a random page in safe range
export function randomPage(max = 10) {
  return Math.max(1, Math.floor(Math.random() * max) + 1);
}



export const getActorCredits = async (personId) => {
  try {
    const res = await tmdb.get(`/person/${personId}/combined_credits`);
    const cast = res.data?.cast || [];
    const filtered = cast.filter(c => c.media_type === 'movie' || c.media_type === 'tv');
    // Sort by popularity
    filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    return filtered;
  } catch (e) {
    return [];
  }
};

// 4. Search Movies
export const searchMovies = async (query, page = 1) => {
  try {
    const res = await tmdb.get('/search/movie', {
      params: {
        query,
        include_adult: false,
        page
      }
    });
    return (res.data.results || []).map(m => ({ ...m, media_type: 'movie' }));
  } catch (error) {
    console.error("searchMovies Error:", error);
    return [];
  }
};

// 5. Search TV Shows
export const searchTV = async (query, page = 1) => {
  try {
    const res = await tmdb.get('/search/tv', {
      params: {
        query,
        include_adult: false,
        page
      }
    });
    return (res.data.results || []).map(t => ({ ...t, media_type: 'tv' }));
  } catch (error) {
    console.error("searchTV Error:", error);
    return [];
  }
};

// 6. Advanced Filters
export const getFilteredResults = async ({
  type = "movie",
  genre = null,
  language = null,
  yearFrom = null,
  yearTo = null,
  ratingFrom = 0,
  ratingTo = 10,
  sortBy = "popularity.desc",
  page = 1
}) => {
  try {
    const res = await tmdb.get(`/discover/${type}`, {
      params: {
        with_genres: genre,
        with_original_language: language,
        "vote_average.gte": ratingFrom,
        "vote_average.lte": ratingTo,
        // Conditionals for Movie vs TV dates
        ...(type === 'movie' ? {
          "primary_release_date.gte": yearFrom ? `${yearFrom}-01-01` : undefined,
          "primary_release_date.lte": yearTo ? `${yearTo}-12-31` : undefined,
        } : {}),
        ...(type === 'tv' ? {
          "first_air_date.gte": yearFrom ? `${yearFrom}-01-01` : undefined,
          "first_air_date.lte": yearTo ? `${yearTo}-12-31` : undefined,
        } : {}),
        sort_by: sortBy,
        page,
        include_adult: false
      }
    });
    return (res.data.results || []).map(item => ({ ...item, media_type: type }));
  } catch (error) {
    console.error("getFilteredResults Error:", error);
    return [];
  }
};


// 7. Unified Results Service
export const getUnifiedResults = async (params) => {
  const {
    type = "movie",
    query,
    genre,
    language,
    dubLanguage,
    yearFrom,
    yearTo,
    ratingFrom = 0,
    ratingTo = 10,
    sort = "popularity.desc",
    page = 1
  } = params;

  try {
    let res;
    // 1. Search Query
    if (query) {
      res = await tmdb.get(`/search/${type}`, {
        params: { query, page, include_adult: false }
      });

      // 2. Dubbed Content (Using with_language as specifically verified)
    } else if (dubLanguage) {
      res = await tmdb.get(`/discover/${type}`, {
        params: {
          with_language: dubLanguage, // Corrected for Dubbed content
          with_genres: genre,
          sort_by: sort,
          page,
          "vote_average.gte": ratingFrom,
          "vote_average.lte": ratingTo,
          include_adult: false
        }
      });

      // 3. Normal Filtration / Discovery / Genre / Language
    } else {
      res = await tmdb.get(`/discover/${type}`, {
        params: {
          with_genres: genre,
          with_original_language: language,
          "primary_release_date.gte": yearFrom ? `${yearFrom}-01-01` : undefined,
          "primary_release_date.lte": yearTo ? `${yearTo}-12-31` : undefined,
          "first_air_date.gte": (type === 'tv' && yearFrom) ? `${yearFrom}-01-01` : undefined,
          "first_air_date.lte": (type === 'tv' && yearTo) ? `${yearTo}-12-31` : undefined,
          "vote_average.gte": ratingFrom,
          "vote_average.lte": ratingTo,
          sort_by: sort,
          page,
          include_adult: false
        }
      });
    }

    return (res.data.results || []).map(item => ({ ...item, media_type: type }));
  } catch (error) {
    console.error("getUnifiedResults Error:", error);
    return [];
  }
};

// Smart Home Page Helpers
// helper: trending week
export async function getTrendingWeek(limit = 12) {
  const res = await tmdb.get("/trending/movie/week");
  return (res.data?.results || []).slice(0, limit);
}

// helper: random high-rated movies
export async function getTopRatedRandom(limit = 12) {
  const page = Math.floor(Math.random() * 10) + 1; // randomize results
  const res = await tmdb.get("/discover/movie", {
    params: {
      sort_by: "vote_average.desc",
      "vote_count.gte": 500,
      "vote_average.gte": 7.5,
      page,
      include_adult: false
    }
  });

  const movies = res.data?.results || [];
  return movies.slice(0, limit);
}

// helper: new releases in a time window, excluding unreleased
export async function getNewReleases({ monthsBack = 12, limit = 30 } = {}) {
  const today = new Date().toISOString().slice(0, 10);
  const start = new Date();
  start.setMonth(start.getMonth() - monthsBack);
  const fromDate = start.toISOString().slice(0, 10);

  const res = await tmdb.get("/discover/movie", {
    params: {
      include_adult: false,
      sort_by: "release_date.desc",
      "primary_release_date.gte": fromDate,
      "primary_release_date.lte": today,
      page: 1
    }
  });
  const list = res.data?.results || [];
  return list.filter(m => m.release_date && m.release_date <= today).slice(0, limit);
}

// helper: top by genre (optionally with region or similarTo)
export async function getTopByGenre(genreId = null, { limit = 20, region = null, sortBy = "popularity.desc", similarTo = null } = {}) {
  let params = {
    include_adult: false,
    sort_by: sortBy,
    page: 1
  };
  if (genreId) params.with_genres = String(genreId);
  if (region) params.region = region;
  if (similarTo) {
    // if similarTo provided, call similar endpoint instead (return similar results)
    const res = await tmdb.get(`/movie/${similarTo}/recommendations`);
    return (res.data?.results || []).slice(0, limit);
  }
  const res = await tmdb.get("/discover/movie", { params });
  return (res.data?.results || []).slice(0, limit);
}

export const getPopularInIndia = async () => {
  try {
    const res = await tmdb.get('/discover/movie', {
      params: {
        region: 'IN',
        sort_by: 'popularity.desc',
        page: 1,
        include_adult: false
      }
    });
    return (res.data.results || []).map(m => ({ ...m, media_type: 'movie' }));
  } catch (error) {
    return [];
  }
};

/**
 * @deprecated Use getTopIndiaMovies instead
 */
export const getTopTen = async () => {
  try {
    const res = await tmdb.get('/movie/top_rated', {
      params: {
        page: 1,
        language: 'en-US'
      }
    });
    return (res.data.results || []).slice(0, 10).map(m => ({ ...m, media_type: 'movie' }));
  } catch (error) {
    return [];
  }
};

export const getBecauseYouWatched = async (movieId) => {
  try {
    const res = await tmdb.get(`/movie/${movieId}/recommendations`);
    return (res.data.results || []).map(m => ({ ...m, media_type: 'movie' }));
  } catch (error) {
    return [];
  }
};

export async function getTopIndiaMovies(limit = 10) {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  try {
    const res = await tmdb.get('/discover/movie', {
      params: {
        region: 'IN',
        'primary_release_date.lte': today,
        include_adult: false,
        sort_by: 'popularity.desc',
        page: 1
      }
    });
    const list = res.data?.results || [];
    // ensure only released movies and sort by popularity then vote_average
    const filtered = list.filter(m => m.release_date && m.release_date <= today);
    filtered.sort((a, b) => (b.popularity - a.popularity) || (b.vote_average - a.vote_average));
    return filtered.slice(0, limit);
  } catch (e) {
    return [];
  }
}

// ...existing code...
export async function searchMoviesTMDB(query, page = 1, limit = 20) {
  if (!query) return [];
  const res = await tmdb.get("/search/movie", { params: { query, page } });
  return (res.data?.results || []).slice(0, limit);
}

export async function searchTvTMDB(query, page = 1, limit = 20) {
  if (!query) return [];
  const res = await tmdb.get("/search/tv", { params: { query, page } });
  return (res.data?.results || []).slice(0, limit);
}

export async function searchPeopleTMDB(query, page = 1, limit = 20) {
  if (!query) return [];
  const res = await tmdb.get("/search/person", { params: { query, page } });
  return (res.data?.results || []).slice(0, limit);
}


// ---------- TV / Episode helpers (append to src/services/tmdb.js) ----------

/**
 * Get TV details with append (videos,credits,similar,recommendations,watch/providers)
 * returns full tv object (seasons included)
 */
export async function getTvDetails(tvId) {
  if (!tvId) return null;
  const key = `tv_details_${tvId}`;
  const c = cache.get(key);
  if (c) return c;
  try {
    const res = await tmdb.get(`/tv/${tvId}`, {
      params: { append_to_response: "videos,credits,similar,recommendations,watch/providers", language: "en-US" }
    });
    cache.set(key, res.data, 900);
    return res.data;
  } catch (e) { return null; }
}

/**
 * Get a specific season's episodes (tv/{tvId}/season/{seasonNumber})
 */
export async function getSeasonDetails(tvId, seasonNumber) {
  if (!tvId || seasonNumber == null) return null;
  const key = `tv_${tvId}_season_${seasonNumber}`;
  const c = cache.get(key);
  if (c) return c;
  try {
    const res = await tmdb.get(`/tv/${tvId}/season/${seasonNumber}`, {
      params: { append_to_response: "videos,credits", language: "en-US" }
    });
    cache.set(key, res.data, 900);
    return res.data;
  } catch (e) { return null; }
}

/**
 * Get episode details for a particular episode (includes videos if available)
 */
export async function getEpisodeDetails(tvId, seasonNumber, episodeNumber) {
  if (!tvId || seasonNumber == null || episodeNumber == null) return null;
  const key = `tv_${tvId}_s${seasonNumber}_e${episodeNumber}`;
  const c = cache.get(key);
  if (c) return c;
  try {
    const res = await tmdb.get(`/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}`, {
      params: { append_to_response: "videos,credits", language: "en-US" }
    });
    cache.set(key, res.data, 900);
    return res.data;
  } catch (e) { return null; }
}

// ...existing code...

// ---------------------------------------------------------
// 🔥 MEGA UPGRADE HELPERS
// ---------------------------------------------------------

// 1. Global Trending (Movies + TV) - Using existing export at top

// 2. Top Rated Movies
export async function getTopRatedMovies(page = 1) {
  try {
    const res = await tmdb.get("/movie/top_rated", { params: { page, region: 'IN' } });
    return res.data?.results || [];
  } catch (e) { return []; }
}

// 3. Popular TV - Using existing export at top

// 4. Upcoming Movies
export async function getUpcomingMovies(page = 1) {
  try {
    const res = await tmdb.get("/movie/upcoming", { params: { page, region: 'IN' } });
    return res.data?.results || [];
  } catch (e) { return []; }
}

// 5. Now Playing
export async function getNowPlayingMovies(page = 1) {
  try {
    const res = await tmdb.get("/movie/now_playing", { params: { page, region: 'IN' } });
    return res.data?.results || [];
  } catch (e) { return []; }
}

// 6. Discover by Language (Generic)
export async function getMoviesByLanguage(langCode, sort = "popularity.desc", page = 1) {
  try {
    const res = await tmdb.get("/discover/movie", {
      params: {
        with_original_language: langCode,
        sort_by: sort,
        page,
        include_adult: false
      }
    });
    return res.data?.results || [];
  } catch (e) { return []; }
}

// 7. Person Details Extended
export async function getPersonDetailsFull(personId) {
  try {
    const res = await tmdb.get(`/person/${personId}`, {
      params: { append_to_response: "combined_credits,external_ids,images" }
    });
    return res.data;
  } catch (e) { return null; }
}

export default tmdb;