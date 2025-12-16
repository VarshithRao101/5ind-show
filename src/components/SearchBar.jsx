// src/components/SearchBar.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiX, FiTrendingUp } from "react-icons/fi";
import useDebounce from "../hooks/useDebounce";
import { searchMulti, getTrendingAll } from "../services/tmdb";
import SmartImage from "./SmartImage";

export default function SearchBar({ initialQuery = "" }) {
    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState([]);
    const [trending, setTrending] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const wrapperRef = useRef(null);

    const debouncedQuery = useDebounce(query, 400);

    // Load trending queries on mount
    useEffect(() => {
        getTrendingAll(1).then(res => setTrending(res.slice(0, 5)));
    }, []);

    // Live Search
    useEffect(() => {
        if (!debouncedQuery || debouncedQuery.length < 2) {
            setResults([]);
            return;
        }

        const fetchResults = async () => {
            setLoading(true);
            try {
                const data = await searchMulti(debouncedQuery);
                setResults(data.slice(0, 5)); // Show top 5 suggestions
            } catch (e) {
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [debouncedQuery]);

    // Click outside to close
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const handleSearch = (q) => {
        if (!q || q.trim().length === 0) return;
        setIsOpen(false);
        setQuery(q); // Update input to match selected suggestion
        navigate(`/search?q=${encodeURIComponent(q.trim())}`);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch(query);
        }
    };

    return (
        <div ref={wrapperRef} className="relative w-full z-50">
            {/* Input Area */}
            <div
                className={`
           flex items-center w-full bg-[#1f1f1f] border transition-all duration-300 rounded-full px-4 py-3
           ${isOpen ? 'border-primary-yellow shadow-[0_0_20px_rgba(245,197,24,0.2)]' : 'border-white/10 hover:border-white/30'}
         `}
            >
                <button onClick={() => handleSearch(query)} className="mr-3 text-gray-400 hover:text-white transition-colors">
                    <FiSearch size={22} />
                </button>

                <input
                    type="text"
                    placeholder="Search titles, people..."
                    className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 text-lg font-medium"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsOpen(true)}
                />

                {query && (
                    <button
                        onClick={() => { setQuery(''); setResults([]); setIsOpen(false); }}
                        className="ml-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <FiX size={20} />
                    </button>
                )}
            </div>

            {/* Dropdown Suggestions */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1f1f1f]/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-fade-in-down origin-top">
                    {loading && (
                        <div className="p-4 text-center text-gray-500 text-sm">Searching...</div>
                    )}

                    {/* Suggestions List */}
                    {!loading && query.length >= 2 && results.length > 0 && (
                        <div>
                            <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider bg-white/5">Top Suggestions</div>
                            {results.map(item => (
                                <div
                                    key={item.id}
                                    onClick={() => {
                                        setIsOpen(false);
                                        if (item.media_type === 'movie') navigate(`/movie/${item.id}`);
                                        else if (item.media_type === 'tv') navigate(`/tv/${item.id}`);
                                        else if (item.media_type === 'person') navigate(`/actor/${item.id}`);
                                        else navigate(`/search?q=${encodeURIComponent(item.title || item.name)}`);
                                    }}
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 hover:border-l-4 hover:border-primary-yellow transition-all cursor-pointer group"
                                >
                                    <div className="w-10 h-14 rounded overflow-hidden flex-shrink-0 bg-gray-800">
                                        <SmartImage
                                            src={item.poster_path || item.profile_path ? `https://image.tmdb.org/t/p/w92${item.poster_path || item.profile_path}` : null}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <div className="text-white font-medium group-hover:text-primary-yellow transition-colors">
                                            {item.title || item.name}
                                        </div>
                                        <div className="text-xs text-gray-400 flex items-center gap-2">
                                            <span className="capitalize">{item.media_type}</span>
                                            {item.release_date && <span>• {item.release_date.slice(0, 4)}</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div
                                onClick={() => handleSearch(query)}
                                className="px-4 py-3 text-center text-sm text-primary-yellow font-bold border-t border-white/10 hover:bg-white/5 cursor-pointer"
                            >
                                View all results for "{query}"
                            </div>
                        </div>
                    )}

                    {/* Trending (Empty State) */}
                    {!loading && (!query || query.length < 2) && (
                        <div>
                            <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider bg-white/5 flex items-center gap-2">
                                <FiTrendingUp /> Trending Searches
                            </div>
                            {trending.map((item, idx) => (
                                <div
                                    key={item.id}
                                    onClick={() => handleSearch(item.title || item.name)}
                                    className="px-4 py-3 hover:bg-white/5 cursor-pointer flex items-center gap-3 text-gray-300 hover:text-white transition-colors"
                                >
                                    <span className="text-gray-600 font-mono text-xs">0{idx + 1}</span>
                                    {item.title || item.name}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* No Results */}
                    {!loading && query.length >= 2 && results.length === 0 && (
                        <div className="p-4 text-center text-gray-500">No results found.</div>
                    )}
                </div>
            )}
        </div>
    );
}



