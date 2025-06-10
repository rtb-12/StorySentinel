import express from "express";
import { StoryProtocolService } from "../services/storyProtocolService";
import { logger } from "../utils/logger";

const router = express.Router();
const storyService = new StoryProtocolService();

// Register IP asset on Story Protocol
router.post("/register", async (req, res) => {
  try {
    const { assetData, licenseTerms, userWallet } = req.body;

    if (!assetData || !userWallet) {
      return res.status(400).json({
        success: false,
        message: "Asset data and user wallet are required for registration",
      });
    }

    const result = await storyService.registerIPAsset(
      assetData,
      licenseTerms,
      userWallet
    );

    logger.info(`IP asset registered on Story Protocol: ${result.ipId}`);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Error registering IP asset on Story Protocol:", error);
    res.status(500).json({
      success: false,
      message: "Failed to register IP asset",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get IP asset details from Story Protocol
router.get("/asset/:ipId", async (req, res) => {
  try {
    const { ipId } = req.params;

    const assetDetails = await storyService.getIPAsset(ipId);

    logger.info(`IP asset details fetched for: ${ipId}`);
    res.json({
      success: true,
      data: assetDetails,
    });
  } catch (error) {
    logger.error("Error fetching IP asset details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch IP asset details",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Create license for IP asset
router.post("/license/create", async (req, res) => {
  try {
    const { ipId, licenseTerms, userWallet } = req.body;

    if (!ipId || !licenseTerms || !userWallet) {
      return res.status(400).json({
        success: false,
        message: "IP ID, license terms, and user wallet are required",
      });
    }

    const license = await storyService.createLicense(
      ipId,
      licenseTerms,
      userWallet
    );

    logger.info(`License created for IP asset: ${ipId}`);
    res.json({
      success: true,
      data: license,
    });
  } catch (error) {
    logger.error("Error creating license:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create license",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get licenses for IP asset
router.get("/asset/:ipId/licenses", async (req, res) => {
  try {
    const { ipId } = req.params;

    const licenses = await storyService.getLicenses(ipId);

    logger.info(`Licenses fetched for IP asset: ${ipId}`);
    res.json({
      success: true,
      data: licenses,
    });
  } catch (error) {
    logger.error("Error fetching licenses:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch licenses",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Submit dispute to Story Protocol
router.post("/dispute/submit", async (req, res) => {
  try {
    const { disputeData, evidence, userWallet } = req.body;

    if (!disputeData || !userWallet) {
      return res.status(400).json({
        success: false,
        message: "Dispute data and user wallet are required",
      });
    }

    const result = await storyService.submitDispute(
      disputeData,
      evidence,
      userWallet
    );

    logger.info(`Dispute submitted to Story Protocol: ${result.disputeId}`);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Error submitting dispute to Story Protocol:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit dispute",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get dispute status from Story Protocol
router.get("/dispute/:disputeId", async (req, res) => {
  try {
    const { disputeId } = req.params;

    const dispute = await storyService.getDispute(disputeId);

    logger.info(`Dispute status fetched: ${disputeId}`);
    res.json({
      success: true,
      data: dispute,
    });
  } catch (error) {
    logger.error("Error fetching dispute status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dispute status",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get royalty information for IP asset
router.get("/asset/:ipId/royalties", async (req, res) => {
  try {
    const { ipId } = req.params;

    const royalties = await storyService.getRoyalties(ipId);

    logger.info(`Royalty information fetched for IP asset: ${ipId}`);
    res.json({
      success: true,
      data: royalties,
    });
  } catch (error) {
    logger.error("Error fetching royalty information:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch royalty information",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Collect royalties for IP asset
router.post("/royalties/collect", async (req, res) => {
  try {
    const { ipId, userWallet } = req.body;

    if (!ipId || !userWallet) {
      return res.status(400).json({
        success: false,
        message: "IP ID and user wallet are required",
      });
    }

    const result = await storyService.collectRoyalties(ipId, userWallet);

    logger.info(`Royalties collected for IP asset: ${ipId}`);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Error collecting royalties:", error);
    res.status(500).json({
      success: false,
      message: "Failed to collect royalties",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get IP asset's derivative works
router.get("/asset/:ipId/derivatives", async (req, res) => {
  try {
    const { ipId } = req.params;

    const derivatives = await storyService.getDerivativeWorks(ipId);

    logger.info(`Derivative works fetched for IP asset: ${ipId}`);
    res.json({
      success: true,
      data: derivatives,
    });
  } catch (error) {
    logger.error("Error fetching derivative works:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch derivative works",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Create derivative work
router.post("/derivative/create", async (req, res) => {
  try {
    const { parentIpId, derivativeData, userWallet } = req.body;

    if (!parentIpId || !derivativeData || !userWallet) {
      return res.status(400).json({
        success: false,
        message: "Parent IP ID, derivative data, and user wallet are required",
      });
    }

    const result = await storyService.createDerivativeWork(
      parentIpId,
      derivativeData,
      userWallet
    );

    logger.info(`Derivative work created from parent IP: ${parentIpId}`);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Error creating derivative work:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create derivative work",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get IP graph (relationships between assets)
router.get("/graph/:ipId", async (req, res) => {
  try {
    const { ipId } = req.params;
    const { depth = 2 } = req.query;

    const graph = await storyService.getIPGraph(
      ipId,
      parseInt(depth as string)
    );

    logger.info(`IP graph fetched for asset: ${ipId}`);
    res.json({
      success: true,
      data: graph,
    });
  } catch (error) {
    logger.error("Error fetching IP graph:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch IP graph",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get user's IP assets
router.get("/user/:walletAddress/assets", async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const assets = await storyService.getUserAssets(
      walletAddress,
      parseInt(page as string),
      parseInt(limit as string)
    );

    logger.info(`User assets fetched for wallet: ${walletAddress}`);
    res.json({
      success: true,
      data: assets,
    });
  } catch (error) {
    logger.error("Error fetching user assets:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user assets",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
