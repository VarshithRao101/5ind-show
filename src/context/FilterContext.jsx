import React, { createContext, useState, useContext } from 'react';

export const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        sortBy: 'popularity', // popularity, rating, date
        contentType: 'all',   // all, movie, tv
        genreId: null,
        language: 'en',       // default english
        year: null            // e.g., '2024', '2023' or ranges
    });

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const applyFilters = (newFilters) => {
        setFilters(newFilters);
        closeModal();
    };

    const resetFilters = () => {
        setFilters({ sortBy: 'popularity', contentType: 'all', genreId: null, language: 'en', year: null });
        closeModal();
    };

    return (
        <FilterContext.Provider value={{
            isModalOpen,
            openModal,
            closeModal,
            filters,
            applyFilters,
            resetFilters
        }}>
            {children}
        </FilterContext.Provider>
    );
};

export const useFilters = () => useContext(FilterContext);
