import React from 'react';
import { motion } from 'framer-motion';

const SectionHeader = ({ title, subtitle, count }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6 sm:mb-8"
    >
      <div className="flex items-baseline gap-3">
        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white">{title}</h2>
        {count !== undefined && (
          <span className="text-sm sm:text-base text-muted-text font-bold">
            ({count} {count === 1 ? 'item' : 'items'})
          </span>
        )}
      </div>
      {subtitle && (
        <p className="text-muted-text text-sm sm:text-base mt-2">{subtitle}</p>
      )}
    </motion.div>
  );
};

export default SectionHeader;



