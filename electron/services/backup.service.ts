import AdmZip from 'adm-zip';
import path from 'node:path';
import fs from 'node:fs';
import { app } from 'electron';
import { dbManager } from '../database/db';
import { enrichmentService } from './enrichment.service';

export class BackupService {
  /**
   * Exports the SQLite database and local assets directory into a ZIP file.
   */
  public async exportBackup(destinationPath: string): Promise<boolean> {
    try {
      const zip = new AdmZip();
      const userDataPath = app.getPath('userData');
      
      const dbPath = path.join(userDataPath, 'bookmark_manager.sqlite');
      const assetsPath = path.join(userDataPath, 'assets');

      // Add database
      if (fs.existsSync(dbPath)) {
        zip.addLocalFile(dbPath, '');
      }

      // Add assets
      if (fs.existsSync(assetsPath)) {
        zip.addLocalFolder(assetsPath, 'assets');
      }

      // Write ZIP asynchronously to prevent UI freezing
      await new Promise<void>((resolve, reject) => {
        zip.writeZip(destinationPath, (error) => {
          if (error) reject(error);
          else resolve();
        });
      });
      return true;
    } catch (error) {
      console.error('Backup export failed:', error);
      throw error;
    }
  }

  /**
   * Imports a backup from a ZIP file safely.
   */
  public async importBackup(sourcePath: string): Promise<boolean> {
    try {
      const zip = new AdmZip(sourcePath);
      const zipEntries = zip.getEntries();
      
      // Basic validation to prevent path traversal
      for (const entry of zipEntries) {
        if (entry.entryName.includes('..') || entry.entryName.startsWith('/')) {
          throw new Error('Invalid archive: Path traversal detected.');
        }
      }

      const userDataPath = app.getPath('userData');
      const dbPath = path.join(userDataPath, 'bookmark_manager.sqlite');
      const assetsPath = path.join(userDataPath, 'assets');

      // For a production app, we should ideally extract to a temp dir, validate DB schema,
      // and then merge or swap. For this implementation, we will perform a hard overwrite
      // safely by extracting to temp, then moving.
      
      const tempExtractDir = path.join(userDataPath, 'temp_restore');
      if (fs.existsSync(tempExtractDir)) {
         await fs.promises.rm(tempExtractDir, { recursive: true, force: true });
      }
      await fs.promises.mkdir(tempExtractDir);

      await new Promise<void>((resolve, reject) => {
        // Handle different adm-zip type signatures gracefully
        const cb = (error: any) => error ? reject(error) : resolve();
        const anyZip = zip as any;
        if (anyZip.extractAllToAsync.length === 3) {
           anyZip.extractAllToAsync(tempExtractDir, true, cb);
        } else {
           anyZip.extractAllToAsync(tempExtractDir, true, false, cb);
        }
      });

      // Verify if temp_restore has the DB
      const tempDbPath = path.join(tempExtractDir, 'bookmark_manager.sqlite');
      if (!fs.existsSync(tempDbPath)) {
        throw new Error('Invalid archive: Missing database file.');
      }

      // It's safe, now we swap
      // We must close the current DB connection first.
      dbManager.getDb().close();

      await fs.promises.copyFile(tempDbPath, dbPath);
      
      const tempAssetsPath = path.join(tempExtractDir, 'assets');
      if (fs.existsSync(tempAssetsPath)) {
        if (fs.existsSync(assetsPath)) {
           await fs.promises.rm(assetsPath, { recursive: true, force: true });
        }
        await fs.promises.rename(tempAssetsPath, assetsPath);
      }

      // Clean up temp
      await fs.promises.rm(tempExtractDir, { recursive: true, force: true });

      // Restart app to reload database state properly
      app.relaunch();
      app.exit(0);
      
      return true;
    } catch (error) {
      console.error('Backup import failed:', error);
      throw error;
    }
  }

  /**
   * Wipes all user data including database records and assets, but keeps settings (passwords).
   */
  public async wipeAllData(): Promise<boolean> {
    try {
      enrichmentService.stopEnrichmentJob();
      enrichmentService.clearLogs();

      const userDataPath = app.getPath('userData');
      const assetsPath = path.join(userDataPath, 'assets');
      
      // 1. Delete all assets (cached images, favicons, thumbnails)
      if (fs.existsSync(assetsPath)) {
        try {
          await fs.promises.rm(assetsPath, { recursive: true, force: true });
        } catch (e) {
          console.warn('Could not fully delete assets dir (file locked), ignoring.', e);
        }
      }
      
      if (!fs.existsSync(assetsPath)) {
        await fs.promises.mkdir(assetsPath);
      }

      // 2. Clear Database Records
      const db = dbManager.getDb();
      db.transaction(() => {
        db.exec(`
          DELETE FROM bookmark_collections;
          DELETE FROM bookmark_tags;
          DELETE FROM bookmarks;
          DELETE FROM collections;
          DELETE FROM tags;
          DELETE FROM domains;
        `);
      })();
      
      return true;
    } catch (error) {
      console.error('Wipe data failed:', error);
      throw error;
    }
  }
}

export const backupService = new BackupService();
