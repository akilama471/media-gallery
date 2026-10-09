import { useState, useEffect, useCallback } from 'react';
import { Bookmark } from '../types/models';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookmarks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // @ts-ignore
      const result = await window.electronAPI.bookmarks.getAll();
      if (result.success) {
        setBookmarks(result.data);
      } else {
        setError(result.error);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addBookmark = async (url: string) => {
    try {
      // @ts-ignore
      const result = await window.electronAPI.bookmarks.add(url);
      if (result.success) {
        // Optimistically or simply refetch
        await fetchBookmarks();
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const deleteBookmark = async (id: number) => {
    try {
      // @ts-ignore
      const result = await window.electronAPI.bookmarks.delete(id);
      if (result.success) {
        setBookmarks((prev) => prev.filter(b => b.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFavorite = async (id: number, currentStatus: boolean) => {
     try {
       // @ts-ignore
      const result = await window.electronAPI.bookmarks.update(id, { is_favorite: !currentStatus });
      if (result.success) {
         setBookmarks((prev) => prev.map(b => b.id === id ? { ...b, is_favorite: !currentStatus } : b));
      }
     } catch (err) {
       console.error(err);
     }
  };

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  return {
    bookmarks,
    loading,
    error,
    addBookmark,
    deleteBookmark,
    toggleFavorite,
    refresh: fetchBookmarks
  };
}
