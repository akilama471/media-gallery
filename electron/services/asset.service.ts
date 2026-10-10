import path from 'node:path';
import fs from 'node:fs/promises';
import { app, net } from 'electron';
import crypto from 'node:crypto';
import sharp from 'sharp';
import https from 'node:https';
import http from 'node:http';

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
  public async downloadImage(url: string, prefix: string = 'img', sourceUrl?: string): Promise<string | null> {
    try {
      const buffer = await new Promise<Buffer>((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        const headers: Record<string, string> = {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 BookmarkManager/1.0',
        };
        
        if (sourceUrl) {
          headers['Referer'] = sourceUrl;
        }

        const makeRequest = (targetUrl: string) => {
          const req = client.get(targetUrl, { headers }, (res) => {
            if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
              // Handle redirect
              const redirectUrl = res.headers.location.startsWith('http') ? res.headers.location : new URL(res.headers.location, targetUrl).href;
              makeRequest(redirectUrl);
              return;
            }
            
            if (!res.statusCode || res.statusCode >= 400) {
              reject(new Error(`Status ${res.statusCode}`));
              return;
            }

            const chunks: Buffer[] = [];
            res.on('data', (chunk) => chunks.push(chunk));
            res.on('end', () => resolve(Buffer.concat(chunks)));
          });
          
          req.on('error', reject);
          req.setTimeout(15000, () => {
            req.destroy();
            reject(new Error('Timeout'));
          });
        };

        makeRequest(url);
      });

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
      const sourceBuffer = await fs.readFile(sourcePath);

      const thumbnailFilename = this.generateFilename('thumb', '.webp');
      const thumbnailPath = path.join(this.assetsDir, thumbnailFilename);

      await sharp(sourceBuffer)
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
