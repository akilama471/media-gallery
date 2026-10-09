import { Domain } from '../../src/types/models';
import { domainModel } from '../models/domain.model';
import { assetService } from './asset.service';

export class DomainService {
  /**
   * Retrieves an existing domain or creates a new one, fetching and caching the favicon if needed.
   */
  public async getOrCreateDomain(domainName: string, faviconUrl: string | null): Promise<Domain> {
    let domain = domainModel.findByDomain(domainName);

    if (!domain) {
      // New domain, let's try to cache its favicon
      let cachedFaviconPath: string | null = null;
      if (faviconUrl) {
        cachedFaviconPath = await assetService.downloadImage(faviconUrl, 'fav');
      }

      domain = domainModel.create(domainName, cachedFaviconPath);
    } else if (!domain.favicon_path && faviconUrl) {
      // Domain exists but has no favicon, let's try to fetch it again
      const cachedFaviconPath = await assetService.downloadImage(faviconUrl, 'fav');
      if (cachedFaviconPath) {
        domainModel.updateFavicon(domain.id, cachedFaviconPath);
        domain = domainModel.findById(domain.id)!;
      }
    }

    return domain;
  }
}

export const domainService = new DomainService();
