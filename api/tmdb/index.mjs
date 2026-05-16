
import fetch from 'node-fetch';

// In-memory cache for hot/warm lambdas (limited effectiveness in serverless but helps burst traffic)
const memoryCache = new Map();

export default async function handler(request, response) {
    // 1. CORS Headers
    response.setHeader('Access-Control-Allow-Credentials', true);
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (request.method === 'OPTIONS') {
        return response.status(200).end();
    }

    // 2. Configuration & Validation
    const apiKey = process.env.TMDB_API_KEY;
    const baseUrl = 'https://api.themoviedb.org/3';
    const { endpoint, ...queryParams } = request.query;

    if (!apiKey) {
        return response.status(500).json({ error: 'Server Invalid Configuration: Missing API Key' });
    }

    if (!endpoint) {
        return response.status(400).json({ error: 'Missing required query parameter: endpoint' });
    }

    // 3. Construct TMDB URL
    // Ensure endpoint starts with /
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    // Build Query String using URLSearchParams
    const params = new URLSearchParams(queryParams);
    params.append('api_key', apiKey);

    const tmdbUrl = `${baseUrl}${cleanEndpoint}?${params.toString()}`;

    // 4. Cache Check (Simple In-Memory for bursts)
    // Key must include all params
    const cacheKey = tmdbUrl;
    if (memoryCache.has(cacheKey)) {
        const cached = memoryCache.get(cacheKey);
        if (Date.now() - cached.timestamp < 60000) { // 1 minute memory cache
            response.setHeader('X-Cache', 'HIT-MEMORY');
            return response.status(200).json(cached.data);
        }
    }

    try {
        // 5. External Request with Timeout
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000); // 15 second timeout

        const tmdbRes = await fetch(tmdbUrl, { signal: controller.signal });
        clearTimeout(timeout);

        // 6. Handle Errors
        if (!tmdbRes.ok) {
            if (tmdbRes.status === 429) {
                return response.status(429).json({ error: 'Too many requests. Please try again later.' });
            }
            return response.status(tmdbRes.status).json({ error: 'Upstream Provider Error', details: tmdbRes.statusText });
        }

        const data = await tmdbRes.json();

        // 7. Caching Strategy (CDN)
        // Cache popular lists for 1 hour (3600s), others for 5 mins (300s)
        const isStaticList = cleanEndpoint.includes('popular') || cleanEndpoint.includes('trending') || cleanEndpoint.includes('top_rated');
        const cacheRef = isStaticList ? 's-maxage=3600, stale-while-revalidate=59' : 's-maxage=300, stale-while-revalidate=59';
        response.setHeader('Cache-Control', `public, ${cacheRef}`);

        // Update memory cache
        if (memoryCache.size > 500) memoryCache.clear(); // Simple GC for local dev
        memoryCache.set(cacheKey, { timestamp: Date.now(), data });

        return response.status(200).json(data);

    } catch (error) {
        console.error('Proxy Error:', error);
        if (error.name === 'AbortError') {
            return response.status(504).json({ error: 'Gateway Timeout: TMDB took too long' });
        }
        return response.status(502).json({ error: 'Bad Gateway: Failed to connect to TMDB' });
    }
}
