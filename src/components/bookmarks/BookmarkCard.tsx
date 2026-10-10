import React from 'react';
import { Bookmark as BookmarkModel } from '../../types/models';
import { ExternalLink, Star, Trash2, Flag, Edit2 } from 'lucide-react';
import clsx from 'clsx';

interface BookmarkCardProps {
  bookmark: BookmarkModel;
  onDelete: (id: number) => void;
  onToggleFavorite: (id: number, current: boolean) => void;
  onToggleImportant: (id: number, current: boolean) => void;
  onEdit: (bookmark: BookmarkModel) => void;
}

export const BookmarkCard: React.FC<BookmarkCardProps> = ({ bookmark, onDelete, onToggleFavorite, onToggleImportant, onEdit }) => {
  
  // Use custom asset:// protocol for local images or fallback to placeholder
  const imageUrl = bookmark.thumbnail_path 
    ? `asset://${bookmark.thumbnail_path}` 
    : 'https://via.placeholder.com/300x200?text=No+Image';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
      <div className="relative h-40 w-full bg-gray-100 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={bookmark.title || 'Bookmark'} 
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute top-2 right-2 flex items-center gap-1">
          <button 
            onClick={() => onToggleImportant(bookmark.id, bookmark.is_important)}
            className={clsx(
              "p-1.5 rounded-full bg-white/80 backdrop-blur shadow-sm hover:bg-white transition-colors",
              bookmark.is_important ? "text-red-500" : "text-gray-400"
            )}
            title="Mark as Important"
          >
            <Flag className="w-4 h-4" fill={bookmark.is_important ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={() => onToggleFavorite(bookmark.id, bookmark.is_favorite)}
            className={clsx(
              "p-1.5 rounded-full bg-white/80 backdrop-blur shadow-sm hover:bg-white transition-colors",
              bookmark.is_favorite ? "text-yellow-500" : "text-gray-400"
            )}
            title="Favorite"
          >
            <Star className="w-4 h-4" fill={bookmark.is_favorite ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 line-clamp-2 leading-tight mb-1" title={bookmark.title || bookmark.url}>
          {bookmark.title || 'Untitled'}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
          {bookmark.description || 'No description available.'}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <a 
            href={bookmark.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <ExternalLink className="w-3 h-3" />
            Visit Site
          </a>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onEdit(bookmark)}
              className="text-gray-400 hover:text-blue-600 transition-colors"
              title="Edit Details"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onDelete(bookmark.id)}
              className="text-gray-400 hover:text-red-600 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
