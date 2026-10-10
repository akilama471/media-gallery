import { useState, useEffect, useCallback } from 'react';
import { Collection } from '../types/models';

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCollections = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // @ts-ignore
      const result = await window.electronAPI.collections.getAll();
      if (result.success) {
        setCollections(result.data);
      } else {
        setError(result.error);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCollection = async (name: string, description?: string) => {
    try {
      // @ts-ignore
      const result = await window.electronAPI.collections.create(name, description);
      if (result.success) {
        await fetchCollections();
        return result.data;
      }
      return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const renameCollection = async (id: number, newName: string, description?: string) => {
    try {
      // @ts-ignore
      const result = await window.electronAPI.collections.rename(id, newName, description);
      if (result.success) {
        await fetchCollections();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const deleteCollection = async (id: number) => {
    try {
      // @ts-ignore
      const result = await window.electronAPI.collections.delete(id);
      if (result.success) {
        await fetchCollections();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const getBookmarkIds = async (collectionId: number): Promise<number[]> => {
    try {
      // @ts-ignore
      const result = await window.electronAPI.collections.getBookmarkIds(collectionId);
      if (result.success) {
        return result.data;
      }
      return [];
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  return {
    collections,
    loading,
    error,
    createCollection,
    renameCollection,
    deleteCollection,
    getBookmarkIds,
    refresh: fetchCollections
  };
}
