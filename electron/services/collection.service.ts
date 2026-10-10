import { Collection } from '../../src/types/models';
import { collectionModel } from '../models/collection.model';

export class CollectionService {
  public getAllCollections(): Collection[] {
    return collectionModel.getAll();
  }

  public getOrCreateCollection(name: string, description: string | null = null): Collection {
    const cleanName = name.trim();
    if (!cleanName) throw new Error('Collection name cannot be empty');
    
    let col = collectionModel.findByName(cleanName);
    if (!col) {
      col = collectionModel.create(cleanName, description);
    } else if (description !== null && col.description !== description) {
      collectionModel.update(col.id, cleanName, description);
      col = collectionModel.findById(col.id)!;
    }
    return col;
  }

  public renameCollection(id: number, newName: string, description: string | null = null): Collection {
    const cleanName = newName.trim();
    if (!cleanName) throw new Error('Collection name cannot be empty');
    
    const existing = collectionModel.findByName(cleanName);
    if (existing && existing.id !== id) {
      throw new Error('A collection with this name already exists');
    }
    
    collectionModel.update(id, cleanName, description);
    return collectionModel.findById(id)!;
  }

  public deleteCollection(id: number): void {
    collectionModel.delete(id);
  }

  public getCollectionsForBookmark(bookmarkId: number): Collection[] {
    return collectionModel.getCollectionsForBookmark(bookmarkId);
  }

  public setCollectionsForBookmark(bookmarkId: number, collectionNames: string[]): Collection[] {
    const colIds = collectionNames.map(name => this.getOrCreateCollection(name).id);
    collectionModel.setCollectionsForBookmark(bookmarkId, colIds);
    return collectionModel.getCollectionsForBookmark(bookmarkId);
  }
  
  public getBookmarkIdsForCollection(collectionId: number): number[] {
    return collectionModel.getBookmarkIdsForCollection(collectionId);
  }
}

export const collectionService = new CollectionService();
