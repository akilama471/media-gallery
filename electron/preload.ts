import { contextBridge, ipcRenderer } from 'electron';

// --- IPC API ---
export const electronAPI = {
  ping: () => ipcRenderer.invoke('ping'),
  bookmarks: {
    add: (url: string) => ipcRenderer.invoke('bookmarks:add', url),
    getAll: () => ipcRenderer.invoke('bookmarks:getAll'),
    update: (id: number, data: any) => ipcRenderer.invoke('bookmarks:update', id, data),
    delete: (id: number) => ipcRenderer.invoke('bookmarks:delete', id)
  }
};

// Expose the API to the renderer process
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electronAPI', electronAPI);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (for type checking)
  window.electronAPI = electronAPI;
}
