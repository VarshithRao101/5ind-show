import React, { useCallback, useEffect, useRef, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import getRandomMovie from "../utils/getRandomMovie";
import { getPosterUrl } from "../config/tmdbImage";

function StarIcon({ className = "w-4 h-4 text-yellow-400" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.034a1 1 0 00-1.175 0l-2.802 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

const FadeWrapper = ({ active, children }) => (
  <div
    className={`transition-opacity duration-500 ${active ? "opacity-100" : "opacity-0"}`}
  >
    {children}
  </div>
);

export default function RandomMovieScreen() {
  const { darkTheme } = useContext(UserContext);
  const [movie, setMovie] = useState(null);
  const [fadeIn, setFadeIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  const loadNext = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    setFadeIn(false);
    const next = await getRandomMovie();
    setMovie(next);
    // allow fade-in to trigger next paint
    requestAnimationFrame(() => setFadeIn(true));
    setLoading(false);
  }, [loading]);

  // initial load
  useEffect(() => {
    loadNext();
  }, [loadNext]);

  // infinite scroll (near bottom)
  useEffect(() => {
    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const threshold = 80; // px from bottom
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - threshold) {
        loadNext();
      }
    };
    const el = containerRef.current;
    if (el) el.addEventListener("scroll", onScroll);
    return () => el && el.removeEventListener("scroll", onScroll);
  }, [loadNext]);

  const posterUrl = getPosterUrl(movie?.poster_path);
  const releaseYear = movie?.release_date
    ? new Date(movie.release_date).getFullYear()
    : movie?.release_year;

  return (
    <div
      ref={containerRef}
      className={`h-full overflow-y-auto ${darkTheme ? 'bg-app-bg-dark text-white' : 'bg-app-bg-light text-text-light'} transition-colors duration-300`}
    >
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <h1 className="text-2xl font-semibold mb-4">Random Picks</h1>

        <div className={`rounded-xl ${darkTheme ? 'bg-card-bg-dark shadow-card' : 'bg-card-bg-light shadow-card-light'} overflow-hidden`}>
          <FadeWrapper active={fadeIn}>
            <div className="flex flex-col md:flex-row">
              {/* Poster */}
              <div className={`md:w-2/5 w-full ${darkTheme ? 'bg-gray-900/40' : 'bg-gray-200/40'}`}>
                {posterUrl ? (
                  <img
                    src={posterUrl}
                    alt={movie?.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className={`w-full h-72 md:h-full flex items-center justify-center ${darkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                    No image
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="md:w-3/5 w-full p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl sm:text-2xl font-bold line-clamp-2">
                    {movie?.title || "Untitled"}
                  </h2>
                </div>

                {/* Rating and meta */}
                <div className={`flex items-center gap-3 text-sm ${darkTheme ? 'text-gray-300' : 'text-gray-600'} mb-3`}>
                  <div className="flex items-center gap-1">
                    <StarIcon />
                    <span>{movie?.vote_average ? movie.vote_average.toFixed(1) : "-"}</span>
                  </div>
                  <span>•</span>
                  <span>{releaseYear || "—"}</span>
                  {movie?.runtime ? (
                    <>
                      <span>•</span>
                      <span>{movie.runtime} min</span>
                    </>
                  ) : null}
                </div>

                {/* Genres */}
                {movie?.genres?.length ? (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {movie.genres.map((g) => (
                      <span
                        key={g}
                        className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-200"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                ) : null}

                {/* Overview */}
                <p className="text-gray-300 mb-6 line-clamp-3">
                  {movie?.overview || "No description available."}
                </p>

                <div className="flex items-center gap-3">
                  {movie?.id ? (
                    <Link
                      to={`/movie/${movie.id}`}
                      className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
                    >
                      More Details
                    </Link>
                  ) : null}
                  <button
                    onClick={loadNext}
                    disabled={loading}
                    className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 disabled:opacity-60"
                  >
                    {loading ? "Loading..." : "Another"}
                  </button>
                </div>
              </div>
            </div>
          </FadeWrapper>
        </div>

        <div className="text-center mt-4 text-sm text-gray-400">
          Scroll down to discover more
        </div>
        <div className="h-40" />
      </div>
    </div>
  );
}



