import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { searchMulti } from "../services/tmdb";
import { getPoster } from "../utils/poster";
import SearchBar from "../components/SearchBar";
import MovieCard from "../components/MovieCard"; // Assuming we can re-use MovieCard, else build simple one

export default function SearchPage() {
    const { search } = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(search);
    const q = params.get("q") || "";

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        // If query is empty, clear results
        if (!q || q.trim().length < 2) {
            setResults([]);
            return;
        }

        let mounted = true;
        setLoading(true);

        const fetchSearch = async () => {
            try {
                const data = await searchMulti(q);
                if (mounted) setResults(data || []);
            } catch (e) {
                console.error("Search failed", e);
                if (mounted) setResults([]);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchSearch();

        return () => { mounted = false; };
    }, [q]);

    // Split results
    const movies = results.filter(i => i.media_type === 'movie');
    const tv = results.filter(i => i.media_type === 'tv');
    const people = results.filter(i => i.media_type === 'person');

    const hasResults = results.length > 0;

    return (
        <div className="min-h-screen pb-24 bg-[#0f0f0f] text-white">
            {/* Header Spacer */}
            <div className="h-20 md:h-24" />

            {/* Search Bar Container */}
            <div className="max-w-4xl mx-auto px-6 mb-8">
                <SearchBar initialQuery={q} realTime={true} />

                {/* Filter Tabs */}
                {hasResults && (
                    <div className="flex items-center justify-center gap-2 mt-6 overflow-x-auto pb-2 scrollbar-hide">
                        {[
                            { id: 'all', label: 'All Results' },
                            { id: 'movie', label: 'Movies', count: movies.length },
                            { id: 'tv', label: 'TV Shows', count: tv.length },
                            { id: 'person', label: 'People', count: people.length }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap
                                    ${activeTab === tab.id
                                        ? 'bg-primary-yellow text-black shadow-lg shadow-yellow-500/20 scale-105'
                                        : 'bg-[#1f1f1f] text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'}
                                `}
                            >
                                {tab.label} {tab.id !== 'all' && <span className="opacity-60 text-xs ml-1">({tab.count})</span>}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {loading && (
                <div className="flex justify-center pt-20">
                    <div className="w-10 h-10 border-4 border-primary-yellow border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {!loading && !hasResults && q.length > 1 && (
                <div className="text-center text-gray-500 pt-20">
                    <p className="text-xl">No results found for "{q}"</p>
                    <p className="text-sm mt-2">Try searching for something else.</p>
                </div>
            )}

            {!loading && hasResults && (
                <div className="max-w-7xl mx-auto px-6 space-y-12 animate-fade-in-up">

                    {/* Movies Section */}
                    {movies.length > 0 && (activeTab === 'all' || activeTab === 'movie') && (
                        <section>
                            <h3 className="text-2xl font-bold font-heading mb-6 flex items-center gap-3">
                                <span className="w-1.5 h-8 bg-primary-yellow rounded-full" />
                                Movies
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                {movies.map(m => (
                                    <MovieCard key={m.id} movie={m} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* TV Section */}
                    {tv.length > 0 && (activeTab === 'all' || activeTab === 'tv') && (
                        <section>
                            <h3 className="text-2xl font-bold font-heading mb-6 flex items-center gap-3">
                                <span className="w-1.5 h-8 bg-blue-500 rounded-full" />
                                TV Series
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                {tv.map(t => (
                                    <MovieCard key={t.id} movie={t} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* People Section */}
                    {people.length > 0 && (activeTab === 'all' || activeTab === 'person') && (
                        <section>
                            <h3 className="text-2xl font-bold font-heading mb-6 flex items-center gap-3">
                                <span className="w-1.5 h-8 bg-purple-500 rounded-full" />
                                Actors & People
                            </h3>
                            <div className={`
                                ${activeTab === 'person'
                                    ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6'
                                    : 'flex gap-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-zinc-700'}
                             `}>
                                {people.map(p => (
                                    <div
                                        key={p.id}
                                        className={`flex-shrink-0 group cursor-pointer text-center ${activeTab === 'person' ? 'w-full' : 'w-32'}`}
                                        onClick={() => navigate(`/actor/${p.id}`)}
                                    >
                                        <div className={`rounded-full overflow-hidden mb-3 border-2 border-white/10 group-hover:border-purple-500 transition-all shadow-lg mx-auto ${activeTab === 'person' ? 'w-32 h-32' : 'w-32 h-32'}`}>
                                            <img
                                                src={p.profile_path ? `https://image.tmdb.org/t/p/w185${p.profile_path}` : `https://ui-avatars.com/api/?name=${p.name}&background=2a2a2a&color=fff`}
                                                alt={p.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                loading="lazy"
                                            />
                                        </div>
                                        <p className="font-bold text-sm text-gray-200 group-hover:text-white truncate">{p.name}</p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {p.known_for?.map(k => k.title || k.name).join(', ') || 'Actor'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            )}
        </div>
    );
}
