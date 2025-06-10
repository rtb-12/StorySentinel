import axios, { AxiosResponse } from "axios";
import { logger } from "../utils/logger";
import { YakoaResponse } from "../types";

class YakoaService {
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = process.env.YAKOA_API_URL || "https://api.yakoa.io";
    this.apiKey = process.env.YAKOA_API_KEY || "";

    if (!this.apiKey) {
      logger.warn("Yakoa API key not configured");
    }
  }

  private async makeRequest(
    method: "GET" | "POST" | "PUT" | "DELETE",
    endpoint: string,
    data?: any
  ): Promise<YakoaResponse> {
    try {
      const config = {
        method,
        url: `${this.baseURL}${endpoint}`,
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        data,
      };

      const response: AxiosResponse = await axios(config);

      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error: any) {
      logger.error("Yakoa API request failed:", {
        endpoint,
        method,
        error: error.message,
        response: error.response?.data,
      });

      return {
        success: false,
        error: error.response?.data?.message || error.message,
        statusCode: error.response?.status || 500,
      };
    }
  }

  /**
   * Register a token with Yakoa for IP monitoring
   */
  async registerToken(tokenData: {
    id: string;
    chain: string;
    contract_address: string;
    token_id: string;
    media_url: string;
    metadata: any;
    registration_tx?: string;
  }): Promise<YakoaResponse> {
    return this.makeRequest("POST", "/tokens", tokenData);
  }

  /**
   * Get token information and authentication status
   */
  async getToken(tokenId: string): Promise<YakoaResponse> {
    return this.makeRequest("GET", `/tokens/${tokenId}`);
  }

  /**
   * Update token information
   */
  async updateToken(tokenId: string, updateData: any): Promise<YakoaResponse> {
    return this.makeRequest("PUT", `/tokens/${tokenId}`, updateData);
  }

  /**
   * Delete token from monitoring
   */
  async deleteToken(tokenId: string): Promise<YakoaResponse> {
    return this.makeRequest("DELETE", `/tokens/${tokenId}`);
  }

  /**
   * Search for similar content
   */
  async searchSimilarContent(params: {
    media_url?: string;
    image_data?: string;
    threshold?: number;
  }): Promise<YakoaResponse> {
    return this.makeRequest("POST", "/search", params);
  }

  /**
   * Get infringement alerts for a token
   */
  async getTokenAlerts(tokenId: string): Promise<YakoaResponse> {
    return this.makeRequest("GET", `/tokens/${tokenId}/alerts`);
  }

  /**
   * Get all alerts for the authenticated user
   */
  async getAllAlerts(params?: {
    status?: string;
    priority?: string;
    limit?: number;
    offset?: number;
  }): Promise<YakoaResponse> {
    const queryParams = new URLSearchParams(params as any).toString();
    const endpoint = `/alerts${queryParams ? `?${queryParams}` : ""}`;
    return this.makeRequest("GET", endpoint);
  }

  /**
   * Update alert status
   */
  async updateAlert(alertId: string, status: string): Promise<YakoaResponse> {
    return this.makeRequest("PUT", `/alerts/${alertId}`, { status });
  }

  /**
   * Add brand authorization
   */
  async addBrandAuthorization(
    tokenId: string,
    authData: {
      brand_id: string;
      authorization_type: string;
      metadata?: any;
    }
  ): Promise<YakoaResponse> {
    return this.makeRequest(
      "POST",
      `/tokens/${tokenId}/brand-authorizations`,
      authData
    );
  }

  /**
   * Get brand authorizations for a token
   */
  async getBrandAuthorizations(tokenId: string): Promise<YakoaResponse> {
    return this.makeRequest("GET", `/tokens/${tokenId}/brand-authorizations`);
  }

  /**
   * Trigger manual scan for a token
   */
  async triggerScan(tokenId: string): Promise<YakoaResponse> {
    return this.makeRequest("POST", `/tokens/${tokenId}/scan`, {});
  }

  /**
   * Get scan history for a token
   */
  async getScanHistory(tokenId: string): Promise<YakoaResponse> {
    return this.makeRequest("GET", `/tokens/${tokenId}/scans`);
  }

  /**
   * Get platform statistics
   */
  async getPlatformStats(): Promise<YakoaResponse> {
    return this.makeRequest("GET", "/stats/platforms");
  }

  /**
   * Get detection methods statistics
   */
  async getDetectionStats(): Promise<YakoaResponse> {
    return this.makeRequest("GET", "/stats/detection-methods");
  }

  /**
   * Health check for Yakoa service
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.makeRequest("GET", "/health");
      return response.success;
    } catch (error) {
      logger.error("Yakoa health check failed:", error);
      return false;
    }
  }

  /**
   * Get supported platforms for monitoring
   */
  async getSupportedPlatforms(): Promise<YakoaResponse> {
    try {
      // Mock data for now - replace with actual API call
      const platforms = [
        { id: "youtube", name: "YouTube", type: "video" },
        { id: "instagram", name: "Instagram", type: "social" },
        { id: "twitter", name: "Twitter", type: "social" },
        { id: "facebook", name: "Facebook", type: "social" },
        { id: "tiktok", name: "TikTok", type: "video" },
        { id: "amazon", name: "Amazon", type: "marketplace" },
        { id: "etsy", name: "Etsy", type: "marketplace" },
        { id: "shopify", name: "Shopify", type: "marketplace" },
      ];

      return {
        success: true,
        statusCode: 200,
        data: platforms,
      };
    } catch (error) {
      logger.error("Failed to get supported platforms:", error);
      return {
        success: false,
        statusCode: 500,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}

export default new YakoaService();
