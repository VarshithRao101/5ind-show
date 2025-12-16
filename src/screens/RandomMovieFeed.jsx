import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { IoStar, IoPlay, IoInformationCircle, IoLanguage } from "react-icons/io5";
import { Link } from "react-router-dom";
import { getTrendingMovies } from "../services/tmdb";
import { backdropUrl } from "../api/tmdbImages";
import { UserContext } from "../context/UserContext";
import { getRating } from "../utils/getRating";

const Section = ({ movie, index }) => {
  const backdropImage = backdropUrl(movie.backdrop_path, "w1280");
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : "—";

  return (
    <section className="snap-start h-screen w-full relative flex items-end justify-center overflow-hidden">
      {/* Background backdrop with blur */}
      <div className="absolute inset-0">
        <img
          src={backdropImage}
          alt={movie.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      {/* Foreground Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.5, once: false }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        className="relative z-10 w-full max-w-4xl px-6 pb-32 sm:pb-36"
      >
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ amount: 0.5, once: false }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl sm:text-6xl font-heading font-bold text-white mb-3 drop-shadow-lg"
        >
          {movie.title}
        </motion.h1>

        {/* Meta info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ amount: 0.5, once: false }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center gap-3 text-white/90 mb-4"
        >
          <div className="flex items-center gap-2 bg-primary-yellow/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-primary-yellow/30">
            <IoStar className="w-5 h-5 text-yellow-400" />
            <span className="text-base font-bold">{getRating(movie)}</span>
          </div>
          <span className="text-lg font-semibold">{releaseYear}</span>
        </motion.div>

        {/* Genres */}
        {movie.genres?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.5, once: false }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-2 mb-3"
          >
            {movie.genres.slice(0, 5).map((g) => (
              <span
                key={g}
                className="px-4 py-1.5 text-sm font-semibold rounded-full glassmorphism text-white shadow-md"
              >
                {g}
              </span>
            ))}
          </motion.div>
        )}

        {/* Language */}
        {movie.original_language && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.5, once: false }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex items-center gap-2 mb-5"
          >
            <IoLanguage className="text-white/80" size={18} />
            <span className="text-white/80 text-sm font-medium">
              Language: {movie.original_language.toUpperCase()}
            </span>
          </motion.div>
        )}

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ amount: 0.5, once: false }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-white/90 text-base sm:text-lg leading-relaxed max-w-2xl mb-6 line-clamp-3 drop-shadow-md"
        >
          {movie.overview || "No description available."}
        </motion.p>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.5, once: false }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex items-center gap-4"
        >
          <Link
            to={movie.id ? `/movie/${movie.id}` : "#"}
            className="group"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-primary-yellow hover:bg-primary-yellow-hover text-white font-bold text-lg transition-all shadow-yellow-glow-lg"
            >
              <IoPlay size={24} />
              Watch Now
            </motion.button>
          </Link>
          <Link
            to={movie.id ? `/movie/${movie.id}` : "#"}
            className="group"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl glassmorphism text-white font-bold text-lg border-2 border-white/20 hover:border-primary-yellow/50 transition-all"
            >
              <IoInformationCircle size={24} />
              More Info
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator for first item */}
      {index === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1
          }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 text-white/60 text-sm flex flex-col items-center gap-2"
        >
          <span className="font-semibold">Swipe up for more</span>
          <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full" />
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default function RandomMovieFeed() {
  const [movieList, setMovieList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { darkTheme } = useContext(UserContext);

  useEffect(() => {
    const fetchRandomMovies = async () => {
      try {
        // Fetch random page of movies
        const randomPage = Math.floor(Math.random() * 10) + 1;
        const tmdbMovies = await getTrendingMovies(randomPage);

        if (tmdbMovies.length > 0) {
          setMovieList(tmdbMovies.slice(0, 10));
        } else {
          setMovieList([]);
        }
      } catch (err) {
        console.error('Error fetching random movies:', err);
        setMovieList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomMovies();
  }, []);

  if (loading) {
    return (
      <div className={`h-screen w-full flex items-center justify-center ${darkTheme ? 'bg-app-bg-dark text-white' : 'bg-app-bg-light text-text-light'}`}>
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-primary-yellow/30 border-t-primary-yellow rounded-full animate-spin mx-auto mb-4" />
          <p>Loading movies...</p>
        </div>
      </div>
    );
  }

  if (!movieList || movieList.length === 0) {
    return (
      <div className={`h-screen w-full flex items-center justify-center ${darkTheme ? 'bg-app-bg-dark text-white' : 'bg-app-bg-light text-text-light'}`}>
        <div className="text-center">
          <p className="text-lg">No movies found. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-black text-white snap-y snap-mandatory overflow-y-scroll scrollbar-hide">
      {movieList.map((m, idx) => (
        <Section key={m.id} movie={m} index={idx} />
      ))}
    </div>
  );
}


