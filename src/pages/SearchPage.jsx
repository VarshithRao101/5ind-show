import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { searchMulti } from "../services/tmdb";
import { getPoster } from "../utils/poster";

export default function SearchPage() {
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const q = params.get("q") || "";

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!q || q.trim().length < 2) return;

        const controller = new AbortController();
        const timeout = setTimeout(async () => {
            setLoading(true);
            try {
                // Using existing service instead of fetch('/api/search')
                const data = await searchMulti(q);
                // filter out items without images if desired, or keep as raw as possible per prompt "results = data.results || []"
                // The prompt pattern just said setResults(data.results || []). searchMulti returns the array directly.
                setResults(data || []);
            } catch (e) { }
            setLoading(false);
        }, 300); // debounce

        return () => {
            clearTimeout(timeout);
            controller.abort();
        };
    }, [q]);

    return (
        <div className="min-h-screen p-6 pt-24 bg-[#0f0f0f] text-white">
            <h2 className="mb-4 text-xl font-semibold">
                Results for “{q}”
            </h2>

            {loading && <p>Searching…</p>}

            {!loading && results.length === 0 && q.length > 2 && <p>No results found.</p>}

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {results.map(item => (
                    <div key={item.id}>
                        <img
                            src={getPoster(item.poster_path || item.profile_path)}
                            alt={item.title || item.name}
                            className="rounded-lg w-full h-auto object-cover"
                            loading="lazy"
                        />
                        <p className="text-sm mt-1 text-gray-300">
                            {item.title || item.name}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
