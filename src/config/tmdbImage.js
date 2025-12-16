export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/";
export const POSTER_SIZES = {
    SMALL: "w342",
    MEDIUM: "w500",
    LARGE: "w780"
};

export const getPosterUrl = (path, size = POSTER_SIZES.MEDIUM) => {
    if (!path) return "/images/poster-placeholder.png";
    return `${TMDB_IMAGE_BASE}${size}${path}`;
};
