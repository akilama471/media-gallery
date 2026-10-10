import { dbManager } from '../database/db';
import { Collection } from '../../src/types/models';

export class CollectionModel {
  public getAll(): Collection[] {
    return dbManager.getDb().prepare('SELECT * FROM collections ORDER BY name ASC').all() as Collection[];
  }

  public findByName(name: string): Collection | null {
    return dbManager.getDb().prepare('SELECT * FROM collections WHERE name = ? COLLATE NOCASE').get(name) as Collection | null;
  }

  public findById(id: number): Collection | null {
    return dbManager.getDb().prepare('SELECT * FROM collections WHERE id = ?').get(id) as Collection | null;
  }

  public create(name: string, description: string | null = null): Collection {
    const info = dbManager.getDb().prepare('INSERT INTO collections (name, description) VALUES (?, ?)').run(name, description);
    return this.findById(info.lastInsertRowid as number)!;
  }

  public update(id: number, name: string, description: string | null = null): void {
    dbManager.getDb().prepare('UPDATE collections SET name = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(name, description, id);
  }

  public delete(id: number): void {
    dbManager.getDb().prepare('DELETE FROM collections WHERE id = ?').run(id);
  }

  public getCollectionsForBookmark(bookmarkId: number): Collection[] {
    return dbManager.getDb().prepare(`
      SELECT c.* FROM collections c
      JOIN bookmark_collections bc ON c.id = bc.collection_id
      WHERE bc.bookmark_id = ?
      ORDER BY c.name ASC
    `).all(bookmarkId) as Collection[];
  }

  public getBookmarkIdsForCollection(collectionId: number): number[] {
    const rows = dbManager.getDb().prepare('SELECT bookmark_id FROM bookmark_collections WHERE collection_id = ?').all(collectionId) as {bookmark_id: number}[];
    return rows.map(r => r.bookmark_id);
  }

  public setCollectionsForBookmark(bookmarkId: number, collectionIds: number[]): void {
    const db = dbManager.getDb();
    const deleteStmt = db.prepare('DELETE FROM bookmark_collections WHERE bookmark_id = ?');
    const insertStmt = db.prepare('INSERT INTO bookmark_collections (bookmark_id, collection_id) VALUES (?, ?)');
    
    db.transaction(() => {
      deleteStmt.run(bookmarkId);
      for (const colId of collectionIds) {
        insertStmt.run(bookmarkId, colId);
      }
    })();
  }
}

export const collectionModel = new CollectionModel();
