import { contextBridge, ipcRenderer } from 'electron';

// --- IPC API ---
export const electronAPI = {
  ping: () => ipcRenderer.invoke('ping'),
  // Add backend operations here as per documentation
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
