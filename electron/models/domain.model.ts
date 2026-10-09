import { dbManager } from '../database/db';
import { Domain } from '../../src/types/models';

export class DomainModel {
  public findByDomain(domain: string): Domain | null {
    const db = dbManager.getDb();
    const stmt = db.prepare('SELECT * FROM domains WHERE domain = ?');
    return stmt.get(domain) as Domain | null;
  }

  public create(domain: string, faviconPath: string | null): Domain {
    const db = dbManager.getDb();
    const stmt = db.prepare('INSERT INTO domains (domain, favicon_path) VALUES (?, ?)');
    const info = stmt.run(domain, faviconPath);
    return this.findById(info.lastInsertRowid as number)!;
  }

  public updateFavicon(id: number, faviconPath: string | null): void {
    const db = dbManager.getDb();
    const stmt = db.prepare('UPDATE domains SET favicon_path = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    stmt.run(faviconPath, id);
  }

  public findById(id: number): Domain | null {
    const db = dbManager.getDb();
    const stmt = db.prepare('SELECT * FROM domains WHERE id = ?');
    return stmt.get(id) as Domain | null;
  }

  public getAll(): Domain[] {
    const db = dbManager.getDb();
    const stmt = db.prepare('SELECT * FROM domains ORDER BY domain ASC');
    return stmt.all() as Domain[];
  }
}

export const domainModel = new DomainModel();
