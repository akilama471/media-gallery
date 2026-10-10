import React, { useState } from 'react';
import { Tag } from '../../types/models';
import { Hash, Loader2, Plus, Edit2, Trash2, X, Check } from 'lucide-react';

interface TagsViewProps {
  tags: Tag[];
  loading: boolean;
  onSelectTag: (tag: Tag) => void;
  onCreateTag: (name: string) => Promise<any>;
  onRenameTag: (id: number, newName: string) => Promise<boolean>;
  onDeleteTag: (id: number) => Promise<boolean>;
}

export const TagsView: React.FC<TagsViewProps> = ({ tags, loading, onSelectTag, onCreateTag, onRenameTag, onDeleteTag }) => {
  const [newTagName, setNewTagName] = useState('');
  const [editingTagId, setEditingTagId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    await onCreateTag(newTagName);
    setNewTagName('');
  };

  const handleStartEdit = (tag: Tag) => {
    setEditingTagId(tag.id);
    setEditName(tag.name);
  };

  const handleSaveEdit = async () => {
    if (editingTagId && editName.trim()) {
      await onRenameTag(editingTagId, editName);
    }
    setEditingTagId(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
        <p>Loading tags...</p>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleCreate} className="mb-8 flex items-center gap-2 max-w-md">
        <input
          type="text"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          placeholder="New tag name..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          type="submit"
          disabled={!newTagName.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Tag
        </button>
      </form>

      {tags.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <div className="bg-gray-100 p-6 rounded-full mb-4 text-gray-300">
            <Hash className="w-12 h-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No tags yet</h3>
          <p>Create tags above to organize your bookmarks.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tags.map((tag) => (
            <div key={tag.id} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 transition-all group">
              {editingTagId === tag.id ? (
                <div className="flex items-center gap-2 w-full">
                  <input
                    type="text"
                    autoFocus
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit();
                      if (e.key === 'Escape') setEditingTagId(null);
                    }}
                    className="flex-1 px-2 py-1 text-sm border border-blue-300 rounded focus:outline-none"
                  />
                  <button onClick={handleSaveEdit} className="text-green-600 hover:text-green-800">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => setEditingTagId(null)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => onSelectTag(tag)}
                    className="flex items-center gap-2 flex-1 text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <Hash className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-gray-800 truncate" title={tag.name}>
                      {tag.name}
                    </span>
                  </button>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleStartEdit(tag)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Rename"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete the tag "${tag.name}"?`)) {
                          onDeleteTag(tag.id);
                        }
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
