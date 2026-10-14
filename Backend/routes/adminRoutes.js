const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const adminController = require("../controllers/adminController");

// Flexible Admin Check: Uses authMiddleware and allows master admin key bypass
const adminAccessControl = (req, res, next) => {
  const masterKey = req.headers["x-admin-key"];
  if (masterKey === "admin123") {
    return next();
  }
  return authMiddleware(req, res, () => {
    return adminMiddleware(req, res, next);
  });
};

// Public Unauthenticated Testimonials & Settings Route
router.get("/public/testimonials", adminController.getPublicTestimonials);
router.get("/public/settings", adminController.getSettings);

router.use(adminAccessControl);

// Stats & Dashboard
router.get("/stats", adminController.getAdminStats);

// User Management
router.get("/users", adminController.getAllUsers);
router.put("/users/:id/role", adminController.updateUserRole);
router.put("/users/:id/ban", adminController.updateUserStatus);
router.delete("/users/:id", adminController.deleteUser);

// Skills Management
router.get("/skills", adminController.getAllSkills);
router.post("/skills", adminController.addSkill);
router.put("/skills/:id", adminController.updateSkill);
router.delete("/skills/:id", adminController.deleteSkill);

// Exchange Rooms Management
router.get("/exchanges", adminController.getAllExchanges);
router.put("/exchanges/:id", adminController.updateExchange);
router.delete("/exchanges/:id", adminController.deleteExchange);

// Swap Proposals Management
router.get("/requests", adminController.getAllRequests);
router.put("/requests/:id/status", adminController.updateRequestStatus);
router.delete("/requests/:id", adminController.deleteRequest);

// Reviews Moderation
router.get("/reviews", adminController.getAllReviews);
router.delete("/reviews/:id", adminController.deleteReview);

// System Settings
router.get("/settings", adminController.getSettings);
router.put("/settings", adminController.updateSettings);

// Testimonials Management (Admin)
router.get("/testimonials", adminController.getAllTestimonials);
router.post("/testimonials", adminController.createTestimonial);
router.put("/testimonials/:id", adminController.updateTestimonial);
router.delete("/testimonials/:id", adminController.deleteTestimonial);

module.exports = router;
