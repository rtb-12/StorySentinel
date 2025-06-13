// Yakoa API integration for IP registration and infringement checking

interface YakoaTokenId {
  chain: string;
  contract_address: string;
  token_id: string;
}

interface YakoaRegistrationTx {
  hash: string;
  block_number: number;
  timestamp: string;
  chain: string;
}

interface YakoaLicenseParent {
  parent_token_id: YakoaTokenId;
  license_id: string;
}

interface YakoaAuthorization {
  brand_id: string;
  brand_name: string;
  data: {
    type: "email";
    email_address: string;
  };
}

interface YakoaMedia {
  media_id: string;
  url: string;
  hash: string;
  trust_reason: {
    type: "trusted_platform";
    platform_name: string;
  };
  fetch_status: "pending" | "success" | "failed";
  uri_id: string;
}

interface YakoaInfringements {
  status: "pending" | "completed" | "failed";
  reasons: string[];
}

export interface YakoaTokenRegistrationRequest {
  id: YakoaTokenId;
  registration_tx: YakoaRegistrationTx;
  creator_id: string;
  metadata: Record<string, unknown>;
  license_parents?: YakoaLicenseParent[];
  token_authorizations?: YakoaAuthorization[];
  creator_authorizations?: YakoaAuthorization[];
  media: Array<{
    url: string;
    hash: string;
    trust_reason: {
      type: "trusted_platform";
      platform_name: string;
    };
  }>;
}

export interface YakoaTokenRegistrationResponse {
  id: YakoaTokenId;
  registration_tx: YakoaRegistrationTx;
  creator_id: string;
  metadata: Record<string, unknown>;
  license_parents: YakoaLicenseParent[];
  token_authorizations: YakoaAuthorization[];
  creator_authorizations: YakoaAuthorization[];
  media: YakoaMedia[];
  infringements: YakoaInfringements;
}

export interface YakoaTokenResponse {
  id: YakoaTokenId;
  registration_tx: YakoaRegistrationTx;
  creator_id: string;
  metadata: Record<string, unknown>;
  license_parents: YakoaLicenseParent[];
  token_authorizations: YakoaAuthorization[];
  creator_authorizations: YakoaAuthorization[];
  media: YakoaMedia[];
  infringements: YakoaInfringements;
}

class YakoaApiService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_YAKOA_BASE_URL || "";
    this.apiKey = import.meta.env.VITE_YAKOA_API_KEY || "";

    if (!this.baseUrl || !this.apiKey) {
      console.warn(
        "Yakoa API configuration missing. Please set VITE_YAKOA_BASE_URL and VITE_YAKOA_API_KEY in your .env file"
      );
    }
  }

  private getHeaders() {
    return {
      "Content-Type": "application/json",
      "X-API-KEY": this.apiKey,
      accept: "application/json",
    };
  }

  /**
   * Register a new token with Yakoa or update existing one
   */
  async registerToken(
    tokenData: YakoaTokenRegistrationRequest
  ): Promise<YakoaTokenRegistrationResponse> {
    if (!this.baseUrl || !this.apiKey) {
      throw new Error("Yakoa API not configured");
    }

    try {
      const response = await fetch(`${this.baseUrl}/token`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(tokenData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Yakoa registration failed:", response.status, errorText);
        throw new Error(
          `Failed to register token with Yakoa: ${response.status} ${errorText}`
        );
      }

      const result = await response.json();
      console.log("Token registered with Yakoa:", result);
      return result;
    } catch (error) {
      console.error("Error registering token with Yakoa:", error);
      throw error;
    }
  }

  /**
   * Get token details and infringement check results
   */
  async getToken(tokenId: string): Promise<YakoaTokenResponse> {
    if (!this.baseUrl || !this.apiKey) {
      throw new Error("Yakoa API not configured");
    }

    try {
      const response = await fetch(`${this.baseUrl}/token/${tokenId}`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Yakoa token fetch failed:", response.status, errorText);
        throw new Error(
          `Failed to fetch token from Yakoa: ${response.status} ${errorText}`
        );
      }

      const result = await response.json();
      console.log("Token retrieved from Yakoa:", result);
      return result;
    } catch (error) {
      console.error("Error fetching token from Yakoa:", error);
      throw error;
    }
  }

  /**
   * Create Yakoa token registration data from Story Protocol result
   */
  createTokenRegistrationData(
    storyResult: {
      spgNftContract?: string;
      tokenId?: string;
      txHash?: string;
      blockNumber?: number;
      ipHash?: string;
    },
    ipMetadata: {
      title: string;
      description: string;
      creators: Array<{
        name: string;
        address: string;
        contributionPercent: number;
      }>;
      [key: string]: unknown;
    },
    mediaUrls: string[],
    creatorId: string
  ): YakoaTokenRegistrationRequest {
    // Extract contract address and token ID from Story Protocol result
    const contractAddress = storyResult.spgNftContract || "";
    const tokenId = storyResult.tokenId || "";
    const txHash = storyResult.txHash || "";

    // Create the token ID
    const yakoaTokenId: YakoaTokenId = {
      chain: "story-mainnet", // or 'story-testnet' based on network
      contract_address: contractAddress,
      token_id: tokenId,
    };

    // Create registration transaction data
    const registrationTx: YakoaRegistrationTx = {
      hash: txHash,
      block_number: storyResult.blockNumber || 0,
      timestamp: new Date().toISOString(),
      chain: "story-mainnet", // or 'story-testnet' based on network
    };

    // Create media entries
    const media = mediaUrls.map((url, index) => ({
      url,
      hash: storyResult.ipHash || `hash_${index}`,
      trust_reason: {
        type: "trusted_platform" as const,
        platform_name: "Story Protocol",
      },
    }));

    // Create the registration request
    const registrationData: YakoaTokenRegistrationRequest = {
      id: yakoaTokenId,
      registration_tx: registrationTx,
      creator_id: creatorId,
      metadata: {
        ...ipMetadata,
        ipAssetType: "story-protocol",
        registrationTimestamp: new Date().toISOString(),
      },
      media,
    };

    return registrationData;
  }

  /**
   * Helper to generate a unique token identifier for Yakoa
   */
  generateTokenIdentifier(
    chain: string,
    contractAddress: string,
    tokenId: string
  ): string {
    return `${chain}_${contractAddress}_${tokenId}`;
  }
}

// Export singleton instance
export const yakoaApiService = new YakoaApiService();
export default yakoaApiService;
