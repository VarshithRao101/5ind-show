/*
  src/api/tmdbImages.js
  Helper functions for TMDb image URLs with proper sizes and fallbacks.
*/

export const TMDB_IMG = "https://image.tmdb.org/t/p";

// SVG placeholder images for missing content
const POSTER_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='750'%3E%3Crect fill='%23222' width='500' height='750'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='20' fill='%23666' text-anchor='middle' dominant-baseline='middle'%3ENo Poster%3C/text%3E%3C/svg%3E";

const BACKDROP_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1280' height='720'%3E%3Crect fill='%23111' width='1280' height='720'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='32' fill='%23444' text-anchor='middle' dominant-baseline='middle'%3ENo Image Available%3C/text%3E%3C/svg%3E";

const PROFILE_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='185' height='278'%3E%3Crect fill='%23333' width='185' height='278'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='14' fill='%23999' text-anchor='middle' dominant-baseline='middle'%3ENo Photo%3C/text%3E%3C/svg%3E";

/**
 * Generate poster URL from TMDb path
 * @param {string} path - TMDb poster path (e.g., /kXfqcdQKsToCoqWlUgsJD6FIwt0.jpg)
 * @param {string} size - Image size (w92, w154, w185, w342, w500, w780, original)
 * @returns {string} Full poster URL or placeholder
 */
export function posterUrl(path, size = "w500") {
  if (!path) {
    console.warn('⚠️ Missing poster_path for movie');
    return POSTER_PLACEHOLDER;
  }
  return `${TMDB_IMG}/${size}${path}`;
}

/**
 * Generate backdrop URL from TMDb path
 * @param {string} path - TMDb backdrop path (e.g., /abc123def.jpg)
 * @param {string} size - Image size (w300, w780, w1280, original)
 * @returns {string} Full backdrop URL or placeholder
 */
export function backdropUrl(path, size = "original") {
  if (!path) {
    console.warn('⚠️ Missing backdrop_path for movie');
    return BACKDROP_PLACEHOLDER;
  }
  return `${TMDB_IMG}/${size}${path}`;
}

/**
 * Generate profile image URL from TMDb path
 * @param {string} path - TMDb profile path (e.g., /abc123.jpg)
 * @param {string} size - Image size (w45, w185, h632, original)
 * @returns {string} Full profile URL or placeholder
 */
export function profileUrl(path, size = "w185") {
  if (!path) {
    console.warn('⚠️ Missing profile_path for cast member');
    return PROFILE_PLACEHOLDER;
  }
  return `${TMDB_IMG}/${size}${path}`;
}

/**
 * Get platform logo
 * @param {string} platform - Platform name (netflix, prime, hotstar, etc.)
 * @returns {string} Platform logo path
 */
export function getPlatformIcon(platform) {
  const platformMap = {
    netflix: "/assets/netflix.png",
    prime: "/assets/prime.png",
    "prime video": "/assets/prime.png",
    hotstar: "/assets/hotstar.png",
    "disney+": "/assets/disney.png",
    hulu: "/assets/hulu.png",
  };
  return platformMap[platform?.toLowerCase()] || "/assets/streaming-placeholder.png";
}
