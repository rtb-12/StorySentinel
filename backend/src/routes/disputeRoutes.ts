import express from "express";
import { Request, Response } from "express";
import { logger } from "../utils/logger";
import storyProtocolService from "../services/storyProtocolService";

const router = express.Router();

// Mock database - in production, use MongoDB
let disputes: any[] = [
  {
    id: "1",
    ipAssetId: "1",
    alertId: "1",
    title: "Unauthorized NFT Marketplace Sale",
    description:
      "User is selling our registered IP asset without permission on unauthorized marketplace",
    disputeType: "infringement",
    status: "in-progress",
    priority: "high",
    evidence: [
      {
        id: "1",
        type: "url",
        title: "Infringing Listing",
        url: "https://marketplace.com/item/123",
        description: "Direct link to unauthorized listing",
        uploadedAt: new Date("2025-06-08T10:15:00Z"),
      },
      {
        id: "2",
        type: "image",
        title: "Screenshot Evidence",
        url: "https://storage.example.com/evidence/screenshot1.png",
        description: "Screenshot of the infringing listing",
        uploadedAt: new Date("2025-06-08T10:15:00Z"),
      },
    ],
    respondent: {
      platform: "OpenSea Clone",
      identifier: "0x742d35cc6e5e",
      contact: "support@marketplace.com",
      walletAddress: "0x742d35cc6e5e567890123456789012345678901234",
    },
    storyData: {
      disputeId: "dispute_001_story",
      transactionHash: "0xabc123def456...",
    },
    timeline: [
      {
        id: "1",
        date: new Date("2025-06-08T10:00:00Z"),
        action: "Created",
        actor: "System",
        description: "Dispute automatically created from alert",
        metadata: { alertId: "1" },
      },
      {
        id: "2",
        date: new Date("2025-06-08T10:15:00Z"),
        action: "Evidence Added",
        actor: "User",
        description: "Added screenshot and transaction proof",
        metadata: { evidenceCount: 2 },
      },
      {
        id: "3",
        date: new Date("2025-06-08T11:30:00Z"),
        action: "Submitted",
        actor: "System",
        description: "Dispute submitted to Story Protocol",
        metadata: { storyDisputeId: "dispute_001_story" },
      },
    ],
    createdBy: "user123",
    assignedTo: "legal_team",
    createdAt: new Date("2025-06-08T10:00:00Z"),
    updatedAt: new Date("2025-06-09T14:30:00Z"),
  },
  {
    id: "2",
    ipAssetId: "2",
    title: "Brand Logo Misuse",
    description: "Company using our logo without proper licensing agreement",
    disputeType: "licensing",
    status: "resolved",
    priority: "medium",
    evidence: [
      {
        id: "3",
        type: "url",
        title: "Company Website",
        url: "https://company.com/about",
        description: "Page where logo is being used",
        uploadedAt: new Date("2025-06-05T09:15:00Z"),
      },
    ],
    respondent: {
      platform: "Corporate Website",
      identifier: "TechCorp Inc.",
      contact: "legal@techcorp.com",
    },
    outcome: {
      result: "settled",
      compensation: "0.5 ETH",
      terms: "Logo removed, licensing fee paid",
      enforcementActions: [
        "Logo removal",
        "Payment received",
        "License agreement signed",
      ],
    },
    timeline: [
      {
        id: "4",
        date: new Date("2025-06-05T09:00:00Z"),
        action: "Created",
        actor: "User",
        description: "Manual dispute creation",
        metadata: {},
      },
      {
        id: "5",
        date: new Date("2025-06-07T16:45:00Z"),
        action: "Resolved",
        actor: "System",
        description: "Settlement reached and executed",
        metadata: { compensation: "0.5 ETH" },
      },
    ],
    createdBy: "user123",
    createdAt: new Date("2025-06-05T09:00:00Z"),
    updatedAt: new Date("2025-06-07T16:45:00Z"),
  },
];

/**
 * @route GET /api/disputes
 * @desc Get all disputes
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const {
      status,
      disputeType,
      priority,
      ipAssetId,
      assignedTo,
      search,
      limit = 20,
      offset = 0,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    let filteredDisputes = [...disputes];

    // Apply filters
    if (status) {
      filteredDisputes = filteredDisputes.filter(
        (dispute) => dispute.status === status
      );
    }
    if (disputeType) {
      filteredDisputes = filteredDisputes.filter(
        (dispute) => dispute.disputeType === disputeType
      );
    }
    if (priority) {
      filteredDisputes = filteredDisputes.filter(
        (dispute) => dispute.priority === priority
      );
    }
    if (ipAssetId) {
      filteredDisputes = filteredDisputes.filter(
        (dispute) => dispute.ipAssetId === ipAssetId
      );
    }
    if (assignedTo) {
      filteredDisputes = filteredDisputes.filter(
        (dispute) => dispute.assignedTo === assignedTo
      );
    }
    if (search) {
      const searchTerm = (search as string).toLowerCase();
      filteredDisputes = filteredDisputes.filter(
        (dispute) =>
          dispute.title.toLowerCase().includes(searchTerm) ||
          dispute.description.toLowerCase().includes(searchTerm) ||
          dispute.respondent.identifier.toLowerCase().includes(searchTerm)
      );
    }

    // Apply sorting
    filteredDisputes.sort((a, b) => {
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
    const paginatedDisputes = filteredDisputes.slice(startIndex, endIndex);

    // Calculate statistics
    const stats = {
      total: filteredDisputes.length,
      active: disputes.filter(
        (d) => d.status === "pending" || d.status === "in-progress"
      ).length,
      resolved: disputes.filter((d) => d.status === "resolved").length,
      winRate:
        disputes.filter((d) => d.outcome).length > 0
          ? Math.round(
              (disputes.filter(
                (d) =>
                  d.outcome?.result === "won" || d.outcome?.result === "settled"
              ).length /
                disputes.filter((d) => d.outcome).length) *
                100
            )
          : 0,
      averageResolutionTime: 5.2, // days - would calculate from actual data
    };

    res.json({
      success: true,
      data: {
        disputes: paginatedDisputes,
        stats,
        pagination: {
          total: filteredDisputes.length,
          limit: parseInt(limit as string),
          offset: startIndex,
          hasMore: endIndex < filteredDisputes.length,
        },
      },
    });
  } catch (error: any) {
    logger.error("Error fetching disputes:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch disputes",
    });
  }
});

/**
 * @route GET /api/disputes/:id
 * @desc Get specific dispute
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const dispute = disputes.find((d) => d.id === id);

    if (!dispute) {
      return res.status(404).json({
        success: false,
        error: "Dispute not found",
      });
    }

    res.json({
      success: true,
      data: dispute,
    });
  } catch (error: any) {
    logger.error("Error fetching dispute:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch dispute",
    });
  }
});

/**
 * @route POST /api/disputes
 * @desc Create new dispute
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      ipAssetId,
      alertId,
      title,
      description,
      disputeType,
      priority,
      evidence,
      respondent,
      createdBy,
    } = req.body;

    // Validate required fields
    if (!ipAssetId || !title || !description || !disputeType || !respondent) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    // Create new dispute
    const newDispute = {
      id: (disputes.length + 1).toString(),
      ipAssetId,
      alertId: alertId || null,
      title,
      description,
      disputeType,
      status: "pending",
      priority: priority || "medium",
      evidence: evidence || [],
      respondent,
      storyData: {},
      timeline: [
        {
          id: `timeline_${Date.now()}`,
          date: new Date(),
          action: "Created",
          actor: createdBy || "User",
          description: "Dispute created",
          metadata: { alertId },
        },
      ],
      createdBy: createdBy || "system",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    disputes.push(newDispute);

    res.status(201).json({
      success: true,
      data: newDispute,
      message: "Dispute created successfully",
    });
  } catch (error: any) {
    logger.error("Error creating dispute:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create dispute",
    });
  }
});

/**
 * @route POST /api/disputes/:id/submit-to-story
 * @desc Submit dispute to Story Protocol
 */
router.post("/:id/submit-to-story", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      targetIpAssetId,
      arbitrationPolicy,
      linkToDisputeEvidence,
      targetTag,
      calldata,
    } = req.body;

    const disputeIndex = disputes.findIndex((d) => d.id === id);
    if (disputeIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Dispute not found",
      });
    }

    const dispute = disputes[disputeIndex];

    if (!targetIpAssetId || !arbitrationPolicy || !linkToDisputeEvidence) {
      return res.status(400).json({
        success: false,
        error: "Missing required Story Protocol parameters",
      });
    }

    // Submit to Story Protocol
    const storyResult = await storyProtocolService.submitDispute({
      targetIpAssetId,
      arbitrationPolicy,
      linkToDisputeEvidence,
      targetTag: targetTag || "INFRINGEMENT",
      calldata,
    });

    if (!storyResult.success) {
      return res.status(500).json({
        success: false,
        error: "Failed to submit dispute to Story Protocol",
        details: storyResult.error,
      });
    }

    // Update dispute with Story Protocol data
    dispute.storyData = {
      disputeId: storyResult.data?.disputeId,
      transactionHash: storyResult.transactionHash,
    };
    dispute.status = "in-progress";
    dispute.timeline.push({
      id: `timeline_${Date.now()}`,
      date: new Date(),
      action: "Submitted to Story Protocol",
      actor: "System",
      description: "Dispute submitted to Story Protocol blockchain",
      metadata: {
        disputeId: storyResult.data?.disputeId,
        transactionHash: storyResult.transactionHash,
      },
    });
    dispute.updatedAt = new Date();

    res.json({
      success: true,
      data: {
        dispute,
        storyResult,
      },
      message: "Dispute submitted to Story Protocol successfully",
    });
  } catch (error: any) {
    logger.error("Error submitting dispute to Story Protocol:", error);
    res.status(500).json({
      success: false,
      error: "Failed to submit dispute to Story Protocol",
    });
  }
});

/**
 * @route PUT /api/disputes/:id
 * @desc Update dispute
 */
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const disputeIndex = disputes.findIndex((d) => d.id === id);
    if (disputeIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Dispute not found",
      });
    }

    // Update dispute
    const oldDispute = disputes[disputeIndex];
    disputes[disputeIndex] = {
      ...oldDispute,
      ...updates,
      updatedAt: new Date(),
    };

    // Add timeline entry for significant changes
    if (updates.status && updates.status !== oldDispute.status) {
      disputes[disputeIndex].timeline.push({
        id: `timeline_${Date.now()}`,
        date: new Date(),
        action: "Status Updated",
        actor: updates.updatedBy || "System",
        description: `Status changed from ${oldDispute.status} to ${updates.status}`,
        metadata: { oldStatus: oldDispute.status, newStatus: updates.status },
      });
    }

    res.json({
      success: true,
      data: disputes[disputeIndex],
      message: "Dispute updated successfully",
    });
  } catch (error: any) {
    logger.error("Error updating dispute:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update dispute",
    });
  }
});

/**
 * @route POST /api/disputes/:id/evidence
 * @desc Add evidence to dispute
 */
router.post("/:id/evidence", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { type, title, url, description, uploadedBy } = req.body;

    const disputeIndex = disputes.findIndex((d) => d.id === id);
    if (disputeIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Dispute not found",
      });
    }

    if (!type || !title) {
      return res.status(400).json({
        success: false,
        error: "Evidence type and title are required",
      });
    }

    const evidence = {
      id: `evidence_${Date.now()}`,
      type,
      title,
      url: url || "",
      description: description || "",
      uploadedAt: new Date(),
    };

    disputes[disputeIndex].evidence.push(evidence);
    disputes[disputeIndex].timeline.push({
      id: `timeline_${Date.now()}`,
      date: new Date(),
      action: "Evidence Added",
      actor: uploadedBy || "User",
      description: `Added evidence: ${title}`,
      metadata: { evidenceId: evidence.id, evidenceType: type },
    });
    disputes[disputeIndex].updatedAt = new Date();

    res.json({
      success: true,
      data: {
        dispute: disputes[disputeIndex],
        evidence,
      },
      message: "Evidence added successfully",
    });
  } catch (error: any) {
    logger.error("Error adding evidence:", error);
    res.status(500).json({
      success: false,
      error: "Failed to add evidence",
    });
  }
});

/**
 * @route POST /api/disputes/:id/resolve
 * @desc Mark dispute as resolved with outcome
 */
router.post("/:id/resolve", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { result, compensation, terms, enforcementActions, resolvedBy } =
      req.body;

    const disputeIndex = disputes.findIndex((d) => d.id === id);
    if (disputeIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Dispute not found",
      });
    }

    if (!result || !["won", "lost", "settled"].includes(result)) {
      return res.status(400).json({
        success: false,
        error: "Valid result is required (won, lost, or settled)",
      });
    }

    // Set outcome
    disputes[disputeIndex].outcome = {
      result,
      compensation,
      terms,
      enforcementActions: enforcementActions || [],
    };
    disputes[disputeIndex].status = "resolved";
    disputes[disputeIndex].timeline.push({
      id: `timeline_${Date.now()}`,
      date: new Date(),
      action: "Resolved",
      actor: resolvedBy || "System",
      description: `Dispute resolved with result: ${result}`,
      metadata: { result, compensation, terms },
    });
    disputes[disputeIndex].updatedAt = new Date();

    res.json({
      success: true,
      data: disputes[disputeIndex],
      message: "Dispute resolved successfully",
    });
  } catch (error: any) {
    logger.error("Error resolving dispute:", error);
    res.status(500).json({
      success: false,
      error: "Failed to resolve dispute",
    });
  }
});

/**
 * @route POST /api/disputes/:id/generate-evidence-package
 * @desc Generate evidence package for legal use
 */
router.post(
  "/:id/generate-evidence-package",
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { format = "pdf", includeTimeline = true } = req.body;

      const dispute = disputes.find((d) => d.id === id);
      if (!dispute) {
        return res.status(404).json({
          success: false,
          error: "Dispute not found",
        });
      }

      // In a real implementation, this would generate a downloadable package
      const evidencePackage = {
        disputeId: id,
        title: dispute.title,
        generatedAt: new Date(),
        format,
        contents: {
          disputeDetails: {
            title: dispute.title,
            description: dispute.description,
            type: dispute.disputeType,
            status: dispute.status,
            priority: dispute.priority,
            createdAt: dispute.createdAt,
            updatedAt: dispute.updatedAt,
          },
          respondent: dispute.respondent,
          evidence: dispute.evidence,
          timeline: includeTimeline ? dispute.timeline : undefined,
          outcome: dispute.outcome,
          storyProtocolData: dispute.storyData,
        },
        downloadUrl: `https://api.storysentinel.com/evidence-packages/${id}-${Date.now()}.${format}`,
      };

      // Add timeline entry
      dispute.timeline.push({
        id: `timeline_${Date.now()}`,
        date: new Date(),
        action: "Evidence Package Generated",
        actor: "System",
        description: `Generated ${format.toUpperCase()} evidence package for legal use`,
        metadata: { format, includeTimeline },
      });

      res.json({
        success: true,
        data: evidencePackage,
        message: "Evidence package generated successfully",
      });
    } catch (error: any) {
      logger.error("Error generating evidence package:", error);
      res.status(500).json({
        success: false,
        error: "Failed to generate evidence package",
      });
    }
  }
);

/**
 * @route GET /api/disputes/stats/summary
 * @desc Get dispute statistics summary
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

    const filteredDisputes = disputes.filter(
      (dispute) => new Date(dispute.createdAt) >= startDate
    );

    const resolvedDisputes = filteredDisputes.filter((d) => d.outcome);
    const stats = {
      total: filteredDisputes.length,
      active: filteredDisputes.filter(
        (d) => d.status === "pending" || d.status === "in-progress"
      ).length,
      resolved: filteredDisputes.filter((d) => d.status === "resolved").length,
      winRate:
        resolvedDisputes.length > 0
          ? Math.round(
              (resolvedDisputes.filter(
                (d) =>
                  d.outcome?.result === "won" || d.outcome?.result === "settled"
              ).length /
                resolvedDisputes.length) *
                100
            )
          : 0,
      byType: {
        infringement: filteredDisputes.filter(
          (d) => d.disputeType === "infringement"
        ).length,
        licensing: filteredDisputes.filter((d) => d.disputeType === "licensing")
          .length,
        ownership: filteredDisputes.filter((d) => d.disputeType === "ownership")
          .length,
        takedown: filteredDisputes.filter((d) => d.disputeType === "takedown")
          .length,
      },
      byStatus: {
        pending: filteredDisputes.filter((d) => d.status === "pending").length,
        "in-progress": filteredDisputes.filter(
          (d) => d.status === "in-progress"
        ).length,
        resolved: filteredDisputes.filter((d) => d.status === "resolved")
          .length,
        rejected: filteredDisputes.filter((d) => d.status === "rejected")
          .length,
        escalated: filteredDisputes.filter((d) => d.status === "escalated")
          .length,
      },
      totalCompensation: resolvedDisputes
        .filter((d) => d.outcome?.compensation)
        .reduce((sum, d) => {
          const comp = d.outcome!.compensation!;
          // Simple ETH extraction - would be more sophisticated in production
          const match = comp.match(/(\d+\.?\d*)\s*ETH/);
          return sum + (match ? parseFloat(match[1]) : 0);
        }, 0),
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
    logger.error("Error fetching dispute statistics:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch dispute statistics",
    });
  }
});

export default router;
