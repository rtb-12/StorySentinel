import fetch from "node-fetch";
import {
  YakoaTokenRegistrationRequest,
  YakoaTokenRegistrationResponse,
  YakoaTokenResponse,
  YakoaTokenId,
  YakoaRegistrationTx,
  StoryProtocolResult,
  IPMetadata,
} from "../types";

class YakoaService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl =
      process.env.YAKOA_BASE_URL ||
      "https://docs-demo.ip-api-sandbox.yakoa.io/docs-demo";
    this.apiKey =
      process.env.YAKOA_API_KEY || "zsSIvo4j7P15AB8qWzXej7JB6oSGyNeElcWL01F6";

    if (!this.baseUrl || !this.apiKey) {
      console.warn(
        "Yakoa API configuration missing. Please set YAKOA_BASE_URL and YAKOA_API_KEY in your .env file"
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

    console.log(
      "Registering token with Yakoa:",
      JSON.stringify(tokenData, null, 2)
    );

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

      const result = (await response.json()) as YakoaTokenRegistrationResponse;
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

      const result = (await response.json()) as YakoaTokenResponse;
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
    storyResult: StoryProtocolResult,
    ipMetadata: IPMetadata,
    mediaUrls: string[],
    creatorId: string,
    chain: string = "story-testnet"
  ): YakoaTokenRegistrationRequest {
    // Extract contract address and token ID from Story Protocol result
    const contractAddress = storyResult.spgNftContract || "";
    const tokenId = storyResult.tokenId || "";
    const txHash = storyResult.txHash || "";

    // Create a unique token identifier string in the format required by Yakoa
    // Pattern: ^0x[a-f0-9]{40}(:[0-9]+)?$ (Ethereum address with optional :tokenId)
    let formattedContractAddress = contractAddress.toLowerCase();
    if (!formattedContractAddress.startsWith("0x")) {
      formattedContractAddress = `0x${formattedContractAddress}`;
    }
    // Ensure it's exactly 42 characters (0x + 40 hex chars) and only contains valid hex
    if (
      formattedContractAddress.length !== 42 ||
      !/^0x[a-f0-9]{40}$/.test(formattedContractAddress)
    ) {
      // If invalid, create a valid format by padding/truncating
      const hexPart = formattedContractAddress
        .replace(/^0x/, "")
        .replace(/[^a-f0-9]/g, "");
      formattedContractAddress = `0x${hexPart
        .padStart(40, "0")
        .substring(0, 40)}`;
    }
    const tokenIdString = tokenId
      ? `${formattedContractAddress}:${tokenId}`
      : formattedContractAddress;

    // Ensure creator_id is a valid Ethereum address format (^0x[a-f0-9]{40}$)
    let formattedCreatorId = creatorId.toLowerCase();
    if (!formattedCreatorId.startsWith("0x")) {
      formattedCreatorId = `0x${formattedCreatorId}`;
    }
    // Ensure it's exactly 42 characters (0x + 40 hex chars) and only contains valid hex
    if (
      formattedCreatorId.length !== 42 ||
      !/^0x[a-f0-9]{40}$/.test(formattedCreatorId)
    ) {
      // If invalid, create a valid format by padding/truncating
      const hexPart = formattedCreatorId
        .replace(/^0x/, "")
        .replace(/[^a-f0-9]/g, "");
      formattedCreatorId = `0x${hexPart.padStart(40, "0").substring(0, 40)}`;
    }

    // Create registration transaction data
    const registrationTx: YakoaRegistrationTx = {
      hash: txHash,
      block_number: storyResult.blockNumber || 0,
      timestamp: new Date().toISOString(),
      chain,
    };

    // Generate proper 64-character hex hashes for media
    const generateHash = (index: number): string => {
      const baseHash = storyResult.ipHash || `${Date.now()}_${index}`;
      // Convert to hex if not already, then pad to 64 characters
      let hexHash = baseHash;
      if (!baseHash.match(/^[a-f0-9]+$/i)) {
        // Convert string to hex
        hexHash = Buffer.from(baseHash).toString("hex");
      }
      // Ensure it's exactly 64 characters of hex
      return hexHash.padEnd(64, "0").substring(0, 64).toLowerCase();
    };

    // Create media entries with required fields
    const media = mediaUrls.map((url, index) => ({
      media_id: `media_${Date.now()}_${index}`, // Required field
      url,
      hash: generateHash(index), // Must be 64-character hex string
      trust_reason: {
        type: "trusted_platform" as const,
        platform_name: "Story Protocol",
      },
    }));

    // Create the registration request with correct format
    const registrationData: YakoaTokenRegistrationRequest = {
      id: tokenIdString, // String format, not object
      registration_tx: registrationTx,
      creator_id: formattedCreatorId, // Must match Ethereum address pattern
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
   * Format: 0x[address]:[tokenId] (matching Yakoa's required pattern)
   */
  generateTokenIdentifier(
    chain: string,
    contractAddress: string,
    tokenId: string
  ): string {
    // Format the contract address to ensure it's valid
    let formattedContractAddress = contractAddress.toLowerCase();
    if (!formattedContractAddress.startsWith("0x")) {
      formattedContractAddress = `0x${formattedContractAddress}`;
    }
    if (
      formattedContractAddress.length !== 42 ||
      !/^0x[a-f0-9]{40}$/.test(formattedContractAddress)
    ) {
      const hexPart = formattedContractAddress
        .replace(/^0x/, "")
        .replace(/[^a-f0-9]/g, "");
      formattedContractAddress = `0x${hexPart
        .padStart(40, "0")
        .substring(0, 40)}`;
    }

    return tokenId
      ? `${formattedContractAddress}:${tokenId}`
      : formattedContractAddress;
  }

  /**
   * Check if the API is properly configured
   */
  isConfigured(): boolean {
    return !!(this.baseUrl && this.apiKey);
  }
}

// Export singleton instance
export const yakoaService = new YakoaService();
export default yakoaService;
