import React, { useState } from 'react';
import { Bookmark, Tag } from '../../types/models';
import { X, Save, Hash } from 'lucide-react';

interface BookmarkDetailsModalProps {
  bookmark: Bookmark;
  onClose: () => void;
  onSave: (id: number, data: Partial<Bookmark>) => Promise<void>;
}

export const BookmarkDetailsModal: React.FC<BookmarkDetailsModalProps> = ({ bookmark, onClose, onSave }) => {
  const [title, setTitle] = useState(bookmark.title || '');
  const [url, setUrl] = useState(bookmark.url);
  const [description, setDescription] = useState(bookmark.description || '');
  const [notes, setNotes] = useState(bookmark.notes || '');
  const [saving, setSaving] = useState(false);
  
  const [bookmarkTags, setBookmarkTags] = useState<Tag[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [tagInput, setTagInput] = useState('');

  React.useEffect(() => {
    // Fetch available tags and current bookmark tags
    const fetchTags = async () => {
      try {
        // @ts-ignore
        const allTagsRes = await window.electronAPI.tags.getAll();
        // @ts-ignore
        const bookmarkTagsRes = await window.electronAPI.tags.getForBookmark(bookmark.id);
        
        if (allTagsRes.success) setAvailableTags(allTagsRes.data);
        if (bookmarkTagsRes.success) setBookmarkTags(bookmarkTagsRes.data);
      } catch (err) {
        console.error('Failed to fetch tags', err);
      }
    };
    fetchTags();
  }, [bookmark.id]);

  const handleAddTag = async (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    const name = tagInput.trim();
    if (!name) return;

    // Check if already added
    if (bookmarkTags.some(t => t.name.toLowerCase() === name.toLowerCase())) {
      setTagInput('');
      return;
    }

    try {
      // @ts-ignore
      const result = await window.electronAPI.tags.create(name);
      if (result.success) {
        setBookmarkTags([...bookmarkTags, result.data]);
        
        // Also update available tags if it's new
        if (!availableTags.some(t => t.name.toLowerCase() === name.toLowerCase())) {
          setAvailableTags([...availableTags, result.data]);
        }
      }
    } catch (err) {
      console.error(err);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagId: number) => {
    setBookmarkTags(bookmarkTags.filter(t => t.id !== tagId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave(bookmark.id, { title, url, description, notes });
    
    // Save tags
    try {
      // @ts-ignore
      await window.electronAPI.tags.setForBookmark(bookmark.id, bookmarkTags.map(t => t.name));
    } catch (err) {
      console.error('Failed to save tags', err);
    }

    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl flex flex-col overflow-hidden max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900">Edit Bookmark</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 flex-1">
          <form id="edit-bookmark-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Bookmark Title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                placeholder="Short description..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {bookmarkTags.map(tag => (
                  <span key={tag.id} className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm border border-blue-200">
                    <Hash className="w-3 h-3" />
                    {tag.name}
                    <button type="button" onClick={() => handleRemoveTag(tag.id)} className="text-blue-400 hover:text-blue-800 ml-1">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' ? handleAddTag(e) : null}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Type a tag name and press Enter..."
                  list="available-tags"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim()}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
                >
                  Add Tag
                </button>
              </div>
              <datalist id="available-tags">
                {availableTags.map(tag => (
                  <option key={tag.id} value={tag.name} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Personal Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                placeholder="Add your personal notes here..."
              />
            </div>
          </form>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-bookmark-form"
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-70 transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};
