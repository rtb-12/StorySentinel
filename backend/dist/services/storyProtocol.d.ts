interface StoryApiOptions {
    pagination?: {
        limit?: number;
        after?: string;
        before?: string;
    };
    filters?: {
        status?: string;
        type?: string;
    };
}
interface Dispute {
    id: string;
    ipAssetId: string;
    claimant: string;
    respondent: string;
    status: string;
    type: string;
    submittedAt: string;
    lastUpdate: string;
    evidence: any[];
    resolution?: any;
}
interface DisputeDetails extends Dispute {
    timeline: any[];
    metadata: any;
    verdict?: any;
}
interface IPAsset {
    id: string;
    owner: string;
    metadataUri: string;
    metadata: any;
    registeredAt: string;
    licenseTerms: any[];
}
export declare class StoryProtocolService {
    private baseUrl;
    private apiKey;
    constructor();
    private makeRequest;
    /**
     * Get disputes from Story Protocol
     */
    getDisputes(chain: string, options?: StoryApiOptions): Promise<{
        data: Dispute[];
        pagination: {
            hasNext: boolean;
            hasPrev: boolean;
            total: number;
        };
        metadata: {
            chain: string;
            timestamp: string;
        };
    }>;
    /**
     * Get dispute details from Story Protocol
     */
    getDisputeDetails(chain: string, disputeId: string): Promise<DisputeDetails>;
    /**
     * Get IP assets from Story Protocol
     */
    getIPAssets(chain: string, options?: StoryApiOptions): Promise<{
        data: IPAsset[];
        pagination: {
            hasNext: boolean;
            hasPrev: boolean;
            total: number;
        };
        metadata: {
            chain: string;
            timestamp: string;
        };
    }>;
    /**
     * Get IP asset details from Story Protocol
     */
    getIPAssetDetails(chain: string, ipId: string): Promise<IPAsset>;
    /**
     * Submit a dispute to Story Protocol
     */
    submitDispute(disputeData: any): Promise<any>;
    /**
     * Mock data methods (to be replaced with real API calls)
     */
    private getMockDisputes;
    private getMockDisputeDetails;
    private getMockIPAssets;
    private getMockIPAssetDetails;
    /**
     * Check if the service is properly configured
     */
    isConfigured(): boolean;
}
export declare const storyProtocolService: StoryProtocolService;
export default storyProtocolService;
//# sourceMappingURL=storyProtocol.d.ts.map