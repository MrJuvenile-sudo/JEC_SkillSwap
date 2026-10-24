const jwt = require("jsonwebtoken");
const db = require("../config/db");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing or invalid",
      });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET || "skillswap_super_secret_key_change_this";
    const decoded = jwt.verify(token, secret);

    // Verify user status in database
    const [users] = await db.query("SELECT role, status FROM users WHERE id = ?", [decoded.id]);
    if (users.length > 0 && users[0].status === "banned") {
      return res.status(403).json({
        success: false,
        message: "Your account has been suspended by System Administrator.",
      });
    }

    if (users.length > 0) {
      decoded.role = users[0].role;
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET || "skillswap_super_secret_key_change_this";
    const decoded = jwt.verify(token, secret);

    const [users] = await db.query("SELECT role, status FROM users WHERE id = ?", [decoded.id]);
    if (users.length > 0 && users[0].status !== "banned") {
      decoded.role = users[0].role;
      req.user = decoded;
    } else {
      req.user = null;
    }
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

authMiddleware.authMiddleware = authMiddleware;
authMiddleware.optionalAuthMiddleware = optionalAuthMiddleware;

module.exports = authMiddleware;
