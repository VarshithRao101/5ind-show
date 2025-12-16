// src/components/CinematicErrorBoundary.jsx
import React from 'react';

class CinematicErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Cinematic Error Boundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-[#000] text-white flex flex-col items-center justify-center p-8 text-center bg-[url('https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg')] bg-cover bg-no-repeat bg-blend-overlay bg-black/80">
                    <h1 className="text-6xl font-extrabold mb-4 text-red-600 drop-shadow-lg">Something Went Wrong.</h1>
                    <p className="text-2xl text-gray-300 max-w-2xl mb-8">
                        We encountered an unexpected error while loading this scene. Please try refreshing the page.
                    </p>
                    <div className="flex gap-4">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-8 py-3 bg-red-600 rounded font-bold hover:bg-red-700 transition shadow-lg"
                        >
                            Reload Page
                        </button>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="px-8 py-3 bg-white/10 backdrop-blur-md rounded font-bold hover:bg-white/20 transition shadow-lg border border-white/20"
                        >
                            Go Home
                        </button>
                    </div>
                    <div className="mt-12 p-4 bg-black/50 rounded text-left font-mono text-xs text-red-400 max-w-3xl overflow-auto border border-red-900/30">
                        {this.state.error && this.state.error.toString()}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default CinematicErrorBoundary;



