
import fetch from 'node-fetch';

// In-memory cache for OMDb responses to save specific API calls
const memoryCache = new Map();

export default async function handler(request, response) {
    // 1. CORS Headers
    response.setHeader('Access-Control-Allow-Credentials', true);
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (request.method === 'OPTIONS') {
        return response.status(200).end();
    }

    // 2. Configuration
    const apiKey = process.env.OMDB_API_KEY;
    const { i: imdbId } = request.query;

    if (!apiKey) {
        // Fail gracefully - tell frontend standard error
        console.warn("Server: Missing OMDB_API_KEY");
        return response.status(200).json({ error: 'Configuration Missing', Ratings: [] });
    }

    if (!imdbId) {
        return response.status(400).json({ error: 'Missing IMDb ID' });
    }

    // 3. Cache Check
    const cacheKey = `omdb_${imdbId}`;
    if (memoryCache.has(cacheKey)) {
        const cached = memoryCache.get(cacheKey);
        if (Date.now() - cached.timestamp < 3600000) { // 1 hour cache
            response.setHeader('X-Cache', 'HIT-MEMORY');
            return response.status(200).json(cached.data);
        }
    }

    try {
        const omdbUrl = `https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbId}`;

        // 4. External Request
        const res = await fetch(omdbUrl);
        const data = await res.json();

        if (data.Error) {
            return response.status(200).json({ error: data.Error, Ratings: [] });
        }

        // 5. Cache & Return
        response.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=59');
        if (memoryCache.size > 100) memoryCache.clear();
        memoryCache.set(cacheKey, { timestamp: Date.now(), data });

        return response.status(200).json(data);

    } catch (error) {
        console.error('OMDb Proxy Error:', error);
        return response.status(502).json({ error: 'Failed to fetch from OMDb', Ratings: [] });
    }
}
