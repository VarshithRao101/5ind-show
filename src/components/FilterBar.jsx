import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { getGenreArray } from '../services/genres';

const FilterBar = ({ onFilterChange, showLanguages = true }) => {
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState(null);

    useEffect(() => {
        getGenreArray().then(setGenres);
    }, []);

    const languages = [
        { code: 'te', name: 'Telugu' },
        { code: 'hi', name: 'Hindi' },
        { code: 'ta', name: 'Tamil' },
        { code: 'ml', name: 'Malayalam' },
        { code: 'kn', name: 'Kannada' },
        { code: 'en', name: 'English' }
    ];

    const handleGenreClick = (id) => {
        const newGenre = selectedGenre === id ? null : id;
        setSelectedGenre(newGenre);
        onFilterChange({ genreId: newGenre, language: selectedLanguage });
    };

    const handleLanguageClick = (code) => {
        const newLang = selectedLanguage === code ? null : code;
        setSelectedLanguage(newLang);
        onFilterChange({ genreId: selectedGenre, language: newLang });
    };

    const handleClear = () => {
        setSelectedGenre(null);
        setSelectedLanguage(null);
        onFilterChange({ genreId: null, language: null });
    };

    const hasFilter = selectedGenre || selectedLanguage;

    return (
        <div className="w-full relative z-20 py-4 border-b border-white/5 bg-[#0f0f0f]/95 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 overflow-x-auto scrollbar-hide flex items-center gap-3">

                {/* Clear Button */}
                {hasFilter && (
                    <button
                        onClick={handleClear}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full font-bold text-sm whitespace-nowrap hover:bg-red-500 hover:text-white transition-all"
                    >
                        <FiX /> Clear
                    </button>
                )}

                {/* Separator */}
                {hasFilter && <div className="w-px h-6 bg-white/10 mx-2" />}

                {/* Languages */}
                {showLanguages && languages.map(lang => (
                    <button
                        key={lang.code}
                        onClick={() => handleLanguageClick(lang.code)}
                        className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${selectedLanguage === lang.code
                            ? 'bg-primary-yellow text-black border-primary-yellow shadow-yellow-glow'
                            : 'bg-[#1f1f1f] text-gray-400 border-white/5 hover:border-white/20 hover:text-white'
                            }`}
                    >
                        {lang.name}
                    </button>
                ))}

                {showLanguages && <div className="w-px h-6 bg-white/10 mx-2" />}

                {/* Genres */}
                {genres.map(genre => (
                    <button
                        key={genre.id}
                        onClick={() => handleGenreClick(genre.id)}
                        className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${selectedGenre === genre.id
                            ? 'bg-primary-yellow text-black border-primary-yellow shadow-yellow-glow'
                            : 'bg-[#1f1f1f] text-gray-400 border-white/5 hover:border-white/20 hover:text-white'
                            }`}
                    >
                        {genre.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FilterBar;
