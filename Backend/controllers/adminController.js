const db = require("../config/db");

// 1. Get Overall Admin Stats
exports.getAdminStats = async (req, res) => {
  try {
    const [uRows] = await db.query("SELECT COUNT(*) AS total FROM users");
    const [aRows] = await db.query("SELECT COUNT(*) AS total FROM users WHERE role = 'admin'");
    const [bRows] = await db.query("SELECT COUNT(*) AS total FROM users WHERE status = 'banned'");
    const [sRows] = await db.query("SELECT COUNT(*) AS total FROM skills");
    const [rRows] = await db.query("SELECT COUNT(*) AS total FROM swap_requests");
    const [eRows] = await db.query("SELECT COUNT(*) AS total FROM exchanges");
    const [revRows] = await db.query("SELECT COUNT(*) AS total FROM reviews");
    const [avgRows] = await db.query("SELECT AVG(rating) AS avg FROM reviews");

    const [dbTest] = await db.query("SELECT 1 AS status");

    res.json({
      success: true,
      stats: {
        totalUsers: uRows[0]?.total || 0,
        totalAdmins: aRows[0]?.total || 0,
        bannedUsers: bRows[0]?.total || 0,
        totalSkills: sRows[0]?.total || 0,
        totalRequests: rRows[0]?.total || 0,
        totalExchanges: eRows[0]?.total || 0,
        totalReviews: revRows[0]?.total || 0,
        averageRating: Number(avgRows[0]?.avg || 5.0).toFixed(1),
        systemHealth: "100% Operational",
        dbStatus: dbTest.length > 0 ? "Connected" : "Disconnected"
      }
    });
  } catch (error) {
    console.error("GetAdminStats Error:", error);
    res.status(500).json({ success: false, message: "Error fetching admin stats", error: error.message });
  }
};

// 2. Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(`
      SELECT u.id, u.name, u.email, COALESCE(u.role, 'user') as role, COALESCE(u.status, 'active') as status, u.bio, u.location, u.city,
             u.profession, u.education_degree, u.profile_picture, u.created_at,
             (SELECT COUNT(*) FROM user_skills us WHERE us.user_id = u.id AND us.type = 'offered') as offered_count,
             (SELECT COUNT(*) FROM user_skills us WHERE us.user_id = u.id AND us.type = 'wanted') as wanted_count
      FROM users u
      ORDER BY u.created_at DESC
    `);
    res.json({ success: true, users: users || [] });
  } catch (error) {
    console.error("GetAllUsers Error:", error);
    res.status(500).json({ success: false, message: "Error fetching users", error: error.message });
  }
};

// 3. Update User Role (User vs Admin)
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role value" });
    }
    await db.query("UPDATE users SET role = ? WHERE id = ?", [role, id]);
    res.json({ success: true, message: `User role updated to ${role}` });
  } catch (error) {
    console.error("UpdateUserRole Error:", error);
    res.status(500).json({ success: false, message: "Error updating user role" });
  }
};

// 4. Update User Status (Active vs Banned)
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['active', 'banned'].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }
    await db.query("UPDATE users SET status = ? WHERE id = ?", [status, id]);
    res.json({ success: true, message: `User status updated to ${status}` });
  } catch (error) {
    console.error("UpdateUserStatus Error:", error);
    res.status(500).json({ success: false, message: "Error updating user status" });
  }
};

// 5. Delete User Account
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM user_skills WHERE user_id = ?", [id]);
    await db.query("DELETE FROM swap_requests WHERE requester_id = ? OR receiver_id = ?", [id, id]);
    await db.query("DELETE FROM users WHERE id = ?", [id]);
    res.json({ success: true, message: "User account deleted successfully" });
  } catch (error) {
    console.error("DeleteUser Error:", error);
    res.status(500).json({ success: false, message: "Error deleting user" });
  }
};

// 6. Get All Master Skills
exports.getAllSkills = async (req, res) => {
  try {
    const [skills] = await db.query("SELECT * FROM skills ORDER BY name ASC");
    res.json({ success: true, skills: skills || [] });
  } catch (error) {
    console.error("GetAllSkills Error:", error);
    res.status(500).json({ success: false, message: "Error fetching skills", error: error.message });
  }
};

// 7. Add Master Skill
exports.addSkill = async (req, res) => {
  try {
    const { name, category, description } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Skill name is required" });
    }
    const [result] = await db.query(
      "INSERT INTO skills (name, category, description) VALUES (?, ?, ?)",
      [name.trim(), category || 'Technology & Programming', description || '']
    );
    res.json({ success: true, message: "Master skill created successfully", skillId: result.insertId });
  } catch (error) {
    console.error("AddSkill Error:", error);
    res.status(500).json({ success: false, message: error.code === 'ER_DUP_ENTRY' ? 'Skill name already exists' : 'Error adding skill' });
  }
};

// 8. Update Master Skill
exports.updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, description } = req.body;
    await db.query(
      "UPDATE skills SET name = ?, category = ?, description = ? WHERE id = ?",
      [name, category, description, id]
    );
    res.json({ success: true, message: "Master skill updated successfully" });
  } catch (error) {
    console.error("UpdateSkill Error:", error);
    res.status(500).json({ success: false, message: "Error updating skill" });
  }
};

// 9. Delete Master Skill
exports.deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM user_skills WHERE skill_id = ?", [id]);
    await db.query("DELETE FROM skills WHERE id = ?", [id]);
    res.json({ success: true, message: "Master skill deleted successfully" });
  } catch (error) {
    console.error("DeleteSkill Error:", error);
    res.status(500).json({ success: false, message: "Error deleting skill" });
  }
};

// 10. Get All Exchanges
exports.getAllExchanges = async (req, res) => {
  try {
    const [exchanges] = await db.query(`
      SELECT e.*,
             sr.requester_id, sr.receiver_id,
             COALESCE(u1.name, 'Swapper') as requester_name, u1.email as requester_email,
             COALESCE(u2.name, 'Swapper') as receiver_name, u2.email as receiver_email,
             COALESCE(os.name, 'General Skill') as offered_skill_name, COALESCE(rs.name, 'General Skill') as requested_skill_name
      FROM exchanges e
      LEFT JOIN swap_requests sr ON e.request_id = sr.id
      LEFT JOIN users u1 ON sr.requester_id = u1.id
      LEFT JOIN users u2 ON sr.receiver_id = u2.id
      LEFT JOIN skills os ON sr.offered_skill_id = os.id
      LEFT JOIN skills rs ON sr.requested_skill_id = rs.id
      ORDER BY e.id DESC
    `);
    res.json({ success: true, exchanges: exchanges || [] });
  } catch (error) {
    console.error("GetAllExchanges Error:", error);
    res.status(500).json({ success: false, message: "Error fetching exchanges", error: error.message });
  }
};

// 11. Update Exchange Details
exports.updateExchange = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, meeting_link, notes } = req.body;
    await db.query(
      "UPDATE exchanges SET status = COALESCE(?, status), meeting_link = COALESCE(?, meeting_link), notes = COALESCE(?, notes) WHERE id = ?",
      [status, meeting_link, notes, id]
    );
    res.json({ success: true, message: "Exchange session updated successfully" });
  } catch (error) {
    console.error("UpdateExchange Error:", error);
    res.status(500).json({ success: false, message: "Error updating exchange" });
  }
};

// 12. Delete Exchange
exports.deleteExchange = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM exchanges WHERE id = ?", [id]);
    res.json({ success: true, message: "Exchange session deleted" });
  } catch (error) {
    console.error("DeleteExchange Error:", error);
    res.status(500).json({ success: false, message: "Error deleting exchange" });
  }
};

// 13. Get All Swap Requests
exports.getAllRequests = async (req, res) => {
  try {
    const [requests] = await db.query(`
      SELECT sr.*,
             COALESCE(u1.name, 'Swapper') as requester_name, u1.email as requester_email,
             COALESCE(u2.name, 'Swapper') as receiver_name, u2.email as receiver_email,
             COALESCE(os.name, 'General Skill') as offered_skill_name, COALESCE(rs.name, 'General Skill') as requested_skill_name
      FROM swap_requests sr
      LEFT JOIN users u1 ON sr.requester_id = u1.id
      LEFT JOIN users u2 ON sr.receiver_id = u2.id
      LEFT JOIN skills os ON sr.offered_skill_id = os.id
      LEFT JOIN skills rs ON sr.requested_skill_id = rs.id
      ORDER BY sr.created_at DESC
    `);
    res.json({ success: true, requests: requests || [] });
  } catch (error) {
    console.error("GetAllRequests Error:", error);
    res.status(500).json({ success: false, message: "Error fetching swap requests", error: error.message });
  }
};

// 14. Update Swap Request Status
exports.updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await db.query("UPDATE swap_requests SET status = ? WHERE id = ?", [status, id]);
    if (status === 'accepted') {
      const [existing] = await db.query("SELECT id FROM exchanges WHERE request_id = ?", [id]);
      if (existing.length === 0) {
        await db.query("INSERT INTO exchanges (request_id, status, meeting_link, notes) VALUES (?, 'scheduled', 'https://meet.google.com/new', 'Created by Admin')", [id]);
      }
    }
    res.json({ success: true, message: `Request status updated to ${status}` });
  } catch (error) {
    console.error("UpdateRequestStatus Error:", error);
    res.status(500).json({ success: false, message: "Error updating request status" });
  }
};

// 15. Delete Swap Request
exports.deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM exchanges WHERE request_id = ?", [id]);
    await db.query("DELETE FROM swap_requests WHERE id = ?", [id]);
    res.json({ success: true, message: "Swap request deleted" });
  } catch (error) {
    console.error("DeleteRequest Error:", error);
    res.status(500).json({ success: false, message: "Error deleting request" });
  }
};

// 16. Get All Reviews
exports.getAllReviews = async (req, res) => {
  try {
    const [reviews] = await db.query(`
      SELECT r.*,
             COALESCE(u1.name, 'Swapper') as reviewer_name, u1.profile_picture as reviewer_picture,
             COALESCE(u2.name, 'Swapper') as reviewee_name
      FROM reviews r
      LEFT JOIN users u1 ON r.reviewer_id = u1.id
      LEFT JOIN users u2 ON r.reviewee_id = u2.id
      ORDER BY r.created_at DESC
    `);
    res.json({ success: true, reviews: reviews || [] });
  } catch (error) {
    console.error("GetAllReviews Error:", error);
    res.status(500).json({ success: false, message: "Error fetching reviews", error: error.message });
  }
};

// 17. Delete Review
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM reviews WHERE id = ?", [id]);
    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.error("DeleteReview Error:", error);
    res.status(500).json({ success: false, message: "Error deleting review" });
  }
};

// 18. System Settings
exports.getSettings = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM system_settings");
    const settings = {};
    if (rows && rows.length > 0) {
      rows.forEach(r => { settings[r.setting_key] = r.setting_value; });
    }
    res.json({ success: true, settings });
  } catch (error) {
    console.error("GetSettings Error:", error);
    res.json({ success: true, settings: {} });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { settings } = req.body;
    if (settings) {
      for (const [key, value] of Object.entries(settings)) {
        await db.query(
          "INSERT INTO system_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?",
          [key, String(value), String(value)]
        );
      }
    }
    res.json({ success: true, message: "System settings updated successfully" });
  } catch (error) {
    console.error("UpdateSettings Error:", error);
    res.status(500).json({ success: false, message: "Error updating settings" });
  }
};

// 19. Testimonials Management
exports.getAllTestimonials = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM testimonials ORDER BY created_at DESC");
    res.json({ success: true, testimonials: rows || [] });
  } catch (error) {
    console.error("GetAllTestimonials Error:", error);
    res.json({ success: true, testimonials: [] });
  }
};

exports.getPublicTestimonials = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM testimonials WHERE is_featured = 1 ORDER BY created_at DESC");
    res.json({ success: true, testimonials: rows || [] });
  } catch (error) {
    console.error("GetPublicTestimonials Error:", error);
    res.json({ success: true, testimonials: [] });
  }
};

exports.createTestimonial = async (req, res) => {
  try {
    const { author_name, author_role, skill_traded, rating, quote, avatar_url, is_featured } = req.body;
    if (!author_name || !quote) {
      return res.status(400).json({ success: false, message: "Author name and quote are required" });
    }
    const avatar = avatar_url || `https://api.dicebear.com/7.x/lorelei/svg?seed=${encodeURIComponent(author_name)}&backgroundColor=b6e3f4`;
    const [result] = await db.query(
      "INSERT INTO testimonials (author_name, author_role, skill_traded, rating, quote, avatar_url, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [author_name, author_role || "Swapper", skill_traded || "General Skill Exchange", rating || 5, quote, avatar, is_featured !== undefined ? is_featured : true]
    );
    res.json({ success: true, message: "Testimonial created", id: result.insertId });
  } catch (error) {
    console.error("CreateTestimonial Error:", error);
    res.status(500).json({ success: false, message: "Error creating testimonial" });
  }
};

exports.updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { author_name, author_role, skill_traded, rating, quote, avatar_url, is_featured } = req.body;
    await db.query(
      "UPDATE testimonials SET author_name = ?, author_role = ?, skill_traded = ?, rating = ?, quote = ?, avatar_url = ?, is_featured = ? WHERE id = ?",
      [author_name, author_role, skill_traded, rating, quote, avatar_url, is_featured !== undefined ? is_featured : true, id]
    );
    res.json({ success: true, message: "Testimonial updated successfully" });
  } catch (error) {
    console.error("UpdateTestimonial Error:", error);
    res.status(500).json({ success: false, message: "Error updating testimonial" });
  }
};

exports.deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM testimonials WHERE id = ?", [id]);
    res.json({ success: true, message: "Testimonial deleted successfully" });
  } catch (error) {
    console.error("DeleteTestimonial Error:", error);
    res.status(500).json({ success: false, message: "Error deleting testimonial" });
  }
};

