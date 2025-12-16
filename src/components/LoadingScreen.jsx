import React from 'react';

const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#121212]">
            {/* Animated Logo/Spinner Container */}
            <div className="relative flex items-center justify-center">
                {/* Outer Glowing Ring */}
                <div className="absolute h-24 w-24 rounded-full border-[3px] border-[#333] opacity-20"></div>

                {/* Spinning Yellow Arc */}
                <div className="h-24 w-24 animate-spin rounded-full border-[3px] border-transparent border-t-[#FFD400] shadow-[0_0_20px_rgba(255,212,0,0.3)]"></div>

                {/* Inner Counter-Rotating Grey Arc */}
                <div className="absolute h-16 w-16 animate-[spin_1.5s_linear_infinite_reverse] rounded-full border-[3px] border-transparent border-b-[#555]"></div>

                {/* Central Pulse Dot */}
                <div className="absolute h-3 w-3 animate-pulse rounded-full bg-[#FFD400] shadow-[0_0_15px_#FFD400]"></div>
            </div>

            {/* Loading Text */}
            <div className="mt-8 flex items-center space-x-1">
                <span className="text-xl font-medium tracking-[0.2em] text-[#888]">LOADING</span>
                <span className="animate-bounce text-xl font-bold text-[#FFD400] delay-75">.</span>
                <span className="animate-bounce text-xl font-bold text-[#FFD400] delay-150">.</span>
                <span className="animate-bounce text-xl font-bold text-[#FFD400] delay-300">.</span>
            </div>
        </div>
    );
};

export default LoadingScreen;
