import { Bookmark } from '../../src/types/models';
export interface CreateBookmarkDTO {
    url: string;
    title: string | null;
    description: string | null;
    domain_id: number | null;
    thumbnail_path: string | null;
    preview_path: string | null;
}
export interface UpdateBookmarkDTO {
    title?: string | null;
    description?: string | null;
    is_favorite?: boolean;
    is_important?: boolean;
    notes?: string | null;
    domain_id?: number | null;
    thumbnail_path?: string | null;
    preview_path?: string | null;
}
export declare class BookmarkModel {
    findById(id: number): Bookmark | null;
    findByUrl(url: string): Bookmark | null;
    create(data: CreateBookmarkDTO): Bookmark;
    update(id: number, data: UpdateBookmarkDTO): Bookmark;
    delete(id: number): void;
    getAll(): Bookmark[];
    search(query: string): Bookmark[];
    private mapRow;
}
export declare const bookmarkModel: BookmarkModel;
