import { dbManager } from '../database/db';
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

export class BookmarkModel {
  public findById(id: number): Bookmark | null {
    const db = dbManager.getDb();
    const stmt = db.prepare('SELECT * FROM bookmarks WHERE id = ?');
    const row = stmt.get(id);
    if (!row) return null;
    return this.mapRow(row);
  }

  public findByUrl(url: string): Bookmark | null {
    const db = dbManager.getDb();
    const stmt = db.prepare('SELECT * FROM bookmarks WHERE url = ?');
    const row = stmt.get(url);
    if (!row) return null;
    return this.mapRow(row);
  }

  public create(data: CreateBookmarkDTO): Bookmark {
    const db = dbManager.getDb();
    const stmt = db.prepare(`
      INSERT INTO bookmarks (url, title, description, domain_id, thumbnail_path, preview_path)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      data.url,
      data.title,
      data.description,
      data.domain_id,
      data.thumbnail_path,
      data.preview_path
    );
    return this.findById(info.lastInsertRowid as number)!;
  }

  public update(id: number, data: UpdateBookmarkDTO): Bookmark {
    const db = dbManager.getDb();
    
    // Build dynamic update query
    const updates: string[] = [];
    const values: any[] = [];
    
    if (data.title !== undefined) { updates.push('title = ?'); values.push(data.title); }
    if (data.description !== undefined) { updates.push('description = ?'); values.push(data.description); }
    if (data.is_favorite !== undefined) { updates.push('is_favorite = ?'); values.push(data.is_favorite ? 1 : 0); }
    if (data.is_important !== undefined) { updates.push('is_important = ?'); values.push(data.is_important ? 1 : 0); }
    if (data.notes !== undefined) { updates.push('notes = ?'); values.push(data.notes); }
    if (data.domain_id !== undefined) { updates.push('domain_id = ?'); values.push(data.domain_id); }
    if (data.thumbnail_path !== undefined) { updates.push('thumbnail_path = ?'); values.push(data.thumbnail_path); }
    if (data.preview_path !== undefined) { updates.push('preview_path = ?'); values.push(data.preview_path); }
    
    if (updates.length === 0) return this.findById(id)!;

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const sql = `UPDATE bookmarks SET ${updates.join(', ')} WHERE id = ?`;
    db.prepare(sql).run(...values);

    return this.findById(id)!;
  }

  public delete(id: number): void {
    const db = dbManager.getDb();
    db.prepare('DELETE FROM bookmarks WHERE id = ?').run(id);
  }

  public getAll(): Bookmark[] {
    const db = dbManager.getDb();
    const rows = db.prepare('SELECT * FROM bookmarks ORDER BY created_at DESC').all();
    return rows.map((row: any) => this.mapRow(row));
  }

  public search(query: string): Bookmark[] {
    const db = dbManager.getDb();
    const rows = db.prepare(`
      SELECT b.* FROM bookmarks b
      JOIN bookmarks_fts fts ON b.id = fts.rowid
      WHERE bookmarks_fts MATCH ?
      ORDER BY rank
    `).all(query);
    return rows.map((row: any) => this.mapRow(row));
  }

  private mapRow(row: any): Bookmark {
    return {
      ...row,
      is_favorite: Boolean(row.is_favorite),
      is_important: Boolean(row.is_important),
    };
  }
}

export const bookmarkModel = new BookmarkModel();
