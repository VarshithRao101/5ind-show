import React, { useState, useEffect } from 'react';
import { FiWifiOff } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const OfflineBanner = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <AnimatePresence>
            {!isOnline && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="fixed bottom-0 left-0 right-0 z-[100] bg-red-600 text-white shadow-lg overflow-hidden"
                >
                    <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium">
                        <FiWifiOff />
                        <span>You are currently offline. Check your internet connection.</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default OfflineBanner;
