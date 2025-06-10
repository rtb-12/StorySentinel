import express from "express";
import { Request, Response } from "express";
import { logger } from "../utils/logger";
import yakoaService from "../services/yakoaService";

const router = express.Router();

// Mock database - in production, use MongoDB
let alerts: any[] = [
  {
    id: "1",
    ipAssetId: "1",
    title: "High Similarity Match Detected",
    description:
      "Your digital art has been found on an unauthorized marketplace",
    similarity: 94,
    confidence: 87,
    source: {
      url: "https://example-marketplace.com/art/stolen-piece",
      platform: "NFT Marketplace",
      timestamp: new Date("2025-06-10T08:30:00Z"),
      domain: "example-marketplace.com",
    },
    suspectContent: {
      imageUrl: "https://example-marketplace.com/images/stolen-art.jpg",
      description: "Unauthorized copy of digital art",
    },
    yakoaData: {
      matchId: "yakoa_match_001",
      detectionMethod: "AI_VISUAL_SIMILARITY",
      analysisData: {
        features: ["color_histogram", "edge_detection", "texture_analysis"],
        confidence_breakdown: {
          visual: 0.94,
          metadata: 0.82,
          contextual: 0.85,
        },
      },
    },
    status: "new",
    priority: "critical",
    actions: [],
    createdAt: new Date("2025-06-10T08:30:00Z"),
    updatedAt: new Date("2025-06-10T08:30:00Z"),
  },
  {
    id: "2",
    ipAssetId: "2",
    title: "Logo Usage Detected",
    description: "Your brand logo is being used without authorization",
    similarity: 89,
    confidence: 92,
    source: {
      url: "https://social-platform.com/post/123456",
      platform: "Social Media",
      timestamp: new Date("2025-06-09T15:22:00Z"),
      domain: "social-platform.com",
    },
    suspectContent: {
      imageUrl: "https://social-platform.com/images/post-123456.jpg",
      description: "Logo used in social media post",
    },
    yakoaData: {
      matchId: "yakoa_match_002",
      detectionMethod: "WATERMARK_DETECTION",
      analysisData: {
        watermark_detected: true,
        logo_boundaries: { x: 10, y: 10, width: 100, height: 100 },
      },
    },
    status: "reviewed",
    priority: "high",
    actions: [
      {
        actionType: "viewed",
        timestamp: new Date("2025-06-09T16:00:00Z"),
        userId: "user123",
        notes: "Reviewed initial detection",
      },
    ],
    createdAt: new Date("2025-06-09T15:22:00Z"),
    updatedAt: new Date("2025-06-09T16:00:00Z"),
  },
];

/**
 * @route GET /api/alerts
 * @desc Get all alerts
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const {
      status,
      priority,
      ipAssetId,
      search,
      limit = 20,
      offset = 0,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    let filteredAlerts = [...alerts];

    // Apply filters
    if (status) {
      filteredAlerts = filteredAlerts.filter(
        (alert) => alert.status === status
      );
    }
    if (priority) {
      filteredAlerts = filteredAlerts.filter(
        (alert) => alert.priority === priority
      );
    }
    if (ipAssetId) {
      filteredAlerts = filteredAlerts.filter(
        (alert) => alert.ipAssetId === ipAssetId
      );
    }
    if (search) {
      const searchTerm = (search as string).toLowerCase();
      filteredAlerts = filteredAlerts.filter(
        (alert) =>
          alert.title.toLowerCase().includes(searchTerm) ||
          alert.description.toLowerCase().includes(searchTerm) ||
          alert.source.platform.toLowerCase().includes(searchTerm)
      );
    }

    // Apply sorting
    filteredAlerts.sort((a, b) => {
      const aValue = a[sortBy as string];
      const bValue = b[sortBy as string];

      if (sortOrder === "desc") {
        return bValue > aValue ? 1 : -1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });

    // Apply pagination
    const startIndex = parseInt(offset as string);
    const endIndex = startIndex + parseInt(limit as string);
    const paginatedAlerts = filteredAlerts.slice(startIndex, endIndex);

    // Get alert statistics
    const stats = {
      total: filteredAlerts.length,
      new: alerts.filter((a) => a.status === "new").length,
      reviewed: alerts.filter((a) => a.status === "reviewed").length,
      disputed: alerts.filter((a) => a.status === "disputed").length,
      resolved: alerts.filter((a) => a.status === "resolved").length,
      ignored: alerts.filter((a) => a.status === "ignored").length,
      critical: alerts.filter((a) => a.priority === "critical").length,
      high: alerts.filter((a) => a.priority === "high").length,
      medium: alerts.filter((a) => a.priority === "medium").length,
      low: alerts.filter((a) => a.priority === "low").length,
    };

    res.json({
      success: true,
      data: {
        alerts: paginatedAlerts,
        stats,
        pagination: {
          total: filteredAlerts.length,
          limit: parseInt(limit as string),
          offset: startIndex,
          hasMore: endIndex < filteredAlerts.length,
        },
      },
    });
  } catch (error: any) {
    logger.error("Error fetching alerts:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch alerts",
    });
  }
});

/**
 * @route GET /api/alerts/:id
 * @desc Get specific alert
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const alert = alerts.find((a) => a.id === id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        error: "Alert not found",
      });
    }

    res.json({
      success: true,
      data: alert,
    });
  } catch (error: any) {
    logger.error("Error fetching alert:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch alert",
    });
  }
});

/**
 * @route PUT /api/alerts/:id
 * @desc Update alert status or add action
 */
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, action, userId, notes } = req.body;

    const alertIndex = alerts.findIndex((a) => a.id === id);
    if (alertIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Alert not found",
      });
    }

    const alert = alerts[alertIndex];

    // Update status if provided
    if (status) {
      alert.status = status;
    }

    // Add action if provided
    if (action) {
      alert.actions.push({
        actionType: action,
        timestamp: new Date(),
        userId: userId || "system",
        notes: notes || "",
      });
    }

    alert.updatedAt = new Date();

    // Update in Yakoa if available
    if (alert.yakoaData?.matchId && status) {
      await yakoaService.updateAlert(alert.yakoaData.matchId, status);
    }

    res.json({
      success: true,
      data: alert,
      message: "Alert updated successfully",
    });
  } catch (error: any) {
    logger.error("Error updating alert:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update alert",
    });
  }
});

/**
 * @route POST /api/alerts/bulk-update
 * @desc Bulk update multiple alerts
 */
router.post("/bulk-update", async (req: Request, res: Response) => {
  try {
    const { alertIds, status, action, userId, notes } = req.body;

    if (!alertIds || !Array.isArray(alertIds) || alertIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Alert IDs array is required",
      });
    }

    const updatedAlerts = [];
    const errors = [];

    for (const alertId of alertIds) {
      const alertIndex = alerts.findIndex((a) => a.id === alertId);

      if (alertIndex === -1) {
        errors.push({ alertId, error: "Alert not found" });
        continue;
      }

      const alert = alerts[alertIndex];

      // Update status if provided
      if (status) {
        alert.status = status;
      }

      // Add action if provided
      if (action) {
        alert.actions.push({
          actionType: action,
          timestamp: new Date(),
          userId: userId || "system",
          notes: notes || "",
        });
      }

      alert.updatedAt = new Date();
      updatedAlerts.push(alert);

      // Update in Yakoa if available
      if (alert.yakoaData?.matchId && status) {
        try {
          await yakoaService.updateAlert(alert.yakoaData.matchId, status);
        } catch (yakoaError) {
          logger.warn(
            `Failed to update alert ${alertId} in Yakoa:`,
            yakoaError
          );
        }
      }
    }

    res.json({
      success: true,
      data: {
        updated: updatedAlerts,
        errors,
        total: alertIds.length,
        successful: updatedAlerts.length,
        failed: errors.length,
      },
      message: `Bulk update completed: ${updatedAlerts.length} successful, ${errors.length} failed`,
    });
  } catch (error: any) {
    logger.error("Error in bulk update:", error);
    res.status(500).json({
      success: false,
      error: "Failed to perform bulk update",
    });
  }
});

/**
 * @route POST /api/alerts/:id/escalate
 * @desc Escalate alert to dispute
 */
router.post("/:id/escalate", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { disputeType, description, evidence } = req.body;

    const alert = alerts.find((a) => a.id === id);
    if (!alert) {
      return res.status(404).json({
        success: false,
        error: "Alert not found",
      });
    }

    // Create dispute data
    const disputeData = {
      ipAssetId: alert.ipAssetId,
      alertId: id,
      title: `Dispute: ${alert.title}`,
      description: description || alert.description,
      disputeType: disputeType || "infringement",
      status: "pending",
      priority: alert.priority,
      evidence: evidence || [
        {
          id: `evidence_${Date.now()}`,
          type: "url",
          title: "Infringing Content",
          url: alert.source.url,
          description: `Content found at ${alert.source.platform}`,
          uploadedAt: new Date(),
        },
      ],
      respondent: {
        platform: alert.source.platform,
        identifier: alert.source.domain,
        contact: `support@${alert.source.domain}`,
      },
      timeline: [
        {
          id: `timeline_${Date.now()}`,
          date: new Date(),
          action: "Created",
          actor: "System",
          description: "Dispute created from alert escalation",
          metadata: { alertId: id, yakoaMatchId: alert.yakoaData?.matchId },
        },
      ],
      createdBy: "system",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Update alert status
    alert.status = "disputed";
    alert.actions.push({
      actionType: "escalated",
      timestamp: new Date(),
      userId: "system",
      notes: "Alert escalated to dispute",
    });
    alert.updatedAt = new Date();

    res.json({
      success: true,
      data: {
        alert,
        dispute: disputeData,
      },
      message: "Alert escalated to dispute successfully",
    });
  } catch (error: any) {
    logger.error("Error escalating alert:", error);
    res.status(500).json({
      success: false,
      error: "Failed to escalate alert",
    });
  }
});

/**
 * @route POST /api/alerts/search-similar
 * @desc Search for similar content using Yakoa
 */
router.post("/search-similar", async (req: Request, res: Response) => {
  try {
    const { mediaUrl, imageData, threshold = 80 } = req.body;

    if (!mediaUrl && !imageData) {
      return res.status(400).json({
        success: false,
        error: "Either mediaUrl or imageData is required",
      });
    }

    const searchResult = await yakoaService.searchSimilarContent({
      media_url: mediaUrl,
      image_data: imageData,
      threshold,
    });

    if (!searchResult.success) {
      return res.status(500).json({
        success: false,
        error: "Failed to search for similar content",
        details: searchResult.error,
      });
    }

    res.json({
      success: true,
      data: searchResult.data,
      message: "Similar content search completed",
    });
  } catch (error: any) {
    logger.error("Error searching similar content:", error);
    res.status(500).json({
      success: false,
      error: "Failed to search for similar content",
    });
  }
});

/**
 * @route GET /api/alerts/stats/summary
 * @desc Get alert statistics summary
 */
router.get("/stats/summary", async (req: Request, res: Response) => {
  try {
    const { timeRange = "30d" } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate = new Date();

    switch (timeRange) {
      case "7d":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(now.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(now.getDate() - 90);
        break;
      case "1y":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    const filteredAlerts = alerts.filter(
      (alert) => new Date(alert.createdAt) >= startDate
    );

    // Calculate statistics
    const stats = {
      total: filteredAlerts.length,
      byStatus: {
        new: filteredAlerts.filter((a) => a.status === "new").length,
        reviewed: filteredAlerts.filter((a) => a.status === "reviewed").length,
        disputed: filteredAlerts.filter((a) => a.status === "disputed").length,
        resolved: filteredAlerts.filter((a) => a.status === "resolved").length,
        ignored: filteredAlerts.filter((a) => a.status === "ignored").length,
      },
      byPriority: {
        critical: filteredAlerts.filter((a) => a.priority === "critical")
          .length,
        high: filteredAlerts.filter((a) => a.priority === "high").length,
        medium: filteredAlerts.filter((a) => a.priority === "medium").length,
        low: filteredAlerts.filter((a) => a.priority === "low").length,
      },
      byPlatform: filteredAlerts.reduce((acc: any, alert) => {
        const platform = alert.source.platform;
        acc[platform] = (acc[platform] || 0) + 1;
        return acc;
      }, {}),
      averageSimilarity:
        filteredAlerts.length > 0
          ? Math.round(
              filteredAlerts.reduce((sum, alert) => sum + alert.similarity, 0) /
                filteredAlerts.length
            )
          : 0,
      averageConfidence:
        filteredAlerts.length > 0
          ? Math.round(
              filteredAlerts.reduce((sum, alert) => sum + alert.confidence, 0) /
                filteredAlerts.length
            )
          : 0,
      resolutionRate:
        filteredAlerts.length > 0
          ? Math.round(
              (filteredAlerts.filter((a) => a.status === "resolved").length /
                filteredAlerts.length) *
                100
            )
          : 0,
    };

    res.json({
      success: true,
      data: {
        stats,
        timeRange,
        startDate,
        endDate: now,
      },
    });
  } catch (error: any) {
    logger.error("Error fetching alert statistics:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch alert statistics",
    });
  }
});

export default router;
