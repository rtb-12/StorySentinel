// Types for Yakoa API integration

export interface YakoaTokenId {
  chain: string;
  contract_address: string;
  token_id: string;
}

export interface YakoaRegistrationTx {
  hash: string;
  block_number: number;
  timestamp: string;
  chain: string;
}

export interface YakoaLicenseParent {
  parent_token_id: YakoaTokenId;
  license_id: string;
}

export interface YakoaAuthorization {
  brand_id: string;
  brand_name: string;
  data: {
    type: "email";
    email_address: string;
  };
}

export interface YakoaMedia {
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

export interface YakoaInfringements {
  status: "pending" | "completed" | "failed";
  reasons: string[];
}

export interface YakoaTokenRegistrationRequest {
  id: string; // Changed from YakoaTokenId to string
  registration_tx: YakoaRegistrationTx;
  creator_id: string; // Must match pattern '^0x[a-f0-9]{40}$'
  metadata: Record<string, unknown>;
  license_parents?: YakoaLicenseParent[];
  token_authorizations?: YakoaAuthorization[];
  creator_authorizations?: YakoaAuthorization[];
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
  license_parents: YakoaLicenseParent[];
  token_authorizations: YakoaAuthorization[];
  creator_authorizations: YakoaAuthorization[];
  media: YakoaMedia[];
  infringements: YakoaInfringements;
}

export interface YakoaTokenResponse {
  id: string; // Changed from YakoaTokenId to string to match request
  registration_tx: YakoaRegistrationTx;
  creator_id: string;
  metadata: Record<string, unknown>;
  license_parents: YakoaLicenseParent[];
  token_authorizations: YakoaAuthorization[];
  creator_authorizations: YakoaAuthorization[];
  media: YakoaMedia[];
  infringements: YakoaInfringements;
}

// Story Protocol types
export interface StoryProtocolResult {
  spgNftContract?: string;
  tokenId?: string;
  txHash?: string;
  blockNumber?: number;
  ipHash?: string;
}

export interface IPMetadata {
  title: string;
  description: string;
  creators: Array<{
    name: string;
    address: string;
    contributionPercent: number;
  }>;
  [key: string]: unknown;
}
