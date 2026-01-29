import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiMessageSquare, FiX, FiMinimize2 } from 'react-icons/fi';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import { processUserMessage } from './chatUtils';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'Hi! I’m your movie assistant. Ask me anything!\nTry "Telugu horror movies" or "Movies like Inception".\n\n(Note: This is a static bot results will not be accurate)' }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (text) => {
        // Add User Message
        const userMsg = { type: 'user', text };
        setMessages(prev => [...prev, userMsg]);
        setIsTyping(true);

        // Process Bot Response
        try {
            // Artificial delay for realism
            await new Promise(r => setTimeout(r, 600));

            const response = await processUserMessage(text);

            const botMsg = {
                type: 'bot',
                text: response.text,
                movies: response.movies
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            setMessages(prev => [...prev, { type: 'bot', text: "Sorry, I'm having trouble connecting to the movie database." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            {/* Toggle Button */}
            {!isOpen && (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-24 right-6 z-50 w-14 h-14 bg-[#FFD400] rounded-full shadow-[0_0_20px_rgba(255,212,0,0.4)] flex items-center justify-center text-black"
                >
                    <FiMessageSquare size={24} fill="currentColor" />
                </motion.button>
            )}

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-24 right-6 z-50 w-[90vw] md:w-[400px] h-[600px] max-h-[70vh] bg-[#121212] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 bg-[#FFD400] flex justify-between items-center text-black">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-black/10 rounded-lg">
                                    <FiMessageSquare size={18} fill="currentColor" />
                                </div>
                                <h3 className="font-bold tracking-tight">5indshow Assistant</h3>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-black/10 rounded-full transition-colors"
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-[#0f0f0f]">
                            {messages.map((msg, idx) => (
                                <ChatMessage key={idx} message={msg} />
                            ))}
                            {isTyping && (
                                <div className="flex items-start mb-4">
                                    <div className="bg-[#1f1f1f] px-4 py-3 rounded-2xl rounded-tl-sm border border-white/5 flex gap-1 items-center">
                                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-75"></div>
                                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-150"></div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <ChatInput onSend={handleSend} disabled={isTyping} />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatBot;
