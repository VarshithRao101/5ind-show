import axios from 'axios';

const OMDB_API_KEY = process.env.REACT_APP_OMDB_API_KEY;

export const getRottenTomatoesScore = async (imdbId) => {
    // Debug log to check if key is loaded (don't log the full key in prod, but for local debugging it's helpful)
    if (!OMDB_API_KEY) {
        console.warn("OMDB_API_KEY is missing. Rotten Tomatoes scores will not load.");
        return null;
    }
    if (!imdbId) return null;

    try {
        const response = await axios.get(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${imdbId}`);
        const data = response.data;

        if (data.Ratings) {
            const rtRating = data.Ratings.find(r => r.Source === "Rotten Tomatoes");
            return rtRating ? rtRating.Value : null;
        }
        return null;
    } catch (error) {
        console.error("OMDB Fetch Error", error);
        return null;
    }
};
