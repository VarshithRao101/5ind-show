// src/pages/ActorPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getActorCredits } from "../services/tmdb";
import MovieCard from "../components/MovieCard";
import axios from "axios";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY || "e3af0171bcb844881fd1b0506b9d1c8a";

export default function ActorPage() {
    const { personId } = useParams();
    const navigate = useNavigate();
    const [details, setDetails] = useState(null);
    const [credits, setCredits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        setLoading(true);

        const fetchData = async () => {
            try {
                // Guarded Fetches
                const fetchDetails = axios.get(`https://api.themoviedb.org/3/person/${personId}`, {
                    params: { api_key: API_KEY, language: 'en-US' }
                }).catch(e => { console.error("Actor Details Fail", e); return null; });

                const fetchCredits = axios.get(`https://api.themoviedb.org/3/person/${personId}/combined_credits`, {
                    params: { api_key: API_KEY, language: 'en-US' }
                }).catch(e => { console.error("Actor Credits Fail", e); return { data: { cast: [] } }; });

                const [resDetails, resCredits] = await Promise.all([fetchDetails, fetchCredits]);

                if (mounted) {
                    if (resDetails && resDetails.data) {
                        console.log("Actor loaded:", resDetails.data.name);
                        setDetails(resDetails.data);

                        // Process Credits
                        const cast = resCredits?.data?.cast || [];
                        const valid = cast.filter(c => c.poster_path && (c.media_type === 'movie' || c.media_type === 'tv'));
                        valid.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

                        setCredits(valid);
                    } else {
                        console.warn("Actor details missing");
                    }
                }
            } catch (error) {
                console.error("Actor fetch error", error);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchData();
        window.scrollTo(0, 0);

        return () => {
            mounted = false;
        };
    }, [personId]);

    if (loading) return (
        <div className="min-h-screen bg-[#141414] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
    );

    if (!details) return <div className="min-h-screen bg-[#141414] flex items-center justify-center text-white">Actor not found.</div>;

    return (
        <div className="min-h-screen bg-[#141414] text-white font-sans">
            {/* Actor Hero */}
            <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-10">
                <div className="flex-shrink-0 mx-auto md:mx-0">
                    <div className="w-64 h-96 rounded-xl overflow-hidden shadow-2xl border border-white/10">
                        <img
                            src={details.profile_path ? `https://image.tmdb.org/t/p/h632${details.profile_path}` : "https://via.placeholder.com/500x750?text=No+Image"}
                            alt={details.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                <div className="flex-1 space-y-6">
                    <h1 className="text-4xl md:text-5xl font-extrabold">{details.name}</h1>
                    <div className="flex flex-wrap gap-4 text-gray-400 text-sm">
                        {details.birthday && <span>Born: {details.birthday}</span>}
                        {details.place_of_birth && <span>• {details.place_of_birth}</span>}
                        {details.known_for_department && <span>• {details.known_for_department}</span>}
                    </div>

                    <div className="text-gray-300 leading-relaxed text-lg max-w-4xl">
                        <h3 className="text-white font-bold mb-2">Biography</h3>
                        <p className="line-clamp-6 hover:line-clamp-none transition-all cursor-pointer">
                            {details.biography || "No biography available."}
                        </p>
                    </div>
                </div>
            </div>

            {/* Credits Grid */}
            <div className="max-w-7xl mx-auto px-6 pb-20">
                <h2 className="text-2xl font-bold mb-8 border-l-4 border-red-600 pl-4">Known For</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
                    {credits.map(item => (
                        <div
                            key={`${item.id}-${item.media_type}`}
                            onClick={() => navigate(item.media_type === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`)}
                            className="cursor-pointer hover:scale-105 transition-transform duration-300"
                        >
                            <MovieCard movie={item} isTV={item.media_type === 'tv'} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}



