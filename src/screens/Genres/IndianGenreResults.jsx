// GENRE SYSTEM HARD RESET COMPLETE
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiRefreshCw, FiAlertCircle } from "react-icons/fi";
import MovieCard from "../../components/MovieCard";
import SkeletonCard from "../../components/skeletons/SkeletonCard";
import tmdb from "../../services/tmdb";
import { shuffle } from "../../services/tmdb";

// Static map for Genre Names (since we cannot pass state)
const GENRE_NAMES = {
    "28": "Action",
    "12": "Adventure",
    "16": "Animation",
    "35": "Comedy",
    "80": "Crime",
    "99": "Documentary",
    "18": "Drama",
    "10751": "Family",
    "14": "Fantasy",
    "36": "History",
    "27": "Horror",
    "10402": "Music",
    "9648": "Mystery",
    "10749": "Romance",
    "878": "Science Fiction",
    "10770": "TV Movie",
    "53": "Thriller",
    "10752": "War",
    "37": "Western",
    "all": "All"
};

const LANGUAGE_NAMES = {
    te: "Telugu",
    ta: "Tamil",
    hi: "Hindi",
    ml: "Malayalam",
    kn: "Kannada",
    bn: "Bengali",
    en: "English"
};

export default function IndianGenreResults() {
    const { type, language, genreId } = useParams();
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchedData = React.useRef({}); // Cache for page tracking

    // Determine Mode
    const isIndianMode = Boolean(type && language);
    const isDub = type === "dub";

    // Resolve Display Names
    const genreName = GENRE_NAMES[genreId] || "Genre";
    const langName = isIndianMode ? (LANGUAGE_NAMES[language] || language?.toUpperCase()) : "Global";

    const fetchMovies = useCallback(async (isShuffle = false) => {
        setLoading(true);
        setError(null);
        try {
            // SHUFFLE LOGIC: Fetch next page instead of random page to ensure uniqueness
            // Use a ref to track current page for this specific filter combo
            const filterKey = `${type}-${language}-${genreId}`;

            // If checking a new filter, reset pages tracking
            if (!fetchedData.current[filterKey]) {
                fetchedData.current[filterKey] = 1;
            }

            // If shuffling, increment page. If fetching fresh (page load), use tracked page (usually 1)
            let page = fetchedData.current[filterKey];
            if (isShuffle) {
                page += 1;
                fetchedData.current[filterKey] = page;
            } else {
                // Reset if it's a fresh mount/filter change implies we want start
                // But wait, if we navigate back, we might want to keep state?
                // For now, let's stick to 1 on fresh filter load
                if (!isShuffle) {
                    page = 1;
                    fetchedData.current[filterKey] = 1;
                }
            }

            const genreParam = (genreId === 'all' || !genreId) ? undefined : genreId;
            const limit = 25;

            let results = [];

            if (isIndianMode) {
                // --- INDIAN MODE (Sub/Dub) ---
                const params = {
                    with_original_language: isDub ? undefined : language,
                    with_language: isDub ? language : undefined,
                    with_genres: genreParam,
                    sort_by: "popularity.desc",
                    page: page,
                    include_adult: false
                };

                // For Dubbed, force specific discover logic
                if (isDub) {
                    delete params.with_original_language;
                    params.with_language = language;
                }

                const res = await tmdb.get("/discover/movie", { params });
                results = res.data?.results || [];

                // Fallback for empty dubbed results (only on page 1)
                if (results.length === 0 && page === 1 && isDub) {
                    const broadRes = await tmdb.get("/discover/movie", {
                        params: { ...params, with_language: undefined, with_original_language: language, page: 1 }
                    });
                    results = broadRes.data?.results || [];
                }
            } else {
                // --- STANDARD GENRE MODE (Global) ---
                const res = await tmdb.get("/discover/movie", {
                    params: {
                        with_genres: genreParam,
                        sort_by: "popularity.desc",
                        page: page,
                        include_adult: false
                    }
                });
                results = res.data?.results || [];
            }

            // Shuffle results locally to give "random" feel even within popularity sort
            // But if we are paging, maybe don't shuffle too much to avoid losing order? 
            // The prompt asks to "Randomize existing list first, Then fetch new page... Merge".
            // Implementation: Fetch new page. Combine with existing (if we were keeping them, but here we replace setMovies).
            // Actually, for "Show new movies", we replace the list.
            const finalResults = shuffle(results).slice(0, limit);

            setMovies(finalResults);

        } catch (e) {
            console.error("Genre Engine Error:", e);
            setError(`Failed to load movies: ${e.message || "Unknown Error"}`);
            // Keep old movies if shuffle failed? No, better show error.
        } finally {
            setLoading(false);
        }
    }, [type, language, genreId, isIndianMode, isDub]);

    const handleShuffle = () => {
        fetchMovies(true);
    };

    useEffect(() => {
        fetchMovies(false);
    }, [fetchMovies]);

    // Title Logic
    const pageTitle = isIndianMode
        ? `${langName} ${isDub ? "Dubbed" : "Movies"}`
        : `${genreName} Movies`;

    const subTitle = isIndianMode
        ? (genreName !== "All" ? genreName : "All Genres")
        : "Top Rated & Popular";

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white pt-20 px-4 pb-20">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                        >
                            <FiArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">
                                {pageTitle}
                            </h1>
                            <p className="text-gray-400 text-sm mt-1">{subTitle}</p>
                        </div>
                    </div>

                    <button
                        onClick={handleShuffle}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-yellow text-black rounded-full font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50"
                    >
                        <FiRefreshCw className={loading ? "animate-spin" : ""} />
                        <span className="hidden sm:inline">Shuffle</span>
                    </button>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {[...Array(20)].map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <FiAlertCircle size={48} className="text-red-500 mb-4" />
                        <h3 className="text-xl font-bold mb-2">Oops!</h3>
                        <p className="text-gray-400">{error}</p>
                        <button onClick={() => window.location.reload()} className="mt-6 px-6 py-2 bg-white/10 rounded-full hover:bg-white/20">Try refresh</button>
                    </div>
                )}

                {/* Empty */}
                {!loading && !error && movies.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="text-6xl mb-4">🎬</div>
                        <h3 className="text-xl font-bold mb-2">No movies found</h3>
                        <p className="text-gray-400">Try refreshing or checking another genre.</p>
                    </div>
                )}

                {/* Results */}
                {!loading && !error && movies.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                        {movies.map(movie => (
                            <MovieCard
                                key={movie.id}
                                id={movie.id}
                                title={movie.title || movie.name}
                                posterPath={movie.poster_path}
                                year={(movie.release_date || "").substring(0, 4)}
                                rating={movie.vote_average?.toFixed(1) || "N/A"}
                                genre={genreName}
                                onNavigate={() => navigate(`/movie/${movie.id}`)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
