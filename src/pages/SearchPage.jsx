import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { searchMulti } from "../services/tmdb";
import MovieCard from "../components/MovieCard";
import SkeletonCard from "../components/skeletons/SkeletonCard";
import { FiFilm, FiTv, FiUser, FiSearch, FiX } from "react-icons/fi";
import { getPosterUrl } from "../config/tmdbImage";

// -----------------------------------------------------------------------------
// FILTER LOGIC
// -----------------------------------------------------------------------------
const filterResults = (items) => {
    return items.filter(item =>
        (item.poster_path || item.profile_path) && // Must have image
        (item.media_type === 'movie' || item.media_type === 'tv' || item.media_type === 'person') // Valid types
    );
};

// Debounce Utility
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
};

export default function SearchPage() {
    const { search } = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(search);
    const urlQuery = params.get("q") || "";

    const [inputValue, setInputValue] = useState(urlQuery);
    const debouncedQuery = useDebounce(inputValue, 300);

    const [movies, setMovies] = useState([]);
    const [series, setSeries] = useState([]);
    const [actors, setActors] = useState([]);
    const [activeTab, setActiveTab] = useState("all");
    const [loading, setLoading] = useState(false);

    // Sync input with URL if URL changes externally
    useEffect(() => {
        if (urlQuery !== inputValue) {
            setInputValue(urlQuery);
        }
    }, [urlQuery]);

    // Update URL when debounced query changes
    useEffect(() => {
        if (debouncedQuery !== urlQuery) {
            navigate(`/search?q=${encodeURIComponent(debouncedQuery)}`, { replace: true });
        }
    }, [debouncedQuery, navigate, urlQuery]);

    const runSearch = useCallback(async (query) => {
        if (!query.trim()) {
            setMovies([]);
            setSeries([]);
            setActors([]);
            return;
        }

        setLoading(true);
        try {
            // Single API Call
            const results = await searchMulti(query);
            const validResults = filterResults(results);

            // Split into sections
            setMovies(validResults.filter(i => i.media_type === 'movie'));
            setSeries(validResults.filter(i => i.media_type === 'tv'));
            setActors(validResults.filter(i => i.media_type === 'person'));
        } catch (err) {
            console.error("Search error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Trigger search on query change
    useEffect(() => {
        runSearch(debouncedQuery);
    }, [debouncedQuery, runSearch]);

    const hasResults = movies.length > 0 || series.length > 0 || actors.length > 0;

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white font-sans pb-20">
            {/* Search Header Config */}
            <div className="sticky top-0 z-40 bg-[#0f0f0f]/95 backdrop-blur-xl border-b border-white/5 shadow-xl pt-24 pb-6 transition-all">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    {/* Input Area */}
                    <div className="relative w-full max-w-4xl mx-auto">
                        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                            <FiSearch className="text-gray-400" size={24} />
                        </div>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="What do you want to watch?"
                            className="w-full bg-[#1f1f1f] text-white pl-16 pr-14 py-5 rounded-full text-xl md:text-2xl font-medium border border-white/10 focus:border-[#FFD400] focus:shadow-[0_0_30px_rgba(255,212,0,0.1)] outline-none transition-all placeholder-gray-600"
                            autoFocus
                        />
                        {inputValue && (
                            <button
                                onClick={() => setInputValue('')}
                                className="absolute inset-y-0 right-6 flex items-center text-gray-500 hover:text-white transition-colors"
                            >
                                <FiX size={24} />
                            </button>
                        )}
                    </div>

                    {/* Tabs */}
                    {(hasResults || loading) && (
                        <div className="flex gap-4 md:gap-8 overflow-x-auto scrollbar-hide justify-center pt-6 pb-2 border-b border-white/5">
                            {[
                                { id: 'all', label: 'All Results' },
                                { id: 'movie', label: 'Movies', icon: FiFilm, count: movies.length },
                                { id: 'tv', label: 'TV Shows', icon: FiTv, count: series.length },
                                { id: 'person', label: 'People', icon: FiUser, count: actors.length },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 pb-2 border-b-2 transition-all whitespace-nowrap px-2 font-bold text-sm md:text-base
                                    ${activeTab === tab.id ? 'border-[#FFD400] text-[#FFD400]' : 'border-transparent text-gray-400 hover:text-white'}`}
                                >
                                    {tab.icon && <tab.icon size={18} />} {tab.label}
                                    {!loading && tab.count !== undefined && tab.count > 0 && (
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-[#FFD400] text-black' : 'bg-white/10 text-gray-300'}`}>
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-16">
                {!debouncedQuery && !loading && (
                    <div className="flex flex-col items-center justify-center py-32 text-gray-600 animate-fade-in opacity-50">
                        <FiSearch size={64} className="mb-4" />
                        <h2 className="text-2xl font-bold">Search Cinematic Universe</h2>
                    </div>
                )}

                {loading ? (
                    <div className="animate-fade-in-up space-y-12">
                        {/* Skeleton for All Sections */}
                        <section>
                            <div className="h-8 w-48 bg-white/10 rounded mb-6 shimmer" />
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                                {[...Array(12)].map((_, i) => (
                                    <SkeletonCard key={i} />
                                ))}
                            </div>
                        </section>
                    </div>
                ) : (
                    debouncedQuery && !hasResults ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400 animate-fade-in">
                            <h2 className="text-2xl font-bold text-white mb-2">No results found</h2>
                            <p>Try searching for a different movie, show, or actor.</p>
                        </div>
                    ) : (
                        hasResults && (
                            <div className="animate-fade-in-up space-y-12">
                                {/* SECTION 1: Movies */}
                                {(activeTab === 'all' || activeTab === 'movie') && movies.length > 0 && (
                                    <section>
                                        <h3 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3 text-white border-b border-white/10 pb-4">
                                            <FiFilm className="text-[#FFD400]" /> Movies
                                            <span className="text-sm font-normal text-gray-500 ml-auto">{movies.length} found</span>
                                        </h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                            {movies.map(m => (
                                                <MovieCard key={m.id} movie={m} />
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* SECTION 2: TV Shows */}
                                {(activeTab === 'all' || activeTab === 'tv') && series.length > 0 && (
                                    <section>
                                        <h3 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3 text-white border-b border-white/10 pb-4">
                                            <FiTv className="text-[#FFD400]" /> TV Shows
                                            <span className="text-sm font-normal text-gray-500 ml-auto">{series.length} found</span>
                                        </h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                            {series.map(s => (
                                                <MovieCard key={s.id} movie={{ ...s, media_type: 'tv' }} />
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* SECTION 3: People */}
                                {(activeTab === 'all' || activeTab === 'person') && actors.length > 0 && (
                                    <section>
                                        <h3 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3 text-white border-b border-white/10 pb-4">
                                            <FiUser className="text-[#FFD400]" /> People
                                            <span className="text-sm font-normal text-gray-500 ml-auto">{actors.length} found</span>
                                        </h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                            {actors.map(a => (
                                                <div
                                                    key={a.id}
                                                    className="group cursor-pointer"
                                                    onClick={() => navigate(`/actor/${a.id}`)}
                                                >
                                                    <div className="aspect-[3/4] rounded-xl overflow-hidden mb-3 border border-white/5 group-hover:border-[#FFD400] transition-colors shadow-lg bg-[#1f1f1f]">
                                                        <img
                                                            src={getPosterUrl(a.profile_path)}
                                                            alt={a.name}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            loading="lazy"
                                                        />
                                                    </div>
                                                    <div className="text-center font-bold text-white group-hover:text-[#FFD400] transition-colors text-sm">{a.name}</div>
                                                    <div className="text-center text-xs text-gray-500">{a.known_for_department}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </div>
                        )
                    )
                )}
            </div>
        </div>
    );
}
