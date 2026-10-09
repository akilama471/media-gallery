import { ipcMain, dialog } from 'electron';
import { backupService } from '../services/backup.service';
import { passwordService } from '../services/password.service';

export function registerBackupController() {
  ipcMain.handle('backup:export', async (event) => {
    try {
      passwordService.checkAuth();
      const { canceled, filePath } = await dialog.showSaveDialog({
        title: 'Export Backup',
        defaultPath: 'bookmark_manager_backup.zip',
        filters: [{ name: 'ZIP Archives', extensions: ['zip'] }]
      });

      if (canceled || !filePath) return { success: false, canceled: true };

      await backupService.exportBackup(filePath);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('backup:import', async (event) => {
    try {
      passwordService.checkAuth();
      const { canceled, filePaths } = await dialog.showOpenDialog({
        title: 'Import Backup',
        properties: ['openFile'],
        filters: [{ name: 'ZIP Archives', extensions: ['zip'] }]
      });

      if (canceled || filePaths.length === 0) return { success: false, canceled: true };

      // Prompt warning since it overrides data
      const result = await dialog.showMessageBox({
        type: 'warning',
        title: 'Overwrite Data?',
        message: 'Importing a backup will overwrite all current bookmarks, collections, and settings. The application will restart automatically. Are you sure you want to proceed?',
        buttons: ['Cancel', 'Import and Restart'],
        defaultId: 0,
        cancelId: 0
      });

      if (result.response === 0) return { success: false, canceled: true };

      await backupService.importBackup(filePaths[0]);
      return { success: true }; // Actually won't reach here if it restarts
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });
}
