import { dbManager } from '../database/db';
import { Tag } from '../../src/types/models';

export class TagModel {
  public getAll(): Tag[] {
    return dbManager.getDb().prepare('SELECT * FROM tags ORDER BY name ASC').all() as Tag[];
  }

  public findByName(name: string): Tag | null {
    return dbManager.getDb().prepare('SELECT * FROM tags WHERE name = ? COLLATE NOCASE').get(name) as Tag | null;
  }

  public create(name: string): Tag {
    const info = dbManager.getDb().prepare('INSERT INTO tags (name) VALUES (?)').run(name);
    return this.findById(info.lastInsertRowid as number)!;
  }

  public update(id: number, name: string): void {
    dbManager.getDb().prepare('UPDATE tags SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(name, id);
  }

  public delete(id: number): void {
    dbManager.getDb().prepare('DELETE FROM tags WHERE id = ?').run(id);
  }

  public findById(id: number): Tag | null {
    return dbManager.getDb().prepare('SELECT * FROM tags WHERE id = ?').get(id) as Tag | null;
  }

  // Bookmark <-> Tag relation
  public getTagsForBookmark(bookmarkId: number): Tag[] {
    return dbManager.getDb().prepare(`
      SELECT t.* FROM tags t
      JOIN bookmark_tags bt ON t.id = bt.tag_id
      WHERE bt.bookmark_id = ?
      ORDER BY t.name ASC
    `).all(bookmarkId) as Tag[];
  }

  public getBookmarkIdsForTag(tagId: number): number[] {
    const rows = dbManager.getDb().prepare('SELECT bookmark_id FROM bookmark_tags WHERE tag_id = ?').all(tagId) as {bookmark_id: number}[];
    return rows.map(r => r.bookmark_id);
  }

  public setTagsForBookmark(bookmarkId: number, tagIds: number[]): void {
    const db = dbManager.getDb();
    const deleteStmt = db.prepare('DELETE FROM bookmark_tags WHERE bookmark_id = ?');
    const insertStmt = db.prepare('INSERT INTO bookmark_tags (bookmark_id, tag_id) VALUES (?, ?)');
    
    db.transaction(() => {
      deleteStmt.run(bookmarkId);
      for (const tagId of tagIds) {
        insertStmt.run(bookmarkId, tagId);
      }
    })();
  }
}

export const tagModel = new TagModel();
