const express = require("express");
const router = express.Router();
const skillController = require("../controllers/skillController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", skillController.getAllSkills);
router.post("/", authMiddleware, skillController.addSkill);

module.exports = router;
