import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheck, FiRefreshCcw } from 'react-icons/fi';
import { FilterContext } from '../context/FilterContext';
import { fetchGenreList } from '../services/tmdb';

const FilterModal = () => {
    const { isModalOpen, closeModal, filters, applyFilters, resetFilters } = useContext(FilterContext);
    const [localFilters, setLocalFilters] = useState(filters);
    const [availableGenres, setAvailableGenres] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (isModalOpen) {
            setLocalFilters(filters);
            // Fetch genres if not already loaded (could be cached better, but simple for now)
            fetchGenreList().then(map => {
                const list = Object.entries(map).map(([id, name]) => ({ id: Number(id), name }));
                setAvailableGenres(list);
            });
        }
    }, [isModalOpen, filters]);

    const handleApply = () => {
        applyFilters(localFilters);

        // Construct Query Params for Results Page
        const params = new URLSearchParams();

        // 1. Sort
        if (localFilters.sortBy === 'rating') params.append('sort', 'vote_average.desc');
        else if (localFilters.sortBy === 'date') params.append('sort', 'primary_release_date.desc');
        else params.append('sort', 'popularity.desc');

        // 2. Type
        if (localFilters.contentType === 'tv') params.append('type', 'tv');
        else params.append('type', 'movie'); // Default to movie for 'all' or 'movie'

        // 3. Genre
        if (localFilters.genreId) params.append('genre', localFilters.genreId);

        // 4. Language
        if (localFilters.language) params.append('language', localFilters.language);

        // 5. Year
        if (localFilters.year) {
            if (localFilters.year.includes('-')) {
                const [start, end] = localFilters.year.split('-');
                params.append('yearFrom', start);
                params.append('yearTo', end);
            } else {
                params.append('yearFrom', localFilters.year);
                params.append('yearTo', localFilters.year);
            }
        }

        navigate(`/results?${params.toString()}`);
    };

    if (!isModalOpen) return null;

    // Hardcoded Languages (Top ones)
    const languages = [
        { code: 'en', name: 'English' },
        { code: 'hi', name: 'Hindi' },
        { code: 'te', name: 'Telugu' },
        { code: 'ta', name: 'Tamil' },
        { code: 'ml', name: 'Malayalam' },
        { code: 'ko', name: 'Korean' },
        { code: 'ja', name: 'Japanese' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
    ];

    // Years
    const years = [
        { val: null, label: 'All Time' },
        { val: '2025', label: '2025' },
        { val: '2024', label: '2024' },
        { val: '2023', label: '2023' },
        { val: '2022', label: '2022' },
        { val: '2020-2021', label: '2020-2021' },
        { val: '2010-2019', label: '2010s' },
        { val: '2000-2009', label: '2000s' },
        { val: '1990-1999', label: '90s' },
        { val: '1980-1989', label: '80s' },
    ];

    return (
        <AnimatePresence>
            {isModalOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeModal}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 m-auto w-full max-w-lg max-h-[90vh] bg-[#181818] border border-white/10 rounded-2xl shadow-2xl z-[70] overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/5 shrink-0">
                            <h2 className="text-xl font-bold text-white">Filters</h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors">
                                <FiX size={24} />
                            </button>
                        </div>

                        {/* Content Scrollable */}
                        <div className="p-6 space-y-8 overflow-y-auto custom-scrollbar flex-1">

                            {/* Sort By */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Sort By</h3>
                                    {localFilters.sortBy !== 'popularity' && (
                                        <button onClick={() => setLocalFilters({ ...localFilters, sortBy: 'popularity' })} className="text-xs text-primary-yellow hover:text-white flex items-center gap-1"><FiRefreshCcw /> Reset</button>
                                    )}
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { id: 'popularity', label: 'Popularity' },
                                        { id: 'rating', label: 'Rating' },
                                        { id: 'date', label: 'Newest' }
                                    ].map(opt => (
                                        <button
                                            key={opt.id}
                                            onClick={() => setLocalFilters({ ...localFilters, sortBy: opt.id })}
                                            className={`py-2 px-3 rounded-lg text-sm font-bold transition-all border ${localFilters.sortBy === opt.id
                                                ? 'bg-primary-yellow text-black border-primary-yellow'
                                                : 'bg-white/5 text-gray-300 border-transparent hover:border-white/20'
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Content Type */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Content Type</h3>
                                    {localFilters.contentType !== 'all' && (
                                        <button onClick={() => setLocalFilters({ ...localFilters, contentType: 'all' })} className="text-xs text-primary-yellow hover:text-white flex items-center gap-1"><FiRefreshCcw /> Reset</button>
                                    )}
                                </div>
                                <div className="flex bg-[#0f0f0f] rounded-lg p-1 border border-white/5">
                                    {[
                                        { id: 'all', label: 'All' },
                                        { id: 'movie', label: 'Movies' },
                                        { id: 'tv', label: 'TV Shows' }
                                    ].map(opt => (
                                        <button
                                            key={opt.id}
                                            onClick={() => setLocalFilters({ ...localFilters, contentType: opt.id })}
                                            className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${localFilters.contentType === opt.id
                                                ? 'bg-[#2a2a2a] text-white shadow-lg'
                                                : 'text-gray-500 hover:text-gray-300'
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Genres */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Genre</h3>
                                    {localFilters.genreId && (
                                        <button onClick={() => setLocalFilters({ ...localFilters, genreId: null })} className="text-xs text-primary-yellow hover:text-white flex items-center gap-1"><FiRefreshCcw /> Reset</button>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto custom-scrollbar p-1">
                                    <button
                                        onClick={() => setLocalFilters({ ...localFilters, genreId: null })}
                                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${localFilters.genreId === null
                                            ? 'bg-white text-black border-white'
                                            : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/30'
                                            }`}
                                    >
                                        All
                                    </button>
                                    {availableGenres.map(g => (
                                        <button
                                            key={g.id}
                                            onClick={() => setLocalFilters({ ...localFilters, genreId: g.id })}
                                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${localFilters.genreId === g.id
                                                ? 'bg-primary-yellow text-black border-primary-yellow'
                                                : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/30'
                                                }`}
                                        >
                                            {g.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Languages */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Language</h3>
                                    {localFilters.language !== 'en' && (
                                        <button onClick={() => setLocalFilters({ ...localFilters, language: 'en' })} className="text-xs text-primary-yellow hover:text-white flex items-center gap-1"><FiRefreshCcw /> Reset</button>
                                    )}
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        onClick={() => setLocalFilters({ ...localFilters, language: null })}
                                        className={`py-2 rounded-lg text-xs font-bold transition-all border ${localFilters.language === null
                                            ? 'bg-white text-black border-white'
                                            : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/30'
                                            }`}
                                    >
                                        All
                                    </button>
                                    {languages.map(l => (
                                        <button
                                            key={l.code}
                                            onClick={() => setLocalFilters({ ...localFilters, language: l.code })}
                                            className={`py-2 rounded-lg text-xs font-bold transition-all border ${localFilters.language === l.code
                                                ? 'bg-white/20 text-white border-white/40'
                                                : 'bg-white/5 text-gray-400 border-transparent hover:bg-white/10'
                                                }`}
                                        >
                                            {l.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Years */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Release Year</h3>
                                    {localFilters.year && (
                                        <button onClick={() => setLocalFilters({ ...localFilters, year: null })} className="text-xs text-primary-yellow hover:text-white flex items-center gap-1"><FiRefreshCcw /> Reset</button>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto custom-scrollbar p-1">
                                    <button
                                        onClick={() => setLocalFilters({ ...localFilters, year: null })}
                                        className={`px-3 py-1.5 rounded-md text-xs font-bold border ${!localFilters.year ? 'bg-white text-black border-white' : 'bg-white/5 text-gray-400 border-white/10'}`}
                                    >
                                        Any Time
                                    </button>
                                    {['2020-2025', '2010-2019', '2000-2009', '1990-1999', '1980-1989'].map(range => (
                                        <button
                                            key={range}
                                            onClick={() => setLocalFilters({ ...localFilters, year: range })}
                                            className={`px-3 py-1.5 rounded-md text-xs font-bold border ${localFilters.year === range ? 'bg-primary-yellow text-black border-primary-yellow' : 'bg-white/5 text-gray-400 border-white/10'}`}
                                        >
                                            {range}
                                        </button>
                                    ))}
                                    {/* Individual Years 2025-2000 */}
                                    {Array.from({ length: 26 }, (_, i) => 2025 - i).map(y => (
                                        <button
                                            key={y}
                                            onClick={() => setLocalFilters({ ...localFilters, year: String(y) })}
                                            className={`px-3 py-1.5 rounded-md text-xs font-bold border ${localFilters.year === String(y) ? 'bg-primary-yellow text-black border-primary-yellow' : 'bg-white/5 text-gray-400 border-white/10'}`}
                                        >
                                            {y}
                                        </button>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-white/5 bg-[#1f1f1f] flex gap-4 shrink-0">
                            <button
                                onClick={resetFilters}
                                className="flex-1 py-3 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                            >
                                Reset
                            </button>
                            <button
                                onClick={handleApply}
                                className="flex-[2] py-3 rounded-xl font-bold bg-primary-yellow text-black hover:bg-primary-yellow-hover transition-all shadow-yellow-glow flex items-center justify-center gap-2"
                            >
                                <FiCheck size={18} /> Apply Filters
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default FilterModal;
