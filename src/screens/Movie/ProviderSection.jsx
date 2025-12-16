import React, { memo } from 'react';
import { motion } from 'framer-motion';

const ProviderSection = memo(({ providers, mediaTitle }) => {
  // ...
  return (
    <motion.div
      // ...
      className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 border-t border-gray-800"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Where to Watch</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-6">
        {providers.map((p) => (
          <a
            key={p.id}
            href={`https://www.justwatch.com/in/search?q=${encodeURIComponent(mediaTitle || '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center group cursor-pointer"
          >
            <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col items-center">
              <img
                src={p.logo}
                alt={p.name}
                className="w-16 h-16 rounded-xl shadow-md object-contain border border-gray-700 group-hover:border-white transition-colors"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/64x64?text=?";
                  e.currentTarget.onerror = null;
                }}
              />
              <p className="text-sm mt-2 text-white text-center group-hover:text-red-500 transition-colors">{p.name}</p>
            </motion.div>
          </a>
        ))}
      </div>
    </motion.div>
  );
});

export default ProviderSection;



