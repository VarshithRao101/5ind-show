
import axios from 'axios';

// Point to local proxy (matches tmdb service pattern)
// No process.env usage here - strictly runtime config via API
const omdb = axios.create({
    baseURL: "/api/omdb",
    timeout: 5000
});

export const getRottenTomatoesScore = async (imdbId) => {
    if (!imdbId) return null;

    try {
        // Call our proxy: /api/omdb?i=tt123456
        const response = await omdb.get("", {
            params: { i: imdbId }
        });

        const data = response.data;
        if (!data || data.error) return null;

        if (data.Ratings) {
            const rtRating = data.Ratings.find(r => r.Source === "Rotten Tomatoes");
            return rtRating ? rtRating.Value : null;
        }
        return null;
    } catch (error) {
        // Silent fail for UI resilience
        console.warn("OMDb fetch failed via proxy", error.message);
        return null;
    }
};

