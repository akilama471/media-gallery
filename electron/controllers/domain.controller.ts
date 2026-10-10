import { ipcMain } from 'electron';
import { domainModel } from '../models/domain.model';
import { passwordService } from '../services/password.service';

export function registerDomainController() {
  ipcMain.handle('domains:getAll', async () => {
    try {
      passwordService.checkAuth();
      const domains = domainModel.getAll();
      return { success: true, data: domains };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });
}
