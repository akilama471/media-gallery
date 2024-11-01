const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const ffmpeg = require("fluent-ffmpeg");
const Store = require('electron-store');
const store = new Store();

// Set paths for ffmpeg and ffprobe
const ffmpegPath = path.join(__dirname, "..", "ffmpeg", "bin", "ffmpeg.exe");
const ffprobePath = path.join(__dirname, "..", "ffmpeg", "bin", "ffprobe.exe");

// Set the paths for ffmpeg and ffprobe
ffmpeg.setFfmpegPath(store.get('ffmpegPath') || ffmpegPath);
ffmpeg.setFfprobePath(store.get('ffprobePath') || ffprobePath);

async function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile("index.html");
  mainWindow.webContents.openDevTools();

  ipcMain.handle("select-folder", async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ["openDirectory"],
    });

    if (result.canceled) {
      return null;
    } else {
      const folderPath = result.filePaths[0];
      store.set("folderPath", folderPath);
      return folderPath;
    }
  });

  ipcMain.handle("set-ffmpeg-path", (event, ffmpegPath) => {
    store.set('ffmpegPath', ffmpegPath);
    ffmpeg.setFfmpegPath(ffmpegPath);
  });

  ipcMain.handle("set-ffprobe-path", (event, ffprobePath) => {
    store.set('ffprobePath', ffprobePath);
    ffmpeg.setFfprobePath(ffprobePath);
  });

  ipcMain.handle("set-flvtool-path", (event, flvtoolPath) => {
    store.set('flvtoolPath', flvtoolPath);
    ffmpeg.setFlvtoolPath(flvtoolPath);
  });

  ipcMain.handle("scan-folder", async (event) => {
    const folderPath = store.get("folderPath");
    if (!folderPath) return { mediaFiles: [], thumbnails: [] };

    const mediaFiles = [];
    const files = fs.readdirSync(folderPath);
    for (const file of files) {
      const fullPath = path.join(folderPath, file);
      const fileStat = fs.statSync(fullPath);
      if (fileStat.isFile()) {
        const fileExt = path.extname(file).toLowerCase();
        if (
          [".png", ".jpg", ".jpeg", ".gif", ".mp4", ".avi", ".mov"].includes(
            fileExt
          )
        ) {
          mediaFiles.push({
            path: fullPath,
            type: fileExt.startsWith(".mp") ? "video" : "image",
          });
        }
      }
    }

    const thumbnailDir = path.join(app.getPath("userData"), "thumbnails");
    if (!fs.existsSync(thumbnailDir)) {
      fs.mkdirSync(thumbnailDir);
    }

    const thumbnails = [];
    let processedCount = 0;
    for (const media of mediaFiles) {
      const thumbnailPath = path.join(
        thumbnailDir,
        path.basename(media.path) + ".png"
      );
      if (media.type === "image") {
        await sharp(media.path)
          .resize(200, 200, { fit: "cover" })
          .toFile(thumbnailPath);
      } else {
        await new Promise((resolve, reject) => {
          ffmpeg(media.path)
            .screenshots({
              timestamps: ["50%"],
              filename: path.basename(thumbnailPath),
              folder: thumbnailDir,
              size: "200x200",
            })
            .on("end", resolve)
            .on("error", reject);
        });
      }
      thumbnails.push({ original: media.path, thumbnail: thumbnailPath });
      processedCount++;
      event.sender.send("thumbnail-progress", {
        processedCount,
        totalCount: mediaFiles.length,
      });
    }

    return { mediaFiles, thumbnails };
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
