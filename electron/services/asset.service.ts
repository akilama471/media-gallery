import path from 'node:path';
import fs from 'node:fs/promises';
import { app } from 'electron';
import crypto from 'node:crypto';
import sharp from 'sharp';

export class AssetService {
  private readonly assetsDir: string;

  constructor() {
    this.assetsDir = path.join(app.getPath('userData'), 'assets');
    this.ensureDirectory();
  }

  private async ensureDirectory() {
    try {
      await fs.mkdir(this.assetsDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create assets directory:', error);
    }
  }

  /**
   * Generates a unique filename for an asset
   */
  private generateFilename(prefix: string, extension: string): string {
    const hash = crypto.randomBytes(16).toString('hex');
    return `${prefix}_${hash}${extension}`;
  }

  /**
   * Downloads an image from a URL and saves it to the local filesystem
   * Returns the relative path to the saved asset
   */
  public async downloadImage(url: string, prefix: string = 'img'): Promise<string | null> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds limit for images

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) return null;

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Use sharp to normalize the image and potentially strip malicious data
      const processedBuffer = await sharp(buffer)
        .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();

      const filename = this.generateFilename(prefix, '.webp');
      const fullPath = path.join(this.assetsDir, filename);

      await fs.writeFile(fullPath, processedBuffer);
      return filename; // Return relative filename
    } catch (error) {
      console.warn(`Failed to download image from ${url}:`, error);
      return null;
    }
  }

  /**
   * Generates a small thumbnail from an existing local image
   */
  public async generateThumbnail(sourceFilename: string): Promise<string | null> {
    try {
      const sourcePath = path.join(this.assetsDir, sourceFilename);
      const thumbnailFilename = this.generateFilename('thumb', '.webp');
      const thumbnailPath = path.join(this.assetsDir, thumbnailFilename);

      await sharp(sourcePath)
        .resize(300, 200, { fit: 'cover' })
        .webp({ quality: 70 })
        .toFile(thumbnailPath);

      return thumbnailFilename;
    } catch (error) {
      console.error(`Failed to generate thumbnail for ${sourceFilename}:`, error);
      return null;
    }
  }

  /**
   * Resolves a relative asset filename to an absolute path for the renderer to display (via custom protocol or file://)
   */
  public getAssetAbsolutePath(filename: string): string {
    return path.join(this.assetsDir, filename);
  }
}

export const assetService = new AssetService();
