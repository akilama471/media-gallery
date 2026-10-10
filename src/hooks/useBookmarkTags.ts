import { useState, useEffect } from 'react';
import { Tag } from '../types/models';

export const useBookmarkTags = (bookmarkId: number) => {
  const [bookmarkTags, setBookmarkTags] = useState<Tag[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        // @ts-ignore
        const allRes = await window.electronAPI.tags.getAll();
        // @ts-ignore
        const currentRes = await window.electronAPI.tags.getForBookmark(bookmarkId);
        if (allRes.success) setAvailableTags(allRes.data);
        if (currentRes.success) setBookmarkTags(currentRes.data);
      } catch (err) {
        console.error('Failed to fetch tags', err);
      }
    };
    fetchTags();
  }, [bookmarkId]);

  const addTag = async (name: string) => {
    name = name.trim();
    if (!name || bookmarkTags.some(t => t.name.toLowerCase() === name.toLowerCase())) return false;
    
    try {
      // @ts-ignore
      const res = await window.electronAPI.tags.create(name);
      if (res.success) {
        setBookmarkTags([...bookmarkTags, res.data]);
        if (!availableTags.some(t => t.name.toLowerCase() === name.toLowerCase())) {
          setAvailableTags([...availableTags, res.data]);
        }
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const removeTag = (id: number) => {
    setBookmarkTags(bookmarkTags.filter(t => t.id !== id));
  };

  return { bookmarkTags, availableTags, addTag, removeTag };
};
