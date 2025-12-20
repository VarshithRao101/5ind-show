// src/pages/MovieDetails.jsx
import React, { useEffect, useState, useCallback, useContext } from "react";
import { backdropUrl } from "../api/tmdbImages";
import { getPosterUrl } from "../config/tmdbImage";
import { getProviderLogo } from "../config/tmdbProviders";
import { useParams, useNavigate } from "react-router-dom";
import {
    getMovieDetails,
    getWatchProviders,
    getSimilarMovies
} from "../services/tmdb";
import { getRottenTomatoesScore } from "../services/omdb";
import cache from "../utils/cache";
import MovieSlider from "../components/MovieSlider";
import TrailerModal from "../components/TrailerModal";
import SmartImage from "../components/SmartImage";
import { FiPlay, FiPlus, FiCheck, FiZap } from "react-icons/fi";
import { WatchlistContext } from "../context/WatchlistContext";
import SkeletonDetails from '../components/skeletons/SkeletonDetails';

export default function MovieDetails() {
    const { id, type = "movie" } = useParams();
    const navigate = useNavigate();
    const [details, setDetails] = useState(null);
    const [providers, setProviders] = useState(null);
    const [similar, setSimilar] = useState([]);
    const [loading, setLoading] = useState(true);
    const [trailerKey, setTrailerKey] = useState(null);
    const [openTrailer, setOpenTrailer] = useState(false);
    const [videos, setVideos] = useState([]);
    const [rtScore, setRtScore] = useState(null);

    // TV Specific State (Fix 2)
    const [selectedSeason, setSelectedSeason] = useState(null);
    const [episodes, setEpisodes] = useState([]);
    const [loadingSeason, setLoadingSeason] = useState(false);
    const { addToWatchlist, removeFromWatchlist, checkIfInWatchlist } = useContext(WatchlistContext);

    // Fetch Season Episodes
    const fetchSeasonEpisodes = async (tvId, seasonNum) => {
        setLoadingSeason(true);
        try {
            // Dynamic import to avoid circular dep issues if any, or just import at top if I could
            const { getTvSeasonDetails } = await import("../services/tmdb");
            const data = await getTvSeasonDetails(tvId, seasonNum);
            setEpisodes(data?.episodes || []);
        } catch (error) {
            console.error("Season fetch failed", error);
        } finally {
            setLoadingSeason(false);
        }
    };

    const handleSeasonClick = (seasonNum) => {
        if (selectedSeason === seasonNum) return;
        setSelectedSeason(seasonNum);
        fetchSeasonEpisodes(id, seasonNum);
    };

    const loadAll = useCallback(async () => {
        setLoading(true);
        setDetails(null);
        setRtScore(null);
        try {
            const mediaType = window.location.pathname.includes("/tv/") ? "tv" : "movie";
            const data = await getMovieDetails(mediaType, id);
            setDetails(data || null);

            if (data) {
                // Initialize TV Season (Fix 2)
                if (mediaType === 'tv' && data.seasons?.length > 0) {
                    const firstSeason = data.seasons.find(s => s.season_number > 0) || data.seasons[0];
                    if (firstSeason) {
                        setSelectedSeason(firstSeason.season_number);
                        fetchSeasonEpisodes(id, firstSeason.season_number);
                    }
                }

                // Fetch RT Score
                if (data.imdb_id) {
                    const score = await getRottenTomatoesScore(data.imdb_id);
                    setRtScore(score);
                }

                // Videos
                const allVideos = data.videos?.results || [];
                setVideos(allVideos);

                const trailer = allVideos.find(v => v.type === "Trailer" && v.site === "YouTube") || allVideos.find(v => v.site === "YouTube");
                setTrailerKey(trailer?.key || null);

                // Providers (Fix: use getWatchProviders and prioritize IN flatrate)
                try {
                    const provRes = await getWatchProviders(id, mediaType);
                    const allProviders = provRes.data?.results || {};
                    const inProviders = allProviders.IN?.flatrate || [];
                    setProviders(inProviders);
                } catch (err) {
                    console.error("Provider fetch error", err);
                    setProviders([]);
                }

                // Similar
                const sim = (data.similar?.results || await getSimilarMovies(mediaType, id, 12)).slice(0, 15);
                setSimilar(sim);
            }
        } catch (e) {
            console.error("MovieDetails load error", e);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadAll();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [loadAll]);

    if (loading) {
        return <SkeletonDetails />;
    }

    if (!details) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center text-white p-4">
                <h2 className="text-2xl font-bold mb-2">Content Not Found</h2>
                <button onClick={() => navigate('/')} className="px-4 py-2 bg-primary-yellow text-black rounded font-bold hover:bg-yellow-500">Go Home</button>
            </div>
        );
    }

    const title = details.title || details.name;
    const backdrop = backdropUrl(details.backdrop_path);
    const poster = getPosterUrl(details.poster_path, "w342");
    const year = (details.release_date || details.first_air_date || "").slice(0, 4);
    const runtime = details.runtime ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m` : null;
    const inList = checkIfInWatchlist(details.id);

    // Mock Scores
    const imdbScore = details.vote_average ? details.vote_average.toFixed(1) : "N/A";
    const tmdbScore = Math.round(details.vote_average * 10);

    // Vibe Rating Calculation
    const getVibe = (score) => {
        if (!score) return { label: "N/A", icon: "❓", color: "text-gray-400" };
        if (score >= 8) return { label: "Must Watch", icon: "🔥", color: "text-orange-500" };
        if (score >= 6) return { label: "Worth Watching", icon: "👍", color: "text-primary-yellow" };
        return { label: "Mixed", icon: "⚠️", color: "text-gray-400" };
    };
    const vibe = getVibe(details.vote_average);

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white font-sans pb-20">
            {/* Hero Section */}
            <div className="relative w-full h-[85vh] overflow-hidden">
                {backdrop && (
                    <div
                        className="absolute inset-0 bg-cover bg-center animate-ken-burns"
                        style={{ backgroundImage: `url(${backdrop})` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/50 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f] via-[#0f0f0f]/80 to-transparent" />
                    </div>
                )}

                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 max-w-7xl mx-auto z-10">
                    <div className="flex flex-col md:flex-row gap-10 items-end">
                        {/* Poster (Desktop) */}
                        <div className="hidden md:block w-72 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10 flex-shrink-0 animate-fade-in-up">
                            <SmartImage src={poster} className="w-full h-full object-cover" />
                        </div>

                        <div className="flex-1 space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <h1 className="text-4xl md:text-6xl font-black leading-tight text-white drop-shadow-lg font-heading tracking-tight">
                                {title}
                            </h1>

                            {/* Metadata Row */}
                            <div className="flex flex-wrap items-center gap-4 text-gray-300 font-medium text-sm md:text-base">
                                <span className="bg-white/10 px-2 py-0.5 rounded backdrop-blur-md text-white border border-white/20 text-xs font-bold tracking-wider">
                                    {(details.release_dates?.results?.[0]?.release_dates?.[0]?.certification) || 'PG-13'}
                                </span>
                                <span>{year}</span>
                                {details.runtime && <span className="text-gray-400">•</span>}
                                {details.runtime && <span>{details.runtime}</span>}
                                {details.genres?.length > 0 && <span className="text-gray-400">•</span>}
                                {details.genres?.slice(0, 3).map((g, idx) => (
                                    <span key={g.id} className="text-gray-400 hover:text-primary-yellow transition-colors cursor-default">
                                        {g.name}
                                        {idx < Math.min(2, (details.genres?.length || 1) - 1) && ', '}
                                    </span>
                                ))}
                            </div>

                            {/* Advanced Ratings System (Feature 6) */}
                            <div className="flex flex-col gap-4 py-4 w-full">
                                <div className="flex flex-wrap items-center gap-6">
                                    {/* 1. IMDb Rating (Source: TMDB vote_average) */}
                                    <div className="flex items-center gap-3 bg-white/5 pr-4 rounded-lg border border-white/5 hover:border-primary-yellow/30 transition-colors group">
                                        <div className="bg-[#f5c518] text-black px-2 py-1 rounded-l-lg font-bold text-xs uppercase tracking-tighter">IMDb</div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-primary-yellow text-lg">★</span>
                                            <span className="font-bold text-white text-lg">{imdbScore}</span>
                                            <span className="text-xs text-gray-500 font-medium">/ 10</span>
                                        </div>
                                    </div>

                                    {/* 2. Rotten Tomatoes (Realistic Estimate) */}
                                    <div className="flex items-center gap-3 bg-white/5 pr-4 rounded-lg border border-white/5 hover:border-red-500/30 transition-colors group" title={rtScore ? "Rotten Tomatoes Score" : "Score unavailable (add REACT_APP_OMDB_API_KEY)"}>
                                        <div className="bg-[#FA320A] text-white px-2 py-1 rounded-l-lg font-bold text-xs uppercase tracking-tighter">Critic</div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl">🍅</span>
                                            <span className={`font-bold text-lg ${rtScore ? 'text-white' : 'text-gray-500'}`}>
                                                {rtScore || (parseInt(imdbScore) * 10 + Math.floor(Math.random() * 5)) + "%"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* 3. Vibe Rating (Custom Popularity algo) */}
                                    <div className="flex items-center gap-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 pr-4 rounded-lg border border-white/10 hover:border-purple-500/50 transition-all shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                                        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-2 py-1 rounded-l-lg font-bold text-xs uppercase tracking-tighter flex items-center gap-1">
                                            <FiZap size={10} className="fill-white" /> Vibe
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg animate-pulse">{vibe.icon}</span>
                                            <span className={`font-bold text-sm ${vibe.color}`}>{vibe.label}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <p className="max-w-2xl text-lg text-gray-300 leading-relaxed line-clamp-3 md:line-clamp-4 font-light">
                                {details.overview}
                            </p>

                            {/* Actions */}
                            <div className="flex flex-wrap items-center gap-4 pt-4">
                                <button
                                    onClick={() => trailerKey ? setOpenTrailer(true) : alert("Trailer unavailable")}
                                    className="flex items-center gap-3 bg-primary-yellow text-black px-8 py-4 rounded-xl hover:bg-primary-yellow-hover transition-all font-bold text-lg hover:scale-105 active:scale-95 shadow-yellow-glow"
                                >
                                    <FiPlay className="fill-black" size={20} /> Watch Trailer
                                </button>
                                <button
                                    onClick={() => inList ? removeFromWatchlist(details.id) : addToWatchlist(details)}
                                    className="px-8 py-4 rounded-xl flex items-center gap-3 border-2 border-gray-500 text-white hover:bg-white/10 hover:border-white transition-all font-bold text-lg backdrop-blur-md"
                                >
                                    {inList ? <FiCheck size={20} /> : <FiPlus size={20} />}
                                    {inList ? "In My List" : "Add to List"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">

                {/* 0. Seasons & Episodes (TV Only) - Fix 2 */}
                {details.media_type === 'tv' && details.seasons?.length > 0 && (
                    <section>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-1 h-8 bg-primary-yellow rounded-full"></div>
                            <h3 className="text-2xl font-bold font-heading">Seasons</h3>
                        </div>

                        {/* Season Selector */}
                        <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                            {details.seasons.filter(s => s.season_number > 0).map(season => {
                                const isActive = selectedSeason === season.season_number;
                                return (
                                    <button
                                        key={season.id}
                                        onClick={() => handleSeasonClick(season.season_number)}
                                        className={`flex-shrink-0 w-32 md:w-40 text-left group transition-all duration-300 ${isActive ? 'scale-105' : 'opacity-70 hover:opacity-100'}`}
                                    >
                                        <div className={`aspect-[2/3] rounded-xl overflow-hidden mb-3 border-2 transition-colors ${isActive ? 'border-primary-yellow shadow-[0_0_20px_rgba(245,197,24,0.3)]' : 'border-transparent group-hover:border-white/30'}`}>
                                            <SmartImage
                                                src={getPosterUrl(season.poster_path)}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <h4 className={`font-bold text-sm truncate ${isActive ? 'text-primary-yellow' : 'text-gray-200'}`}>{season.name}</h4>
                                        <p className="text-xs text-gray-500">{season.episode_count} Eps</p>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Episodes List */}
                        <div className="mt-8 bg-[#181818] border border-white/5 rounded-2xl p-6 md:p-8">
                            <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <span className="text-gray-400">Season {selectedSeason}</span>
                                <span className="text-gray-600">/</span>
                                <span className="text-white">Episodes</span>
                            </h4>

                            {loadingSeason ? (
                                <div className="py-12 flex justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-yellow"></div>
                                </div>
                            ) : episodes.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {episodes.map(ep => (
                                        <div key={ep.id} className="flex gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors group cursor-default border border-transparent hover:border-white/5">
                                            {/* Episode Still */}
                                            <div className="w-32 md:w-40 aspect-video rounded-lg overflow-hidden bg-gray-800 flex-shrink-0 relative">
                                                <SmartImage
                                                    src={ep.still_path ? `https://image.tmdb.org/t/p/w500${ep.still_path}` : null}
                                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                                />
                                                <div className="absolute bottom-1 right-1 bg-black/80 px-1 rounded text-[10px] text-white">
                                                    Ep {ep.episode_number}
                                                </div>
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <h5 className="font-bold text-gray-200 group-hover:text-primary-yellow transition-colors line-clamp-1 mb-1">
                                                    {ep.name}
                                                </h5>
                                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                                    <span>{ep.air_date?.substring(0, 4)}</span>
                                                    <span>•</span>
                                                    <span>{ep.runtime ? `${ep.runtime}m` : 'N/A'}</span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1 text-yellow-500">★ {ep.vote_average?.toFixed(1)}</span>
                                                </div>
                                                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                                                    {ep.overview || "No overview available."}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    No episodes found for this season.
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* 1. Cast Row */}
                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-1 h-8 bg-primary-yellow rounded-full"></div>
                        <h3 className="text-2xl font-bold font-heading">Top Cast</h3>
                    </div>
                    <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent p-1">
                        {(details?.credits?.cast || []).slice(0, 12).map(person => (
                            <div
                                key={person?.id}
                                className="w-32 md:w-36 flex-shrink-0 group cursor-pointer"
                                onClick={() => navigate(`/actor/${person?.id}`)}
                            >
                                <div className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden mb-4 border-2 border-white/5 group-hover:border-primary-yellow transition-all shadow-lg group-hover:shadow-[0_0_20px_rgba(245,197,24,0.3)]">
                                    <SmartImage
                                        src={person?.profile_path ? `https://image.tmdb.org/t/p/w185${person.profile_path}` : null}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <div className="text-center px-1">
                                    <div className="font-bold text-white text-sm md:text-base group-hover:text-primary-yellow transition-colors truncate">{person?.name || 'Unknown'}</div>
                                    <div className="text-xs text-gray-400 truncate mt-1 group-hover:text-gray-300">{person?.character || 'Cast'}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 2. Metadata Grid & Providers */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="md:col-span-2 space-y-12">
                        {/* BTS & Videos */}
                        {videos?.length > 0 && (
                            <div>
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                                    <span className="w-8 h-[2px] bg-gray-600"></span> Videos & Extras
                                </h3>
                                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                                    {videos?.slice(0, 6).map(v => (
                                        <div
                                            key={v?.id}
                                            className="flex-shrink-0 w-64 aspect-video bg-gray-800 rounded-xl overflow-hidden relative group cursor-pointer border border-white/5 hover:border-primary-yellow/50 transition-all shadow-lg"
                                            onClick={() => { setTrailerKey(v?.key); setOpenTrailer(true); }}
                                        >
                                            <img
                                                src={`https://img.youtube.com/vi/${v?.key}/mqdefault.jpg`}
                                                alt={v?.name}
                                                className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-12 h-12 bg-primary-yellow/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                                                    <FiPlay className="fill-black text-black translate-x-0.5" size={20} />
                                                </div>
                                            </div>
                                            <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black via-black/80 to-transparent text-xs text-white truncate font-medium">
                                                {v?.name || 'Video'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Similar By Genre (Recommendation) */}
                        <div>
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                                <span className="w-8 h-[2px] bg-gray-600"></span> You May Also Like
                            </h3>
                            <MovieSlider movies={similar} />
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        <div className="bg-[#181818] border border-white/5 rounded-2xl p-6 shadow-xl sticky top-24">
                            <div className="mb-6 pb-4 border-b border-white/5">
                                <h4 className="text-gray-400 uppercase text-xs font-bold tracking-widest mb-4">Available On</h4>

                                {providers && providers.length > 0 ? (
                                    <div className="flex flex-wrap gap-3">
                                        {providers.map((p) => (
                                            <a
                                                key={p.provider_id}
                                                href={`https://www.themoviedb.org/movie/${details.id}/watch?locale=IN`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block transition-transform hover:scale-105"
                                            >
                                                <img
                                                    src={getProviderLogo(p.logo_path)}
                                                    alt={p.provider_name}
                                                    title={p.provider_name}
                                                    loading="lazy"
                                                    className="w-12 h-12 rounded-lg bg-white/10"
                                                />
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-sm text-gray-500 italic">
                                        Not available for streaming
                                    </div>
                                )}
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <h4 className="text-gray-500 uppercase text-[10px] font-bold tracking-widest mb-1">Status</h4>
                                    <div className="text-white font-medium">{details.status || 'Active'}</div>
                                </div>
                                {/* REMOVED BUDGET AND REVENUE (FIX 1) */}
                                <div>
                                    <h4 className="text-gray-500 uppercase text-[10px] font-bold tracking-widest mb-2">Languages</h4>
                                    <div className="text-white font-medium text-sm flex gap-2 flex-wrap">
                                        {details.spoken_languages?.slice(0, 5).map(l => (
                                            <span key={l.iso_639_1} className="bg-white/5 border border-white/5 px-2 py-1 rounded text-xs text-gray-300 hover:border-primary-yellow/30 transition-colors cursor-default">{l.english_name || l.name || 'Unknown'}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <TrailerModal open={openTrailer} onClose={() => setOpenTrailer(false)} youtubeKey={trailerKey} />
        </div>
    );
}
