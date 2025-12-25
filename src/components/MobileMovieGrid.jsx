import React from "react";
import { useNavigate } from "react-router-dom";

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
                    {movie.poster_path ? (
                        <img
                            src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                            alt={movie.title}
                            loading="lazy"
                            className="w-full h-auto"
                        />
                    ) : (
                        <div className="h-48 flex items-center justify-center text-gray-500">
                            No Image
                        </div>
                    )}

                    <div className="p-2 text-sm text-white truncate">
                        {(movie.title || movie.name || "Untitled")}
                    </div>
                </div>
            ))}
        </div>
    );
}
