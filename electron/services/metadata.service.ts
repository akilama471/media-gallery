import * as cheerio from 'cheerio';
import { net } from 'electron';

export interface WebsiteMetadata {
  url: string;
  title: string | null;
  description: string | null;
  domain: string;
  faviconUrl: string | null;
  previewImageUrl: string | null;
}

export class MetadataService {
  /**
   * Fetches and parses website metadata from a given URL
   */
  public async extractMetadata(url: string): Promise<WebsiteMetadata> {
    const parsedUrl = new URL(url);
    const domain = parsedUrl.hostname;
    
    const defaultMetadata: WebsiteMetadata = {
      url,
      title: domain,
      description: null,
      domain,
      faviconUrl: `${parsedUrl.protocol}//${parsedUrl.host}/favicon.ico`,
      previewImageUrl: null,
    };

    try {
      // Use AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds timeout

      const response = await net.fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 BookmarkManager/1.0',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type') || '';
      
      // If it's not HTML, we can't extract standard meta tags
      if (!contentType.includes('text/html')) {
        return defaultMetadata;
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // Extract Title
      const title = $('meta[property="og:title"]').attr('content') || 
                    $('meta[name="twitter:title"]').attr('content') || 
                    $('title').text() || 
                    domain;

      // Extract Description
      const description = $('meta[property="og:description"]').attr('content') || 
                          $('meta[name="description"]').attr('content') || 
                          null;

      // Extract Preview Image
      let previewImageUrl = $('meta[property="og:image"]').attr('content') || 
                            $('meta[name="twitter:image"]').attr('content') || 
                            null;

      // Extract Favicon (try to find a better one than the default /favicon.ico)
      let faviconUrl = $('link[rel="apple-touch-icon"]').attr('href') ||
                       $('link[rel="icon"]').attr('href') ||
                       $('link[rel="shortcut icon"]').attr('href') ||
                       defaultMetadata.faviconUrl;

      // Resolve relative URLs
      if (previewImageUrl && !previewImageUrl.startsWith('http')) {
        previewImageUrl = new URL(previewImageUrl, url).href;
      }
      if (faviconUrl && !faviconUrl.startsWith('http')) {
        faviconUrl = new URL(faviconUrl, url).href;
      }

      return {
        url,
        title: title.trim(),
        description: description ? description.trim() : null,
        domain,
        faviconUrl,
        previewImageUrl
      };

    } catch (error) {
      console.warn(`Failed to extract metadata for ${url}:`, error);
      // Fallback to domain defaults if extraction fails
      return defaultMetadata;
    }
  }
}

export const metadataService = new MetadataService();
