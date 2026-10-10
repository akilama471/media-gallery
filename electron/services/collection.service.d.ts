import { Collection } from '../../src/types/models';
export declare class CollectionService {
    getAllCollections(): Collection[];
    getOrCreateCollection(name: string, description?: string | null): Collection;
    renameCollection(id: number, newName: string, description?: string | null): Collection;
    deleteCollection(id: number): void;
    getCollectionsForBookmark(bookmarkId: number): Collection[];
    setCollectionsForBookmark(bookmarkId: number, collectionNames: string[]): Collection[];
    getBookmarkIdsForCollection(collectionId: number): number[];
}
export declare const collectionService: CollectionService;
