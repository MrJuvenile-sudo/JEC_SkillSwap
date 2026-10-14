const express = require("express");
const router = express.Router();
const exchangeController = require("../controllers/exchangeController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, exchangeController.getExchanges);
router.put("/:id", authMiddleware, exchangeController.updateExchange);
router.put("/:id/complete", authMiddleware, exchangeController.completeExchange);

module.exports = router;
