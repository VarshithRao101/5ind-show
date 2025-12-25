// src/pages/SeriesPage.jsx
import React, { useEffect, useState, useCallback, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    getTvDetails,
    getSeasonDetails,
    getEpisodeDetails,
    getProviders,
    getCredits,
    getSimilarSeries
} from "../services/tmdb";
import { getPoster } from "../utils/poster";
import TrailerModal from "../components/TrailerModal";
import EpisodeCard from "../components/EpisodeCard";
import MovieCard from "../components/MovieCard";
import { FiPlay, FiPlus, FiCheck } from "react-icons/fi";
import { WatchlistContext } from "../context/WatchlistContext";

export default function SeriesPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useContext(WatchlistContext);

    const [tv, setTv] = useState(null);
    const [selectedSeasonNumber, setSelectedSeasonNumber] = useState(null);
    const [seasonData, setSeasonData] = useState(null);
    const [episodes, setEpisodes] = useState([]);

    // Loading States
    const [loading, setLoading] = useState(true); // Initial Page Load
    const [seasonLoading, setSeasonLoading] = useState(false); // Season Switching

    const [trailerKey, setTrailerKey] = useState(null);
    const [openTrailer, setOpenTrailer] = useState(false);
    const [providers, setProviders] = useState(null);
    const [cast, setCast] = useState([]);
    const [similar, setSimilar] = useState([]);

    // 1. Initial Load: Fetch Series Overview + Metadata
    useEffect(() => {
        let mounted = true;
        setLoading(true);

        const loadInit = async () => {
            try {
                // Guarded Fetches
                const fetchTv = getTvDetails(id).catch(e => { console.error("TV Fail", e); return null; });
                const fetchProv = getProviders("tv", id, "IN").catch(e => { console.error("Prov Fail", e); return null; });
                const fetchCredits = getCredits("tv", id).catch(e => { console.error("Credits Fail", e); return { cast: [] }; });
                const fetchSimilar = getSimilarSeries(id).catch(e => { console.error("Similar Fail", e); return { data: { results: [] } }; });

                // Parallel Wait
                const [tvData, provData, creditsData, similarData] = await Promise.all([fetchTv, fetchProv, fetchCredits, fetchSimilar]);

                if (mounted) {
                    if (tvData) {
                        console.log("Series loaded:", tvData.name);
                        setTv(tvData);

                        const allProviders = tvData['watch/providers']?.results || {};
                        const flatrateProviders = allProviders.IN?.flatrate || allProviders.US?.flatrate || [];
                        setProviders(flatrateProviders);

                        setCast(creditsData?.cast?.slice(0, 15) || []);
                        setSimilar(similarData?.data?.results?.slice(0, 12) || []);

                        // Determine default season
                        const validSeasons = tvData.seasons?.filter(s => s.season_number > 0) || [];
                        const initialSeason = validSeasons.length > 0 ? validSeasons[0].season_number : (tvData.seasons?.[0]?.season_number || 1);

                        setSelectedSeasonNumber(initialSeason);
                    } else {
                        console.warn("Series data missing for ID:", id);
                        setTv(null);
                    }
                }
            } catch (error) {
                console.error("Failed to load series:", error);
                if (mounted) setTv(null);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        loadInit();
        window.scrollTo(0, 0);
        return () => {
            mounted = false;
        };
    }, [id]);

    // 2. Season Switching: Fetch Episodes Only
    useEffect(() => {
        if (!tv || selectedSeasonNumber === null) return;

        let mounted = true;
        setSeasonLoading(true);
        setEpisodes([]);

        const loadSeason = async () => {
            try {
                const sData = await getSeasonDetails(id, selectedSeasonNumber);
                if (mounted) {
                    setSeasonData(sData);
                    setEpisodes(sData?.episodes || []);
                }
            } catch (e) {
                console.error("Failed to load season:", e);
            } finally {
                if (mounted) setSeasonLoading(false);
            }
        };

        loadSeason();
        return () => { mounted = false; };
    }, [id, selectedSeasonNumber, tv]);

    const handlePlayTrailer = async (episode = null) => {
        if (episode) {
            // Fetch episode specific trailer
            const d = await getEpisodeDetails(id, selectedSeasonNumber, episode.episode_number);
            const v = d?.videos?.results?.find(x => x.site === 'YouTube' && x.type === 'Trailer')
                || d?.videos?.results?.find(x => x.site === 'YouTube');
            if (v) {
                setTrailerKey(v.key);
                setOpenTrailer(true);
                return;
            }
        }
        // Fallback to series trailer
        const v = tv?.videos?.results?.find(x => x.site === 'YouTube' && x.type === 'Trailer')
            || tv?.videos?.results?.find(x => x.site === 'YouTube');

        if (v) {
            setTrailerKey(v.key);
            setOpenTrailer(true);
        } else {
            alert("No trailer available.");
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-yellow"></div>
        </div>
    );

    if (!tv) return (
        <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center text-white p-4">
            <h2 className="text-2xl font-bold mb-2">Content Not Found</h2>
            <button onClick={() => navigate('/')} className="px-4 py-2 bg-primary-yellow text-black rounded font-bold hover:bg-yellow-500">Go Home</button>
        </div>
    );

    const backdrop = tv.backdrop_path ? `https://image.tmdb.org/t/p/w500${tv.backdrop_path}` : null;
    const poster = getPoster(tv.poster_path);

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white pb-20 font-sans">
            {/* 1. Overview Section (Hero) */}
            <div className="relative w-full h-[80vh] overflow-hidden">
                {backdrop && (
                    <div className="absolute inset-0 bg-cover bg-center animate-ken-burns" style={{ backgroundImage: `url(${backdrop})` }}>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/60 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f] via-[#0f0f0f]/70 to-transparent" />
                    </div>
                )}
                <div className="absolute inset-0 max-w-7xl mx-auto px-6 lg:px-8 flex flex-col justify-end pb-16 z-10">
                    <div className="flex flex-col lg:flex-row gap-8 items-end">
                        {/* Poster */}
                        <div className="block w-72 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10 flex-shrink-0 animate-fade-in-up md:mb-0 mb-6">
                            <img src={poster} alt={tv.name} className="w-full h-auto object-cover" loading="lazy" />
                        </div>
                        {/* Text */}
                        <div className="flex-1 space-y-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            <h1 className="text-4xl lg:text-7xl font-black leading-none font-heading tracking-tight drop-shadow-xl">{tv.name}</h1>
                            <div className="flex items-center gap-4 text-gray-300 font-medium text-lg">
                                <span className="text-primary-yellow font-bold text-xl">{new Date(tv.first_air_date).getFullYear()}</span>
                                <span className="border border-white/20 bg-white/5 backdrop-blur-sm px-2 py-0.5 rounded text-sm font-bold tracking-wide">TV-MA</span>
                                <span className="text-gray-400">{tv.number_of_seasons} Seasons</span>
                            </div>
                            <p className="max-w-3xl text-gray-300 line-clamp-3 md:line-clamp-4 text-lg font-light leading-relaxed drop-shadow-md">{tv.overview}</p>

                            <div className="flex gap-4 pt-4">
                                <button onClick={() => handlePlayTrailer()} className="bg-primary-yellow text-black px-8 py-4 rounded-xl font-bold hover:bg-primary-yellow-hover hover:scale-105 active:scale-95 transition-all shadow-yellow-glow flex items-center gap-2">
                                    <FiPlay className="fill-black" size={20} /> Play Trailer
                                </button>
                                {/* "My List" button intentionally omitted for Series per instructions */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Content Layout */}
            <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-16 grid grid-cols-1 lg:grid-cols-4 gap-12">

                {/* Sidebar: Seasons & Providers */}
                <div className="lg:col-span-1 space-y-8 h-fit lg:sticky lg:top-24">
                    {/* Season Selector */}
                    <div className="bg-[#181818] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                        <div className="p-4 border-b border-white/5 bg-white/5">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Seasons</h3>
                        </div>
                        <div className="space-y-0.5 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700">
                            {tv.seasons?.map(s => {
                                if (s.season_number === 0 && !s.episode_count) return null;
                                const active = selectedSeasonNumber === s.season_number;
                                return (
                                    <button
                                        key={s.id}
                                        onClick={() => setSelectedSeasonNumber(s.season_number)}
                                        className={`w-full text-left px-4 py-3 transition-colors flex justify-between items-center bg-transparent group ${active ? 'bg-primary-yellow/10 border-l-4 border-primary-yellow' : 'hover:bg-white/5 border-l-4 border-transparent'}`}
                                    >
                                        <span className={`text-sm font-medium ${active ? 'text-primary-yellow' : 'text-gray-400 group-hover:text-white'}`}>{s.name}</span>
                                        {active && <FiPlay size={10} className="fill-current text-primary-yellow" />}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Where to Watch */}
                    {providers && providers.length > 0 ? (
                        <div className="bg-[#181818] p-5 rounded-2xl border border-white/5 shadow-xl">
                            <h3 className="text-xs font-bold font-mono text-gray-500 mb-4 tracking-widest uppercase">Available On</h3>
                            <div className="flex flex-wrap gap-3">
                                {providers.map(p => (
                                    <div key={p.provider_id} className="block transition-transform hover:scale-110">
                                        <img
                                            src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                                            alt={p.provider_name}
                                            className="w-12 h-12 rounded-xl shadow-md"
                                            title={p.provider_name}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-[#181818] p-5 rounded-2xl border border-white/5 shadow-xl text-sm text-gray-500 italic">
                            Not available for streaming currently
                        </div>
                    )}
                </div>

                {/* Main: Episodes List */}
                <div className="lg:col-span-3">
                    <div className="mb-8 pl-2">
                        <h2 className="text-3xl font-bold font-heading mb-2 text-white">
                            {seasonData?.name || `Season ${selectedSeasonNumber}`}
                        </h2>
                        {seasonData?.overview && (
                            <p className="text-gray-400 max-w-3xl text-sm leading-7 font-light">
                                {seasonData.overview}
                            </p>
                        )}
                    </div>

                    {seasonLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="bg-[#1f1f1f] h-40 rounded-xl animate-pulse border border-white/5"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                            {episodes.map(ep => (
                                <EpisodeCard
                                    key={ep.id}
                                    episode={ep}
                                    onPlayTrailer={handlePlayTrailer}
                                    onWatchNow={() => window.open(`https://www.google.com/search?q=watch+${tv.name}+season+${selectedSeasonNumber}+episode+${ep.episode_number}`, '_blank')}
                                />
                            ))}
                            {episodes.length === 0 && (
                                <div className="col-span-full py-20 text-center text-gray-500 italic bg-[#181818] rounded-2xl border border-white/5">
                                    No episodes found for this season.
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </div>

            {/* 3. Cast & Similar */}
            <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-24 space-y-20">
                {cast.length > 0 && (
                    <section>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-1 h-8 bg-primary-yellow rounded-full"></div>
                            <h3 className="text-2xl font-bold font-heading text-white">Top Cast</h3>
                        </div>
                        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                            {cast.map(c => (
                                <div key={c.id} className="w-32 flex-shrink-0 cursor-pointer group" onClick={() => navigate(`/actor/${c.id}`)}>
                                    <div className="w-32 h-32 rounded-full overflow-hidden mb-3 border-2 border-white/5 group-hover:border-primary-yellow transition-all shadow-lg group-hover:shadow-[0_0_15px_rgba(245,197,24,0.3)]">
                                        <img src={c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : 'https://via.placeholder.com/185'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                                    </div>
                                    <div className="text-center text-sm font-bold text-gray-200 group-hover:text-primary-yellow truncate transition-colors">{c.name}</div>
                                    <div className="text-center text-xs text-gray-500 truncate group-hover:text-gray-400">{c.character}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                {similar.length > 0 && (
                    <section>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-1 h-8 bg-primary-yellow rounded-full"></div>
                            <h3 className="text-2xl font-bold font-heading text-white">Similar Shows</h3>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                            {similar.map(s => (
                                <div key={s.id} onClick={() => { navigate(`/tv/${s.id}`); window.scrollTo(0, 0); }}>
                                    <MovieCard movie={{ ...s, media_type: 'tv' }} />
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            <TrailerModal open={openTrailer} onClose={() => setOpenTrailer(false)} youtubeKey={trailerKey} />
        </div>
    );
}



