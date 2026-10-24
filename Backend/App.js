const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const db = require("./config/db");
const initDb = require("./config/initDb");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const skillRoutes = require("./routes/skillRoutes");
const discoveryRoutes = require("./routes/discoveryRoutes");
const requestRoutes = require("./routes/requestRoutes");
const exchangeRoutes = require("./routes/exchangeRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const adminRoutes = require("./routes/adminRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const liveSessionRoutes = require("./routes/liveSessionRoutes");
const liveSessionController = require("./controllers/liveSessionController");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Serve uploaded user and platform files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Initialize Database on Startup asynchronously
initDb();

// Health Check API
app.get("/api/health", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 AS test");

    res.json({
      success: true,
      message: "SkillSwap API and MySQL database are connected",
      database: rows[0].test === 1,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/discovery", discoveryRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/exchanges", exchangeRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/live-sessions", liveSessionRoutes);
app.get("/api/my/live-sessions", authMiddleware, liveSessionController.getMySessions);

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error("Global Error Handler Caught:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Serve frontend static files if dist folder exists (Production / Render deployment)
const distPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(distPath));

// For all non-API GET requests, serve frontend SPA index.html
app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api")) {
    return res.sendFile(path.join(distPath, "index.html"), (err) => {
      if (err) {
        res.status(200).send("🚀 SkillSwap Backend API Server is running smoothly.");
      }
    });
  }
  next();
});

module.exports = app;