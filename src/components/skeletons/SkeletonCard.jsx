import React from 'react';

const SkeletonCard = () => {
    return (
        <div className="flex-shrink-0 w-[160px] sm:w-[170px] aspect-[2/3] bg-[#1f1f1f] rounded-xl overflow-hidden relative border border-white/5">
            {/* Poster shimmer */}
            <div className="w-full h-full shimmer bg-white/5" />

            {/* Content overlay mimic - optional, or just let poster be the skeleton */}
            <div className="absolute bottom-0 w-full p-3 space-y-2 z-10">
                <div className="h-3 w-3/4 bg-white/10 rounded shimmer" />
                <div className="flex justify-between">
                    <div className="h-2 w-1/4 bg-white/10 rounded shimmer" />
                    <div className="h-2 w-1/4 bg-white/10 rounded shimmer" />
                </div>
            </div>
        </div>
    );
};

export default SkeletonCard;
