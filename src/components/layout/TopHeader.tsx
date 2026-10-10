import React from 'react';
import { Search, Plus, Loader2 } from 'lucide-react';

interface TopHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  newUrl: string;
  onUrlChange: (value: string) => void;
  onAddSubmit: (e: React.FormEvent) => void;
  isAdding: boolean;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  searchQuery,
  onSearchChange,
  newUrl,
  onUrlChange,
  onAddSubmit,
  isAdding
}) => {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shrink-0">
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Search bookmarks..." 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </div>
      
      <form onSubmit={onAddSubmit} className="flex items-center gap-2">
        <input 
          type="url" 
          required
          placeholder="https://example.com" 
          value={newUrl}
          onChange={(e) => onUrlChange(e.target.value)}
          className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button 
          type="submit" 
          disabled={isAdding || !newUrl}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-70 transition-colors"
        >
          {isAdding ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
          Add URL
        </button>
      </form>
    </header>
  );
};
