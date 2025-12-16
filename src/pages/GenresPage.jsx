// src/pages/GenresPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

/*
  Multi-card Genres + Indian Languages + Dubbed collections
*/

const GENRES = [
    { id: 28, name: "Action", icon: "⚔️" },
    { id: 35, name: "Comedy", icon: "😂" },
    { id: 27, name: "Horror", icon: "👻" },
    { id: 53, name: "Thriller", icon: "🔪" },
    { id: 10749, name: "Romance", icon: "❤️" },
    { id: 878, name: "Sci-Fi", icon: "🚀" },
    { id: 18, name: "Drama", icon: "🎭" },
    { id: 10751, name: "Family", icon: "👪" },
    { id: 80, name: "Crime", icon: "🚓" },
    { id: 14, name: "Fantasy", icon: "✨" },
    { id: 12, name: "Adventure", icon: "🏹" },
    { id: 9648, name: "Mystery", icon: "🕵️" }
];

const LANGUAGES = [
    { code: "te", name: "Telugu", icon: "🇮🇳" },
    { code: "hi", name: "Hindi", icon: "🇮🇳" },
    { code: "ta", name: "Tamil", icon: "🇮🇳" },
    { code: "ml", name: "Malayalam", icon: "🇮🇳" },
    { code: "kn", name: "Kannada", icon: "🇮🇳" },
    { code: "bn", name: "Bengali", icon: "🇮🇳" },
    { code: "mr", name: "Marathi", icon: "🇮🇳" },
    { code: "pa", name: "Punjabi", icon: "🇮🇳" }
];

const DubbedLangs = LANGUAGES;

export default function GenresPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white">
            {/* Sticky Header with Back Button */}
            <div className="sticky top-0 z-30 bg-[#0f0f0f]/90 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                    <FiArrowLeft size={24} />
                </button>
                <h1 className="text-2xl font-bold">Browse categories</h1>
            </div>

            <div className="p-6 pb-20 max-w-7xl mx-auto">
                <section className="mb-10">
                    <h2 className="text-xl font-semibold mb-4 border-l-4 border-red-500 pl-3">Popular Genres</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {GENRES.map(g => (
                            <button
                                key={g.id}
                                onClick={() => navigate(`/genre/${g.id}`)}
                                className="p-4 rounded-xl bg-white/5 backdrop-blur-md hover:bg-white/10 hover:scale-105 transform transition flex flex-col items-center justify-center border border-white/5 aspect-square"
                            >
                                <div className="text-4xl mb-3">{g.icon}</div>
                                <div className="text-sm font-bold tracking-wide">{g.name}</div>
                            </button>
                        ))}
                    </div>
                </section>

                <section className="mb-10">
                    <h2 className="text-xl font-semibold mb-4 border-l-4 border-red-500 pl-3">Indian Languages</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                        {LANGUAGES.map(l => (
                            <button
                                key={l.code}
                                onClick={() => navigate(`/language/${l.code}`)}
                                className="p-4 rounded-xl bg-white/5 backdrop-blur-md hover:bg-white/10 hover:scale-105 transform transition flex flex-col items-center justify-center border border-white/5 aspect-[4/3]"
                            >
                                <div className="text-3xl mb-2">{l.icon}</div>
                                <div className="text-sm font-bold capitalize">{l.name}</div>
                            </button>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-4 border-l-4 border-red-500 pl-3">Dubbed Collections</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        {DubbedLangs.map(l => (
                            <button
                                key={l.code}
                                onClick={() => navigate(`/dubbed/${l.code}`)}
                                className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-md hover:from-white/10 hover:to-white/5 hover:scale-105 transform transition flex flex-col items-center justify-center border border-white/5 aspect-video"
                            >
                                <div className="text-3xl mb-2">🎧</div>
                                <div className="text-sm font-bold">{l.name} Dubbed</div>
                            </button>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}



