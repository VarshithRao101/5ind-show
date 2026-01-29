import React from 'react';

const LoadingSkeleton = ({ rows = 1 }) => (
    <div className="animate-pulse space-y-4 w-full">
        {[...Array(rows)].map((_, i) => (
            <div key={i} className="flex gap-4 overflow-hidden">
                {[...Array(5)].map((_, j) => (
                    <div key={j} className="h-48 md:h-64 aspect-[2/3] bg-gray-800 rounded-xl flex-shrink-0" />
                ))}
            </div>
        ))}
    </div>
);

export default LoadingSkeleton;



