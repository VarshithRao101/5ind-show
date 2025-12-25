import React from "react";
import { useNavigate } from "react-router-dom";
import { POSTER_BASE, PLACEHOLDER_POSTER } from '../utils/imageConstants';

export default function MobileMovieGrid({ movies }) {
    const navigate = useNavigate();
    if (!movies || movies.length === 0) {
        return (
            <div className="text-center text-gray-400 mt-10">
                No movies available
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-3 p-3">
            {movies.slice(0, 20).map(movie => (
                <div
                    key={movie.id}
                    onClick={() => navigate(`/movie/${movie.id}`)}
                    className="bg-gray-900 rounded-md overflow-hidden cursor-pointer active:scale-95 transition"
                >
                    <div className="relative aspect-[2/3]">
                        <img
                            src={movie.poster_path ? POSTER_BASE + movie.poster_path : PLACEHOLDER_POSTER}
                            alt={movie.title || movie.name}
                            loading="lazy"
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_POSTER; }}
                        />
                    </div>

                    <div className="p-2 text-sm text-white truncate">
                        {(movie.title || movie.name || "Untitled")}
                    </div>
                </div>
            ))}
        </div>
    );
}
