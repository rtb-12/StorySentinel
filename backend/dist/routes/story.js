"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const storyProtocol_1 = require("../services/storyProtocol");
const router = (0, express_1.Router)();
// Health check endpoint
router.get("/health", (req, res) => {
    res.json({
        service: "Story Protocol API",
        configured: storyProtocol_1.storyProtocolService.isConfigured(),
        hasApiKey: !!process.env.STORY_API_KEY,
        timestamp: new Date().toISOString(),
    });
});
// Get disputes from Story Protocol
router.get("/disputes", async (req, res) => {
    try {
        const { chain = "story-aeneid", limit = 20, after, before, status, type, } = req.query;
        const options = {
            pagination: {
                limit: parseInt(limit),
                ...(after ? { after: after } : {}),
                ...(before ? { before: before } : {}),
            },
            filters: {
                ...(status ? { status: status } : {}),
                ...(type ? { type: type } : {}),
            },
        };
        const disputes = await storyProtocol_1.storyProtocolService.getDisputes(chain, options);
        res.json(disputes);
    }
    catch (error) {
        console.error("Error fetching disputes:", error);
        res.status(500).json({
            error: "Failed to fetch disputes",
            message: error instanceof Error ? error.message : "Unknown error",
            timestamp: new Date().toISOString(),
        });
    }
});
// Get dispute details
router.get("/disputes/:disputeId", async (req, res) => {
    try {
        const { disputeId } = req.params;
        const { chain = "story-aeneid" } = req.query;
        const disputeDetails = await storyProtocol_1.storyProtocolService.getDisputeDetails(chain, disputeId);
        res.json({
            success: true,
            data: disputeDetails,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        console.error("Error fetching dispute details:", error);
        res.status(500).json({
            error: "Failed to fetch dispute details",
            message: error instanceof Error ? error.message : "Unknown error",
            timestamp: new Date().toISOString(),
        });
    }
});
// Get IP assets
router.get("/ip-assets", async (req, res) => {
    try {
        const { chain = "story-aeneid", limit = 20, after, before } = req.query;
        const options = {
            pagination: {
                limit: parseInt(limit),
                ...(after ? { after: after } : {}),
                ...(before ? { before: before } : {}),
            },
        };
        const ipAssets = await storyProtocol_1.storyProtocolService.getIPAssets(chain, options);
        res.json(ipAssets);
    }
    catch (error) {
        console.error("Error fetching IP assets:", error);
        res.status(500).json({
            error: "Failed to fetch IP assets",
            message: error instanceof Error ? error.message : "Unknown error",
            timestamp: new Date().toISOString(),
        });
    }
});
// Get IP asset details
router.get("/ip-assets/:ipId", async (req, res) => {
    try {
        const { ipId } = req.params;
        const { chain = "story-aeneid" } = req.query;
        const ipAssetDetails = await storyProtocol_1.storyProtocolService.getIPAssetDetails(chain, ipId);
        res.json({
            success: true,
            data: ipAssetDetails,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        console.error("Error fetching IP asset details:", error);
        res.status(500).json({
            error: "Failed to fetch IP asset details",
            message: error instanceof Error ? error.message : "Unknown error",
            timestamp: new Date().toISOString(),
        });
    }
});
// Submit dispute to Story Protocol
router.post("/disputes", async (req, res) => {
    try {
        const disputeData = req.body;
        if (!disputeData) {
            return res.status(400).json({
                error: "Dispute data is required",
                timestamp: new Date().toISOString(),
            });
        }
        const result = await storyProtocol_1.storyProtocolService.submitDispute(disputeData);
        res.json({
            success: true,
            data: result,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        console.error("Error submitting dispute:", error);
        res.status(500).json({
            error: "Failed to submit dispute",
            message: error instanceof Error ? error.message : "Unknown error",
            timestamp: new Date().toISOString(),
        });
    }
});
exports.default = router;
//# sourceMappingURL=story.js.map