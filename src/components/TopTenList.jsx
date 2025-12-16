import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getPosterUrl } from '../config/tmdbImage';

const TopTenList = ({ movies = [] }) => {
    const navigate = useNavigate();

    if (!movies || movies.length === 0) return null;

    // Rank Badges SVG paths (simple numbers 1-10)
    // For simplicity, we'll design a nice CSS badge or use simple text
    return (
        <section className="mb-16 px-4 sm:px-6 md:px-12">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
                Top 10 in India Today
            </h2>

            <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x">
                {movies.slice(0, 10).map((movie, index) => {
                    const rank = index + 1;
                    return (
                        <div
                            key={movie.id}
                            onClick={() => navigate(`/movie/${movie.id}`)}
                            className="relative min-w-[200px] cursor-pointer group snap-start transition-transform hover:scale-105"
                        >
                            {/* Big Rank Number on Left */}
                            <div className="flex items-end">
                                <span className={`
                                    text-[100px] leading-none font-black tracking-tighter 
                                    text-transparent bg-clip-text bg-gradient-to-b from-gray-400 to-gray-800 
                                    stroke-white drop-shadow-lg -mr-6 z-0 relative bottom-0
                                    group-hover:text-red-600 transition-colors
                                `}
                                    style={{ WebkitTextStroke: '2px #444' }}>
                                    {rank}
                                </span>

                                <div className="z-10 relative shadow-2xl rounded-lg overflow-hidden border border-white/10 w-[140px] aspect-[2/3]">
                                    <img
                                        src={getPosterUrl(movie.poster_path)}
                                        alt={movie.title}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default React.memo(TopTenList);



