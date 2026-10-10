export declare class AssetService {
    private readonly assetsDir;
    constructor();
    private ensureDirectory;
    /**
     * Generates a unique filename for an asset
     */
    private generateFilename;
    /**
     * Downloads an image from a URL and saves it to the local filesystem
     * Returns the relative path to the saved asset
     */
    downloadImage(url: string, prefix?: string, sourceUrl?: string): Promise<string | null>;
    /**
     * Generates a small thumbnail from an existing local image
     */
    generateThumbnail(sourceFilename: string): Promise<string | null>;
    /**
     * Resolves a relative asset filename to an absolute path for the renderer to display (via custom protocol or file://)
     */
    getAssetAbsolutePath(filename: string): string;
}
export declare const assetService: AssetService;
