import React, { createContext, useState, useCallback, useEffect } from 'react';

export const GenreContext = createContext();

export const GenreProvider = ({ children }) => {
  const [selectedGenres, setSelectedGenres] = useState([]);

  // Load genres from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('selectedGenres');
    if (stored) {
      try {
        setSelectedGenres(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored genres', e);
      }
    }
  }, []);

  const toggleGenre = useCallback((genreId) => {
    setSelectedGenres((prevGenres) => {
      const isSelected = prevGenres.includes(genreId);
      let updated;
      if (isSelected) {
        updated = prevGenres.filter((id) => id !== genreId);
      } else {
        updated = [...prevGenres, genreId];
      }
      // Persist to localStorage
      localStorage.setItem('selectedGenres', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const setGenres = useCallback((genres) => {
    setSelectedGenres(genres);
    localStorage.setItem('selectedGenres', JSON.stringify(genres));
  }, []);

  const value = {
    selectedGenres,
    toggleGenre,
    setGenres,
  };

  return (
    <GenreContext.Provider value={value}>
      {children}
    </GenreContext.Provider>
  );
};



