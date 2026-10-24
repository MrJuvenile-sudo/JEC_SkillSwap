const db = require("../config/db");
const { calculateMatchScore } = require("../services/matchingService");

// Search/Explore users by skills offered/wanted or location
exports.searchUsers = async (req, res) => {
  try {
    const { query, offered_skill_id, wanted_skill_id, category } = req.query;
    const currentUserId = req.user ? req.user.id : null;

    let sql = `
      SELECT DISTINCT u.id, u.name, u.email, u.gender, u.bio, u.location, u.city, u.profession, u.education_degree, u.education_institute, u.education_year, u.profile_picture, u.created_at
      FROM users u
      LEFT JOIN user_skills us ON u.id = us.user_id
      LEFT JOIN skills s ON us.skill_id = s.id
      WHERE 1=1
    `;
    const params = [];

    if (currentUserId) {
      sql += " AND u.id != ?";
      params.push(currentUserId);
    }

    if (query) {
      sql += " AND (u.name LIKE ? OR u.bio LIKE ? OR u.location LIKE ? OR u.profession LIKE ? OR u.education_degree LIKE ? OR s.name LIKE ? OR s.category LIKE ?)";
      const searchPattern = `%${query}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
    }

    if (offered_skill_id) {
      sql += " AND u.id IN (SELECT user_id FROM user_skills WHERE skill_id = ? AND type = 'offered')";
      params.push(offered_skill_id);
    }

    if (wanted_skill_id) {
      sql += " AND u.id IN (SELECT user_id FROM user_skills WHERE skill_id = ? AND type = 'wanted')";
      params.push(wanted_skill_id);
    }

    if (category) {
      if (category === "Web Development") {
        sql += " AND (s.name IN ('React', 'HTML', 'CSS', 'JavaScript', 'Node.js', 'Frontend', 'Backend') OR s.category LIKE '%Web%')";
      } else if (category === "DSA & Core CS") {
        sql += " AND (s.name IN ('Java', 'C', 'C++', 'Data Structures', 'Algorithms', 'DSA', 'Python', 'DBMS', 'OS') OR s.category LIKE '%Core%')";
      } else if (category === "AI & Machine Learning") {
        sql += " AND (s.name IN ('Python', 'Machine Learning', 'AI', 'Deep Learning', 'Data Science') OR s.category LIKE '%AI%')";
      } else if (category === "UI/UX Design") {
        sql += " AND (s.name IN ('UI/UX Design', 'Figma', 'Graphic Design') OR s.category LIKE '%Design%')";
      } else if (category === "Cloud & DevOps") {
        sql += " AND (s.name IN ('AWS', 'Docker', 'Kubernetes', 'Cloud', 'DevOps', 'Linux') OR s.category LIKE '%Cloud%')";
      } else if (category === "Languages & Comms") {
        sql += " AND (s.name IN ('English', 'Spanish', 'German', 'French', 'Communication') OR s.category LIKE '%Language%')";
      } else {
        sql += " AND (s.category = ? OR s.name LIKE ?)";
        params.push(category, `%${category}%`);
      }
    }

    sql += " ORDER BY u.created_at DESC LIMIT 50";

    const [users] = await db.query(sql, params);

    // Populate skills, clean location, and rating for each user
    for (let u of users) {
      if (u.location && /^\d+$/.test(u.location.trim())) {
        u.location = "";
      }
      if (u.city && /^\d+$/.test(u.city.trim())) {
        u.city = "";
      }

      const [skills] = await db.query(
        `SELECT us.id, us.skill_id, us.type, us.experience_level, us.description,
                s.name as skill_name, s.category
         FROM user_skills us
         JOIN skills s ON us.skill_id = s.id
         WHERE us.user_id = ?`,
        [u.id]
      );
      u.offered_skills = skills.filter(s => s.type === "offered");
      u.wanted_skills = skills.filter(s => s.type === "wanted");

      const [ratingAgg] = await db.query(
        "SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews FROM reviews WHERE reviewee_id = ?",
        [u.id]
      );
      u.rating = ratingAgg[0].avg_rating ? parseFloat(ratingAgg[0].avg_rating).toFixed(1) : "5.0";
      u.total_reviews = ratingAgg[0].total_reviews || 0;
    }

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("SearchUsers Error:", error);
    res.status(500).json({ success: false, message: "Server error searching users" });
  }
};

// Smart matching recommendations for current user
exports.getMatches = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    // Fetch current user's skills
    const [mySkills] = await db.query(
      "SELECT user_id, skill_id, type, experience_level FROM user_skills WHERE user_id = ?",
      [currentUserId]
    );

    if (mySkills.length === 0) {
      return res.json({
        success: true,
        message: "Add offered and wanted skills to your profile to get personalized matches!",
        matches: [],
      });
    }

    // Fetch all other users
    const [otherUsers] = await db.query(
      "SELECT id, name, email, bio, location, profile_picture FROM users WHERE id != ?",
      [currentUserId]
    );

    const matches = [];

    for (let user of otherUsers) {
      const [userSkills] = await db.query(
        `SELECT us.id, us.skill_id, us.type, us.experience_level, us.description,
                s.name as skill_name, s.category
         FROM user_skills us
         JOIN skills s ON us.skill_id = s.id
         WHERE us.user_id = ?`,
        [user.id]
      );

      user.offered_skills = userSkills.filter(s => s.type === "offered");
      user.wanted_skills = userSkills.filter(s => s.type === "wanted");

      const matchResult = calculateMatchScore(mySkills, userSkills);

      if (matchResult.score > 20) {
        const [ratingAgg] = await db.query(
          "SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews FROM reviews WHERE reviewee_id = ?",
          [user.id]
        );
        user.rating = ratingAgg[0].avg_rating ? parseFloat(ratingAgg[0].avg_rating).toFixed(1) : "5.0";
        user.total_reviews = ratingAgg[0].total_reviews || 0;
        user.matchScore = matchResult.score;
        user.isTwoWayMatch = matchResult.isTwoWay;
        user.canTeachMeSkillIds = matchResult.canTeachMeSkillIds;
        user.canTeachTargetSkillIds = matchResult.canTeachTargetSkillIds;

        matches.push(user);
      }
    }

    // Sort by match score descending
    matches.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      success: true,
      matches,
    });
  } catch (error) {
    console.error("GetMatches Error:", error);
    res.status(500).json({ success: false, message: "Server error generating matches" });
  }
};
