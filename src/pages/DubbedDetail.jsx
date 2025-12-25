// src/pages/DubbedDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiRefreshCw } from "react-icons/fi";
import { getDubbedMovies, randomPage } from "../services/tmdb";
import MovieCard from "../components/MovieCard";
import SkeletonCard from "../components/skeletons/SkeletonCard";

export default function DubbedDetail() {
    const { langCode } = useParams();
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [gridKey, setGridKey] = useState(0);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        let active = true;

        async function loadData() {
            setLoading(true);
            try {
                const data = await getDubbedMovies(langCode, 30, true, randomPage(8));
                if (active) {
                    setMovies(data || []);
                    setGridKey(k => k + 1);
                    console.log("Loaded Dubbed movies:", (data || []).length);
                }
            } catch (error) {
                console.error("Dubbed fetch failed", error);
                if (active) setMovies([]);
            } finally {
                if (active) setLoading(false);
            }
        }

        loadData();

        return () => {
            active = false;
        };
    }, [langCode, refreshTrigger]);

    const handleRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="p-6 pt-24 min-h-screen bg-[#0f0f0f] text-white">
            <div className="flex items-center justify-between mb-8 sticky top-20 bg-[#0f0f0f]/90 backdrop-blur z-20 py-4 border-b border-white/10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full hover:bg-white/10 text-white hover:text-primary-yellow transition-all"
                    >
                        <FiArrowLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-bold font-heading">{langCode?.toUpperCase()} Dubbed</h1>
                </div>
                <div>
                    <button
                        onClick={handleRefresh}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:border-primary-yellow hover:text-primary-yellow rounded-lg font-semibold transition-all"
                    >
                        <FiRefreshCw />
                        <span className="hidden sm:inline">Refresh</span>
                    </button>
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
                <div className="text-gray-400 text-center py-20">No dubbed movies found.</div>
            )}
        </div>
    );
}
