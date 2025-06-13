import { Router, Request, Response } from "express";
import { storyProtocolService } from "../services/storyProtocol";

const router = Router();

// Health check endpoint
router.get("/health", (req: Request, res: Response) => {
  res.json({
    service: "Story Protocol API",
    configured: storyProtocolService.isConfigured(),
    hasApiKey: !!process.env.STORY_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Get disputes from Story Protocol
router.get("/disputes", async (req: Request, res: Response) => {
  try {
    const {
      chain = "story-aeneid",
      limit = 20,
      after,
      before,
      status,
      type,
    } = req.query;

    const options = {
      pagination: {
        limit: parseInt(limit as string),
        ...(after ? { after: after as string } : {}),
        ...(before ? { before: before as string } : {}),
      },
      filters: {
        ...(status ? { status: status as string } : {}),
        ...(type ? { type: type as string } : {}),
      },
    };

    const disputes = await storyProtocolService.getDisputes(
      chain as string,
      options
    );
    res.json(disputes);
  } catch (error) {
    console.error("Error fetching disputes:", error);
    res.status(500).json({
      error: "Failed to fetch disputes",
      message: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
});

// Get dispute details
router.get("/disputes/:disputeId", async (req: Request, res: Response) => {
  try {
    const { disputeId } = req.params;
    const { chain = "story-aeneid" } = req.query;

    const disputeDetails = await storyProtocolService.getDisputeDetails(
      chain as string,
      disputeId
    );
    res.json({
      success: true,
      data: disputeDetails,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching dispute details:", error);
    res.status(500).json({
      error: "Failed to fetch dispute details",
      message: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
});

// Get IP assets
router.get("/ip-assets", async (req: Request, res: Response) => {
  try {
    const { chain = "story-aeneid", limit = 20, after, before } = req.query;

    const options = {
      pagination: {
        limit: parseInt(limit as string),
        ...(after ? { after: after as string } : {}),
        ...(before ? { before: before as string } : {}),
      },
    };

    const ipAssets = await storyProtocolService.getIPAssets(
      chain as string,
      options
    );
    res.json(ipAssets);
  } catch (error) {
    console.error("Error fetching IP assets:", error);
    res.status(500).json({
      error: "Failed to fetch IP assets",
      message: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
});

// Get IP asset details
router.get("/ip-assets/:ipId", async (req: Request, res: Response) => {
  try {
    const { ipId } = req.params;
    const { chain = "story-aeneid" } = req.query;

    const ipAssetDetails = await storyProtocolService.getIPAssetDetails(
      chain as string,
      ipId
    );
    res.json({
      success: true,
      data: ipAssetDetails,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching IP asset details:", error);
    res.status(500).json({
      error: "Failed to fetch IP asset details",
      message: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
});

// Submit dispute to Story Protocol
router.post("/disputes", async (req: Request, res: Response) => {
  try {
    const disputeData = req.body;

    if (!disputeData) {
      return res.status(400).json({
        error: "Dispute data is required",
        timestamp: new Date().toISOString(),
      });
    }

    const result = await storyProtocolService.submitDispute(disputeData);
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error submitting dispute:", error);
    res.status(500).json({
      error: "Failed to submit dispute",
      message: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
