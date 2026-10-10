import type { Database as DatabaseType } from 'better-sqlite3';
export declare class DbManager {
    private db;
    private readonly dbPath;
    constructor();
    private init;
    getDb(): DatabaseType;
    private runMigrations;
}
export declare const dbManager: DbManager;
