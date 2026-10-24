const express = require("express");
const router = express.Router();
const liveSessionController = require("../controllers/liveSessionController");
const authMiddleware = require("../middleware/authMiddleware");
const { optionalAuthMiddleware } = require("../middleware/authMiddleware");

// 1. Discover classes (Public, optional auth for registration status and link reveal)
router.get("/", optionalAuthMiddleware, liveSessionController.getDiscoverSessions);

// 2. My Hosted & Registered Classes (Auth required)
router.get("/my/all", authMiddleware, liveSessionController.getMySessions);

// 3. Create a class (Auth required)
router.post("/", authMiddleware, liveSessionController.createSession);

// 4. Get class details (Public, optional auth to reveal protected Google Meet link)
router.get("/:id", optionalAuthMiddleware, liveSessionController.getSessionDetails);

// 5. Update class details (Host only, auth required)
router.put("/:id", authMiddleware, liveSessionController.updateSession);

// 6. Register for a seat (Auth required)
router.post("/:id/register", authMiddleware, liveSessionController.registerForSeat);

// 7. Cancel registration (Auth required)
router.delete("/:id/register", authMiddleware, liveSessionController.cancelRegistration);

// 8. Cancel the class (Host only, auth required)
router.post("/:id/cancel", authMiddleware, liveSessionController.cancelSession);

// 9. Record attendance or submit feedback (Auth required)
router.post("/:id/attendance", authMiddleware, liveSessionController.recordAttendanceAndFeedback);

module.exports = router;
