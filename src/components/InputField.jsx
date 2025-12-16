import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const InputField = ({ label, type = 'text', placeholder, value, onChange, error, onBlur }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <label className="block text-sm font-bold text-white mb-2">{label}</label>

      <div className="relative">
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`w-full px-5 py-4 rounded-xl bg-card-bg border-2 transition-all duration-200 focus:outline-none caret-primary-yellow text-white placeholder-muted-text font-medium ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/30 shake'
              : 'border-card-border focus:border-primary-yellow focus:ring-2 focus:ring-primary-yellow/30 focus:shadow-yellow-glow'
          }`}
        />

        {isPassword && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-text hover:text-primary-yellow transition-colors"
            aria-label="Toggle password visibility"
          >
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </motion.button>
        )}
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-xs font-bold mt-2 flex items-center gap-1"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};

export default InputField;



