const express = require("express");
const router = express.Router();
const discoveryController = require("../controllers/discoveryController");
const authMiddleware = require("../middleware/authMiddleware");

// Optional auth for search (allows guest search, but excludes self if logged in)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const token = authHeader.split(" ")[1];
      const jwt = require("jsonwebtoken");
      const secret = process.env.JWT_SECRET || "skillswap_super_secret_key_change_this";
      req.user = jwt.verify(token, secret);
    } catch (e) {
      // Ignore invalid token for optional auth
    }
  }
  next();
};

router.get("/search", optionalAuth, discoveryController.searchUsers);
router.get("/matches", authMiddleware, discoveryController.getMatches);

module.exports = router;
