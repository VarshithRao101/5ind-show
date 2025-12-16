/*
  src/utils/mediaUtils.js
  Helper functions for media routing and normalization.
*/

/**
 * Robustly determines if an item is a TV show or Movie.
 * @param {Object} item - The media item from TMDB
 * @returns {'movie'|'tv'} - The detected media type
 */
export const getMediaType = (item) => {
    if (!item) return 'movie';

    // 1. Trust explicit media_type if present
    if (item.media_type === 'movie' || item.media_type === 'tv') {
        return item.media_type;
    }

    // 2. Infer from type-specific fields
    if (item.title && !item.name) return 'movie';
    if (item.name && !item.title) return 'tv';

    // 3. Infer from date fields
    if (item.release_date) return 'movie';
    if (item.first_air_date) return 'tv';

    // 4. Checking existence of seasons/episodes
    if (item.seasons || item.number_of_episodes) return 'tv';

    // Default fallback (safer to assume movie if unknown, or handle as error)
    return 'movie';
};

/**
 * Generates the correct internal route for a media item.
 * @param {Object} item - The media item
 * @returns {string} - The route path (e.g., "/movie/123")
 */
export const getMediaRoute = (item) => {
    if (!item || !item.id) return '/home';
    const type = getMediaType(item);
    return `/${type}/${item.id}`;
};

/**
 * Sanitizes a media item for rendering, ensuring no objects are passed where strings are needed.
 * @param {Object} item - Raw API item
 * @returns {Object} - Safe item for UI
 */
export const sanitizeMediaItem = (item) => {
    if (!item) return null;

    const type = getMediaType(item);
    const title = item.title || item.name || 'Unknown Title';
    const date = item.release_date || item.first_air_date;
    const year = date ? new Date(date).getFullYear() : 'TBA';

    return {
        ...item,
        id: item.id,
        media_type: type,
        title: String(title), // Ensure string
        overview: String(item.overview || ''),
        poster_path: item.poster_path, // Keep null/string
        backdrop_path: item.backdrop_path,
        vote_average: typeof item.vote_average === 'number' ? item.vote_average : 0,
        year: year,
        displayYear: String(year),
    };
};
