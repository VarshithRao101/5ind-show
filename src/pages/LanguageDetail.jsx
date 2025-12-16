// src/pages/LanguageDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTopMoviesByLanguage, randomPage } from "../services/tmdb";
import MovieCard from "../components/MovieCard";
import SkeletonCard from "../components/skeletons/SkeletonCard";

export default function LanguageDetail() {
    const { langCode } = useParams();
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [gridKey, setGridKey] = useState(0);

    const load = async (page = 1) => {
        setLoading(true);
        try {
            const data = await getTopMoviesByLanguage(langCode, 30, true, page);
            setMovies(data);
        } catch (e) {
            console.error("Language load error", e);
            setMovies([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load(randomPage(10));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [langCode]);

    const handleRefresh = () => {
        const p = randomPage(20);
        load(p).then(() => setGridKey(k => k + 1));
    };

    return (
        <div className="p-6 pt-24 min-h-screen bg-[#0f0f0f] text-white">
            <div className="flex items-center justify-between mb-8 sticky top-20 bg-[#0f0f0f]/90 backdrop-blur z-20 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="text-2xl hover:text-red-500 transition-colors">←</button>
                    <h1 className="text-2xl font-bold">Language: {langCode?.toUpperCase()}</h1>
                </div>
                <div>
                    <button onClick={handleRefresh} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-colors">Refresh</button>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-pulse">
                    {[...Array(12)].map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            ) : movies.length ? (
                <div key={gridKey} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {movies.map(m => <MovieCard key={m.id} movie={m} />)}
                </div>
            ) : (
                <div className="text-gray-400 text-center py-20">No movies found.</div>
            )}
        </div>
    );
}
