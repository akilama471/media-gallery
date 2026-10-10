import { Bookmark } from '../../src/types/models';
import { UpdateBookmarkDTO } from '../models/bookmark.model';
export declare class BookmarkService {
    /**
     * Adds a new bookmark by scraping its URL for metadata and downloading assets.
     */
    addBookmark(url: string): Promise<Bookmark>;
    getAllBookmarks(): Bookmark[];
    searchBookmarks(query: string): Bookmark[];
    updateBookmark(id: number, data: UpdateBookmarkDTO): Bookmark;
    deleteBookmark(id: number): void;
}
export declare const bookmarkService: BookmarkService;
