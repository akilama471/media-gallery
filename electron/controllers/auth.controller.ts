import { ipcMain } from 'electron';
import { passwordService } from '../services/password.service';

export function registerAuthController() {
  ipcMain.handle('auth:hasPassword', () => {
    return passwordService.hasPasswordSet();
  });

  ipcMain.handle('auth:setPassword', (event, password: string) => {
    try {
      passwordService.setPassword(password);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('auth:verifyPassword', (event, password: string) => {
    try {
      const success = passwordService.verifyPassword(password);
      return { success };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('auth:lock', () => {
    passwordService.lock();
    return { success: true };
  });
}
