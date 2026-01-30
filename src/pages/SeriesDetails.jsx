// SERIES PAGE STRUCTURED LIKE MOVIE DETAILS (3-COLUMN)
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiStar, FiClock, FiActivity, FiUser } from 'react-icons/fi';
import {
    getTvDetails,
    getSeasonDetails,
    getWatchProviders,
    getSimilarSeries,
    getSeriesCredits,
    POSTER_BASE
} from '../services/tmdb';
import MovieCard from '../components/MovieCard';
// import { isMobileDevice } from '../utils/isMobile';

const SeriesDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    // const isMobile = isMobileDevice();

    const [details, setDetails] = useState(null);
    const [selectedSeason, setSelectedSeason] = useState(1);
    const [episodes, setEpisodes] = useState([]);
    const [providers, setProviders] = useState(null);
    const [similar, setSimilar] = useState([]);
    const [cast, setCast] = useState([]);

    // Loading States
    const [loadingDetails, setLoadingDetails] = useState(true);
    const [loadingEpisodes, setLoadingEpisodes] = useState(false);
    const [error, setError] = useState(null);

    // Ref for scrolling to episodes on season change (mobile optimized)
    const episodesRef = useRef(null);

    // 1. Initial Load: Series Info
    useEffect(() => {
        let active = true;
        async function loadSeries() {
            setLoadingDetails(true);
            try {
                const data = await getTvDetails(id);
                if (!active) return;
                if (!data) throw new Error("Series not found");

                setDetails(data);
                // Auto-select first available season (usually 1)
                const firstSeason = data.seasons?.find(s => s.season_number > 0) || data.seasons?.[0];
                if (firstSeason) setSelectedSeason(firstSeason.season_number);
            } catch (err) {
                if (active) setError(err.message);
            } finally {
                if (active) setLoadingDetails(false);
            }
        }
        loadSeries();
        return () => { active = false; };
    }, [id]);

    // 2. Auxiliary Data (Providers, Similar, Cast)
    useEffect(() => {
        let active = true;
        async function loadAux() {
            if (!id) return;
            try {
                const [provRes, simRes, castRes] = await Promise.all([
                    getWatchProviders(id, 'tv'),
                    getSimilarSeries(id),
                    getSeriesCredits(id)
                ]);

                if (!active) return;

                // Providers
                const provData = provRes.data?.results?.IN || provRes.data?.results?.US || null;
                setProviders(provData);

                // Similar
                setSimilar((simRes.data?.results || []).slice(0, 12));

                // Cast
                setCast((castRes.data?.cast || []).slice(0, 15));

            } catch (e) {
                console.warn("Aux fetch failed", e);
            }
        }
        loadAux();
        return () => { active = false; };
    }, [id]);

    // 3. On Season Change: Fetch Episodes
    useEffect(() => {
        if (!details) return;

        let active = true;
        async function loadSeason() {
            setLoadingEpisodes(true);
            try {
                const seasonData = await getSeasonDetails(id, selectedSeason);
                if (!active) return;
                setEpisodes(seasonData?.episodes || []);
            } catch (err) {
                console.error("Failed to load season", err);
                if (active) setEpisodes([]);
            } finally {
                if (active) setLoadingEpisodes(false);
            }
        }
        loadSeason();
        return () => { active = false; };
    }, [id, selectedSeason, details]);

    if (loadingDetails) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary-yellow border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !details) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col items-center justify-center gap-4">
                <p className="text-red-500">{error || "Series not found"}</p>
                <button onClick={() => navigate(-1)} className="text-primary-yellow underline">Go Back</button>
            </div>
        );
    }

    const backdrop = details.backdrop_path
        ? `https://image.tmdb.org/t/p/w1280${details.backdrop_path}`
        : null;

    // Derived Metadata
    const languages = [
        details.original_language?.toUpperCase(),
        ...(details.spoken_languages || []).map(l => l.english_name || l.name)
    ].filter(Boolean);
    const uniqueLanguages = [...new Set(languages)].slice(0, 5);

    const genres = (details.genres || []).map(g => g.name || g).slice(0, 3);

    // Combine providers
    const allProviders = [
        ...(providers?.flatrate || []),
        ...(providers?.rent || []),
        ...(providers?.buy || [])
    ].reduce((acc, curr) => {
        if (!acc.find(p => p.provider_id === curr.provider_id)) acc.push(curr);
        return acc;
    }, []);

    // Active Season Info
    const activeSeasonObj = details.seasons?.find(s => s.season_number === selectedSeason);

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white pb-20">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="fixed top-4 left-4 z-50 p-3 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black/80 transition-all border border-white/10"
            >
                <FiArrowLeft size={24} />
            </button>

            {/* ==================================================================================
               SECTION 1: HERO (MATCH MOVIE PAGE)
               ================================================================================== */}
            <div className="relative w-full aspect-[16/9] md:aspect-[3/1] max-h-[500px]">
                {backdrop ? (
                    <img
                        src={backdrop}
                        alt="Backdrop"
                        className="w-full h-full object-cover opacity-40 mask-image-gradient"
                    />
                ) : (
                    <div className="w-full h-full bg-[#1a1a1a]" />
                )}
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f] via-[#0f0f0f]/30 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-12 flex items-end gap-8 max-w-7xl mx-auto z-10">
                    {/* Poster */}
                    <img
                        src={details.poster_path ? `https://image.tmdb.org/t/p/w500${details.poster_path}` : "/placeholder-poster.png"}
                        alt={details.name}
                        className="hidden md:block w-[200px] rounded-xl shadow-2xl border border-white/10"
                    />

                    <div className="flex-1 mb-2">
                        <h1 className="text-3xl md:text-6xl font-black mb-4 leading-tight drop-shadow-lg">{details.name}</h1>

                        {/* Rating & Simple Metadata */}
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm md:text-base text-gray-200 font-medium mb-4">
                            <span className="flex items-center gap-1 text-primary-yellow font-bold">
                                <FiStar fill="currentColor" /> {details.vote_average?.toFixed(1)} <span className="text-gray-400 font-normal">({details.vote_count})</span>
                            </span>
                            <span>{details.first_air_date?.substring(0, 4)}</span>
                            <span>{details.number_of_seasons} Seasons</span>
                            <span className="px-2 py-0.5 border border-white/20 rounded text-xs uppercase">{details.status}</span>
                        </div>

                        {/* Overview (Short) */}
                        <p className="hidden md:block text-gray-300 leading-relaxed max-w-3xl line-clamp-3 mb-6">
                            {details.overview}
                        </p>
                    </div>
                </div>
            </div>

            {/* ==================================================================================
               SECTION 2: MAIN 3-COLUMN BODY
               ================================================================================== */}
            <div className="max-w-7xl mx-auto px-4 mt-8 md:mt-12">
                <div className="flex flex-col lg:grid lg:grid-cols-[220px_1fr_300px] gap-8">

                    {/* --- LEFT COLUMN: SEASONS --- */}
                    <div className="order-2 lg:order-1">
                        <h3 className="text-lg font-bold mb-4 sticky top-0 bg-[#0f0f0f] py-2 z-10">Seasons</h3>

                        {/* Mobile: Horizontal Scroll Chips */}
                        <div className="lg:hidden flex overflow-x-auto gap-2 pb-4 no-scrollbar mb-4">
                            {details.seasons?.filter(s => s.season_number > 0).map(season => (
                                <button
                                    key={season.id}
                                    onClick={() => setSelectedSeason(season.season_number)}
                                    className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all border ${selectedSeason === season.season_number
                                        ? "bg-primary-yellow text-black border-primary-yellow"
                                        : "bg-[#1f1f1f] text-gray-400 border-white/10"
                                        }`}
                                >
                                    Season {season.season_number}
                                </button>
                            ))}
                        </div>

                        {/* Desktop: Vertical List */}
                        <div className="hidden lg:flex flex-col gap-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            {details.seasons?.filter(s => s.season_number > 0).map(season => (
                                <button
                                    key={season.id}
                                    onClick={() => setSelectedSeason(season.season_number)}
                                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${selectedSeason === season.season_number
                                        ? "bg-primary-yellow text-black shadow-lg shadow-yellow-500/10"
                                        : "bg-[#1a1a1a] text-gray-400 hover:bg-[#252525] border border-transparent hover:border-white/5"
                                        }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <span>Season {season.season_number}</span>
                                        {season.episode_count > 0 && (
                                            <span className="text-xs opacity-60 bg-black/20 px-1.5 py-0.5 rounded">{season.episode_count} eps</span>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* --- CENTER COLUMN: EPISODES --- */}
                    <div className="order-3 lg:order-2 min-h-[500px]" ref={episodesRef}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold">
                                {activeSeasonObj?.name || `Season ${selectedSeason}`}
                            </h3>
                            <span className="text-xs text-gray-500">{episodes.length} Episodes</span>
                        </div>

                        <div className="space-y-4">
                            {loadingEpisodes ? (
                                Array(5).fill(0).map((_, i) => (
                                    <div key={i} className="h-32 bg-[#1a1a1a] rounded-xl animate-pulse" />
                                ))
                            ) : episodes.length > 0 ? (
                                episodes.map(ep => (
                                    <div
                                        key={ep.id}
                                        className="bg-[#1a1a1a] rounded-xl p-4 md:p-5 border border-white/5 hover:border-white/10 transition-colors group relative overflow-hidden"
                                    >
                                        <div className="flex gap-4">
                                            {/* Episode Number */}
                                            <div className="text-2xl font-black text-white/10 group-hover:text-primary-yellow/20 transition-colors">
                                                {ep.episode_number.toString().padStart(2, '0')}
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                                                    <h4 className="text-base font-bold text-gray-100 group-hover:text-primary-yellow transition-colors">
                                                        {ep.name}
                                                    </h4>
                                                    {ep.runtime && (
                                                        <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
                                                            <FiClock /> {ep.runtime}m
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-400 line-clamp-2 md:line-clamp-3 leading-relaxed">
                                                    {ep.overview || "No description available."}
                                                </p>
                                                <div className="mt-3 text-xs text-gray-600 font-medium">
                                                    Aired: {ep.air_date}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-gray-500 bg-[#1a1a1a] rounded-xl border border-dashed border-white/10">
                                    No episodes found.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN: INFO PANEL --- */}
                    <div className="order-1 lg:order-3 space-y-8">
                        {/* Mobile Overview (Was hidden in hero on desktop) */}
                        <div className="lg:hidden">
                            <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Synopsis</h3>
                            <p className="text-gray-300 leading-relaxed text-sm">{details.overview}</p>
                        </div>

                        {/* Available On */}
                        {allProviders.length > 0 && (
                            <div className="bg-[#1a1a1a] p-5 rounded-xl border border-white/5">
                                <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">Available On</h3>
                                <div className="flex flex-wrap gap-3">
                                    {allProviders.map(p => (
                                        <a
                                            key={p.provider_id}
                                            href={providers.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 hover:border-primary-yellow transition-all hover:scale-105"
                                            title={p.provider_name}
                                        >
                                            <img
                                                src={`https://image.tmdb.org/t/p/original${p.logo_path}`}
                                                alt={p.provider_name}
                                                className="w-full h-full object-cover"
                                            />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Metadata Block */}
                        <div className="space-y-6">
                            {genres.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Genres</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {genres.map(g => (
                                            <span key={g} className="text-xs font-medium bg-white/5 px-2 py-1 rounded text-gray-300 border border-white/5">{g}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {uniqueLanguages.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Languages</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {uniqueLanguages.map(l => (
                                            <span key={l} className="text-xs font-medium text-gray-400 flex items-center gap-1">
                                                <FiActivity size={10} className="text-primary-yellow" /> {l}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ==================================================================================
                   SECTION 3: CAST
                   ================================================================================== */}
                {cast.length > 0 && (
                    <div className="mt-16 border-t border-white/5 pt-8">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <span className="w-1 h-6 bg-primary-yellow rounded-full"></span>
                            Top Cast
                        </h3>
                        <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar">
                            {cast.map(actor => (
                                <div
                                    key={actor.id}
                                    className="min-w-[120px] w-[120px] cursor-pointer group"
                                    onClick={() => navigate(`/actor/${actor.id}`)}
                                >
                                    <div className="w-full aspect-[2/3] rounded-xl overflow-hidden mb-2 bg-[#1a1a1a] shadow-lg border border-white/5 group-hover:border-primary-yellow/50 transition-colors">
                                        {actor.profile_path ? (
                                            <img
                                                src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                                                alt={actor.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-600">
                                                <FiUser />
                                            </div>
                                        )}
                                    </div>
                                    <h4 className="text-sm font-bold text-white truncate group-hover:text-primary-yellow transition-colors">{actor.name}</h4>
                                    <p className="text-xs text-gray-500 truncate">{actor.character}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ==================================================================================
                   SECTION 4: SIMILAR SERIES
                   ================================================================================== */}
                {similar.length > 0 && (
                    <div className="mt-12 pb-20">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <span className="w-1 h-6 bg-gray-600 rounded-full"></span>
                            Similar Series
                        </h3>
                        <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar snap-x snap-mandatory">
                            {similar.map(item => (
                                <div key={item.id} className="min-w-[150px] md:min-w-[180px] snap-start">
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
                    </div>
                )}

            </div>
        </div>
    );
};

export default SeriesDetails;
