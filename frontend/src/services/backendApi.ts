// Backend API service for StorySentinel

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

interface BackendResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  error?: string;
  message?: string;
}

interface YakoaRegistrationTx {
  hash: string;
  block_number: number;
  timestamp: string;
  chain: string;
}

interface YakoaTokenRegistrationRequest {
  id: string; // Changed from YakoaTokenId to string
  registration_tx: YakoaRegistrationTx;
  creator_id: string; // Must match pattern '^0x[a-f0-9]{40}$'
  metadata: Record<string, unknown>;
  license_parents?: unknown[];
  token_authorizations?: unknown[];
  creator_authorizations?: unknown[];
  media: Array<{
    media_id: string; // Required field
    url: string;
    hash: string; // Must match pattern '^[a-f0-9]{64}$'
    trust_reason: {
      type: "trusted_platform";
      platform_name: string;
    };
  }>;
}

export interface YakoaTokenRegistrationResponse {
  id: string; // Changed from YakoaTokenId to string to match request
  registration_tx: YakoaRegistrationTx;
  creator_id: string;
  metadata: Record<string, unknown>;
  license_parents: unknown[];
  token_authorizations: unknown[];
  creator_authorizations: unknown[];
  media: unknown[];
  infringements: {
    status: "pending" | "completed" | "failed";
    reasons: string[];
  };
}

class BackendApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));
      throw new Error(
        errorData.message || errorData.error || `HTTP ${response.status}`
      );
    }

    const data = await response.json();
    return data.data || data;
  }

  /**
   * Health check for the backend API
   */
  async healthCheck(): Promise<Record<string, unknown>> {
    return this.makeRequest<Record<string, unknown>>("/health");
  }

  /**
   * Register a token with Yakoa through the backend
   */
  async registerTokenWithYakoa(
    tokenData: YakoaTokenRegistrationRequest
  ): Promise<YakoaTokenRegistrationResponse> {
    return this.makeRequest<YakoaTokenRegistrationResponse>(
      "/api/yakoa/register",
      {
        method: "POST",
        body: JSON.stringify(tokenData),
      }
    );
  }

  /**
   * Get token details from Yakoa through the backend
   */
  async getTokenFromYakoa(
    tokenId: string
  ): Promise<YakoaTokenRegistrationResponse> {
    return this.makeRequest<YakoaTokenRegistrationResponse>(
      `/api/yakoa/token/${tokenId}`
    );
  }

  /**
   * Create Yakoa registration data from Story Protocol result
   */
  async createYakoaRegistrationData(
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
    creatorId: string,
    chain: string = "story-testnet"
  ): Promise<YakoaTokenRegistrationRequest> {
    return this.makeRequest<YakoaTokenRegistrationRequest>(
      "/api/yakoa/create-registration-data",
      {
        method: "POST",
        body: JSON.stringify({
          storyResult,
          ipMetadata,
          mediaUrls,
          creatorId,
          chain,
        }),
      }
    );
  }

  /**
   * Generate unique token identifier for Yakoa
   */
  async generateTokenIdentifier(
    chain: string,
    contractAddress: string,
    tokenId: string
  ): Promise<{ identifier: string }> {
    return this.makeRequest<{ identifier: string }>(
      "/api/yakoa/generate-identifier",
      {
        method: "POST",
        body: JSON.stringify({
          chain,
          contractAddress,
          tokenId,
        }),
      }
    );
  }

  /**
   * Check Yakoa service health through backend
   */
  async yakoaHealthCheck(): Promise<Record<string, unknown>> {
    return this.makeRequest<Record<string, unknown>>("/api/yakoa/health");
  }

  /**
   * Check Story Protocol service health through backend
   */
  async storyHealthCheck(): Promise<Record<string, unknown>> {
    return this.makeRequest<Record<string, unknown>>("/api/story/health");
  }
}

// Export singleton instance
export const backendApiService = new BackendApiService();
export default backendApiService;
