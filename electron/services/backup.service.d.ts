export declare class BackupService {
    /**
     * Exports the SQLite database and local assets directory into a ZIP file.
     */
    exportBackup(destinationPath: string): Promise<boolean>;
    /**
     * Imports a backup from a ZIP file safely.
     */
    importBackup(sourcePath: string): Promise<boolean>;
    /**
     * Wipes all user data including database records and assets, but keeps settings (passwords).
     */
    wipeAllData(): Promise<boolean>;
}
export declare const backupService: BackupService;
