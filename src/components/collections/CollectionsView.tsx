import React, { useState } from 'react';
import { Collection } from '../../types/models';
import { Folder, Loader2, Plus, Edit2, Trash2, X, Check } from 'lucide-react';

interface CollectionsViewProps {
  collections: Collection[];
  loading: boolean;
  onSelectCollection: (col: Collection) => void;
  onCreateCollection: (name: string, desc?: string) => Promise<any>;
  onRenameCollection: (id: number, newName: string, desc?: string) => Promise<boolean>;
  onDeleteCollection: (id: number) => Promise<boolean>;
}

export const CollectionsView: React.FC<CollectionsViewProps> = ({ collections, loading, onSelectCollection, onCreateCollection, onRenameCollection, onDeleteCollection }) => {
  const [newColName, setNewColName] = useState('');
  const [newColDesc, setNewColDesc] = useState('');
  const [editingColId, setEditingColId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColName.trim()) return;
    await onCreateCollection(newColName, newColDesc);
    setNewColName('');
    setNewColDesc('');
  };

  const handleStartEdit = (col: Collection) => {
    setEditingColId(col.id);
    setEditName(col.name);
    setEditDesc(col.description || '');
  };

  const handleSaveEdit = async () => {
    if (editingColId && editName.trim()) {
      await onRenameCollection(editingColId, editName, editDesc);
    }
    setEditingColId(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
        <p>Loading collections...</p>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleCreate} className="mb-8 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Create New Collection</h3>
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={newColName}
            onChange={(e) => setNewColName(e.target.value)}
            placeholder="Collection name..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <input
            type="text"
            value={newColDesc}
            onChange={(e) => setNewColDesc(e.target.value)}
            placeholder="Description (optional)..."
            className="flex-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            type="submit"
            disabled={!newColName.trim()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create
          </button>
        </div>
      </form>

      {collections.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <div className="bg-gray-100 p-6 rounded-full mb-4 text-gray-300">
            <Folder className="w-12 h-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No collections yet</h3>
          <p>Create a collection above to group your bookmarks.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {collections.map((col) => (
            <div key={col.id} className="flex flex-col p-5 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group relative">
              {editingColId === col.id ? (
                <div className="flex flex-col gap-2 w-full h-full">
                  <input
                    type="text"
                    autoFocus
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-2 py-1 text-sm font-bold border border-blue-300 rounded focus:outline-none"
                    placeholder="Name"
                  />
                  <textarea
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none flex-1 resize-none"
                    placeholder="Description"
                    rows={2}
                  />
                  <div className="flex justify-end gap-2 mt-auto pt-2">
                    <button onClick={() => setEditingColId(null)} className="p-1 text-gray-500 hover:bg-gray-100 rounded">
                      <X className="w-4 h-4" />
                    </button>
                    <button onClick={handleSaveEdit} className="p-1 text-green-600 hover:bg-green-50 rounded">
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => onSelectCollection(col)}
                    className="flex flex-col items-start text-left h-full"
                  >
                    <div className="flex items-center gap-3 w-full mb-2">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center group-hover:bg-indigo-100 transition-colors flex-shrink-0">
                        <Folder className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-gray-900 truncate w-full text-lg">
                        {col.name}
                      </span>
                    </div>
                    {col.description && (
                      <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                        {col.description}
                      </p>
                    )}
                  </button>
                  
                  <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-md backdrop-blur shadow-sm p-1">
                    <button
                      onClick={() => handleStartEdit(col)}
                      className="p-1.5 text-gray-500 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                      title="Rename"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete the collection "${col.name}"?`)) {
                          onDeleteCollection(col.id);
                        }
                      }}
                      className="p-1.5 text-gray-500 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
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
