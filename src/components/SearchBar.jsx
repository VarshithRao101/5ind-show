import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiX } from "react-icons/fi";

export default function SearchBar({ initialQuery = "" }) {
    const [query, setQuery] = useState(initialQuery);
    const navigate = useNavigate();

    const handleSearch = (q) => {
        if (!q || q.trim().length === 0) return;
        setQuery(q); // Update input to match selected suggestion
        navigate(`/search?q=${encodeURIComponent(q.trim())}`);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch(query);
        }
    };

    return (
        <div className="relative w-full z-50">
            {/* Input Area */}
            <div
                className={`
           flex items-center w-full bg-[#1f1f1f] border transition-all duration-300 rounded-full px-4 py-3 border-white/10 hover:border-white/30
         `}
            >
                <button onClick={() => handleSearch(query)} className="mr-3 text-gray-400 hover:text-white transition-colors">
                    <FiSearch size={22} />
                </button>

                <input
                    type="text"
                    placeholder="Search titles, people..."
                    className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 text-lg font-medium"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                {query && (
                    <button
                        onClick={() => { setQuery(''); }}
                        className="ml-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <FiX size={20} />
                    </button>
                )}
            </div>

            {/* Dropdown removed as per new requirement */}
        </div>
    );
}



