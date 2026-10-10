import React, { useState } from 'react';
import { Sidebar } from './components/ui/Sidebar';
import { BookmarkCard } from './components/bookmarks/BookmarkCard';
import { BookmarkDetailsModal } from './components/bookmarks/BookmarkDetailsModal';
import { DomainsView } from './components/domains/DomainsView';
import { TagsView } from './components/tags/TagsView';
import { useBookmarks } from './hooks/useBookmarks';
import { useDomains } from './hooks/useDomains';
import { useTags } from './hooks/useTags';
import { Bookmark, Domain, Tag } from './types/models';
import { Plus, Search, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [filteredTagBookmarkIds, setFilteredTagBookmarkIds] = useState<number[]>([]);

  const { bookmarks, loading, addBookmark, deleteBookmark, toggleFavorite, toggleImportant, updateBookmark } = useBookmarks();
  const { domains, loading: domainsLoading } = useDomains();
  const { tags, loading: tagsLoading, createTag, renameTag, deleteTag, getBookmarkIds } = useTags();

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    setSelectedDomain(null);
    setSelectedTag(null);
  };

  const handleSelectTag = async (tag: Tag) => {
    const ids = await getBookmarkIds(tag.id);
    setFilteredTagBookmarkIds(ids);
    setSelectedTag(tag);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;
    
    setIsAdding(true);
    await addBookmark(newUrl);
    setNewUrl('');
    setIsAdding(false);
  };

  const filteredBookmarks = bookmarks.filter(b => {
    if (currentTab === 'favorites' && !b.is_favorite) return false;
    if (currentTab === 'important' && !b.is_important) return false;
    if (selectedDomain && b.domain_id !== selectedDomain.id) return false;
    if (selectedTag && !filteredTagBookmarkIds.includes(b.id)) return false;
    if (searchQuery) {
      const lowerQ = searchQuery.toLowerCase();
      return (
        (b.title?.toLowerCase().includes(lowerQ)) ||
        (b.url.toLowerCase().includes(lowerQ)) ||
        (b.description?.toLowerCase().includes(lowerQ))
      );
    }
    return true;
  });

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <Sidebar currentTab={currentTab} onTabChange={handleTabChange} />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shrink-0">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search bookmarks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          
          <form onSubmit={handleAddSubmit} className="flex items-center gap-2">
            <input 
              type="url" 
              required
              placeholder="https://example.com" 
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
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

        <div className="flex-1 overflow-y-auto p-8">
          {currentTab === 'domains' && !selectedDomain ? (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Websites</h2>
                <p className="text-gray-500">
                  {domains.length} {domains.length === 1 ? 'website' : 'websites'} found
                </p>
              </div>
              <DomainsView 
                domains={domains} 
                loading={domainsLoading} 
                onSelectDomain={setSelectedDomain} 
              />
            </>
          ) : currentTab === 'tags' && !selectedTag ? (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Tags</h2>
                <p className="text-gray-500">
                  {tags.length} {tags.length === 1 ? 'tag' : 'tags'} found
                </p>
              </div>
              <TagsView 
                tags={tags} 
                loading={tagsLoading} 
                onSelectTag={handleSelectTag}
                onCreateTag={createTag}
                onRenameTag={renameTag}
                onDeleteTag={deleteTag}
              />
            </>
          ) : (
            <>
              <div className="mb-6 flex items-center gap-4">
                {(selectedDomain || selectedTag) && (
                  <button 
                    onClick={() => {
                      if (selectedDomain) setSelectedDomain(null);
                      if (selectedTag) setSelectedTag(null);
                    }}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    ← Back to {selectedDomain ? 'Domains' : 'Tags'}
                  </button>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 capitalize">
                    {selectedDomain ? selectedDomain.domain : (selectedTag ? `#${selectedTag.name}` : (currentTab === 'all' ? 'All Bookmarks' : currentTab))}
                  </h2>
                  <p className="text-gray-500">
                    {filteredBookmarks.length} {filteredBookmarks.length === 1 ? 'bookmark' : 'bookmarks'} found
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
                  <p>Loading your library...</p>
                </div>
              ) : filteredBookmarks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <div className="bg-gray-100 p-6 rounded-full mb-4 text-gray-300">
                    <Search className="w-12 h-12" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No bookmarks here</h3>
                  <p>Try saving a new URL or adjusting your filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredBookmarks.map(bookmark => (
                    <BookmarkCard 
                      key={bookmark.id} 
                      bookmark={bookmark} 
                      onDelete={deleteBookmark}
                      onToggleFavorite={toggleFavorite}
                      onToggleImportant={toggleImportant}
                      onEdit={setEditingBookmark}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {editingBookmark && (
        <BookmarkDetailsModal
          bookmark={editingBookmark}
          onClose={() => setEditingBookmark(null)}
          onSave={updateBookmark}
        />
      )}
    </div>
  );
};

export default App;
