const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "skillswap_super_secret_key_change_this";

// Register user
exports.register = async (req, res) => {
  try {
    const { name, email, password, bio, gender, location, city, profession, profile_picture } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    // Check existing
    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email address is already registered",
      });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const userGender = gender || "other";
    const userLocation = location || "";
    const userCity = city || "";
    const userInstitute = req.body.education_institute || "";
    const userDegree = req.body.education_degree || "";
    const userYear = req.body.education_year || "";
    const userBio = bio || "Lifelong learner & skill barter enthusiast on SkillSwap.";
    const userProfession = profession || "Student / Learner";
    const cleanName = encodeURIComponent(name.trim());
    const pic = profile_picture || `https://api.dicebear.com/7.x/lorelei/svg?seed=${cleanName}&backgroundColor=b6e3f4,c0aedd`;

    const [result] = await db.query(
      "INSERT INTO users (name, email, password_hash, gender, bio, location, city, profession, education_institute, education_degree, education_year, profile_picture) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [name, email, password_hash, userGender, userBio, userLocation, userCity, userProfession, userInstitute, userDegree, userYear, pic]
    );

    const userId = result.insertId;
    const token = jwt.sign({ id: userId, email, role: "user" }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: userId,
        name,
        email,
        gender: userGender,
        bio: userBio,
        location: userLocation,
        city: userCity,
        profession: userProfession,
        education_institute: userInstitute,
        education_degree: userDegree,
        education_year: userYear,
        profile_picture: pic,
        role: "user",
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, username, name, identifier, password } = req.body;
    const loginIdentifier = email || username || name || identifier;

    if (!loginIdentifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Email Address / Full Name and password are required",
      });
    }

    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ? OR name = ?",
      [loginIdentifier.trim(), loginIdentifier.trim()]
    );
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email Address / Full Name or password",
      });
    }

    const user = users[0];
    if (user.status === "banned") {
      return res.status(403).json({
        success: false,
        message: "Your account has been suspended by System Administrator.",
      });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email Address / Full Name or password",
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        location: user.location,
        city: user.city,
        gender: user.gender,
        profession: user.profession,
        education_degree: user.education_degree,
        education_institute: user.education_institute,
        education_year: user.education_year,
        availability: user.availability,
        github_url: user.github_url,
        linkedin_url: user.linkedin_url,
        portfolio_url: user.portfolio_url,
        profile_picture: user.profile_picture,
        role: user.role,
        karma_balance: user.karma_balance,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

// Get current profile
exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const [users] = await db.query(
      "SELECT id, name, email, bio, location, city, gender, profession, education_degree, education_institute, education_year, availability, github_url, linkedin_url, portfolio_url, profile_picture, role, karma_balance, created_at FROM users WHERE id = ?",
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const user = users[0];

    // Fetch skills
    const [skills] = await db.query(
      `SELECT us.id, us.skill_id, us.type, us.experience_level, us.description,
              s.name as skill_name, s.category
       FROM user_skills us
       JOIN skills s ON us.skill_id = s.id
       WHERE us.user_id = ?`,
      [userId]
    );

    user.offered_skills = skills.filter((s) => s.type === "offered");
    user.wanted_skills = skills.filter((s) => s.type === "wanted");

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("GetMe Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching user profile",
    });
  }
};
