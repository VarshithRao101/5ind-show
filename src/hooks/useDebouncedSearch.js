/*
  src/hooks/useDebouncedSearch.js
  Debounce hook for search input.
*/
import { useState, useEffect } from 'react';

export const useDebouncedSearch = (searchFn, delay = 300) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const data = await searchFn(query);
        setResults(data);
      } catch (e) {
        console.error('Search error:', e);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [query, searchFn, delay]);

  return { query, setQuery, results, loading };
};
