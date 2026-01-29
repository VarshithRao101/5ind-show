/**
 * Image URL builders with fallback system
 */

const PLACEHOLDER_POSTER = '/assets/placeholder-episode.png';
const PLACEHOLDER_BACKDROP = '/assets/placeholder-episode.png';
const PLACEHOLDER_PROFILE = '/assets/placeholder-episode.png';

export const getPosterUrl = (posterPath, isMobile = false) => {
  if (!posterPath) return PLACEHOLDER_POSTER;
  const size = isMobile ? 'w342' : 'w500';
  return `https://image.tmdb.org/t/p/${size}${posterPath}`;
};

export const getBackdropUrl = (backdropPath, isMobile = false) => {
  if (!backdropPath) return PLACEHOLDER_BACKDROP;
  const size = isMobile ? 'w780' : 'w1280';
  return `https://image.tmdb.org/t/p/${size}${backdropPath}`;
};

export const getProfileUrl = (profilePath, isMobile = false) => {
  if (!profilePath) return PLACEHOLDER_PROFILE;
  const size = isMobile ? 'w185' : 'h632';
  return `https://image.tmdb.org/t/p/${size}${profilePath}`;
};

export const getEpisodeStillUrl = (stillPath, size = 'w300') => {
  if (!stillPath) return '/assets/placeholder-episode.png';
  return `https://image.tmdb.org/t/p/${size}${stillPath}`;
};

export const getSeasonPosterUrl = (posterPath, size = 'w200') => {
  if (!posterPath) return '/assets/placeholder-season.png';
  return `https://image.tmdb.org/t/p/${size}${posterPath}`;
};

/**
 * Get fallback image based on image type
 */
export const getFallbackImage = (imageType = 'poster') => {
  const fallbacks = {
    poster: PLACEHOLDER_POSTER,
    backdrop: PLACEHOLDER_BACKDROP,
    profile: PLACEHOLDER_PROFILE,
    episode: '/assets/placeholder-episode.png',
    season: '/assets/placeholder-season.png',
    provider: '/assets/providers/default.png',
  };
  return fallbacks[imageType] || PLACEHOLDER_POSTER;
};

/**
 * Handle image load errors
 */
export const handleImageError = (event, fallbackType = 'poster') => {
  if (event?.currentTarget) {
    event.currentTarget.src = getFallbackImage(fallbackType);
  }
};
