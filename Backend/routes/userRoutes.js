const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/profile/:id", userController.getProfile);
router.get("/karma-stats", authMiddleware, userController.getKarmaStats);
router.put("/profile", authMiddleware, userController.updateProfile);
router.post("/skills", authMiddleware, userController.addUserSkill);
router.delete("/skills/:id", authMiddleware, userController.deleteUserSkill);

module.exports = router;
