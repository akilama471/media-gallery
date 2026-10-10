import { ipcMain } from 'electron';
import { browserImportService, SupportedBrowser } from '../services/browser-import.service';
import { passwordService } from '../services/password.service';

export function registerBrowserImportController() {
  ipcMain.handle('import:getProfiles', async (event, browser: SupportedBrowser) => {
    try {
      passwordService.checkAuth();
      const profiles = browserImportService.getProfiles(browser);
      return { success: true, data: profiles };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('import:execute', async (event, browser: SupportedBrowser, profilePath: string) => {
    try {
      passwordService.checkAuth();
      const count = await browserImportService.importFromProfile(browser, profilePath);
      return { success: true, data: count };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });
}
