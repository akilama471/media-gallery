import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { registerBookmarkController } from './controllers/bookmark.controller';
import { registerDomainController } from './controllers/domain.controller';
import { registerTagController } from './controllers/tag.controller';
import { protocol } from 'electron';
import fs from 'node:fs';
import { registerAuthController } from './controllers/auth.controller';
import { registerBackupController } from './controllers/backup.controller';
import { dbManager } from './database/db';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.APP_ROOT = path.join(__dirname, '..');

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    width: 1024,
    height: 768,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'));
  }

  // Hide menu bar by default for a modern look
  win.setMenuBarVisibility(false);
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    win = null;
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(() => {
  // Initialize Database
  try {
    dbManager.getDb();
  } catch (error) {
    console.error('Failed to initialize database on startup:', error);
  }

  // Register custom protocol for local assets
  protocol.handle('asset', (request) => {
    // request.url is something like asset://thumb_abcd123.webp
    const filename = request.url.slice('asset://'.length);
    const assetPath = path.join(app.getPath('userData'), 'assets', filename);
    
    // Check if file exists, if not, return 404
    if (!fs.existsSync(assetPath)) {
      return new Response(null, { status: 404 });
    }
    
    // Return file
    const data = fs.readFileSync(assetPath);
    return new Response(data);
  });

  // Register IPC Controllers
  registerAuthController();
  registerBookmarkController();
  registerDomainController();
  registerTagController();
  registerBackupController();
  
  createWindow();
});

// Example IPC handler to ensure secure bridge is working
ipcMain.handle('ping', () => 'pong');

