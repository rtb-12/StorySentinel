interface StoryApiAsset {
  ancestorCount: number;
  blockNumber: string;
  blockTimestamp: string;
  childrenCount: number;
  descendantCount: number;
  id: string;
  ipId: string;
  isGroup: boolean;
  latestArbitrationPolicy: string;
  nftMetadata: {
    chainId: string;
    imageUrl: string;
    name: string;
    tokenContract: string;
    tokenId: string;
    tokenUri: string;
  };
  parentCount: number;
  rootCount: number;
  rootIpIds: string[];
  transactionHash: string;
}

interface StoryApiOptions {
  ipAssetIds?: string[];
  orderBy?: "id" | "blockNumber";
  orderDirection?: "asc" | "desc";
  pagination?: {
    after?: string;
    before?: string;
    limit?: number;
  };
  tokenContractIds?: string[];
  tokenIds?: string[];
  where?: {
    blockNumber?: string;
    blockNumberGte?: string;
    blockNumberLte?: string;
    id?: string;
    ipId?: string;
    tokenContract?: string;
    tokenId?: string;
  };
}

interface StoryApiRawResponse {
  data: StoryApiAsset[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  next: string;
  prev: string;
}

interface StoryApiResponse {
  data: IPAsset[];
  pagination: {
    hasNext: boolean;
    hasPrev: boolean;
    next?: string;
    prev?: string;
  };
}

export interface IPAsset {
  id: string;
  ipId: string;
  tokenContract: string;
  tokenId: string;
  blockNumber: string;
  title: string;
  type: "image" | "video" | "audio" | "document";
  thumbnail: string;
  storyId: string;
  ipfsHash?: string;
  metadata?: {
    title?: string;
    description?: string;
    image?: string;
    mediaUrl?: string;
    mediaType?: string;
    creators?: Array<{
      name: string;
      address: string;
      contributionPercent: number;
    }>;
  };
  registrationDate: string;
  status: "active" | "disputed" | "pending";
  licenseType: string;
  infringements: number;
}

// Dispute interfaces
interface StoryApiDispute {
  id: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
  arbitrationPolicy: string;
  disputeId: string;
  targetIpId: string;
  targetTag: string;
  currentRuling: string;
  disputed: boolean;
  judgeAttempted: boolean;
  judgement: string;
  resolved: boolean;
}

interface StoryApiDisputeOptions {
  orderBy?: "id" | "blockNumber" | "disputeId";
  orderDirection?: "asc" | "desc";
  pagination?: {
    after?: string;
    before?: string;
    limit?: number;
  };
  where?: {
    arbitrationPolicy?: string;
    blockNumber?: string;
    blockNumberGte?: string;
    blockNumberLte?: string;
    currentRuling?: string;
    disputed?: boolean;
    disputeId?: string;
    id?: string;
    judgeAttempted?: boolean;
    judgement?: string;
    resolved?: boolean;
    targetIpId?: string;
    targetTag?: string;
    transactionHash?: string;
  };
}

export interface Dispute {
  id: string;
  title: string;
  ipAssetId: string;
  ipAssetTitle: string;
  disputeType: "infringement" | "licensing" | "ownership" | "takedown";
  status: "pending" | "in-progress" | "resolved" | "rejected" | "escalated";
  priority: "low" | "medium" | "high" | "critical";
  createdAt: string;
  updatedAt: string;
  description: string;
  evidence: {
    id: string;
    type: "image" | "document" | "url" | "transaction";
    title: string;
    url?: string;
  }[];
  respondent: {
    platform: string;
    identifier: string;
    contact?: string;
  };
  outcome?: {
    result: "won" | "lost" | "settled";
    compensation?: string;
    terms?: string;
  };
  storyDisputeId?: string;
  timeline: {
    date: string;
    action: string;
    actor: string;
    description: string;
  }[];
  // Additional fields for real API compatibility
  initiator: string;
  targetIpAsset: string;
  currentTag: string;
  targetTag: string;
  blockNumber: string;
  blockTimestamp: number;
  evidenceHash: string;
  umaLink?: string;
}

// Add this interface for dispute details
export interface DisputeDetails {
  arbitrationPolicy: string;
  blockNumber: number;
  blockTimestamp: number;
  counterEvidenceHash: string;
  currentTag: string;
  data: string;
  deletedAt?: number;
  disputeTimestamp: number;
  evidenceHash: string;
  id: string;
  initiator: string;
  liveness: number;
  logIndex: number;
  status: string;
  targetIpId: string;
  targetTag: string;
  transactionHash: string;
  umaLink: string;
}

interface StoryApiDisputeRawResponse {
  data: StoryApiDispute[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  next: string;
  prev: string;
}

interface StoryApiDisputeResponse {
  data: Dispute[];
  pagination: {
    hasNext: boolean;
    hasPrev: boolean;
    next?: string;
    prev?: string;
  };
}

export type ChainType = "story" | "story-aeneid";

export class StoryApiService {
  private apiKey: string;
  private baseUrl = "https://api.storyapis.com/api/v3";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getAssets(
    chain: ChainType,
    options: StoryApiOptions = {}
  ): Promise<StoryApiResponse> {
    const requestOptions = {
      method: "POST",
      headers: {
        "X-Api-Key": this.apiKey,
        "X-Chain": chain,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        options: {
          orderBy: "id",
          orderDirection: "desc",
          pagination: {
            limit: 50,
          },
          ...options,
        },
      }),
    };

    try {
      const response = await fetch(`${this.baseUrl}/assets`, requestOptions);

      if (!response.ok) {
        throw new Error(
          `Story API request failed: ${response.status} ${response.statusText}`
        );
      }

      const data: StoryApiRawResponse = await response.json();

      // Transform API response to match our IPAsset interface
      const transformedAssets =
        data.data?.map((asset: StoryApiAsset) => ({
          id: asset.id,
          ipId: asset.ipId,
          title:
            asset.nftMetadata?.name ||
            `Asset #${asset.nftMetadata?.tokenId || asset.id}`,
          type: this.getAssetType(asset.nftMetadata?.imageUrl),
          thumbnail: asset.nftMetadata?.imageUrl || "/api/placeholder/300/200",
          registrationDate: new Date(parseInt(asset.blockNumber) * 1000)
            .toISOString()
            .split("T")[0],
          licenseType: "Commercial Use", // This would come from license terms
          status: "active" as const, // This would be determined by API data
          infringements: 0, // This would come from infringement monitoring
          storyId: asset.ipId,
          ipfsHash: asset.nftMetadata?.imageUrl?.includes("ipfs")
            ? asset.nftMetadata.imageUrl.split("/").pop()
            : undefined,
          blockNumber: asset.blockNumber,
          tokenContract: asset.nftMetadata?.tokenContract || "",
          tokenId: asset.nftMetadata?.tokenId || "",
          metadata: {
            title: asset.nftMetadata?.name,
            description: undefined, // Not available in this response
            image: asset.nftMetadata?.imageUrl,
            mediaUrl: asset.nftMetadata?.imageUrl,
            mediaType: undefined, // Not available in this response
          },
        })) || [];

      return {
        data: transformedAssets,
        pagination: {
          hasNext: data.hasNextPage,
          hasPrev: data.hasPreviousPage,
          next: data.next,
          prev: data.prev,
        },
      };
    } catch (error) {
      console.error("Error fetching assets from Story API:", error);
      throw error;
    }
  }

  async getAssetById(chain: ChainType, ipId: string): Promise<IPAsset | null> {
    const options: StoryApiOptions = {
      where: {
        ipId: ipId,
      },
    };

    try {
      const response = await this.getAssets(chain, options);
      return response.data[0] || null;
    } catch (error) {
      console.error("Error fetching asset by ID:", error);
      return null;
    }
  }

  async getDisputes(
    chain: ChainType,
    options: StoryApiDisputeOptions = {}
  ): Promise<StoryApiDisputeResponse> {
    const requestOptions = {
      method: "POST",
      headers: {
        "X-Api-Key": this.apiKey,
        "X-Chain": chain,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        options: {
          orderBy: "blockNumber",
          orderDirection: "desc",
          pagination: {
            limit: 50,
          },
          ...options,
        },
      }),
    };

    try {
      const response = await fetch(`${this.baseUrl}/disputes`, requestOptions);

      if (!response.ok) {
        throw new Error(
          `Story API disputes request failed: ${response.status} ${response.statusText}`
        );
      }

      const data: StoryApiDisputeRawResponse = await response.json();

      // Transform API response to match our Dispute interface
      const transformedDisputes =
        data.data?.map((dispute: StoryApiDispute) => ({
          id: dispute.id,
          title: `Dispute #${dispute.disputeId}`,
          ipAssetId: dispute.targetIpId,
          ipAssetTitle: `IP Asset ${dispute.targetIpId.slice(0, 8)}...`,
          disputeType: this.getDisputeType(dispute.targetTag),
          status: this.getDisputeStatus(dispute),
          priority: this.getDisputePriority(dispute),
          createdAt: new Date(
            parseInt(dispute.blockTimestamp) * 1000
          ).toISOString(),
          updatedAt: new Date(
            parseInt(dispute.blockTimestamp) * 1000
          ).toISOString(),
          description: `Dispute regarding ${dispute.targetTag} for IP asset ${dispute.targetIpId}`,
          evidence: [
            {
              id: `${dispute.id}_tx`,
              type: "transaction" as const,
              title: "Dispute Transaction",
              url: `https://testnet.storyscan.xyz/tx/${dispute.transactionHash}`,
            },
            {
              id: `${dispute.id}_policy`,
              type: "document" as const,
              title: "Arbitration Policy",
              url: dispute.arbitrationPolicy,
            },
          ],
          respondent: {
            platform: "Story Protocol",
            identifier: dispute.targetIpId,
            contact: "disputes@storyprotocol.xyz",
          },
          outcome: dispute.resolved
            ? {
                result: this.getDisputeOutcome(dispute.currentRuling),
                terms: dispute.judgement || "Resolved via arbitration",
              }
            : undefined,
          storyDisputeId: dispute.disputeId,
          // Additional fields for component compatibility
          initiator: "0x" + Math.random().toString(16).substr(2, 40), // Placeholder since not in API
          targetIpAsset: dispute.targetIpId,
          currentTag: dispute.targetTag,
          targetTag: dispute.targetTag,
          blockNumber: dispute.blockNumber,
          blockTimestamp: parseInt(dispute.blockTimestamp),
          evidenceHash: "0x" + Math.random().toString(16).substr(2, 64), // Placeholder since not in API
          umaLink: undefined, // Will be set from detailed API call
          timeline: [
            {
              date: new Date(
                parseInt(dispute.blockTimestamp) * 1000
              ).toISOString(),
              action: "Created",
              actor: "Story Protocol",
              description: `Dispute created for ${dispute.targetTag}`,
            },
            ...(dispute.judgeAttempted
              ? [
                  {
                    date: new Date(
                      parseInt(dispute.blockTimestamp) * 1000
                    ).toISOString(),
                    action: "Under Review",
                    actor: "Arbitrator",
                    description: "Dispute is being reviewed by arbitrator",
                  },
                ]
              : []),
            ...(dispute.resolved
              ? [
                  {
                    date: new Date(
                      parseInt(dispute.blockTimestamp) * 1000
                    ).toISOString(),
                    action: "Resolved",
                    actor: "Arbitrator",
                    description: `Dispute resolved: ${
                      dispute.judgement || "Decision made"
                    }`,
                  },
                ]
              : []),
          ],
        })) || [];

      return {
        data: transformedDisputes,
        pagination: {
          hasNext: data.hasNextPage,
          hasPrev: data.hasPreviousPage,
          next: data.next,
          prev: data.prev,
        },
      };
    } catch (error) {
      console.error("Error fetching disputes from Story API:", error);
      throw error;
    }
  }

  async getDisputeById(
    chain: ChainType,
    disputeId: string
  ): Promise<Dispute | null> {
    const options: StoryApiDisputeOptions = {
      where: {
        disputeId: disputeId,
      },
    };

    try {
      const response = await this.getDisputes(chain, options);
      return response.data[0] || null;
    } catch (error) {
      console.error("Error fetching dispute by ID:", error);
      return null;
    }
  }

  // Add this to the StoryApiService class
  async getDisputeDetails(
    chain: ChainType,
    disputeId: string
  ): Promise<DisputeDetails> {
    const response = await fetch(`${this.baseUrl}/disputes/${disputeId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": this.apiKey,
        "X-Chain": chain,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  }

  private getDisputeType(
    targetTag?: string
  ): "infringement" | "licensing" | "ownership" | "takedown" {
    if (!targetTag) return "infringement";

    const tag = targetTag.toLowerCase();
    if (tag.includes("license") || tag.includes("licensing"))
      return "licensing";
    if (tag.includes("owner") || tag.includes("ownership")) return "ownership";
    if (tag.includes("takedown") || tag.includes("dmca")) return "takedown";
    return "infringement";
  }

  private getDisputeStatus(
    dispute: StoryApiDispute
  ): "pending" | "in-progress" | "resolved" | "rejected" | "escalated" {
    if (dispute.resolved) return "resolved";
    if (dispute.judgeAttempted) return "in-progress";
    if (dispute.disputed) return "pending";
    return "pending";
  }

  private getDisputePriority(
    dispute: StoryApiDispute
  ): "low" | "medium" | "high" | "critical" {
    // This is a simplified priority assignment - in a real system you'd have more complex logic
    if (dispute.resolved) return "low";
    if (dispute.judgeAttempted) return "high";
    return "medium";
  }

  private getDisputeOutcome(ruling?: string): "won" | "lost" | "settled" {
    if (!ruling) return "settled";

    const rulingLower = ruling.toLowerCase();
    if (rulingLower.includes("favor") || rulingLower.includes("won"))
      return "won";
    if (rulingLower.includes("against") || rulingLower.includes("lost"))
      return "lost";
    return "settled";
  }

  private getAssetType(
    imageUrl?: string
  ): "image" | "video" | "audio" | "document" {
    if (!imageUrl) return "document";

    // Check file extension or URL patterns
    const url = imageUrl.toLowerCase();
    if (
      url.includes(".jpg") ||
      url.includes(".jpeg") ||
      url.includes(".png") ||
      url.includes(".gif") ||
      url.includes(".webp")
    ) {
      return "image";
    }
    if (
      url.includes(".mp4") ||
      url.includes(".mov") ||
      url.includes(".avi") ||
      url.includes(".webm")
    ) {
      return "video";
    }
    if (
      url.includes(".mp3") ||
      url.includes(".wav") ||
      url.includes(".ogg") ||
      url.includes(".flac")
    ) {
      return "audio";
    }

    // Default to image if we can't determine the type but have an image URL
    return "image";
  }
}

// Create a singleton instance
let storyApiService: StoryApiService | null = null;

export const getStoryApiService = (): StoryApiService => {
  if (!storyApiService) {
    const apiKey = import.meta.env.VITE_STORY_API_KEY;
    if (!apiKey || apiKey === "your_story_api_key_here") {
      throw new Error(
        "Please configure VITE_STORY_API_KEY in your environment variables. Get your API key from Story Protocol documentation."
      );
    }
    storyApiService = new StoryApiService(apiKey);
  }
  return storyApiService;
};
