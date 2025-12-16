/* src/services/genres.js */
import { fetchGenreList } from "./tmdb";

let _cache = null;

export async function getGenreMap() {
    if (_cache) return _cache;
    const map = await fetchGenreList();
    _cache = map;
    return map;
}

export function mapGenreIdsToNames(ids = [], genreMap = {}) {
    if (!ids || !Array.isArray(ids)) return [];
    return ids.map(id => genreMap[id] || id).filter(Boolean);
}

// Helper for UI components that need a list
export async function getGenreArray() {
    const map = await getGenreMap();
    return Object.entries(map).map(([id, name]) => ({
        id: parseInt(id),
        name
    })).sort((a, b) => a.name.localeCompare(b.name));
}
