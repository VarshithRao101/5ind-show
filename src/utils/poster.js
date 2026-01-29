export const getPoster = (path, size = 'w342') => {
    if (!path) return '/placeholder-poster.png';
    return `https://image.tmdb.org/t/p/${size}${path}`;
};
