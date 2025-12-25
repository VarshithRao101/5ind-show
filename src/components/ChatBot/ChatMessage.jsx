import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MovieCard from '../MovieCard';

const ChatMessage = ({ message }) => {
    const isBot = message.type === 'bot';
    const navigate = useNavigate();

    return (
        <div className={`flex flex-col ${isBot ? 'items-start' : 'items-end'} mb-6`}>
            {/* Message Bubble */}
            <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm md:text-base leading-relaxed ${isBot
                    ? 'bg-[#1f1f1f] text-gray-200 rounded-tl-sm border border-white/5'
                    : 'bg-[#FFD400] text-black font-medium rounded-tr-sm shadow-lg'
                    }`}
            >
                {message.text.split('\n').map((line, i) => (
                    <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
                ))}
            </div>

            {/* Movie Results Grid (Bot Only) */}
            {isBot && message.movies && message.movies.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 grid grid-cols-2 gap-3 w-full pr-4"
                >
                    {message.movies.map(movie => (
                        <div key={movie.id} className="min-w-0">
                            {/* Force compact styling for chat context */}
                            <div className="scale-95 origin-top-left w-full">
                                <MovieCard
                                    id={movie.id}
                                    title={movie.title || movie.name}
                                    posterPath={movie.poster_path}
                                    rating={movie.vote_average?.toFixed(1) || "N/A"}
                                    year={(movie.release_date || movie.first_air_date || "").substring(0, 4)}
                                    genre={movie.media_type === 'tv' ? "TV Series" : "Movie"}
                                    onNavigate={() => navigate(movie.media_type === 'tv' ? `/series/${movie.id}` : `/movie/${movie.id}`)}
                                />
                            </div>
                        </div>
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default ChatMessage;
