// src/pages/LanguagesPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiFilter, FiCheck } from "react-icons/fi";
import { getMoviesByLanguage } from "../services/tmdb";
import MovieCard from "../components/MovieCard";
import GlobalLoader from "../components/GlobalLoader";

const LANGUAGES = [
    { code: "te", name: "Telugu", native: "తెలుగు" },
    { code: "hi", name: "Hindi", native: "हिंदी" },
    { code: "ta", name: "Tamil", native: "தமிழ்" },
    { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
    { code: "ml", name: "Malayalam", native: "മലയാളം" },
    { code: "en", name: "English", native: "English" },
    { code: "ko", name: "Korean", native: "한국어" },
    { code: "ja", name: "Japanese", native: "日本語" },
    { code: "es", name: "Spanish", native: "Español" },
    { code: "fr", name: "French", native: "Français" },
];

export default function LanguagesPage() {
    const navigate = useNavigate();
    const [selectedLang, setSelectedLang] = useState("te");
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState("all"); // all, original, dubbed (mock)

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            try {
                const data = await getMoviesByLanguage(selectedLang);
                setMovies(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchMovies();
    }, [selectedLang]);

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-6">
                <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
                    <span className="w-2 h-10 bg-red-600 rounded-full"></span>
                    Browse Content by Language
                </h1>

                {/* Language Chips */}
                <div className="flex flex-wrap gap-3 mb-10">
                    {LANGUAGES.map(lang => (
                        <button
                            key={lang.code}
                            onClick={() => setSelectedLang(lang.code)}
                            className={`px-5 py-2 rounded-full border transition-all flex items-center gap-2
                           ${selectedLang === lang.code
                                    ? 'bg-white text-black border-white font-bold transform scale-105 shadow-lg'
                                    : 'bg-transparent border-white/20 text-gray-400 hover:border-white hover:text-white'
                                }`}
                        >
                            <span>{lang.name}</span>
                            <span className="text-xs opacity-50 uppercase">{lang.native}</span>
                        </button>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                    <div>
                        <h2 className="text-2xl font-bold capitalize">
                            {LANGUAGES.find(l => l.code === selectedLang)?.name} Movies
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">Discover the best localized content.</p>
                    </div>

                    <div className="flex bg-[#1f1f1f] rounded-lg p-1 gap-1">
                        {['all', 'original'].map(type => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${filterType === type ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
                            >
                                {type === 'all' ? 'All Content' : 'Original Only'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="aspect-[2/3] bg-white/5 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {movies.map(movie => (
                            <div key={movie.id} onClick={() => navigate(`/movie/${movie.id}`)}>
                                <MovieCard movie={movie} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}



