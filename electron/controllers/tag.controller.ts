import { ipcMain } from 'electron';
import { tagService } from '../services/tag.service';
import { passwordService } from '../services/password.service';

export function registerTagController() {
  ipcMain.handle('tags:getAll', async () => {
    try {
      passwordService.checkAuth();
      const tags = tagService.getAllTags();
      return { success: true, data: tags };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('tags:create', async (event, name: string) => {
    try {
      passwordService.checkAuth();
      const tag = tagService.getOrCreateTag(name);
      return { success: true, data: tag };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('tags:rename', async (event, id: number, newName: string) => {
    try {
      passwordService.checkAuth();
      const tag = tagService.renameTag(id, newName);
      return { success: true, data: tag };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('tags:delete', async (event, id: number) => {
    try {
      passwordService.checkAuth();
      tagService.deleteTag(id);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('tags:getForBookmark', async (event, bookmarkId: number) => {
    try {
      passwordService.checkAuth();
      const tags = tagService.getTagsForBookmark(bookmarkId);
      return { success: true, data: tags };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('tags:setForBookmark', async (event, bookmarkId: number, tagNames: string[]) => {
    try {
      passwordService.checkAuth();
      const tags = tagService.setTagsForBookmark(bookmarkId, tagNames);
      return { success: true, data: tags };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('tags:getBookmarkIds', async (event, tagId: number) => {
    try {
      passwordService.checkAuth();
      const ids = tagService.getBookmarkIdsForTag(tagId);
      return { success: true, data: ids };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });
}
