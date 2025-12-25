import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiImage } from "react-icons/fi";
import { getPersonDetailsFull } from "../services/tmdb";
import MovieCard from "../components/MovieCard";

export default function ActorPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [actor, setActor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let active = true;
        async function fetchData() {
            setLoading(true);
            try {
                // This fetches details + combined_credits in one go
                const data = await getPersonDetailsFull(id);
                if (!active) return;

                if (!data) throw new Error("Actor not found");
                setActor(data);
            } catch (err) {
                if (active) {
                    console.error(err);
                    setError(`Failed to load actor ID ${id}: ${err.message || "Unknown Error"}`);
                }
            } finally {
                if (active) setLoading(false);
            }
        }
        fetchData();
        return () => { active = false; };
    }, [id]);

    // ACTOR PAGE POLISHED + SHUFFLE FIX APPLIED
    // Separate Credits & Sorting
    const { movieCredits, tvCredits } = useMemo(() => {
        if (!actor?.combined_credits?.cast) return { movieCredits: [], tvCredits: [] };

        const all = [...actor.combined_credits.cast].filter(
            item => (item.title || item.name) && (item.poster_path) // Strict: must have poster for this polished UI
        );

        // Sort by Popularity
        all.sort((a, b) => b.popularity - a.popularity);

        // Dedupe
        const unique = [];
        const seen = new Set();
        for (const item of all) {
            if (!seen.has(item.id)) {
                seen.add(item.id);
                unique.push(item);
            }
        }

        const movies = unique.filter(i => i.media_type === 'movie').slice(0, 20); // Limit 20
        const tv = unique.filter(i => i.media_type === 'tv').slice(0, 20); // Limit 20

        return { movieCredits: movies, tvCredits: tv };
    }, [actor]);


    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary-yellow border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !actor) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col items-center justify-center">
                <p className="text-red-500 mb-4">{error || "Actor not found"}</p>
                <button onClick={() => window.location.reload()} className="text-primary-yellow underline">Try refresh</button>
            </div>
        );
    }

    const profilePath = actor.profile_path
        ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` // Optimized size
        : null;

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white">
            <button
                onClick={() => navigate(-1)}
                className="fixed top-4 left-4 z-50 p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black/70 transition-colors border border-white/10"
            >
                <FiArrowLeft size={24} />
            </button>

            {/* HERO HEADER */}
            <div className="relative w-full bg-gradient-to-b from-[#1f1f1f] to-[#0f0f0f] pt-28 pb-10 px-4 flex flex-col items-center text-center shadow-xl">
                <div className="w-32 h-32 md:w-44 md:h-44 rounded-full p-1 bg-gradient-to-br from-primary-yellow to-gray-800 shadow-2xl mb-4">
                    <div className="w-full h-full rounded-full overflow-hidden bg-[#121212]">
                        {profilePath ? (
                            <img
                                src={profilePath}
                                alt={actor.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        ) : (
                            <img
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(actor.name)}&background=2a2a2a&color=fff`}
                                alt={actor.name}
                                className="w-full h-full object-cover opacity-70"
                            />
                        )}
                    </div>
                </div>

                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-2">
                    {actor.name}
                </h1>
                <p className="text-primary-yellow font-medium uppercase text-xs tracking-widest bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                    {actor.known_for_department}
                </p>
                {actor.place_of_birth && (
                    <p className="text-gray-500 text-xs mt-3 flex items-center gap-1">
                        {actor.place_of_birth}
                    </p>
                )}
            </div>

            {/* CONTENT AREA */}
            <div className="max-w-7xl mx-auto px-4 pb-20 space-y-12">

                {/* Movies Section */}
                {movieCredits.length > 0 && (
                    <section>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-primary-yellow rounded-full"></span>
                            Movies
                        </h3>
                        {/* Desktop: Horizontal | Mobile: Grid (Vertical Vertical) */}
                        <div className="flex overflow-x-auto md:grid md:grid-cols-5 lg:grid-cols-6 gap-4 pb-4 md:pb-0 no-scrollbar snap-x snap-mandatory">
                            {movieCredits.map(item => (
                                <div key={`movie-${item.id}`} className="min-w-[140px] md:min-w-0 snap-start">
                                    <MovieCard
                                        id={item.id}
                                        title={item.title}
                                        posterPath={item.poster_path}
                                        year={(item.release_date || "").substring(0, 4)}
                                        rating={item.vote_average?.toFixed(1) || "N/A"}
                                        genre="Movie"
                                        onNavigate={() => navigate(`/movie/${item.id}`)}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* TV Section */}
                {tvCredits.length > 0 && (
                    <section>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-gray-600 rounded-full"></span>
                            TV Series
                        </h3>
                        <div className="flex overflow-x-auto md:grid md:grid-cols-5 lg:grid-cols-6 gap-4 pb-4 md:pb-0 no-scrollbar snap-x snap-mandatory">
                            {tvCredits.map(item => (
                                <div key={`tv-${item.id}`} className="min-w-[140px] md:min-w-0 snap-start">
                                    <MovieCard
                                        id={item.id}
                                        title={item.name}
                                        posterPath={item.poster_path}
                                        year={(item.first_air_date || "").substring(0, 4)}
                                        rating={item.vote_average?.toFixed(1) || "N/A"}
                                        genre="TV"
                                        onNavigate={() => navigate(`/series/${item.id}`)}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {movieCredits.length === 0 && tvCredits.length === 0 && (
                    <div className="text-center text-gray-500 py-10">
                        <p>No filmography available.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
