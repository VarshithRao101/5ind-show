import tmdb from '../../services/tmdb';
import { CONCEPT_MAP, normalizeTitle } from './conceptMap';

const GENRES = {
    action: 28, adventure: 12, animation: 16, comedy: 35, crime: 80,
    documentary: 99, drama: 18, family: 10751, fantasy: 14, history: 36,
    horror: 27, music: 10402, mystery: 9648, romance: 10749, scifi: 878,
    science: 878, thriller: 53, war: 10752, western: 37
};

const TV_GENRES = {
    action: 10759, adventure: 10759, animation: 16, comedy: 35, crime: 80,
    documentary: 99, drama: 18, family: 10751, kids: 10762, mystery: 9648,
    news: 10763, reality: 10764, scifi: 10765, soap: 10766, talk: 10767,
    war: 10768, politics: 10768, western: 37
};

const LANGUAGES = {
    telugu: 'te', tamil: 'ta', hindi: 'hi', english: 'en',
    kannada: 'kn', malayalam: 'ml', korean: 'ko', japanese: 'ja',
    malay: 'ms', chinese: 'zh', spanish: 'es', french: 'fr'
};

const INTENTS = {
    TRENDING: ['trending', 'popular', 'hot'],
    TOP_RATED: ['top', 'best', 'rated', 'good'],
    SIMILAR: ['like', 'similar']
};

export const processUserMessage = async (input) => {
    // FALLBACK: Rule-Based Logic (Stable & Safe)
    const text = input.toLowerCase();

    // Determine target media type based on user input keywords
    let targetMediaType = 'movie';
    if (text.includes('tv') || text.includes('series') || text.includes('show')) {
        targetMediaType = 'tv';
    } else if (!text.includes('movie') && !text.includes('film')) {
        targetMediaType = 'neutral';
    }

    // Check Concept/Similar
    const similarMatch = text.match(/(?:like|similar to)\s+(.+)/);
    if (similarMatch && similarMatch[1]) {
        const rawQuery = similarMatch[1].replace(/movies?|shows?|series?|films?/g, '').trim();
        const normalized = normalizeTitle(rawQuery);

        if (CONCEPT_MAP[normalized]) {
            return await handleConceptQuery(rawQuery, CONCEPT_MAP[normalized], targetMediaType);
        }
        return await handleSimilarQuery(rawQuery, targetMediaType === 'neutral' ? 'movie' : targetMediaType);
    }

    // Basic Parsing
    const genreIds = [];
    let language = null;
    let intent = 'DISCOVER';

    const genreMap = targetMediaType === 'tv' ? TV_GENRES : GENRES;
    Object.keys(genreMap).forEach(key => {
        if (text.includes(key)) genreIds.push(genreMap[key]);
    });
    Object.keys(LANGUAGES).forEach(key => {
        if (text.includes(key)) language = LANGUAGES[key];
    });

    if (INTENTS.TRENDING.some(w => text.includes(w))) intent = 'TRENDING';
    if (INTENTS.TOP_RATED.some(w => text.includes(w))) intent = 'TOP_RATED';

    const finalType = targetMediaType === 'neutral' ? 'movie' : targetMediaType;

    if (intent === 'TRENDING') return await getTrending(finalType, language);
    if (intent === 'TOP_RATED') return await getTopRated(finalType, genreIds, language);
    if (genreIds.length > 0 || language || targetMediaType === 'tv') {
        return await discoverMedia(finalType, genreIds, language);
    }

    // Keyword Fallback
    const cleanedText = text.replace(/movies?|shows?|series?/g, '').trim();
    if (cleanedText.length > 2) {
        const keywordRes = await discoverByKeywords(finalType, [cleanedText], [], language);
        if (keywordRes.movies.length > 0) return keywordRes;
    }

    return {
        text: "I didn't quite catch that. Try asking for:\n• Telugu horror movies\n• Best TV shows\n• Movies like Inception",
        movies: []
    };
};

// ------------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------------

const handleConceptQuery = async (queryName, concept, userMediaType) => {
    try {
        const searchType = userMediaType === 'neutral' ? concept.type : userMediaType;
        const params = {
            with_genres: concept.genres.join(','),
            sort_by: 'popularity.desc',
            include_adult: false,
            'vote_average.gte': 6,
            page: 1
        };
        const res = await tmdb.get(`/discover/${searchType}`, { params });
        let movies = res.data.results.slice(0, 5); // Limit to 5 for Chat
        movies = movies.filter(m => normalizeTitle(m.title || m.name) !== normalizeTitle(queryName));
        if (searchType === 'tv') movies = movies.map(m => ({ ...m, media_type: 'tv' }));
        const typeLabel = searchType === 'tv' ? 'shows' : 'movies';
        return {
            text: `Since you liked ${queryName} (${concept.desc}),\nhere are similar ${typeLabel} you might enjoy 👇`,
            movies
        };
    } catch (e) { return { text: "Sorry, I had trouble finding recommendations.", movies: [] }; }
};

const handleSimilarQuery = async (query, type) => {
    try {
        const searchRes = await tmdb.get(`/search/${type}`, { params: { query, include_adult: false } });
        if (!searchRes.data.results.length) {
            return { text: `I couldn't find any ${type === 'tv' ? 'series' : 'movie'} named "${query}".`, movies: [] };
        }
        const target = searchRes.data.results[0];
        const recRes = await tmdb.get(`/${type}/${target.id}/recommendations`);
        let movies = recRes.data.results.slice(0, 5); // Limit 5
        if (type === 'tv') movies = movies.map(m => ({ ...m, media_type: 'tv' }));
        return {
            text: `Here are some ${type === 'tv' ? 'shows' : 'movies'} similar to "${target.name || target.title}" 👇`,
            movies
        };
    } catch (e) { return { text: "Sorry, I had trouble finding recommendations.", movies: [] }; }
};

const discoverByKeywords = async (type, concepts, genreIds, language) => {
    try {
        const keywordIds = [];
        const searchPromises = concepts.slice(0, 2).map(c =>
            tmdb.get('/search/keyword', { params: { query: c } })
                .then(res => res.data.results?.[0]?.id)
                .catch(() => null)
        );

        const foundIds = (await Promise.all(searchPromises)).filter(id => id);

        if (foundIds.length === 0 && genreIds.length === 0) {
            return { text: "I couldn't find matches for those themes.", movies: [] };
        }

        const params = {
            sort_by: 'popularity.desc',
            with_genres: genreIds.join(','),
            with_keywords: foundIds.join('|'),
            with_original_language: language,
            include_adult: false,
            page: 1
        };

        const res = await tmdb.get(`/discover/${type}`, { params });
        let movies = res.data.results.slice(0, 5); // Limit 5
        if (type === 'tv') movies = movies.map(m => ({ ...m, media_type: 'tv' }));

        return {
            text: `Here are top matches for "${concepts.join(', ')}" 👇`,
            movies
        };

    } catch (e) {
        return { text: "Sorry, I had trouble finding recommendations.", movies: [] };
    }
};

const getTrending = async (type, language) => {
    try {
        if (language) return await discoverMedia(type, [], language, 'popularity.desc');
        const res = await tmdb.get(`/trending/${type}/week`);
        let movies = res.data.results.slice(0, 5);
        if (type === 'tv') movies = movies.map(m => ({ ...m, media_type: 'tv' }));
        return {
            text: `Here are the top trending ${type === 'tv' ? 'TV shows' : 'movies'} right now 🔥`,
            movies
        };
    } catch (e) { return { text: "Sorry, couldn't fetch trending content.", movies: [] }; }
};

const getTopRated = async (type, genreIds, language) => {
    return await discoverMedia(type, genreIds, language, 'vote_average.desc', { 'vote_count.gte': 200 });
};

const discoverMedia = async (type, genreIds, language, sortBy = 'popularity.desc', extraParams = {}) => {
    try {
        const params = {
            sort_by: sortBy,
            with_genres: genreIds.join(','),
            with_original_language: language,
            include_adult: false,
            ...extraParams
        };
        const res = await tmdb.get(`/discover/${type}`, { params });
        let movies = res.data.results.slice(0, 5);
        if (type === 'tv') movies = movies.map(m => ({ ...m, media_type: 'tv' }));
        return {
            text: `Here are some ${type === 'tv' ? 'TV shows' : 'movies'} for you 👇`,
            movies
        };
    } catch (e) { return { text: "Sorry, something went wrong while searching.", movies: [] }; }
};
