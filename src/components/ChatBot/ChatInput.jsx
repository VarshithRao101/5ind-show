import React, { useState } from 'react';
import { FiSend } from 'react-icons/fi';

const ChatInput = ({ onSend, disabled }) => {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim() || disabled) return;

        onSend(input);
        setInput('');
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-[#0f0f0f] border-t border-white/10 flex gap-3 items-center">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask for movies (e.g. Telugu horror)..."
                className="flex-1 bg-[#1f1f1f] border border-white/10 rounded-full px-4 py-3 text-sm text-white focus:border-[#FFD400] outline-none transition-colors placeholder-gray-500"
                disabled={disabled}
            />
            <button
                type="submit"
                disabled={disabled || !input.trim()}
                className="p-3 bg-[#FFD400] rounded-full text-black hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-yellow-glow"
            >
                <FiSend size={18} />
            </button>
        </form>
    );
};

export default ChatInput;
