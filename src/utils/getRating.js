/**
 * Utility function to get and format rating from TMDB data
 * Works for both movies and TV series
 * @param {object} item - Movie or TV series object from TMDB
 * @returns {string} - Formatted rating (e.g., "7.5") or "N/A"
 */
export function getRating(item) {
  if (!item) return "N/A";
  
  const rating = item.vote_average;
  
  if (rating === null || rating === undefined) {
    return "N/A";
  }
  
  // Convert to number and round to 1 decimal place
  const numRating = Number(rating);
  
  if (isNaN(numRating)) {
    return "N/A";
  }
  
  return numRating.toFixed(1);
}

/**
 * Get rating with emoji/visual indicator
 * @param {object} item - Movie or TV series object from TMDB
 * @returns {string} - Formatted rating with star emoji
 */
export function getRatingWithEmoji(item) {
  const rating = getRating(item);
  return `⭐ ${rating}`;
}

export default getRating;
