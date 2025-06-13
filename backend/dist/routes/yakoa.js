"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const yakoa_1 = require("../services/yakoa");
const router = (0, express_1.Router)();
// Register a new token with Yakoa
router.post("/register", async (req, res) => {
    try {
        let registrationData = req.body;
        if (!registrationData) {
            return res.status(400).json({
                error: "Registration data is required",
                timestamp: new Date().toISOString(),
            });
        }
        // Auto-fix the ID format if it comes in the old format
        if (typeof registrationData.id === "string" &&
            registrationData.id.includes("_") &&
            registrationData.id.startsWith("story-testnet_")) {
            // Convert from "story-testnet_0xAddress_tokenId" to "0xAddress:tokenId"
            const parts = registrationData.id.split("_");
            if (parts.length >= 3) {
                const address = parts[1].toLowerCase(); // Ensure lowercase
                const tokenId = parts[2]; // tokenId
                registrationData.id = `${address}:${tokenId}`;
                console.log(`Auto-fixed ID format for registration: ${req.body.id} -> ${registrationData.id}`);
            }
        }
        else if (typeof registrationData.id === "string" &&
            registrationData.id.includes(":")) {
            // Ensure existing format is lowercase
            const [address, tokenId] = registrationData.id.split(":");
            registrationData.id = `${address.toLowerCase()}:${tokenId}`;
        }
        // Ensure creator_id is lowercase
        if (registrationData.creator_id) {
            registrationData.creator_id = registrationData.creator_id.toLowerCase();
        }
        console.log("Received token registration request:", registrationData);
        // Check if Yakoa service is configured
        if (!yakoa_1.yakoaService.isConfigured()) {
            return res.status(503).json({
                error: "Yakoa API not configured",
                message: "Please configure YAKOA_BASE_URL and YAKOA_API_KEY environment variables",
                timestamp: new Date().toISOString(),
            });
        }
        const result = await yakoa_1.yakoaService.registerToken(registrationData);
        res.json({
            success: true,
            data: result,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        console.error("Token registration error:", error);
        res.status(500).json({
            error: "Failed to register token",
            message: error.message,
            timestamp: new Date().toISOString(),
        });
    }
});
// Get token details by ID
router.get("/token/:tokenId", async (req, res) => {
    try {
        const { tokenId } = req.params;
        if (!tokenId) {
            return res.status(400).json({
                error: "Token ID is required",
                timestamp: new Date().toISOString(),
            });
        }
        console.log("Fetching token details for:", tokenId);
        // Check if Yakoa service is configured
        if (!yakoa_1.yakoaService.isConfigured()) {
            return res.status(503).json({
                error: "Yakoa API not configured",
                message: "Please configure YAKOA_BASE_URL and YAKOA_API_KEY environment variables",
                timestamp: new Date().toISOString(),
            });
        }
        const result = await yakoa_1.yakoaService.getToken(tokenId);
        res.json({
            success: true,
            data: result,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        console.error("Token fetch error:", error);
        res.status(500).json({
            error: "Failed to fetch token",
            message: error.message,
            timestamp: new Date().toISOString(),
        });
    }
});
// Create token registration data from Story Protocol result
router.post("/create-registration-data", async (req, res) => {
    try {
        const { storyResult, ipMetadata, mediaUrls, creatorId, chain } = req.body;
        if (!storyResult || !ipMetadata || !mediaUrls || !creatorId) {
            return res.status(400).json({
                error: "Missing required fields",
                required: ["storyResult", "ipMetadata", "mediaUrls", "creatorId"],
                timestamp: new Date().toISOString(),
            });
        }
        console.log("Creating registration data for Story Protocol result:", storyResult);
        const registrationData = yakoa_1.yakoaService.createTokenRegistrationData(storyResult, ipMetadata, mediaUrls, creatorId, chain || "story-testnet");
        res.json({
            success: true,
            data: registrationData,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        console.error("Registration data creation error:", error);
        res.status(500).json({
            error: "Failed to create registration data",
            message: error.message,
            timestamp: new Date().toISOString(),
        });
    }
});
// Generate unique token identifier
router.post("/generate-identifier", async (req, res) => {
    try {
        const { chain, contractAddress, tokenId } = req.body;
        if (!chain || !contractAddress || !tokenId) {
            return res.status(400).json({
                error: "Missing required fields",
                required: ["chain", "contractAddress", "tokenId"],
                timestamp: new Date().toISOString(),
            });
        }
        const identifier = yakoa_1.yakoaService.generateTokenIdentifier(chain, contractAddress, tokenId);
        res.json({
            success: true,
            data: { identifier },
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        console.error("Identifier generation error:", error);
        res.status(500).json({
            error: "Failed to generate identifier",
            message: error.message,
            timestamp: new Date().toISOString(),
        });
    }
});
// Health check for Yakoa service
router.get("/health", (req, res) => {
    const isConfigured = yakoa_1.yakoaService.isConfigured();
    res.json({
        service: "Yakoa API",
        configured: isConfigured,
        baseUrl: process.env.YAKOA_BASE_URL,
        hasApiKey: !!process.env.YAKOA_API_KEY,
        timestamp: new Date().toISOString(),
    });
});
// Test endpoint to validate registration data format
router.post("/validate", async (req, res) => {
    try {
        let registrationData = req.body;
        // Auto-fix the ID format if it comes in the old format
        if (typeof registrationData.id === "string" &&
            registrationData.id.includes("_") &&
            registrationData.id.startsWith("story-testnet_")) {
            // Convert from "story-testnet_0xAddress_tokenId" to "0xAddress:tokenId"
            const parts = registrationData.id.split("_");
            if (parts.length >= 3) {
                const address = parts[1].toLowerCase(); // Ensure lowercase
                const tokenId = parts[2]; // tokenId
                registrationData.id = `${address}:${tokenId}`;
                console.log(`Auto-fixed ID format: ${req.body.id} -> ${registrationData.id}`);
            }
        }
        else if (typeof registrationData.id === "string" &&
            registrationData.id.includes(":")) {
            // Ensure existing format is lowercase
            const [address, tokenId] = registrationData.id.split(":");
            registrationData.id = `${address.toLowerCase()}:${tokenId}`;
        }
        // Ensure creator_id is lowercase
        if (registrationData.creator_id) {
            registrationData.creator_id = registrationData.creator_id.toLowerCase();
        }
        // Validate the data format
        const validationErrors = [];
        // Check id format (should match Ethereum address pattern with optional token ID)
        if (typeof registrationData.id !== "string" ||
            !registrationData.id.toLowerCase().match(/^0x[a-f0-9]{40}(:[0-9]+)?$/)) {
            validationErrors.push({
                field: "id",
                message: "Should match pattern ^0x[a-f0-9]{40}(:[0-9]+)?$ (case insensitive)",
                current: registrationData.id,
                original: req.body.id,
            });
        }
        // Check creator_id format (should match Ethereum address pattern)
        if (!registrationData.creator_id ||
            !registrationData.creator_id.toLowerCase().match(/^0x[a-f0-9]{40}$/)) {
            validationErrors.push({
                field: "creator_id",
                message: "Should match pattern ^0x[a-f0-9]{40}$ (case insensitive)",
                current: registrationData.creator_id,
            });
        }
        // Check media array
        if (!registrationData.media || !Array.isArray(registrationData.media)) {
            validationErrors.push({ field: "media", message: "Should be an array" });
        }
        else {
            registrationData.media.forEach((mediaItem, index) => {
                if (!mediaItem.media_id) {
                    validationErrors.push({
                        field: `media.${index}.media_id`,
                        message: "Field required",
                    });
                }
                if (!mediaItem.hash || !mediaItem.hash.match(/^[a-f0-9]{64}$/)) {
                    validationErrors.push({
                        field: `media.${index}.hash`,
                        message: "Should match pattern ^[a-f0-9]{64}$",
                    });
                }
            });
        }
        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                errors: validationErrors,
                data: registrationData,
                originalData: req.body.id !== registrationData.id ? req.body : undefined,
                timestamp: new Date().toISOString(),
            });
        }
        res.json({
            success: true,
            message: "Validation passed",
            data: registrationData,
            autoFixed: req.body.id !== registrationData.id
                ? {
                    originalId: req.body.id,
                    correctedId: registrationData.id,
                }
                : undefined,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        console.error("Validation error:", error);
        res.status(500).json({
            error: "Failed to validate data",
            message: error.message,
            timestamp: new Date().toISOString(),
        });
    }
});
// Test data generation endpoint
router.get("/test-data", async (req, res) => {
    try {
        // Generate sample data that matches Yakoa requirements
        const sampleData = {
            id: "0x1234567890123456789012345678901234567890:1", // Correct format: address:tokenId
            registration_tx: {
                hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
                block_number: 12345,
                timestamp: new Date().toISOString(),
                chain: "story-testnet",
            },
            creator_id: "0x1234567890123456789012345678901234567890", // Correct format: Ethereum address
            metadata: {
                title: "Test IP Asset",
                description: "A test intellectual property asset",
                ipAssetType: "story-protocol",
                registrationTimestamp: new Date().toISOString(),
            },
            media: [
                {
                    media_id: `media_${Date.now()}_0`,
                    url: "https://example.com/image1.jpg",
                    hash: "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef", // 64-char hex
                    trust_reason: {
                        type: "trusted_platform",
                        platform_name: "Story Protocol",
                    },
                },
                {
                    media_id: `media_${Date.now()}_1`,
                    url: "https://example.com/image2.jpg",
                    hash: "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890", // 64-char hex
                    trust_reason: {
                        type: "trusted_platform",
                        platform_name: "Story Protocol",
                    },
                },
            ],
        };
        res.json({
            success: true,
            data: sampleData,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        console.error("Test data generation error:", error);
        res.status(500).json({
            error: "Failed to generate test data",
            message: error.message,
            timestamp: new Date().toISOString(),
        });
    }
});
exports.default = router;
//# sourceMappingURL=yakoa.js.map