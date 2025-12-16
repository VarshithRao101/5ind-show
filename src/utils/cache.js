// src/utils/cache.js
const inMemory = {};

function now() {
    return Date.now();
}

const cache = {
    get(key) {
        try {
            const m = inMemory[key];
            if (m && m.expires > now()) return m.value;
            // try localStorage fallback
            const raw = localStorage.getItem(key);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (parsed.expires && parsed.expires > now()) {
                // repopulate inMemory
                inMemory[key] = parsed;
                return parsed.value;
            }
            localStorage.removeItem(key);
        } catch (e) {
            // ignore
        }
        return null;
    },
    set(key, value, ttlSeconds = 600) {
        const expires = now() + ttlSeconds * 1000;
        const payload = { value, expires };
        inMemory[key] = payload;
        try {
            localStorage.setItem(key, JSON.stringify(payload));
        } catch (e) {
            // ignore localStorage errors
        }
    },
    invalidate(key) {
        delete inMemory[key];
        try { localStorage.removeItem(key); } catch (e) { }
    }
};

export default cache;
