const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const authMiddleware = require("../middleware/authMiddleware");
const optionalAuthMiddleware = authMiddleware.optionalAuthMiddleware || authMiddleware;

// 1-on-1 Session Review
router.post("/", authMiddleware, reviewController.createReview);
router.get("/user/:userId", reviewController.getUserReviews);

// Website / Platform Review (shown on landing page)
router.post("/website", optionalAuthMiddleware, reviewController.submitWebsiteReview);
router.post("/platform", optionalAuthMiddleware, reviewController.submitWebsiteReview);

module.exports = router;
