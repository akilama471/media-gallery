import { bookmarkModel } from '../models/bookmark.model';
import { metadataService } from './metadata.service';
import { domainService } from './domain.service';
import { assetService } from './asset.service';
import { dbManager } from '../database/db';
import { webContents } from 'electron';

class EnrichmentService {
  private isProcessing = false;

  public async startEnrichmentJob() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      while (true) {
        // Fetch 5 bookmarks that have thumbnail_path='pending' (indicating they were freshly imported)
        const pendingBookmarks = dbManager.getDb().prepare(`
          SELECT id, url, title FROM bookmarks 
          WHERE thumbnail_path = 'pending'
          LIMIT 5
        `).all() as { id: number; url: string; title: string | null }[];

        if (pendingBookmarks.length === 0) {
          break; // Nothing left to process
        }

        for (const bookmark of pendingBookmarks) {
          try {
            console.log(`[Enrichment Job] Enriching bookmark ${bookmark.id}: ${bookmark.url}`);
            
            // Wait 2 seconds before making network requests to avoid IP bans / Rate Limits
            await new Promise(resolve => setTimeout(resolve, 2000));

            const metadata = await metadataService.extractMetadata(bookmark.url);
            
            // Prefer original title if it's not "Untitled", else use metadata title
            const finalTitle = (bookmark.title && bookmark.title !== 'Untitled' && bookmark.title !== bookmark.url) ? bookmark.title : metadata.title;

            const domain = await domainService.getOrCreateDomain(metadata.domain, metadata.faviconUrl);

            let previewPath: string | null = null;
            let thumbnailPath: string | null = null;

            if (metadata.previewImageUrl) {
              previewPath = await assetService.downloadImage(metadata.previewImageUrl, 'prev', bookmark.url);
              if (previewPath) {
                thumbnailPath = await assetService.generateThumbnail(previewPath);
              }
            }

            bookmarkModel.update(bookmark.id, {
              title: finalTitle,
              description: metadata.description,
              domain_id: domain.id,
              preview_path: previewPath,
              thumbnail_path: thumbnailPath
            });

            // Notify frontend
            webContents.getAllWebContents().forEach(wc => {
              wc.send('bookmarks:updated');
            });

          } catch (error) {
            console.error(`[Enrichment Job] Failed to enrich bookmark ${bookmark.id} (${bookmark.url}):`, error);
            
            // On failure, clear the pending flag so we don't loop infinitely
            bookmarkModel.update(bookmark.id, { thumbnail_path: null });
          }
        }
      }
    } finally {
      this.isProcessing = false;
    }
  }
}

export const enrichmentService = new EnrichmentService();
