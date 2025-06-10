import express from "express";
import yakoaService from "../services/yakoaService";
import { logger } from "../utils/logger";

const router = express.Router();

// Search for content across platforms
router.post("/search", async (req, res) => {
  try {
    const { query, platforms, filters } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const results = await yakoaService.searchContent(query, platforms, filters);

    logger.info(`Yakoa search performed for query: ${query}`);
    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    logger.error("Error performing Yakoa search:", error);
    res.status(500).json({
      success: false,
      message: "Failed to perform search",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Analyze content for potential infringement
router.post("/analyze", async (req, res) => {
  try {
    const { contentUrl, referenceAssets, analysisType } = req.body;

    if (!contentUrl) {
      return res.status(400).json({
        success: false,
        message: "Content URL is required for analysis",
      });
    }

    const analysis = await yakoaService.analyzeContent(
      contentUrl,
      referenceAssets,
      analysisType
    );

    logger.info(`Content analysis performed for URL: ${contentUrl}`);
    res.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    logger.error("Error analyzing content:", error);
    res.status(500).json({
      success: false,
      message: "Failed to analyze content",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get monitoring status for tracked assets
router.get("/monitoring/:assetId", async (req, res) => {
  try {
    const { assetId } = req.params;

    const status = await yakoaService.getMonitoringStatus(assetId);

    logger.info(`Monitoring status requested for asset: ${assetId}`);
    res.json({
      success: true,
      data: status,
    });
  } catch (error) {
    logger.error("Error fetching monitoring status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch monitoring status",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Start monitoring for an asset
router.post("/monitoring/start", async (req, res) => {
  try {
    const { assetId, monitoringConfig } = req.body;

    if (!assetId) {
      return res.status(400).json({
        success: false,
        message: "Asset ID is required to start monitoring",
      });
    }

    const result = await yakoaService.startMonitoring(
      assetId,
      monitoringConfig
    );

    logger.info(`Monitoring started for asset: ${assetId}`);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Error starting monitoring:", error);
    res.status(500).json({
      success: false,
      message: "Failed to start monitoring",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Stop monitoring for an asset
router.post("/monitoring/stop", async (req, res) => {
  try {
    const { assetId } = req.body;

    if (!assetId) {
      return res.status(400).json({
        success: false,
        message: "Asset ID is required to stop monitoring",
      });
    }

    const result = await yakoaService.stopMonitoring(assetId);

    logger.info(`Monitoring stopped for asset: ${assetId}`);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Error stopping monitoring:", error);
    res.status(500).json({
      success: false,
      message: "Failed to stop monitoring",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Update monitoring configuration
router.put("/monitoring/:assetId", async (req, res) => {
  try {
    const { assetId } = req.params;
    const { monitoringConfig } = req.body;

    const result = await yakoaService.updateMonitoringConfig(
      assetId,
      monitoringConfig
    );

    logger.info(`Monitoring configuration updated for asset: ${assetId}`);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Error updating monitoring configuration:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update monitoring configuration",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get detection results for an asset
router.get("/detections/:assetId", async (req, res) => {
  try {
    const { assetId } = req.params;
    const { page = 1, limit = 20, severity, status } = req.query;

    const filters = {
      severity: severity as string,
      status: status as string,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
    };

    const detections = await yakoaService.getDetectionResults(assetId, filters);

    logger.info(`Detection results requested for asset: ${assetId}`);
    res.json({
      success: true,
      data: detections,
    });
  } catch (error) {
    logger.error("Error fetching detection results:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch detection results",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Verify a potential infringement
router.post("/verify", async (req, res) => {
  try {
    const { detectionId, verificationData } = req.body;

    if (!detectionId) {
      return res.status(400).json({
        success: false,
        message: "Detection ID is required for verification",
      });
    }

    const result = await yakoaService.verifyInfringement(
      detectionId,
      verificationData
    );

    logger.info(
      `Infringement verification performed for detection: ${detectionId}`
    );
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Error verifying infringement:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify infringement",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get supported platforms
router.get("/platforms", async (req, res) => {
  try {
    const platforms = await yakoaService.getSupportedPlatforms();

    res.json({
      success: true,
      data: platforms,
    });
  } catch (error) {
    logger.error("Error fetching supported platforms:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch supported platforms",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
