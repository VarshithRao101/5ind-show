/*
  functions/buildDubbedCache.js
  Pseudo-code / Minimal Serverless Script Example
  
  To run: node buildDubbedCache.js
  Required: firebase-admin, axios, dotenv
*/

const admin = require('firebase-admin');
const axios = require('axios');

// admin.initializeApp({ ... }); 
// const db = admin.firestore();

const API_KEY = process.env.TMDB_API_KEY;
const TARGET_LANGS = ['te', 'hi', 'ta', 'ml', 'kn'];

async function buildCache() {
    for (const lang of TARGET_LANGS) {
        console.log(`Processing dubbed list for: ${lang}`);

        // 1. Get pool of popular movies (Pages 1-3 to get ~60 top movies)
        const moviesToCheck = [];
        for (let p = 1; p <= 3; p++) {
            const res = await axios.get(`https://api.themoviedb.org/3/discover/movie`, {
                params: {
                    api_key: API_KEY,
                    sort_by: 'popularity.desc',
                    'vote_count.gte': 100,
                    page: p
                }
            });
            if (res.data.results) moviesToCheck.push(...res.data.results);
        }

        // 2. Check translations for each server-side
        const dubbed = [];
        for (const movie of moviesToCheck) {
            if (dubbed.length >= 50) break; // Limit cache size

            try {
                const tRes = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/translations`, {
                    params: { api_key: API_KEY }
                });

                const translations = tRes.data.translations || [];
                const hasLang = translations.some(t => t.iso_639_1 === lang);

                if (hasLang) {
                    dubbed.push(movie);
                }
            } catch (e) {
                // ignore error for single movie
            }
        }

        // 3. Save to Firestore (or file)
        // await db.collection('cachedLists').doc(`dubbed_${lang}`).set({
        //   lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        //   movies: dubbed
        // });

        console.log(`Saved ${dubbed.length} dubbed movies for ${lang}`);
    }
}

// buildCache();

module.exports = { buildCache };
