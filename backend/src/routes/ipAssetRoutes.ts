import express from "express";
import { Request, Response } from "express";
import { logger } from "../utils/logger";
import storyProtocolService from "../services/storyProtocolService";
import yakoaService from "../services/yakoaService";

const router = express.Router();

// Mock database - in production, use MongoDB
let ipAssets: any[] = [
  {
    id: "1",
    title: "Digital Art Collection #1",
    description: "A unique digital art piece showcasing modern creativity",
    type: "image",
    fileUrl: "https://example.com/art1.jpg",
    thumbnailUrl: "https://example.com/art1-thumb.jpg",
    metadata: {
      originalFileName: "digital-art-1.jpg",
      fileSize: 2048000,
      mimeType: "image/jpeg",
      dimensions: { width: 1920, height: 1080 },
    },
    storyData: {
      ipAssetId: "0xabc123...",
      tokenId: "1",
      contractAddress: "0xcontract123...",
    },
    yakoaData: {
      tokenId: "yakoa_token_001",
    },
    licensing: {
      type: "commercial",
      terms: "Commercial use allowed with attribution",
      royaltyPercentage: 10,
      allowDerivatives: true,
    },
    owner: "0xowner123...",
    status: "active",
    createdAt: new Date("2025-06-01"),
    updatedAt: new Date("2025-06-01"),
  },
  {
    id: "2",
    title: "Brand Logo Design",
    description: "Professional brand logo for corporate identity",
    type: "image",
    fileUrl: "https://example.com/logo.png",
    thumbnailUrl: "https://example.com/logo-thumb.png",
    metadata: {
      originalFileName: "brand-logo.png",
      fileSize: 512000,
      mimeType: "image/png",
      dimensions: { width: 500, height: 500 },
    },
    storyData: {
      ipAssetId: "0xdef456...",
      tokenId: "2",
      contractAddress: "0xcontract123...",
    },
    yakoaData: {
      tokenId: "yakoa_token_002",
    },
    licensing: {
      type: "non-commercial",
      terms: "Non-commercial use only",
      allowDerivatives: false,
    },
    owner: "0xowner123...",
    status: "disputed",
    createdAt: new Date("2025-05-28"),
    updatedAt: new Date("2025-06-08"),
  },
];

/**
 * @route GET /api/ip-assets
 * @desc Get all IP assets for the user
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const { type, status, search, limit = 20, offset = 0 } = req.query;

    let filteredAssets = [...ipAssets];

    // Apply filters
    if (type) {
      filteredAssets = filteredAssets.filter((asset) => asset.type === type);
    }
    if (status) {
      filteredAssets = filteredAssets.filter(
        (asset) => asset.status === status
      );
    }
    if (search) {
      const searchTerm = (search as string).toLowerCase();
      filteredAssets = filteredAssets.filter(
        (asset) =>
          asset.title.toLowerCase().includes(searchTerm) ||
          asset.description.toLowerCase().includes(searchTerm)
      );
    }

    // Apply pagination
    const startIndex = parseInt(offset as string);
    const endIndex = startIndex + parseInt(limit as string);
    const paginatedAssets = filteredAssets.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        assets: paginatedAssets,
        total: filteredAssets.length,
        limit: parseInt(limit as string),
        offset: startIndex,
      },
    });
  } catch (error: any) {
    logger.error("Error fetching IP assets:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch IP assets",
    });
  }
});

/**
 * @route GET /api/ip-assets/:id
 * @desc Get specific IP asset
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const asset = ipAssets.find((a) => a.id === id);

    if (!asset) {
      return res.status(404).json({
        success: false,
        error: "IP asset not found",
      });
    }

    res.json({
      success: true,
      data: asset,
    });
  } catch (error: any) {
    logger.error("Error fetching IP asset:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch IP asset",
    });
  }
});

/**
 * @route POST /api/ip-assets
 * @desc Create new IP asset
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, description, type, fileUrl, metadata, licensing, owner } =
      req.body;

    // Validate required fields
    if (!title || !description || !type || !fileUrl || !owner) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    // Create new IP asset
    const newAsset = {
      id: (ipAssets.length + 1).toString(),
      title,
      description,
      type,
      fileUrl,
      thumbnailUrl: req.body.thumbnailUrl,
      metadata: metadata || {},
      storyData: {},
      yakoaData: {},
      licensing,
      owner,
      collaborators: req.body.collaborators || [],
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    ipAssets.push(newAsset);

    res.status(201).json({
      success: true,
      data: newAsset,
      message: "IP asset created successfully",
    });
  } catch (error: any) {
    logger.error("Error creating IP asset:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create IP asset",
    });
  }
});

/**
 * @route POST /api/ip-assets/:id/register
 * @desc Register IP asset on Story Protocol
 */
router.post("/:id/register", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nftContract, tokenId } = req.body;

    const asset = ipAssets.find((a) => a.id === id);
    if (!asset) {
      return res.status(404).json({
        success: false,
        error: "IP asset not found",
      });
    }

    // Register with Story Protocol
    const storyResult = await storyProtocolService.registerIPAsset({
      nftContract,
      tokenId,
      metadata: {
        title: asset.title,
        description: asset.description,
        mediaUrl: asset.fileUrl,
        attributes: [],
      },
    });

    if (!storyResult.success) {
      return res.status(500).json({
        success: false,
        error: "Failed to register with Story Protocol",
        details: storyResult.error,
      });
    }

    // Register with Yakoa
    const yakoaResult = await yakoaService.registerToken({
      id: `${nftContract}-${tokenId}`,
      chain:
        process.env.STORY_CHAIN_ID === "mainnet"
          ? "story-mainnet"
          : "story-testnet",
      contract_address: nftContract,
      token_id: tokenId,
      media_url: asset.fileUrl,
      metadata: {
        title: asset.title,
        description: asset.description,
        type: asset.type,
      },
      registration_tx: storyResult.transactionHash,
    });

    // Update asset with registration data
    asset.storyData = {
      ...asset.storyData,
      ipAssetId: storyResult.data?.ipAssetId,
      tokenId,
      contractAddress: nftContract,
      transactionHash: storyResult.transactionHash,
    };

    if (yakoaResult.success) {
      asset.yakoaData = {
        ...asset.yakoaData,
        tokenId: `${nftContract}-${tokenId}`,
      };
    }

    asset.status = "active";
    asset.updatedAt = new Date();

    res.json({
      success: true,
      data: {
        asset,
        storyResult,
        yakoaResult,
      },
      message: "IP asset registered successfully",
    });
  } catch (error: any) {
    logger.error("Error registering IP asset:", error);
    res.status(500).json({
      success: false,
      error: "Failed to register IP asset",
    });
  }
});

/**
 * @route POST /api/ip-assets/:id/scan
 * @desc Trigger manual scan for IP asset
 */
router.post("/:id/scan", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const asset = ipAssets.find((a) => a.id === id);

    if (!asset) {
      return res.status(404).json({
        success: false,
        error: "IP asset not found",
      });
    }

    if (!asset.yakoaData?.tokenId) {
      return res.status(400).json({
        success: false,
        error: "Asset not registered with Yakoa monitoring",
      });
    }

    const scanResult = await yakoaService.triggerScan(asset.yakoaData.tokenId);

    res.json({
      success: true,
      data: scanResult,
      message: "Manual scan triggered successfully",
    });
  } catch (error: any) {
    logger.error("Error triggering scan:", error);
    res.status(500).json({
      success: false,
      error: "Failed to trigger scan",
    });
  }
});

/**
 * @route PUT /api/ip-assets/:id
 * @desc Update IP asset
 */
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const assetIndex = ipAssets.findIndex((a) => a.id === id);
    if (assetIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "IP asset not found",
      });
    }

    // Update asset
    ipAssets[assetIndex] = {
      ...ipAssets[assetIndex],
      ...updates,
      updatedAt: new Date(),
    };

    res.json({
      success: true,
      data: ipAssets[assetIndex],
      message: "IP asset updated successfully",
    });
  } catch (error: any) {
    logger.error("Error updating IP asset:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update IP asset",
    });
  }
});

/**
 * @route DELETE /api/ip-assets/:id
 * @desc Delete IP asset
 */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const assetIndex = ipAssets.findIndex((a) => a.id === id);

    if (assetIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "IP asset not found",
      });
    }

    const asset = ipAssets[assetIndex];

    // Remove from Yakoa monitoring if registered
    if (asset.yakoaData?.tokenId) {
      await yakoaService.deleteToken(asset.yakoaData.tokenId);
    }

    // Remove from local storage
    ipAssets.splice(assetIndex, 1);

    res.json({
      success: true,
      message: "IP asset deleted successfully",
    });
  } catch (error: any) {
    logger.error("Error deleting IP asset:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete IP asset",
    });
  }
});

export default router;
