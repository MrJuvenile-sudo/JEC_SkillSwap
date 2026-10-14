const db = require("../config/db");

// Get all master skills
exports.getAllSkills = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = "SELECT * FROM skills WHERE 1=1";
    const params = [];

    if (category) {
      query += " AND category = ?";
      params.push(category);
    }

    if (search) {
      query += " AND (name LIKE ? OR description LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    query += " ORDER BY category ASC, name ASC";

    const [skills] = await db.query(query, params);

    // Get list of distinct categories
    const [categories] = await db.query("SELECT DISTINCT category FROM skills ORDER BY category ASC");

    res.json({
      success: true,
      skills,
      categories: categories.map(c => c.category),
    });
  } catch (error) {
    console.error("GetAllSkills Error:", error);
    res.status(500).json({ success: false, message: "Server error fetching skills" });
  }
};

// Add new master skill (Admin or Users adding new skills)
exports.addSkill = async (req, res) => {
  try {
    const { name, category, description } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: "Skill name and category are required",
      });
    }

    // Check existing
    const [existing] = await db.query("SELECT id FROM skills WHERE name = ?", [name]);
    if (existing.length > 0) {
      return res.json({
        success: true,
        message: "Skill already exists",
        skill: existing[0],
      });
    }

    const [result] = await db.query(
      "INSERT INTO skills (name, category, description) VALUES (?, ?, ?)",
      [name, category, description || ""]
    );

    res.status(201).json({
      success: true,
      message: "New skill created",
      skill: {
        id: result.insertId,
        name,
        category,
        description: description || "",
      },
    });
  } catch (error) {
    console.error("AddSkill Error:", error);
    res.status(500).json({ success: false, message: "Server error creating skill" });
  }
};
