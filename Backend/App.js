const express = require("express");
const cors = require("cors");
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

const app = express();

app.use(cors());
app.use(express.json());

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

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error("Global Error Handler Caught:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;