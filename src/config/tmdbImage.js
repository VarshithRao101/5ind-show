export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/";
export const POSTER_SIZES = {
    SMALL: "w185",
    MEDIUM: "w342",
    LARGE: "w500"
};

export const getPosterUrl = (path, size = POSTER_SIZES.MEDIUM) => {
    if (!path) return "/images/poster-placeholder.png";
    return `${TMDB_IMAGE_BASE}${size}${path}`;
};
