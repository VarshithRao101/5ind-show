import React, { createContext, useState, useCallback, useContext } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

const ToastItem = ({ id, message, type, onDismiss }) => {
    const bgColors = {
        success: 'bg-[#1f1f1f] border-l-4 border-[#FFD400]', // Yellow accent
        error: 'bg-[#1f1f1f] border-l-4 border-red-500',
        info: 'bg-[#1f1f1f] border-l-4 border-gray-500'
    };

    const icons = {
        success: <FiCheckCircle className="text-[#FFD400]" size={20} />,
        error: <FiAlertCircle className="text-red-500" size={20} />,
        info: <FiInfo className="text-gray-400" size={20} />
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`${bgColors[type] || bgColors.info} text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 min-w-[300px] max-w-sm pointer-events-auto backdrop-blur-md`}
        >
            <div className="flex-shrink-0">
                {icons[type] || icons.info}
            </div>
            <div className="flex-1 text-sm font-medium">
                {message}
            </div>
            <button
                onClick={() => onDismiss(id)}
                className="text-gray-500 hover:text-white transition-colors"
            >
                <FiX size={16} />
            </button>
        </motion.div>
    );
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    // Toast types: success, error, info
    const addToast = useCallback((message, type = 'success') => {
        const id = Date.now();
        setToasts((prev) => {
            // Prevent spam: max 3 toasts, if duplication logic needed, can add here
            const newToasts = [...prev, { id, message, type }];
            if (newToasts.length > 3) return newToasts.slice(newToasts.length - 3);
            return newToasts;
        });

        // Auto dismiss
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}

            {/* Global Toast Container */}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none sm:bottom-8 sm:right-8 items-end w-full sm:w-auto px-4 sm:px-0">
                <AnimatePresence mode="popLayout">
                    {toasts.map((toast) => (
                        <ToastItem
                            key={toast.id}
                            {...toast}
                            onDismiss={removeToast}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};
