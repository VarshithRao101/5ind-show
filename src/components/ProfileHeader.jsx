import React from 'react';
import { motion } from 'framer-motion';

const ProfileHeader = ({ name, email, avatar, onEdit }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative flex flex-col items-center py-8 sm:py-10 border-b border-gray-800 mb-8"
    >
      {/* Avatar */}
      <div className="relative mb-6">
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-[#E11D1D] shadow-lg flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
          <img
            src={avatar || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22256%22 height=%22256%22%3E%3Crect fill=%22%23333%22 width=%22256%22 height=%22256%22/%3E%3Ctext x=%22128%22 y=%22128%22 font-family=%22Arial%22 font-size=%2264%22 fill=%22%23888%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3EU%3C/text%3E%3C/svg%3E'}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Edit Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEdit}
          className="absolute bottom-2 right-2 bg-[#E11D1D] hover:bg-[#d01818] text-white p-2 rounded-full transition-all shadow-lg"
          aria-label="Edit profile"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </motion.button>
      </div>

      {/* Name and Email */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{name || 'User'}</h1>
        <p className="text-[#9AA0A6] text-base sm:text-lg">{email || 'user@example.com'}</p>
      </div>
    </motion.div>
  );
};

export default ProfileHeader;



