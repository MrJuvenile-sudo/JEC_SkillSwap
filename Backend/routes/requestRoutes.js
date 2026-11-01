const express = require("express");
const router = express.Router();
const requestController = require("../controllers/requestController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, requestController.createRequest);
router.get("/", authMiddleware, requestController.getRequests);
router.put("/:id/status", authMiddleware, requestController.updateRequestStatus);
router.put("/:id/accept", authMiddleware, (req, res, next) => {
  req.body.status = 'accepted';
  requestController.updateRequestStatus(req, res, next);
});
router.put("/:id/reject", authMiddleware, (req, res, next) => {
  req.body.status = 'rejected';
  requestController.updateRequestStatus(req, res, next);
});

module.exports = router;
