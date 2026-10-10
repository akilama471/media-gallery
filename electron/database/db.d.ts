import Database from 'better-sqlite3';
export declare class DbManager {
    private db;
    private readonly dbPath;
    constructor();
    private init;
    getDb(): Database.Database;
    private runMigrations;
}
export declare const dbManager: DbManager;
