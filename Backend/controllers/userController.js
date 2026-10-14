const db = require("../config/db");

// Get public profile of any user by ID
exports.getProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await db.query(
      "SELECT id, name, email, bio, location, city, gender, profession, education_degree, education_institute, education_year, availability, github_url, linkedin_url, portfolio_url, profile_picture, role, created_at FROM users WHERE id = ?",
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const user = users[0];

    // Fetch user skills
    const [skills] = await db.query(
      `SELECT us.id, us.skill_id, us.type, us.experience_level, us.description,
              s.name as skill_name, s.category
       FROM user_skills us
       JOIN skills s ON us.skill_id = s.id
       WHERE us.user_id = ?`,
      [id]
    );

    user.offered_skills = skills.filter((s) => s.type === "offered");
    user.wanted_skills = skills.filter((s) => s.type === "wanted");

    // Fetch user rating & reviews received
    const [reviews] = await db.query(
      `SELECT r.id, r.rating, r.comment, r.created_at,
              u.id as reviewer_id, u.name as reviewer_name, u.profile_picture as reviewer_picture
       FROM reviews r
       JOIN users u ON r.reviewer_id = u.id
       WHERE r.reviewee_id = ?
       ORDER BY r.created_at DESC`,
      [id]
    );

    const [ratingAgg] = await db.query(
      "SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews FROM reviews WHERE reviewee_id = ?",
      [id]
    );

    user.reviews = reviews;
    user.rating = ratingAgg[0].avg_rating ? parseFloat(ratingAgg[0].avg_rating).toFixed(1) : "5.0";
    user.total_reviews = ratingAgg[0].total_reviews || 0;

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("GetProfile Error:", error);
    res.status(500).json({ success: false, message: "Server error fetching user profile" });
  }
};

// Update profile details
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const allowedFields = [
      'name', 
      'bio', 
      'location', 
      'city', 
      'gender', 
      'profession', 
      'education_degree', 
      'education_institute', 
      'education_year', 
      'availability', 
      'github_url', 
      'linkedin_url', 
      'portfolio_url', 
      'profile_picture'
    ];

    const updates = [];
    const values = [];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(req.body[field]);
      }
    }

    if (updates.length > 0) {
      values.push(userId);
      await db.query(
        `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }

    const [updatedUsers] = await db.query(
      "SELECT id, name, email, bio, location, city, gender, profession, education_degree, education_institute, education_year, availability, github_url, linkedin_url, portfolio_url, profile_picture, role, karma_balance FROM users WHERE id = ?",
      [userId]
    );

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUsers[0],
    });
  } catch (error) {
    console.error("UpdateProfile Error:", error);
    res.status(500).json({ success: false, message: "Server error updating profile" });
  }
};

// Add a skill (offered or wanted) to user's profile
exports.addUserSkill = async (req, res) => {
  try {
    const userId = req.user.id;
    const { skill_id, type, experience_level, description } = req.body;

    if (!skill_id || !type || !['offered', 'wanted'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Skill ID and valid type ('offered' or 'wanted') are required",
      });
    }

    const expLevel = experience_level || 'intermediate';

    await db.query(
      `INSERT INTO user_skills (user_id, skill_id, type, experience_level, description)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE experience_level = VALUES(experience_level), description = VALUES(description)`,
      [userId, skill_id, type, expLevel, description || '']
    );

    res.json({
      success: true,
      message: `Skill added to ${type} list successfully`,
    });
  } catch (error) {
    console.error("AddUserSkill Error:", error);
    res.status(500).json({ success: false, message: "Server error adding skill" });
  }
};

// Delete user skill
exports.deleteUserSkill = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM user_skills WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Skill not found on profile" });
    }

    res.json({
      success: true,
      message: "Skill removed successfully",
    });
  } catch (error) {
    console.error("DeleteUserSkill Error:", error);
    res.status(500).json({ success: false, message: "Server error removing skill" });
  }
};

// Get real escrow karma & barter balance stats for current user
exports.getKarmaStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Fetch user reviews and average rating
    const [reviewRows] = await db.query(
      "SELECT COALESCE(AVG(rating), 5.0) as avg_rating, COUNT(*) as total_reviews FROM reviews WHERE reviewee_id = ?",
      [userId]
    );
    const avgRating = reviewRows[0].avg_rating ? parseFloat(reviewRows[0].avg_rating).toFixed(1) : "5.0";
    const totalReviews = reviewRows[0].total_reviews || 0;

    // 2. Fetch user's real exchanges
    const [exchangeRows] = await db.query(
      `SELECT e.id, e.status, COALESCE(e.duration_min, 60) as duration_min, 
              sr.requester_id, sr.receiver_id
       FROM swap_requests sr
       LEFT JOIN exchanges e ON e.request_id = sr.id
       WHERE (sr.requester_id = ? OR sr.receiver_id = ?) AND sr.status = 'accepted'`,
      [userId, userId]
    );

    // 3. Compute real hours taught vs hours learned
    let hoursTaught = 0;
    let hoursLearned = 0;
    let completedCount = 0;

    exchangeRows.forEach((ex) => {
      const durHours = (ex.duration_min || 60) / 60;
      if (ex.status === "completed") {
        completedCount++;
      }
      if (ex.requester_id === userId) {
        hoursTaught += durHours;
      } else {
        hoursLearned += durHours;
      }
    });

    // Net credit in hours
    const netCredit = Number((hoursTaught - hoursLearned).toFixed(1));
    const totalSessions = exchangeRows.length;

    // 4. Fetch user profile fields for verification and karma balance
    const [userRows] = await db.query(
      "SELECT karma_balance, profession, education_institute FROM users WHERE id = ?",
      [userId]
    );
    const karmaBalance = userRows[0]?.karma_balance || 50;
    const isScholar = Boolean(userRows[0]?.education_institute);

    // Dynamic level title based on rating & sessions
    let levelTitle = "5-Star Verified Co-Mentor";
    if (totalSessions >= 10) levelTitle = "Elite Master Co-Mentor";
    else if (totalSessions >= 5) levelTitle = "Advanced Co-Mentor";
    else if (totalSessions >= 1) levelTitle = "Verified Co-Mentor";
    else levelTitle = "Active Peer Learner";

    res.json({
      success: true,
      stats: {
        karmaRating: avgRating,
        totalReviews,
        totalSessions,
        completedCount,
        hoursTaught: Number(hoursTaught.toFixed(1)),
        hoursLearned: Number(hoursLearned.toFixed(1)),
        netCredit,
        karmaBalance,
        levelTitle,
        isVerifiedScholar: isScholar,
        isJecScholar: isScholar,
        isFastResponder: true,
      }
    });
  } catch (error) {
    console.error("GetKarmaStats Error:", error);
    res.status(500).json({ success: false, message: "Error fetching karma stats" });
  }
};
