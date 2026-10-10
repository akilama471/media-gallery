# LinkVault

A highly secure, modern, and offline-first desktop bookmark manager. LinkVault transforms the chaotic browser bookmark experience into a visually appealing, highly organized, and fully private local vault.

## 🎯 Purpose
LinkVault was built to solve the problem of scattered, hard-to-find bookmarks and link rot. Unlike cloud-based bookmark managers, LinkVault stores everything entirely on your local machine. It automatically enriches your saved links by fetching metadata and generating visual thumbnails in the background, making it incredibly easy to find what you're looking for using powerful Full-Text Search.

## ✨ Features

- **Offline-First Architecture**: All your bookmarks, collections, favicons, and generated thumbnails are stored securely on your local hard drive. No cloud accounts required.
- **Automated Metadata Enrichment**: When you add a URL or import bookmarks, a background job automatically scrapes the page title, description, favicon, and generates a preview thumbnail.
- **Direct Browser Import**: Seamlessly extract and import bookmarks directly from local browser profiles (Supports Google Chrome, Microsoft Edge, Mozilla Firefox, Opera, and Yandex).
- **Security & Privacy**: Protect your bookmark vault with a Master Password/PIN. Features secure lockouts, old-password validation, and a "Danger Zone" to completely wipe all traces of data.
- **Advanced Full-Text Search**: Powered by SQLite FTS5, instantly search through thousands of bookmarks by title, URL, description, or notes.
- **High Performance**: Employs Virtual Pagination and SQLite WAL mode to smoothly handle 10,000+ bookmarks without UI freezing or memory spikes.
- **Organization**: Group bookmarks into Custom Collections, apply flexible Tags, and mark favorites for quick access.
- **Backup & Restore**: Export your entire database and local asset library into a single `.zip` file for safekeeping, and restore it on any machine.

## 🛠️ Tech Stack

**Frontend (Renderer Process)**
- React 18
- TypeScript
- Vite
- TailwindCSS
- Lucide React (Icons)

**Backend (Main Process)**
- Electron
- Node.js
- `better-sqlite3` (SQLite Database)
- `sharp` (High-performance image processing & thumbnail generation)
- `cheerio` (HTML parsing for metadata extraction)
- `adm-zip` (Backup compression)

## 🚀 Deployment & Build Guidelines

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` (Node Package Manager)

### Development Setup
1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd media-gallery
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run the application in development mode**:
   ```bash
   npm run dev
   ```
   *This command starts the Vite development server and launches the Electron application with hot-reloading enabled.*

### Building for Production
To package the application into a standalone executable installer for your operating system:

1. **Run the build script**:
   ```bash
   npm run build
   ```
   *This command compiles the TypeScript code, builds the React frontend via Vite, and uses `electron-builder` to package the application.*
2. **Locate the executable**:
   Once the build process is complete, the distributable files (e.g., `.exe` for Windows, `.dmg` for macOS, or `.AppImage` for Linux) will be available in the `dist` or `release` directory.

### Project Structure
- `src/` - Contains the React frontend code (Components, Pages, Hooks).
- `electron/` - Contains the Electron backend code (Controllers, Services, Database, Models).
- `electron/preload.ts` - Secure IPC bridge between the Renderer and Main process.
- `index.html` - The main entry point for the Vite renderer.
