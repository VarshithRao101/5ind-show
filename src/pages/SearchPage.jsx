import React, { useEffect, useState, useContext, useMemo } from "react";
import { isMobileDevice } from "../utils/isMobile";
import { useSearchParams, useNavigate } from "react-router-dom";
import { searchMulti } from "../services/tmdb";
import SearchBar from "../components/SearchBar";
import MovieCard from "../components/MovieCard";
import SkeletonCard from "../components/skeletons/SkeletonCard";

import { WatchlistContext } from '../context/WatchlistContext';
import { AuthContext } from '../context/AuthContext';
import { getRating } from '../utils/getRating';
import { getGenreName } from '../utils/genreMap';

// SEARCH & ACTOR SYSTEM RESTORED - PART B

export default function SearchPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { savedForLater, currentlyWatching, addToWatchlist, removeFromWatchlist } = useContext(WatchlistContext);
    const { isGuest } = useContext(AuthContext);
    const q = searchParams.get("q") || "";

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("movie"); // movie | tv | person

    const handleWatchlist = (movie, inList) => {
        if (isGuest) {
            navigate('/login');
            return;
        }
        inList ? removeFromWatchlist(movie.id) : addToWatchlist(movie);
    };

    // Debounce & Fetch
    // Debounce & Fetch with Cancellation
    useEffect(() => {
        if (!q || q.length < 2) {
            setResults([]);
            setLoading(false);
            return;
        }

        const controller = new AbortController();
        const signal = controller.signal;

        const handler = setTimeout(async () => {
            setLoading(true);
            try {
                // Pass signal to Axios (requires update in tmdb.js or generic handling, 
                // but searchMulti helper doesn't accept signal. 
                // We will handle the RACE CONDITION locally.)
                const data = await searchMulti(q);

                if (!signal.aborted) {
                    setResults((data || []).slice(0, 20));
                }
            } catch (e) {
                if (!signal.aborted) setResults([]);
            } finally {
                if (!signal.aborted) setLoading(false);
            }
        }, 400); // 400ms debounce

        return () => {
            controller.abort();
            clearTimeout(handler);
        };
    }, [q]);

    // Categorize
    const categorized = useMemo(() => {
        const movies = results.filter(i => i.media_type === "movie");
        const tv = results.filter(i => i.media_type === "tv");
        const persons = results.filter(i => i.media_type === "person");
        return { movie: movies, tv: tv, person: persons };
    }, [results]);

    // Derived Display Data
    const displayData = categorized[activeTab] || [];

    // Correct Tab Label logic (Hide if 0? or just show 0?) 
    // "If a category has no results, hide it." -> I will hide the tab if count is 0, UNLESS all are 0.
    const hasResults = results.length > 0;
    const showMovieTab = categorized.movie.length > 0;
    const showTvTab = categorized.tv.length > 0;
    const showPersonTab = categorized.person.length > 0;

    // Auto-switch tab if active is empty but others have data
    useEffect(() => {
        if (loading) return;
        if (categorized[activeTab].length === 0 && results.length > 0) {
            if (showMovieTab) setActiveTab("movie");
            else if (showTvTab) setActiveTab("tv");
            else if (showPersonTab) setActiveTab("person");
        }
    }, [results, activeTab, categorized, showMovieTab, showTvTab, showPersonTab, loading]);

    return (
        <div className="min-h-screen pb-24 bg-[#0f0f0f] text-white pt-20 md:pt-24 px-4 md:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Search Input Area */}
                <div className="max-w-3xl mx-auto">
                    <SearchBar initialQuery={q} realTime={true} />
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="grid grid-cols-2 busm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 animate-pulse">
                        {[...Array(10)].map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                )}

                {/* Empty / Initial States */}
                {!loading && (!q || q.length < 2) && (
                    <div className="text-center text-gray-500 py-20">
                        <p className="text-xl font-medium">Type at least 2 characters to search</p>
                    </div>
                )}

                {!loading && q.length >= 2 && results.length === 0 && (
                    <div className="text-center text-gray-500 py-20">
                        <p className="text-xl">No results found for "{q}"</p>
                        <p className="text-sm mt-2">Try a different keyword.</p>
                    </div>
                )}

                {/* TABS & RESULTS */}
                {!loading && results.length > 0 && (
                    <div>
                        {/* Tabs */}
                        <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2 no-scrollbar border-b border-white/10">
                            {showMovieTab && (
                                <button
                                    onClick={() => setActiveTab("movie")}
                                    className={`px-6 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${activeTab === "movie"
                                        ? "bg-primary-yellow text-black"
                                        : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                                        }`}
                                >
                                    Movies ({categorized.movie.length})
                                </button>
                            )}
                            {showTvTab && (
                                <button
                                    onClick={() => setActiveTab("tv")}
                                    className={`px-6 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${activeTab === "tv"
                                        ? "bg-primary-yellow text-black"
                                        : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                                        }`}
                                >
                                    Series ({categorized.tv.length})
                                </button>
                            )}
                            {showPersonTab && (
                                <button
                                    onClick={() => setActiveTab("person")}
                                    className={`px-6 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${activeTab === "person"
                                        ? "bg-primary-yellow text-black"
                                        : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                                        }`}
                                >
                                    Persons ({categorized.person.length})
                                </button>
                            )}
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 animate-fade-in-up">
                            {displayData.map((item) => {
                                if (!item.id) return null;
                                const inList = [...savedForLater, ...currentlyWatching].some(i => i.id === item.id);
                                const imagePath = item.poster_path || item.profile_path;
                                const title = item.title || item.name || 'Unknown';
                                const type = item.media_type || 'movie';

                                return (
                                    <MovieCard
                                        key={`${type}-${item.id}`}
                                        id={item.id}
                                        title={title}
                                        posterPath={imagePath}
                                        rating={getRating(item)}
                                        genre={type === 'person' ? (item.known_for_department || "Person") : (getGenreName(item.genre_ids?.[0]) || (type === 'tv' ? "TV Show" : "Movie"))}
                                        year={(item.release_date || item.first_air_date || "").substring(0, 4)}
                                        isInWatchlist={inList && type !== 'person'}
                                        onToggleWatchlist={() => type !== 'person' && handleWatchlist(item, inList)}
                                        onNavigate={() => {
                                            if (type === 'person') navigate(`/actor/${item.id}`);
                                            else if (type === 'tv') navigate(`/series/${item.id}`);
                                            else navigate(`/movie/${item.id}`);
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
