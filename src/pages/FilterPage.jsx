import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchGenreList } from '../services/tmdb';

// Icons using local SVGs
const IconArrowLeft = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;
const IconFilter = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>;

const FilterPage = () => {
    const navigate = useNavigate();

    // -- State: Filters --
    const [mediaType, setMediaType] = useState('movie'); // movie or tv
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedLang, setSelectedLang] = useState('');
    const [yearFrom, setYearFrom] = useState('');
    const [yearTo, setYearTo] = useState('');
    const [ratingRange, setRatingRange] = useState([0, 10]); // [min, max]
    const [sortBy, setSortBy] = useState('popularity.desc');

    const [genresList, setGenresList] = useState([]);

    // -- options / constants --
    const languages = [
        { code: '', name: 'All Languages' },
        { code: 'en', name: 'English' },
        { code: 'hi', name: 'Hindi' },
        { code: 'te', name: 'Telugu' },
        { code: 'ta', name: 'Tamil' },
        { code: 'ml', name: 'Malayalam' },
        { code: 'kn', name: 'Kannada' },
        { code: 'bn', name: 'Bengali' },
        { code: 'mr', name: 'Marathi' },
        { code: 'ja', name: 'Japanese' },
        { code: 'ko', name: 'Korean' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
    ];

    const sortOptions = [
        { value: 'popularity.desc', label: 'Most Popular' },
        { value: 'vote_average.desc', label: 'Top Rated' },
        { value: 'primary_release_date.desc', label: 'Newest First' },
        { value: 'primary_release_date.asc', label: 'Oldest First' },
    ];

    // -- Init --
    useEffect(() => {
        // Load genres for dropdown
        const loadGenres = async () => {
            const map = await fetchGenreList();
            // Convert map to array
            const list = Object.entries(map).map(([id, name]) => ({ id, name }));
            setGenresList(list);
        };
        loadGenres();
    }, []);

    // Apply Filter Button -> Navigate to Unified Results
    const handleApply = () => {
        const params = new URLSearchParams();
        if (mediaType) params.append('type', mediaType);
        if (selectedGenre) params.append('genre', selectedGenre);
        if (selectedLang) params.append('language', selectedLang);
        if (yearFrom) params.append('yearFrom', yearFrom);
        if (yearTo) params.append('yearTo', yearTo);
        if (ratingRange[0] > 0) params.append('ratingFrom', ratingRange[0]);
        if (ratingRange[1] < 10) params.append('ratingTo', ratingRange[1]);
        if (sortBy) params.append('sort', sortBy);

        navigate(`/results?${params.toString()}`);
    };

    // Rating Slider Handler (simple input range)
    const handleRatingChange = (e, index) => {
        const val = parseFloat(e.target.value);
        const newRange = [...ratingRange];
        newRange[index] = val;
        // Ensure min <= max
        if (index === 0 && val > newRange[1]) newRange[1] = val;
        if (index === 1 && val < newRange[0]) newRange[0] = val;
        setRatingRange(newRange);
    };

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                >
                    <IconArrowLeft />
                </button>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
                    Advanced Filters
                </h1>
            </div>

            {/* Filter Controls Panel */}
            <div className="bg-[#18181b] rounded-2xl p-6 md:p-8 border border-white/5 shadow-xl mb-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                    {/* 1. Media Type */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-400">Category</label>
                        <div className="flex bg-black/40 rounded-lg p-1 border border-white/10">
                            <button
                                onClick={() => setMediaType('movie')}
                                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${mediaType === 'movie' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                            >
                                Movies
                            </button>
                            <button
                                onClick={() => setMediaType('tv')}
                                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${mediaType === 'tv' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                            >
                                TV Series
                            </button>
                        </div>
                    </div>

                    {/* 2. Sort By */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-400">Sort By</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
                        >
                            {sortOptions.map(opt => (
                                <option key={opt.value} value={opt.value} className="bg-[#18181b]">{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* 3. Genre */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-400">Genre</label>
                        <select
                            value={selectedGenre}
                            onChange={(e) => setSelectedGenre(e.target.value)}
                            className="bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
                        >
                            <option value="" className="bg-[#18181b]">All Genres</option>
                            {genresList.map(g => (
                                <option key={g.id} value={g.id} className="bg-[#18181b]">{g.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* 4. Language */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-400">Language</label>
                        <select
                            value={selectedLang}
                            onChange={(e) => setSelectedLang(e.target.value)}
                            className="bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
                        >
                            {languages.map(l => (
                                <option key={l.code} value={l.code} className="bg-[#18181b]">{l.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* 5. Year Range */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-400">Year Range</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                placeholder="From (1990)"
                                value={yearFrom}
                                onChange={(e) => setYearFrom(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none"
                            />
                            <span className="text-gray-500">-</span>
                            <input
                                type="number"
                                placeholder="To (2025)"
                                value={yearTo}
                                onChange={(e) => setYearTo(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* 6. Rating Range */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-400 flex justify-between">
                            <span>Rating ({ratingRange[0]} - {ratingRange[1]})</span>
                        </label>
                        <div className="flex items-center gap-2 px-1">
                            {/* Simple min slider */}
                            <input
                                type="range"
                                min="0" max="10" step="0.5"
                                value={ratingRange[0]}
                                onChange={(e) => handleRatingChange(e, 0)}
                                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                            />
                            {/* Simple max slider */}
                            <input
                                type="range"
                                min="0" max="10" step="0.5"
                                value={ratingRange[1]}
                                onChange={(e) => handleRatingChange(e, 1)}
                                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                            />
                        </div>
                    </div>

                </div>

                {/* Apply Button */}
                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleApply}
                        className="flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/20 transform active:scale-95 transition-all"
                    >
                        <IconFilter /> View Results
                    </button>
                </div>
            </div>

        </div>
    );
};

export default FilterPage;



