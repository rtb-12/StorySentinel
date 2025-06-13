import "dotenv/config"; // Load this first before anything else
import express from "express";
import cors from "cors";
import yakoaRoutes from "./routes/yakoa";
import storyRoutes from "./routes/story";

const app = express();
const PORT = process.env.PORT || 3001;

// Debug: Log env vars to make sure they're loaded
console.log("Environment variables loaded:");
console.log("YAKOA_BASE_URL:", process.env.YAKOA_BASE_URL ? "SET" : "NOT SET");
console.log("YAKOA_API_KEY:", process.env.YAKOA_API_KEY ? "SET" : "NOT SET");
console.log("STORY_API_KEY:", process.env.STORY_API_KEY ? "SET" : "NOT SET");

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    env: {
      yakoa_configured: !!(
        process.env.YAKOA_BASE_URL && process.env.YAKOA_API_KEY
      ),
      story_configured: !!process.env.STORY_API_KEY,
    },
  });
});

app.use("/api/yakoa", yakoaRoutes);
app.use("/api/story", storyRoutes);

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
