import React, { useState } from 'react';
import { Hash, X } from 'lucide-react';
import { Tag } from '../../types/models';

interface TagSelectorProps {
  tags: Tag[];
  availableTags: Tag[];
  onAdd: (name: string) => Promise<boolean>;
  onRemove: (id: number) => void;
}

export const TagSelector: React.FC<TagSelectorProps> = ({ tags, availableTags, onAdd, onRemove }) => {
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
      <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        {tags.map(tag => (
          <span key={tag.id} className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm border border-blue-200">
            <Hash className="w-3 h-3" />
            {tag.name}
            <button type="button" onClick={() => onRemove(tag.id)} className="text-blue-400 hover:text-blue-800 ml-1">
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
          placeholder="Type a tag name and press Enter..."
          list="available-tags"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!input.trim()}
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
  );
};
