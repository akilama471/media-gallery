import { useState, useEffect } from 'react';
import { Collection } from '../types/models';

export const useBookmarkCollections = (bookmarkId: number) => {
  const [bookmarkCols, setBookmarkCols] = useState<Collection[]>([]);
  const [availableCols, setAvailableCols] = useState<Collection[]>([]);

  useEffect(() => {
    const fetchCols = async () => {
      try {
        // @ts-ignore
        const allRes = await window.electronAPI.collections.getAll();
        // @ts-ignore
        const currentRes = await window.electronAPI.collections.getForBookmark(bookmarkId);
        if (allRes.success) setAvailableCols(allRes.data);
        if (currentRes.success) setBookmarkCols(currentRes.data);
      } catch (err) {
        console.error('Failed to fetch collections', err);
      }
    };
    fetchCols();
  }, [bookmarkId]);

  const addCollection = async (name: string) => {
    name = name.trim();
    if (!name || bookmarkCols.some(c => c.name.toLowerCase() === name.toLowerCase())) return false;
    
    try {
      // @ts-ignore
      const res = await window.electronAPI.collections.create(name);
      if (res.success) {
        setBookmarkCols([...bookmarkCols, res.data]);
        if (!availableCols.some(c => c.name.toLowerCase() === name.toLowerCase())) {
          setAvailableCols([...availableCols, res.data]);
        }
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const removeCollection = (id: number) => {
    setBookmarkCols(bookmarkCols.filter(c => c.id !== id));
  };

  return { bookmarkCols, availableCols, addCollection, removeCollection };
};
