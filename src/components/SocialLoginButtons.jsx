import React from 'react';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';

const SocialLoginButtons = ({ onGoogle, onApple, loading }) => {
  const buttonClass =
    'flex-1 flex items-center justify-center gap-3 py-3 px-4 rounded-lg bg-[#111216] border border-[#27282F] text-gray-300 hover:bg-[#1a1a1f] hover:border-gray-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium';

  return (
    <div className="space-y-3 w-full">
      <div className="relative flex items-center gap-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#27282F] to-transparent" />
        <span className="text-xs text-[#9AA0A6] whitespace-nowrap">or continue with</span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#27282F] to-transparent" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onGoogle}
          disabled={loading}
          className={buttonClass}
          type="button"
        >
          <FcGoogle size={20} />
          <span className="hidden sm:inline">Google</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onApple}
          disabled={loading}
          className={buttonClass}
          type="button"
        >
          <FaApple size={18} className="text-white" />
          <span className="hidden sm:inline">Apple</span>
        </motion.button>
      </div>
    </div>
  );
};

export default SocialLoginButtons;



