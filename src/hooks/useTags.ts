import { useState, useEffect, useCallback } from 'react';
import { Tag } from '../types/models';

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTags = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // @ts-ignore
      const result = await window.electronAPI.tags.getAll();
      if (result.success) {
        setTags(result.data);
      } else {
        setError(result.error);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTag = async (name: string) => {
    try {
      // @ts-ignore
      const result = await window.electronAPI.tags.create(name);
      if (result.success) {
        await fetchTags();
        return result.data;
      }
      return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const renameTag = async (id: number, newName: string) => {
    try {
      // @ts-ignore
      const result = await window.electronAPI.tags.rename(id, newName);
      if (result.success) {
        await fetchTags();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const deleteTag = async (id: number) => {
    try {
      // @ts-ignore
      const result = await window.electronAPI.tags.delete(id);
      if (result.success) {
        await fetchTags();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const getBookmarkIds = async (tagId: number): Promise<number[]> => {
    try {
      // @ts-ignore
      const result = await window.electronAPI.tags.getBookmarkIds(tagId);
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
    fetchTags();
  }, [fetchTags]);

  return {
    tags,
    loading,
    error,
    createTag,
    renameTag,
    deleteTag,
    getBookmarkIds,
    refresh: fetchTags
  };
}
