
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import handler from './api/tmdb.js';
import omdbHandler from './api/omdb.js';

dotenv.config();

const app = express();
const PORT = 3002; // Running separately for safety

app.use(cors());
app.use(express.json());

// Emulate Vercel Request/Response
app.all('/api/tmdb', async (req, res) => {
    // Adapter to match Next.js/Vercel syntax
    const responseAdapter = {
        setHeader: (key, val) => res.setHeader(key, val),
        status: (code) => {
            res.status(code);
            return responseAdapter;
        },
        json: (data) => res.json(data),
        end: () => res.end()
    };

    // Inject endpoint param if missing (similar to how we did via query in interceptor)
    // The interceptor sends ?endpoint=/movie/popular

    try {
        await handler(req, responseAdapter);
    } catch (e) {
        console.error("Local Server Error:", e);
        res.status(500).json({ error: "Local Server Error" });
    }
});

// Emulate Vercel OMDb
app.all('/api/omdb', async (req, res) => {
    const responseAdapter = {
        setHeader: (key, val) => res.setHeader(key, val),
        status: (code) => { res.status(code); return responseAdapter; },
        json: (data) => res.json(data),
        end: () => res.end()
    };
    try {
        await omdbHandler(req, responseAdapter);
    } catch (e) {
        console.error("Local OMDb Error:", e);
        res.status(500).json({ error: "Local Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`
    🚀 Local TMDB Proxy running at http://localhost:${PORT}
    ✅ Handling proxy requests locally to bypass ISP blocks
    `);
});
