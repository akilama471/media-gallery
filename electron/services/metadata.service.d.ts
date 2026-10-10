export interface WebsiteMetadata {
    url: string;
    title: string | null;
    description: string | null;
    domain: string;
    faviconUrl: string | null;
    previewImageUrl: string | null;
}
export declare class MetadataService {
    /**
     * Fetches and parses website metadata from a given URL
     */
    extractMetadata(url: string): Promise<WebsiteMetadata>;
}
export declare const metadataService: MetadataService;
