"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config"); // Load this first before anything else
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const yakoa_1 = __importDefault(require("./routes/yakoa"));
const story_1 = __importDefault(require("./routes/story"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Debug: Log env vars to make sure they're loaded
console.log("Environment variables loaded:");
console.log("YAKOA_BASE_URL:", process.env.YAKOA_BASE_URL ? "SET" : "NOT SET");
console.log("YAKOA_API_KEY:", process.env.YAKOA_API_KEY ? "SET" : "NOT SET");
console.log("STORY_API_KEY:", process.env.STORY_API_KEY ? "SET" : "NOT SET");
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Health check endpoint
app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        env: {
            yakoa_configured: !!(process.env.YAKOA_BASE_URL && process.env.YAKOA_API_KEY),
            story_configured: !!process.env.STORY_API_KEY,
        },
    });
});
app.use("/api/yakoa", yakoa_1.default);
app.use("/api/story", story_1.default);
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});
//# sourceMappingURL=index.js.map