import React, { useState } from 'react';
import { FiFilm } from 'react-icons/fi';

export default function SmartImage({ src, alt, className, ...props }) {
    const [loaded, setLoaded] = useState(src && src.startsWith('data:'));
    const [error, setError] = useState(false);

    React.useEffect(() => {
        if (src && src.startsWith('data:')) setLoaded(true);
        else if (!src) setError(true);
        else setError(false); // Reset error if src changes to valid
    }, [src]);

    const Fallback = () => (
        <div className={`absolute inset-0 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] flex flex-col items-center justify-center text-gray-500 p-4 text-center ${className}`}>
            <FiFilm size={32} className="mb-3 opacity-40" />
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-60 line-clamp-3 max-w-full">
                {alt || "No Image"}
            </span>
        </div>
    );

    // If no src, show fallback immediately (handled by error state logic or direct check)
    if (!src || error) {
        // If className is passed to the wrapper, we don't need to duplicate it inside if it's just sizing. 
        // But here className is on the container.
        return (
            <div className={`relative overflow-hidden ${className} bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a]`}>
                <Fallback />
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {/* LQIP / Placeholder - blur effect while loading */}
            <div
                className={`absolute inset-0 bg-gradient-to-br from-[#282828] to-[#1a1a1a] transition-opacity duration-500 ease-out ${loaded ? 'opacity-0' : 'opacity-100'}`}
                aria-hidden="true"
            />

            {/* Actual Image */}
            <img
                src={src}
                alt={alt}
                className={`w-full h-full object-cover transition-all duration-700 ease-in-out ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                onLoad={() => setLoaded(true)}
                onError={() => {
                    if (src && !src.includes('fallback-poster.png')) {
                        console.warn(`Image failed to load: ${alt || 'Unknown'}`);
                    }
                    setError(true);
                }}
                loading="lazy"
                {...props}
            />
        </div>
    );
}



