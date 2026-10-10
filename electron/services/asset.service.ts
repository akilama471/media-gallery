import path from 'node:path';
import fs from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
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
      const filename = this.generateFilename(prefix, '.bdi');
      const fullPath = path.join(this.assetsDir, filename);

      await new Promise<void>((resolve, reject) => {
        const headers: Record<string, string> = {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 BookmarkManager/1.0',
        };
        
        if (sourceUrl) {
          headers['Referer'] = sourceUrl;
        }

        const makeRequest = (targetUrl: string, redirectCount: number = 0) => {
          if (redirectCount > 5) {
            reject(new Error('Too many redirects'));
            return;
          }
          const requestClient = targetUrl.startsWith('https') ? https : http;
          const req = requestClient.get(targetUrl, { headers }, (res) => {
            if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
              // Handle redirect
              const redirectUrl = res.headers.location.startsWith('http') ? res.headers.location : new URL(res.headers.location, targetUrl).href;
              makeRequest(redirectUrl, redirectCount + 1);
              return;
            }
            
            if (!res.statusCode || res.statusCode >= 400) {
              reject(new Error(`Status ${res.statusCode}`));
              return;
            }

            const MAX_SIZE = 5 * 1024 * 1024; // 5MB
            let downloadedBytes = 0;

            res.on('data', (chunk) => {
              downloadedBytes += chunk.length;
              if (downloadedBytes > MAX_SIZE) {
                req.destroy(new Error('File size exceeds 5MB limit'));
              }
            });

            const transform = sharp()
              .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
              .webp({ quality: 80 });

            const outStream = createWriteStream(fullPath);

            res.pipe(transform).pipe(outStream);

            outStream.on('finish', () => resolve());
            outStream.on('error', (err) => {
              req.destroy();
              reject(err);
            });
            transform.on('error', (err) => {
              req.destroy();
              reject(err);
            });
          });
          
          req.on('error', reject);
          req.setTimeout(15000, () => {
            req.destroy();
            reject(new Error('Timeout'));
          });
        };

        makeRequest(url);
      });

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

      const thumbnailFilename = this.generateFilename('thumb', '.bdi');
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
