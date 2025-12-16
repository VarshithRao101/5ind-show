import { getUserGenres, getUserHistory } from "./user";
import { getSimilarMovies, getRecommendedMovies, getTopByGenre } from "./tmdb";

export const generateRecommendations = async (user) => {
    if (!user || !user.uid) return [];

    // Performance: Cache Layer (6 Hours)
    const cacheKey = `5indshow_recs_${user.uid}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
        try {
            const { timestamp, data } = JSON.parse(cached);
            const now = Date.now();
            // 6 hours = 6 * 60 * 60 * 1000 = 21600000 ms
            if (now - timestamp < 21600000 && data.length > 0) {
                return data;
            }
        } catch (e) {
            localStorage.removeItem(cacheKey);
        }
    }

    try {
        const [genres, history] = await Promise.all([
            getUserGenres(user.uid),
            getUserHistory(user.uid)
        ]);

        let allMovies = [];

        // 1. Genre-based Recommendations (Top 3 genres)
        const selectedGenres = (genres || []).slice(0, 3);
        const genrePromises = selectedGenres.map(gId => getTopByGenre(gId));

        // 2. History-based Recommendations (Last 3 watched)
        // Only if history has enough data
        const recentHistory = (history || [])
            .sort((a, b) => b.watchedAt - a.watchedAt) // Newest first
            .slice(0, 3);

        const historyPromises = [];
        if (history.length >= 3) {
            recentHistory.forEach(item => {
                historyPromises.push(getSimilarMovies(item.movieId));
                historyPromises.push(getRecommendedMovies(item.movieId));
            });
        }

        // Execute all requests
        const results = await Promise.all([
            ...genrePromises,
            ...historyPromises
        ]);

        // Flatten results
        results.forEach(res => {
            if (Array.isArray(res)) {
                allMovies.push(...res);
            } else if (res?.data?.results) { // Handle getSimilarMovies return shape
                allMovies.push(...res.data.results);
            }
        });

        // 3. Merge, Filter, Score
        const seen = new Set();
        const watchedIds = new Set(history.map(h => String(h.movieId)));
        const scoredRecommendations = [];

        for (const movie of allMovies) {
            if (!movie || !movie.id) continue;
            const strId = String(movie.id);

            // Dedup
            if (seen.has(strId)) continue;
            seen.add(strId);

            // Exclude watched
            if (watchedIds.has(strId)) continue;

            // Filter invalid assets
            if (!movie.poster_path) continue;

            // Score: popularity*0.4 + vote_average*0.4 + random*0.2
            // Normalizing: Pop ~ 1000 => 10, Vote ~ 10 => 10
            const normPop = Math.min((movie.popularity || 0) / 100, 10);
            const normVote = (movie.vote_average || 0);
            const random = Math.random() * 10;

            const score = (normPop * 0.4) + (normVote * 0.4) + (random * 0.2);

            scoredRecommendations.push({ ...movie, recoScore: score });
        }

        // Sort by score
        scoredRecommendations.sort((a, b) => b.recoScore - a.recoScore);

        // Take top 20
        const finalRecs = scoredRecommendations.slice(0, 20);

        // Cache if we found valid recs
        if (finalRecs.length > 0) {
            localStorage.setItem(cacheKey, JSON.stringify({
                timestamp: Date.now(),
                data: finalRecs
            }));
        }

        return finalRecs;

    } catch (e) {
        console.error("Recommendation Engine Error:", e);
        return [];
    }
};
