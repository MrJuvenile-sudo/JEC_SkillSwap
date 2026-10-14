const db = require("../config/db");

// Submit a review for an exchange
exports.createReview = async (req, res) => {
  try {
    const reviewerId = req.user.id;
    const { exchange_id, rating, comment } = req.body;

    if (!exchange_id || !rating) {
      return res.status(400).json({
        success: false,
        message: "Exchange ID and rating (1-5) are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be an integer between 1 and 5",
      });
    }

    // Get exchange & request info to find reviewee
    const [exchanges] = await db.query(
      `SELECT e.*, sr.requester_id, sr.receiver_id
       FROM exchanges e
       JOIN swap_requests sr ON e.request_id = sr.id
       WHERE e.id = ?`,
      [exchange_id]
    );

    if (exchanges.length === 0) {
      return res.status(404).json({ success: false, message: "Exchange session not found" });
    }

    const ex = exchanges[0];

    // Determine reviewee (the other person in the exchange)
    let revieweeId;
    if (ex.requester_id === reviewerId) {
      revieweeId = ex.receiver_id;
    } else if (ex.receiver_id === reviewerId) {
      revieweeId = ex.requester_id;
    } else {
      return res.status(403).json({ success: false, message: "You were not a participant in this exchange" });
    }

    // Check existing review
    const [existing] = await db.query(
      "SELECT id FROM reviews WHERE exchange_id = ? AND reviewer_id = ?",
      [exchange_id, reviewerId]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "You have already left a review for this exchange session",
      });
    }

    await db.query(
      `INSERT INTO reviews (exchange_id, reviewer_id, reviewee_id, rating, comment)
       VALUES (?, ?, ?, ?, ?)`,
      [exchange_id, reviewerId, revieweeId, rating, comment || "Great skill exchange!"]
    );

    res.status(201).json({
      success: true,
      message: "Thank you! Your review has been published.",
    });
  } catch (error) {
    console.error("CreateReview Error:", error);
    res.status(500).json({ success: false, message: "Server error submitting review" });
  }
};

// Get reviews for a target user
exports.getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;

    const [reviews] = await db.query(
      `SELECT r.id, r.rating, r.comment, r.created_at,
              u.id as reviewer_id, u.name as reviewer_name, u.profile_picture as reviewer_picture
       FROM reviews r
       JOIN users u ON r.reviewer_id = u.id
       WHERE r.reviewee_id = ?
       ORDER BY r.created_at DESC`,
      [userId]
    );

    const [ratingAgg] = await db.query(
      "SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews FROM reviews WHERE reviewee_id = ?",
      [userId]
    );

    res.json({
      success: true,
      reviews,
      averageRating: ratingAgg[0].avg_rating ? parseFloat(ratingAgg[0].avg_rating).toFixed(1) : "5.0",
      totalReviews: ratingAgg[0].total_reviews || 0,
    });
  } catch (error) {
    console.error("GetUserReviews Error:", error);
    res.status(500).json({ success: false, message: "Server error fetching user reviews" });
  }
};
