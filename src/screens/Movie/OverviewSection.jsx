import React from 'react';
import { motion } from 'framer-motion';

const OverviewSection = ({ title, overview }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12"
    >
      <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
      <p className="text-[#9AA0A6] text-base sm:text-lg leading-relaxed">
        {overview || 'No description available'}
      </p>
    </motion.div>
  );
};

export default OverviewSection;



