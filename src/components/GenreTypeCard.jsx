import React from 'react';
import { motion } from 'framer-motion';
import { getGenreIcon } from '../assets/icons/genreIcons';

const GenreTypeCard = ({ title, onClick }) => {
    const Icon = getGenreIcon(title);

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            onClick={onClick}
            className="flex flex-col items-center justify-center p-6 bg-[#1f1f1f] border border-white/5 rounded-2xl hover:bg-white/10 hover:border-primary-yellow/30 transition-all group h-32 w-full"
        >
            <div className="w-10 h-10 mb-3 rounded-full bg-white/5 flex items-center justify-center text-primary-yellow group-hover:bg-primary-yellow group-hover:text-black transition-colors">
                <Icon size={20} />
            </div>
            <span className="font-bold text-sm text-gray-200 group-hover:text-white truncate max-w-full">
                {title}
            </span>
        </motion.button>
    );
};

export default GenreTypeCard;
