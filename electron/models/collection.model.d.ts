import { Collection } from '../../src/types/models';
export declare class CollectionModel {
    getAll(): Collection[];
    findByName(name: string): Collection | null;
    findById(id: number): Collection | null;
    create(name: string, description?: string | null): Collection;
    update(id: number, name: string, description?: string | null): void;
    delete(id: number): void;
    getCollectionsForBookmark(bookmarkId: number): Collection[];
    getBookmarkIdsForCollection(collectionId: number): number[];
    setCollectionsForBookmark(bookmarkId: number, collectionIds: number[]): void;
}
export declare const collectionModel: CollectionModel;
