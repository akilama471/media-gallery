import { contextBridge, ipcRenderer } from 'electron';

// --- IPC API ---
export const electronAPI = {
  ping: () => ipcRenderer.invoke('ping'),
  bookmarks: {
    add: (url: string) => ipcRenderer.invoke('bookmarks:add', url),
    getAll: () => ipcRenderer.invoke('bookmarks:getAll'),
    update: (id: number, data: any) => ipcRenderer.invoke('bookmarks:update', id, data),
    delete: (id: number) => ipcRenderer.invoke('bookmarks:delete', id)
  },
  auth: {
    hasPassword: () => ipcRenderer.invoke('auth:hasPassword'),
    setPassword: (password: string) => ipcRenderer.invoke('auth:setPassword', password),
    verifyPassword: (password: string) => ipcRenderer.invoke('auth:verifyPassword', password),
    lock: () => ipcRenderer.invoke('auth:lock')
  },
  backup: {
    export: () => ipcRenderer.invoke('backup:export'),
    import: () => ipcRenderer.invoke('backup:import')
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
