import React from 'react';

const SkeletonDetails = () => {
    return (
        <div className="min-h-screen bg-[#0f0f0f] pb-20 overflow-hidden">
            {/* Hero Section Skeleton */}
            <div className="relative w-full h-[85vh] bg-[#1a1a1a]">
                <div className="absolute inset-0 shimmer opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/50 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 max-w-7xl mx-auto z-10">
                    <div className="flex flex-col md:flex-row gap-10 items-end">
                        {/* Poster Skeleton */}
                        <div className="hidden md:block w-72 aspect-[2/3] bg-white/5 rounded-xl overflow-hidden border border-white/10 shimmer flex-shrink-0" />

                        <div className="flex-1 w-full space-y-6">
                            {/* Title */}
                            <div className="h-12 md:h-16 w-3/4 bg-white/10 rounded-lg shimmer" />

                            {/* Metadata */}
                            <div className="flex gap-4">
                                <div className="h-6 w-16 bg-white/10 rounded shimmer" />
                                <div className="h-6 w-16 bg-white/10 rounded shimmer" />
                                <div className="h-6 w-24 bg-white/10 rounded shimmer" />
                            </div>

                            {/* Scores */}
                            <div className="flex gap-6 py-4">
                                <div className="h-10 w-32 bg-white/10 rounded-lg shimmer" />
                                <div className="h-10 w-32 bg-white/10 rounded-lg shimmer" />
                            </div>

                            {/* Overview */}
                            <div className="space-y-3 max-w-2xl">
                                <div className="h-4 w-full bg-white/10 rounded shimmer" />
                                <div className="h-4 w-full bg-white/10 rounded shimmer" />
                                <div className="h-4 w-2/3 bg-white/10 rounded shimmer" />
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-4 pt-4">
                                <div className="h-14 w-40 bg-white/10 rounded-xl shimmer" />
                                <div className="h-14 w-40 bg-white/10 rounded-xl shimmer" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Skeleton */}
            <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
                {/* Cast Row Skeleton */}
                <div className="space-y-8">
                    <div className="h-8 w-48 bg-white/10 rounded shimmer" />
                    <div className="flex gap-6 overflow-hidden">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="flex-shrink-0 flex flex-col items-center gap-3">
                                <div className="w-32 h-32 rounded-full bg-white/5 shimmer" />
                                <div className="h-4 w-24 bg-white/10 rounded shimmer" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonDetails;
