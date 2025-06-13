import { YakoaTokenRegistrationRequest, YakoaTokenRegistrationResponse, YakoaTokenResponse, StoryProtocolResult, IPMetadata } from "../types";
declare class YakoaService {
    private baseUrl;
    private apiKey;
    constructor();
    private getHeaders;
    /**
     * Register a new token with Yakoa or update existing one
     */
    registerToken(tokenData: YakoaTokenRegistrationRequest): Promise<YakoaTokenRegistrationResponse>;
    /**
     * Get token details and infringement check results
     */
    getToken(tokenId: string): Promise<YakoaTokenResponse>;
    /**
     * Create Yakoa token registration data from Story Protocol result
     */
    createTokenRegistrationData(storyResult: StoryProtocolResult, ipMetadata: IPMetadata, mediaUrls: string[], creatorId: string, chain?: string): YakoaTokenRegistrationRequest;
    /**
     * Helper to generate a unique token identifier for Yakoa
     * Format: 0x[address]:[tokenId] (matching Yakoa's required pattern)
     */
    generateTokenIdentifier(chain: string, contractAddress: string, tokenId: string): string;
    /**
     * Check if the API is properly configured
     */
    isConfigured(): boolean;
}
export declare const yakoaService: YakoaService;
export default yakoaService;
//# sourceMappingURL=yakoa.d.ts.map