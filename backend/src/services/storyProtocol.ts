import fetch, { RequestInit } from "node-fetch";

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

export class StoryProtocolService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl =
      process.env.STORY_API_BASE_URL || "https://api.story.foundation/api/v1";
    this.apiKey = process.env.STORY_API_KEY || "";

    if (!this.apiKey) {
      console.warn(
        "Story Protocol API key not configured. Please set STORY_API_KEY in your .env file"
      );
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "X-API-Key": this.apiKey,
      };

      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Story API request failed: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      return response.json();
    } catch (error) {
      console.error(`Story Protocol API error for ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Get disputes from Story Protocol
   */
  async getDisputes(chain: string, options: StoryApiOptions = {}) {
    const params = new URLSearchParams();
    params.append("chain", chain);

    if (options.pagination?.limit) {
      params.append("limit", options.pagination.limit.toString());
    }
    if (options.pagination?.after) {
      params.append("after", options.pagination.after);
    }
    if (options.pagination?.before) {
      params.append("before", options.pagination.before);
    }
    if (options.filters?.status) {
      params.append("status", options.filters.status);
    }
    if (options.filters?.type) {
      params.append("type", options.filters.type);
    }

    // For now, return mock data until Story Protocol API is available
    return this.getMockDisputes(chain, options);
  }

  /**
   * Get dispute details from Story Protocol
   */
  async getDisputeDetails(
    chain: string,
    disputeId: string
  ): Promise<DisputeDetails> {
    const params = new URLSearchParams();
    params.append("chain", chain);

    // For now, return mock data until Story Protocol API is available
    return this.getMockDisputeDetails(disputeId);
  }

  /**
   * Get IP assets from Story Protocol
   */
  async getIPAssets(chain: string, options: StoryApiOptions = {}) {
    const params = new URLSearchParams();
    params.append("chain", chain);

    if (options.pagination?.limit) {
      params.append("limit", options.pagination.limit.toString());
    }
    if (options.pagination?.after) {
      params.append("after", options.pagination.after);
    }
    if (options.pagination?.before) {
      params.append("before", options.pagination.before);
    }

    // For now, return mock data until Story Protocol API is available
    return this.getMockIPAssets(chain, options);
  }

  /**
   * Get IP asset details from Story Protocol
   */
  async getIPAssetDetails(chain: string, ipId: string): Promise<IPAsset> {
    const params = new URLSearchParams();
    params.append("chain", chain);

    // For now, return mock data until Story Protocol API is available
    return this.getMockIPAssetDetails(ipId);
  }

  /**
   * Submit a dispute to Story Protocol
   */
  async submitDispute(disputeData: any): Promise<any> {
    // Mock implementation for now
    return {
      success: true,
      disputeId: `dispute_${Date.now()}`,
      transactionHash: `0x${Math.random().toString(16).substr(2, 8)}`,
      submittedAt: new Date().toISOString(),
    };
  }

  /**
   * Mock data methods (to be replaced with real API calls)
   */
  private getMockDisputes(chain: string, options: StoryApiOptions = {}) {
    const mockDisputes: Dispute[] = [
      {
        id: "dispute_001",
        ipAssetId: "ip_asset_001",
        claimant: "0x1234567890123456789012345678901234567890",
        respondent: "0x0987654321098765432109876543210987654321",
        status: "pending",
        type: "infringement",
        submittedAt: "2025-06-10T10:00:00Z",
        lastUpdate: "2025-06-12T08:30:00Z",
        evidence: [
          {
            type: "document",
            url: "https://evidence.example.com/doc1.pdf",
            description: "Proof of original creation",
          },
        ],
      },
      {
        id: "dispute_002",
        ipAssetId: "ip_asset_002",
        claimant: "0x2345678901234567890123456789012345678901",
        respondent: "0x1987654321098765432109876543210987654321",
        status: "in-progress",
        type: "licensing",
        submittedAt: "2025-06-11T14:00:00Z",
        lastUpdate: "2025-06-12T09:15:00Z",
        evidence: [],
        resolution: {
          type: "mediation",
          mediator: "0x3456789012345678901234567890123456789012",
          scheduledDate: "2025-06-15T10:00:00Z",
        },
      },
      {
        id: "dispute_003",
        ipAssetId: "ip_asset_003",
        claimant: "0x3456789012345678901234567890123456789012",
        respondent: "0x2987654321098765432109876543210987654321",
        status: "resolved",
        type: "ownership",
        submittedAt: "2025-06-08T09:00:00Z",
        lastUpdate: "2025-06-11T16:45:00Z",
        evidence: [
          {
            type: "blockchain_record",
            transactionHash: "0xabcdef123456789",
            description: "Original registration transaction",
          },
        ],
        resolution: {
          type: "arbitration",
          verdict: "claimant_wins",
          compensation: "2.5 ETH",
          finalizedAt: "2025-06-11T16:45:00Z",
        },
      },
    ];

    // Apply filters if provided
    let filteredDisputes = mockDisputes;
    if (options.filters?.status) {
      filteredDisputes = filteredDisputes.filter(
        (d) => d.status === options.filters!.status
      );
    }
    if (options.filters?.type) {
      filteredDisputes = filteredDisputes.filter(
        (d) => d.type === options.filters!.type
      );
    }

    // Apply pagination
    const limit = options.pagination?.limit || 20;
    const paginatedDisputes = filteredDisputes.slice(0, limit);

    return {
      data: paginatedDisputes,
      pagination: {
        hasNext: filteredDisputes.length > limit,
        hasPrev: false,
        total: filteredDisputes.length,
      },
      metadata: {
        chain,
        timestamp: new Date().toISOString(),
      },
    };
  }

  private getMockDisputeDetails(disputeId: string): DisputeDetails {
    return {
      id: disputeId,
      ipAssetId: "ip_asset_001",
      claimant: "0x1234567890123456789012345678901234567890",
      respondent: "0x0987654321098765432109876543210987654321",
      status: "pending",
      type: "infringement",
      submittedAt: "2025-06-10T10:00:00Z",
      lastUpdate: "2025-06-12T08:30:00Z",
      evidence: [
        {
          id: "evidence_001",
          type: "document",
          url: "https://evidence.example.com/doc1.pdf",
          description: "Proof of original creation",
          submittedAt: "2025-06-10T10:30:00Z",
          submittedBy: "claimant",
        },
      ],
      timeline: [
        {
          timestamp: "2025-06-10T10:00:00Z",
          action: "dispute_submitted",
          actor: "0x1234567890123456789012345678901234567890",
          description: "Dispute submitted for IP infringement",
        },
        {
          timestamp: "2025-06-10T10:30:00Z",
          action: "evidence_submitted",
          actor: "0x1234567890123456789012345678901234567890",
          description: "Evidence document uploaded",
        },
        {
          timestamp: "2025-06-12T08:30:00Z",
          action: "status_updated",
          actor: "system",
          description: "Dispute moved to review phase",
        },
      ],
      metadata: {
        arbitrationPolicy: "0x4567890123456789012345678901234567890123",
        targetTag: "INFRINGEMENT",
        estimatedResolutionTime: "7-14 days",
      },
    };
  }

  private getMockIPAssets(chain: string, options: StoryApiOptions = {}) {
    const mockAssets: IPAsset[] = [
      {
        id: "ip_asset_001",
        owner: "0x1234567890123456789012345678901234567890",
        metadataUri: "ipfs://QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
        metadata: {
          title: "Digital Art Collection",
          description: "A unique digital art collection",
          creator: "Artist Name",
        },
        registeredAt: "2025-06-01T12:00:00Z",
        licenseTerms: [
          {
            type: "commercial",
            royaltyRate: 5,
            commercialUse: true,
          },
        ],
      },
      {
        id: "ip_asset_002",
        owner: "0x2345678901234567890123456789012345678901",
        metadataUri: "ipfs://QmSomeOtherHashHere123456789",
        metadata: {
          title: "Music Track",
          description: "Original music composition",
          creator: "Musician Name",
        },
        registeredAt: "2025-06-02T14:30:00Z",
        licenseTerms: [
          {
            type: "non-commercial",
            royaltyRate: 0,
            commercialUse: false,
          },
        ],
      },
    ];

    const limit = options.pagination?.limit || 20;
    const paginatedAssets = mockAssets.slice(0, limit);

    return {
      data: paginatedAssets,
      pagination: {
        hasNext: mockAssets.length > limit,
        hasPrev: false,
        total: mockAssets.length,
      },
      metadata: {
        chain,
        timestamp: new Date().toISOString(),
      },
    };
  }

  private getMockIPAssetDetails(ipId: string): IPAsset {
    return {
      id: ipId,
      owner: "0x1234567890123456789012345678901234567890",
      metadataUri: "ipfs://QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
      metadata: {
        title: "Digital Art Collection",
        description: "A unique digital art collection with multiple pieces",
        creator: "Artist Name",
        createdAt: "2025-06-01T10:00:00Z",
        tags: ["digital-art", "nft", "collection"],
        attributes: [
          { trait_type: "Style", value: "Abstract" },
          { trait_type: "Medium", value: "Digital" },
          { trait_type: "Rarity", value: "Unique" },
        ],
      },
      registeredAt: "2025-06-01T12:00:00Z",
      licenseTerms: [
        {
          id: "license_001",
          type: "commercial",
          royaltyRate: 5,
          commercialUse: true,
          attribution: true,
          derivatives: "allowed",
          territory: "worldwide",
          duration: "perpetual",
        },
        {
          id: "license_002",
          type: "non-commercial",
          royaltyRate: 0,
          commercialUse: false,
          attribution: true,
          derivatives: "allowed",
          territory: "worldwide",
          duration: "perpetual",
        },
      ],
    };
  }

  /**
   * Check if the service is properly configured
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }
}

// Export singleton instance
export const storyProtocolService = new StoryProtocolService();
export default storyProtocolService;
