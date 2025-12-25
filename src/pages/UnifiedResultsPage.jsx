import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getUnifiedResults, fetchGenreList } from '../services/tmdb';
import MovieCard from '../components/MovieCard';
import SkeletonCard from '../components/skeletons/SkeletonCard';

// Icons using local SVGs
const IconArrowLeft = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;
const IconRefresh = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path><path d="M16 21h5v-5"></path></svg>;

const LANG_MAP = {
    'en': 'English', 'hi': 'Hindi', 'te': 'Telugu', 'ta': 'Tamil',
    'ml': 'Malayalam', 'kn': 'Kannada', 'bn': 'Bengali', 'mr': 'Marathi',
    'ja': 'Japanese', 'ko': 'Korean', 'es': 'Spanish', 'fr': 'French'
};

const UnifiedResultsPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Read Params
    const type = searchParams.get('type') || 'movie';
    const query = searchParams.get('query') || '';
    const genre = searchParams.get('genre') || '';
    const language = searchParams.get('language') || '';
    const dubLanguage = searchParams.get('dubLanguage') || '';
    const yearFrom = searchParams.get('yearFrom') || '';
    const yearTo = searchParams.get('yearTo') || '';
    const ratingFrom = searchParams.get('ratingFrom') || 0;
    const ratingTo = searchParams.get('ratingTo') || 10;
    const sort = searchParams.get('sort') || 'popularity.desc';

    // State
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [genreMap, setGenreMap] = useState({});
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Determines params object for API - memoized to detect changes
    const apiParams = useMemo(() => ({
        type, query, genre, language, dubLanguage,
        yearFrom, yearTo, ratingFrom, ratingTo, sort
    }), [type, query, genre, language, dubLanguage, yearFrom, yearTo, ratingFrom, ratingTo, sort]);

    // Fetch Genre Map for Titles
    useEffect(() => {
        const loadGenres = async () => {
            const map = await fetchGenreList();
            setGenreMap(map);
        };
        loadGenres();
    }, []);

    // Fetch Results
    useEffect(() => {
        let mounted = true;

        const loadResults = async () => {
            if (mounted) {
                setResults([]);
                setPage(1);
                setHasMore(true);
                setLoading(true);
            }

            try {
                const data = await getUnifiedResults({ ...apiParams, page: 1 });
                if (mounted) {
                    setResults(data || []);
                    setHasMore((data && data.length > 0));
                }
            } catch (error) {
                console.error(error);
                if (mounted) setResults([]);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        loadResults();

        return () => {
            mounted = false;
        };
    }, [apiParams, refreshTrigger]);

    // Load More Handler
    const handleLoadMore = async () => {
        const nextPage = page + 1;
        const data = await getUnifiedResults({ ...apiParams, page: nextPage });
        if (data.length === 0) {
            setHasMore(false);
        } else {
            setResults(prev => [...prev, ...data]);
            setPage(nextPage);
        }
    };

    // Determine Dynamic Title
    const getPageTitle = () => {
        if (query) return `Search Results for: "${query}"`;
        if (dubLanguage) return `${LANG_MAP[dubLanguage] || dubLanguage.toUpperCase()} Dubbed Collection`;
        if (language) return `${LANG_MAP[language] || language.toUpperCase()} Movies`;
        if (genre) {
            // Handle multiple genres if comma separated
            const names = genre.split(',').map(id => genreMap[id]).filter(Boolean).join(', ');
            return names ? `Genre: ${names}` : 'Genre Results';
        }
        if (yearFrom || ratingFrom > 0) return 'Filtered Results';
        if (sort === 'popularity.desc') return 'Trending Now';
        return 'Discover Movies';
    };

    const handleRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white pt-24 px-4 pb-12 max-w-7xl mx-auto">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 sticky top-20 bg-[#0f0f0f]/95 backdrop-blur z-20 py-4 border-b border-white/10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
                    >
                        <IconArrowLeft />
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            {getPageTitle()}
                        </h1>
                        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">
                            {type === 'tv' ? 'TV Series' : 'Movies'}
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleRefresh}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm font-semibold"
                >
                    <IconRefresh className={loading ? "animate-spin" : ""} />
                    Refresh
                </button>
            </div>

            {/* Results Grid */}
            <div className="min-h-[50vh]">
                {loading && page === 1 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {[...Array(10)].map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : (
                    <>
                        {results.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 fade-in">
                                {results.map((item, index) => (
                                    <MovieCard
                                        key={`${item.id}-${index}`}
                                        movie={item}
                                        onClick={() => navigate(item.media_type === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center opacity-70">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-xl font-bold text-white mb-2">No Results Found</h3>
                                <p className="text-gray-400">Try adjusting your search or filters.</p>
                            </div>
                        )}

                        {/* Pagination */}
                        {results.length > 0 && hasMore && (
                            <div className="flex justify-center mt-12">
                                <button
                                    onClick={handleLoadMore}
                                    disabled={loading}
                                    className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-white font-semibold transition-all disabled:opacity-50 flex items-center gap-3"
                                >
                                    {loading ? "Loading..." : "Load More"}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default UnifiedResultsPage;
