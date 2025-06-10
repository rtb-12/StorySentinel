export interface IPAsset {
  id: string;
  title: string;
  description: string;
  type: "image" | "video" | "audio" | "document";
  fileUrl: string;
  thumbnailUrl?: string;
  metadata: {
    originalFileName: string;
    fileSize: number;
    mimeType: string;
    dimensions?: {
      width: number;
      height: number;
    };
    duration?: number;
  };
  storyData: {
    ipAssetId?: string;
    tokenId?: string;
    contractAddress?: string;
    transactionHash?: string;
    registrationTx?: string;
  };
  yakoaData?: {
    tokenId?: string;
    registrationHash?: string;
  };
  licensing: {
    type: "commercial" | "non-commercial" | "custom";
    terms: string;
    royaltyPercentage?: number;
    allowDerivatives: boolean;
  };
  owner: string;
  collaborators?: string[];
  status: "draft" | "registering" | "active" | "disputed" | "suspended";
  createdAt: Date;
  updatedAt: Date;
}

export interface Alert {
  id: string;
  ipAssetId: string;
  title: string;
  description: string;
  similarity: number;
  confidence: number;
  source: {
    url: string;
    platform: string;
    timestamp: Date;
    domain: string;
  };
  suspectContent: {
    imageUrl?: string;
    videoUrl?: string;
    audioUrl?: string;
    description?: string;
  };
  yakoaData: {
    matchId: string;
    detectionMethod: string;
    analysisData: Record<string, any>;
  };
  status: "new" | "reviewed" | "disputed" | "resolved" | "ignored";
  priority: "low" | "medium" | "high" | "critical";
  assignedTo?: string;
  actions: {
    actionType: "viewed" | "escalated" | "ignored" | "disputed";
    timestamp: Date;
    userId: string;
    notes?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Dispute {
  id: string;
  ipAssetId: string;
  alertId?: string;
  title: string;
  description: string;
  disputeType: "infringement" | "licensing" | "ownership" | "takedown";
  status: "pending" | "in-progress" | "resolved" | "rejected" | "escalated";
  priority: "low" | "medium" | "high" | "critical";
  evidence: {
    id: string;
    type: "image" | "document" | "url" | "transaction" | "screenshot";
    title: string;
    url?: string;
    description?: string;
    uploadedAt: Date;
  }[];
  respondent: {
    platform: string;
    identifier: string;
    contact?: string;
    walletAddress?: string;
  };
  storyData?: {
    disputeId?: string;
    transactionHash?: string;
  };
  timeline: {
    id: string;
    date: Date;
    action: string;
    actor: string;
    description: string;
    metadata?: Record<string, any>;
  }[];
  outcome?: {
    result: "won" | "lost" | "settled";
    compensation?: string;
    terms?: string;
    enforcementActions?: string[];
  };
  createdBy: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface YakoaResponse {
  success: boolean;
  data?: any;
  error?: string;
  statusCode: number;
}

export interface StoryProtocolResponse {
  success: boolean;
  data?: any;
  error?: string;
  transactionHash?: string;
}

export interface AnalyticsData {
  overview: {
    totalAssets: number;
    totalScans: number;
    alertsGenerated: number;
    disputesWon: number;
    protectionScore: number;
  };
  trends: {
    scansOverTime: {
      date: string;
      scans: number;
      alerts: number;
    }[];
    topInfringedAssets: {
      id: string;
      name: string;
      infringements: number;
      resolved: number;
    }[];
    platformBreakdown: {
      platform: string;
      count: number;
      percentage: number;
    }[];
    topInfringers: {
      identifier: string;
      platform: string;
      violations: number;
    }[];
  };
  timeRange: "7d" | "30d" | "90d" | "1y";
  generatedAt: Date;
}
