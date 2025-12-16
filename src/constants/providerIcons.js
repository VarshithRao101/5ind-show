/**
 * Provider ID to icon mapping
 * Maps TMDb provider IDs to local icon paths
 * For MovieCard OTT icons display
 */
export const PROVIDER_ICONS = {
  8: "/providers/netflix.png",
  9: "/providers/primevideo.png",
  119: "/providers/disney.png",
  122: "/providers/hotstar.png",
  337: "/providers/hotstar.png",
  350: "/providers/zee5.png",
  384: "/providers/sonyliv.png",
};

/**
 * TMDb image base URL for provider logos
 * If local icon is missing, fall back to TMDb logos
 */
export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w45";

/**
 * Fallback poster image when TMDB poster_path is null
 */
export const FALLBACK_POSTER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='450'%3E%3Crect fill='%23222' width='300' height='450'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='18' fill='%23666' text-anchor='middle' dominant-baseline='middle'%3ENo Poster%3C/text%3E%3C/svg%3E";

/**
 * Fallback backdrop image when TMDB backdrop_path is null
 */
export const FALLBACK_BACKDROP = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1280' height='720'%3E%3Crect fill='%23111' width='1280' height='720'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='32' fill='%23444' text-anchor='middle' dominant-baseline='middle'%3ENo Image Available%3C/text%3E%3C/svg%3E";
