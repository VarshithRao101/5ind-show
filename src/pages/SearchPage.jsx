import React, { useEffect, useState } from "react";
import { isMobileDevice } from "../utils/isMobile";
import MobileMovieGrid from "../components/MobileMovieGrid";
import { useSearchParams, useNavigate } from "react-router-dom";
import { searchMulti } from "../services/tmdb";
import SearchBar from "../components/SearchBar";
import MovieCard from "../components/MovieCard";
import SkeletonCard from "../components/skeletons/SkeletonCard";

export default function SearchPage() {
    const isMobile = isMobileDevice();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const q = searchParams.get("q") || "";

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        const safety = setTimeout(() => {
            setLoading(false);
        }, 6000);
        return () => clearTimeout(safety);
    }, []);

    useEffect(() => {
        if (!q) {
            setResults([]);
            setLoading(false);
            return;
        }

        let active = true;

        async function search() {
            setLoading(true);
            try {
                // Use service but handle as instructed
                const data = await searchMulti(q);
                if (active) {
                    setResults(data || []);
                }
            } catch (e) {
                // Silent catch
                if (active) setResults([]);
            } finally {
                if (active) setLoading(false);
            }
        }

        search();

        return () => {
            active = false;
        };
    }, [q]);

    // Split results
    const movies = results.filter(i => i.media_type === 'movie');
    const tv = results.filter(i => i.media_type === 'tv');
    const people = results.filter(i => i.media_type === 'person');

    const hasResults = results.length > 0;

    return (
        <>
            {isMobile ? (
                <div className="min-h-screen pt-16 bg-[#0f0f0f]">
                    {loading && <div className="text-center mt-10 text-gray-400">Loading result…</div>}
                    {!loading && <MobileMovieGrid movies={[...movies, ...tv]} />}
                    {!loading && [...movies, ...tv].length === 0 && (
                        <div className="text-center text-gray-400 mt-8">
                            Nothing to show right now
                        </div>
                    )}
                </div>
            ) : (
                <div className="min-h-screen pb-24 bg-[#0f0f0f] text-white">
                    {/* Header Spacer */}
                    <div className="h-20 md:h-24" />

                    {/* Search Bar Container */}
                    <div className="max-w-4xl mx-auto px-6 mb-8">
                        <SearchBar initialQuery={q} realTime={true} />

                        {/* Filter Tabs */}
                        {hasResults && !loading && (
                            <div className="flex items-center justify-center gap-2 mt-6 overflow-x-auto pb-2 scrollbar-hide">
                                {/* Tabs remain same but strict check on !loading ensures no flicker */}
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
                        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 animate-pulse">
                            {[...Array(10)].map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
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
            )}
        </>
    );
}
