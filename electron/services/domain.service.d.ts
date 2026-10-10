import { Domain } from '../../src/types/models';
export declare class DomainService {
    /**
     * Retrieves an existing domain or creates a new one, fetching and caching the favicon if needed.
     */
    getOrCreateDomain(domainName: string, faviconUrl: string | null): Promise<Domain>;
}
export declare const domainService: DomainService;
