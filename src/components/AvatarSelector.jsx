import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';

const AVATARS = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=c0aede",
    "https://api.dicebear.com/7.x/bottts/svg?seed=C3PO&backgroundColor=ffdfbf",
    "https://api.dicebear.com/7.x/bottts/svg?seed=R2D2&backgroundColor=b6e3f4",
    "https://api.dicebear.com/7.x/notionists/svg?seed=Leo&backgroundColor=ffdfbf",
    "https://api.dicebear.com/7.x/notionists/svg?seed=Mila&backgroundColor=c0aede",
    "https://api.dicebear.com/7.x/lorelei/svg?seed=John&backgroundColor=ffdfbf",
    "https://api.dicebear.com/7.x/lorelei/svg?seed=Sarah&backgroundColor=b6e3f4",
    "https://api.dicebear.com/7.x/thumbs/svg?seed=Pepper&backgroundColor=c0aede",
    "https://api.dicebear.com/7.x/thumbs/svg?seed=Bandit&backgroundColor=ffdfbf",
    "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Happy&backgroundColor=b6e3f4",
    "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Cool&backgroundColor=c0aede",
    "https://api.dicebear.com/7.x/shapes/svg?seed=Circle&backgroundColor=ffdfbf",
    "https://api.dicebear.com/7.x/shapes/svg?seed=Polygon&backgroundColor=b6e3f4",
    "https://api.dicebear.com/7.x/pixel-art/svg?seed=Gamer&backgroundColor=c0aede",
    "https://api.dicebear.com/7.x/pixel-art/svg?seed=Retro&backgroundColor=ffdfbf"
];

const AvatarSelector = ({ selectedAvatar, onSelect }) => {
    return (
        <div className="grid grid-cols-4 gap-3 sm:gap-4 mb-6">
            {AVATARS.map((avatar, index) => {
                const isSelected = selectedAvatar === avatar;

                return (
                    <motion.div
                        key={index}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative cursor-pointer group"
                        onClick={() => onSelect(avatar)}
                    >
                        <div
                            className={`
                                w-full aspect-square rounded-full overflow-hidden 
                                border-2 transition-all duration-300 shadow-lg
                                ${isSelected
                                    ? 'border-primary-yellow shadow-[0_0_15px_rgba(255,212,0,0.5)] scale-105'
                                    : 'border-white/10 group-hover:border-primary-yellow/50'
                                }
                            `}
                        >
                            <img
                                src={avatar}
                                alt={`Avatar ${index + 1}`}
                                className="w-full h-full object-cover bg-[#1a1a1a]"
                                loading="lazy"
                            />
                        </div>

                        <AnimatePresence>
                            {isSelected && (
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    className="absolute -top-1 -right-1 w-6 h-6 bg-primary-yellow rounded-full flex items-center justify-center text-black shadow-md border-2 border-[#121212]"
                                >
                                    <FiCheck size={14} strokeWidth={3} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default AvatarSelector;
