// src/components/TrailerModal.jsx
import React from "react";

export default function TrailerModal({ open, onClose, youtubeKey }) {
  if (!open) return null;

  const src = youtubeKey ? `https://www.youtube.com/embed/${youtubeKey}?autoplay=1&rel=0` : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 fade-in">
      <div className="bg-[#1f1f1f] rounded-xl max-w-4xl w-full border border-white/10 shadow-2xl overflow-hidden relative animate-scale-in">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 md:top-4 md:right-4 text-white text-3xl font-bold hover:text-primary-yellow transition-colors z-10 p-2"
        >
          &times;
        </button>
        <div className="w-full aspect-video">
          {src ? (
            <iframe
              title="Trailer"
              src={src}
              className="w-full h-full"
              allow="autoplay; encrypted-media"
              frameBorder="0"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <p className="text-xl mb-2">Trailer not available</p>
                <p className="text-sm">We couldn't find a trailer for this title.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



