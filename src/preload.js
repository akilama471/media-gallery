const { contextBridge, ipcRenderer  } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  selectFolder: () => ipcRenderer.invoke('select-folder').catch(console.error),
  scanFolder: () => ipcRenderer.invoke('scan-folder').catch(console.error),
  onThumbnailProgress: (callback) => ipcRenderer.on('thumbnail-progress', callback)
});

