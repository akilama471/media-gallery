import React, { useState } from 'react';
import { Folder, X } from 'lucide-react';
import { Collection } from '../../types/models';

interface CollectionSelectorProps {
  collections: Collection[];
  availableCollections: Collection[];
  onAdd: (name: string) => Promise<boolean>;
  onRemove: (id: number) => void;
}

export const CollectionSelector: React.FC<CollectionSelectorProps> = ({ collections, availableCollections, onAdd, onRemove }) => {
  const [input, setInput] = useState('');

  const handleAdd = async (e?: React.FormEvent | React.KeyboardEvent) => {
    e?.preventDefault();
    if (await onAdd(input)) {
      setInput('');
    } else {
      setInput('');
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Collections</label>
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        {collections.map(col => (
          <span key={col.id} className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md text-sm border border-indigo-200">
            <Folder className="w-3 h-3" />
            {col.name}
            <button type="button" onClick={() => onRemove(col.id)} className="text-indigo-400 hover:text-indigo-800 ml-1">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' ? handleAdd(e) : null}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Add to collection..."
          list="available-cols"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!input.trim()}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
        >
          Add
        </button>
      </div>
      <datalist id="available-cols">
        {availableCollections.map(col => (
          <option key={col.id} value={col.name} />
        ))}
      </datalist>
    </div>
  );
};
