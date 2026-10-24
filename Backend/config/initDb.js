const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");

async function ensureColumn(pool, table, column, definition) {
  try {
    const [cols] = await pool.query(`SHOW COLUMNS FROM \`${table}\` LIKE ?`, [column]);
    if (cols.length === 0) {
      await pool.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`);
      console.log(`Successfully added missing column '${column}' to table '${table}'`);
    }
  } catch (err) {
    console.error(`Error ensuring column ${column} on ${table}:`, err.message);
  }
}

async function initDb() {
  let connection;
  try {
    const host = process.env.DB_HOST || "localhost";
    const user = process.env.DB_USER || "root";
    const password = process.env.DB_PASSWORD || "";
    const port = process.env.DB_PORT || 3306;
    const dbName = process.env.DB_NAME || "skillswap";

    // Connect to MySQL server to ensure database exists
    connection = await mysql.createConnection({ host, user, password, port });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await connection.end();

    const pool = require("./db");

    // Create tables if not existing
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        bio TEXT,
        location VARCHAR(100),
        profile_picture VARCHAR(500) DEFAULT 'https://api.dicebear.com/7.x/lorelei/svg?seed=Swapper&backgroundColor=b6e3f4,c0aedd',
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // Migration column guarantees for users table
    await ensureColumn(pool, "users", "password_hash", "VARCHAR(255) NOT NULL DEFAULT ''");
    await ensureColumn(pool, "users", "bio", "TEXT");
    await ensureColumn(pool, "users", "location", "VARCHAR(100)");
    await ensureColumn(pool, "users", "city", "VARCHAR(100)");
    await ensureColumn(pool, "users", "gender", "VARCHAR(20) DEFAULT 'other'");
    await ensureColumn(pool, "users", "profession", "VARCHAR(150)");
    await ensureColumn(pool, "users", "education_degree", "VARCHAR(150)");
    await ensureColumn(pool, "users", "education_institute", "VARCHAR(200)");
    await ensureColumn(pool, "users", "education_year", "VARCHAR(50)");
    await ensureColumn(pool, "users", "availability", "VARCHAR(100)");
    await ensureColumn(pool, "users", "github_url", "VARCHAR(255)");
    await ensureColumn(pool, "users", "linkedin_url", "VARCHAR(255)");
    await ensureColumn(pool, "users", "portfolio_url", "VARCHAR(255)");
    await ensureColumn(pool, "users", "profile_picture", "LONGTEXT");
    await pool.query("ALTER TABLE users MODIFY COLUMN profile_picture LONGTEXT").catch(() => {});
    await ensureColumn(pool, "users", "role", "VARCHAR(20) DEFAULT 'user'");
    await ensureColumn(pool, "users", "status", "VARCHAR(20) DEFAULT 'active'");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS system_settings (
        setting_key VARCHAR(100) PRIMARY KEY,
        setting_value LONGTEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);
    await pool.query("ALTER TABLE system_settings MODIFY COLUMN setting_value LONGTEXT").catch(() => {});

    await pool.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        author_name VARCHAR(100) NOT NULL,
        author_role VARCHAR(150),
        skill_traded VARCHAR(100),
        rating INT DEFAULT 5,
        quote TEXT NOT NULL,
        avatar_url VARCHAR(500),
        is_featured BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Legacy column fixes
    try {
      const [pwdCols] = await pool.query(`SHOW COLUMNS FROM users LIKE 'password'`);
      if (pwdCols.length > 0) {
        await pool.query(`ALTER TABLE users MODIFY COLUMN password VARCHAR(255) NULL`);
        await pool.query(`UPDATE users SET password_hash = password WHERE (password_hash IS NULL OR password_hash = '') AND password IS NOT NULL`);
      }
    } catch (e) {}

    await pool.query(`
      CREATE TABLE IF NOT EXISTS skills (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        category VARCHAR(100) NOT NULL DEFAULT 'Technology & Programming',
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await ensureColumn(pool, "skills", "category", "VARCHAR(100) NOT NULL DEFAULT 'Technology & Programming'");
    await ensureColumn(pool, "skills", "category_id", "INT DEFAULT 1");
    await ensureColumn(pool, "skills", "description", "TEXT");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_skills (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        skill_id INT NOT NULL,
        type VARCHAR(20) NOT NULL DEFAULT 'offered',
        experience_level VARCHAR(50) DEFAULT 'intermediate',
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await ensureColumn(pool, "user_skills", "type", "VARCHAR(20) NOT NULL DEFAULT 'offered'");
    await ensureColumn(pool, "user_skills", "experience_level", "VARCHAR(50) DEFAULT 'intermediate'");
    await ensureColumn(pool, "user_skills", "description", "TEXT");

    // Upgrade type and experience_level to VARCHAR to prevent ENUM truncation errors
    try {
      await pool.query(`ALTER TABLE user_skills MODIFY COLUMN type VARCHAR(20) NOT NULL DEFAULT 'offered'`);
      await pool.query(`ALTER TABLE user_skills MODIFY COLUMN experience_level VARCHAR(50) DEFAULT 'intermediate'`);
    } catch (e) {}

    await pool.query(`
      CREATE TABLE IF NOT EXISTS swap_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        requester_id INT NOT NULL,
        receiver_id INT NOT NULL,
        offered_skill_id INT NOT NULL,
        requested_skill_id INT NOT NULL,
        message TEXT,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    try {
      await pool.query(`ALTER TABLE swap_requests MODIFY COLUMN status VARCHAR(20) DEFAULT 'pending'`);
    } catch (e) {}

    await pool.query(`
      CREATE TABLE IF NOT EXISTS exchanges (
        id INT AUTO_INCREMENT PRIMARY KEY,
        request_id INT NOT NULL UNIQUE,
        status VARCHAR(20) DEFAULT 'scheduled',
        meeting_link VARCHAR(500),
        scheduled_at DATETIME,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    try {
      await pool.query(`ALTER TABLE exchanges MODIFY COLUMN status VARCHAR(20) DEFAULT 'scheduled'`);
    } catch (e) {}

    await ensureColumn(pool, "exchanges", "chat_history", "LONGTEXT");
    await ensureColumn(pool, "exchanges", "shared_resources", "LONGTEXT");

    // Auto-create missing exchange session rooms for all swap requests
    try {
      await pool.query(`
        INSERT INTO exchanges (request_id, status, meeting_link, notes)
        SELECT sr.id, 'scheduled', 'https://meet.google.com/skillswap-room', 'Welcome to your 1-on-1 skill exchange virtual classroom! Connect via video call, share meeting links, and use study guides.'
        FROM swap_requests sr
        WHERE NOT EXISTS (SELECT 1 FROM exchanges e WHERE e.request_id = sr.id)
      `);
    } catch (e) {}

    await pool.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        exchange_id INT NOT NULL,
        reviewer_id INT NOT NULL,
        reviewee_id INT NOT NULL,
        rating INT CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // SkillSwap Live: Group Learning Sessions & Classes (Google Meet Provider)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS live_sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        host_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        skill_topic VARCHAR(150) NOT NULL,
        category VARCHAR(100) DEFAULT 'General',
        description TEXT,
        session_date DATE NOT NULL,
        start_time TIME NOT NULL,
        duration_minutes INT NOT NULL DEFAULT 60,
        max_participants INT NOT NULL DEFAULT 10,
        meeting_provider ENUM('GOOGLE_MEET') NOT NULL DEFAULT 'GOOGLE_MEET',
        meeting_url VARCHAR(600) NULL,
        google_meet_space_name VARCHAR(255) NULL,
        visibility ENUM('public', 'private') NOT NULL DEFAULT 'public',
        status ENUM('draft', 'published', 'in_progress', 'completed', 'cancelled') NOT NULL DEFAULT 'published',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_host_id (host_id),
        INDEX idx_session_date (session_date),
        INDEX idx_status (status)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS session_registrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        session_id INT NOT NULL,
        user_id INT NOT NULL,
        status ENUM('registered', 'attended', 'cancelled') NOT NULL DEFAULT 'registered',
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uq_session_user (session_id, user_id),
        INDEX idx_session_id (session_id),
        INDEX idx_user_id (user_id)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS session_attendances (
        id INT AUTO_INCREMENT PRIMARY KEY,
        session_id INT NOT NULL,
        user_id INT NOT NULL,
        attended BOOLEAN DEFAULT TRUE,
        rating INT NULL CHECK (rating >= 1 AND rating <= 5),
        feedback TEXT NULL,
        marked_by_host_id INT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uq_attendance (session_id, user_id),
        INDEX idx_session_att (session_id)
      );
    `);

    // Seed default master skills (including Top IT & MCA Core Courses)
    const seedSkills = [
      ['React.js Frontend Development', 'Technology & Programming', 'Building modern single-page web applications with React'],
      ['Node.js & Express Backend', 'Technology & Programming', 'Developing scalable REST APIs with Node.js and Express'],
      ['Python & Data Analysis', 'Technology & Programming', 'Data manipulation, automation, and machine learning with Python'],
      ['Data Structures & Algorithms (DSA)', 'MCA Core & IT', 'Arrays, Linked Lists, Trees, Graphs, Sorting & Dynamic Programming'],
      ['Database Management Systems (DBMS & SQL)', 'MCA Core & IT', 'Relational database design, SQL queries, Indexing, and Transactions'],
      ['Java Enterprise Edition & Spring Boot', 'MCA Core & IT', 'Core Java, OOPs concepts, Multithreading, and Spring Boot APIs'],
      ['Operating Systems & System Concepts', 'MCA Core & IT', 'Processes, Threads, Memory Management, Linux CLI, and Shell Scripting'],
      ['Computer Networks & Security', 'MCA Core & IT', 'TCP/IP Model, OSI Layers, Socket Programming, and Network Defense'],
      ['Cloud Computing & AWS DevOps', 'Top IT Courses', 'AWS Services, EC2, S3, Docker Containerization, and CI/CD Pipelines'],
      ['Machine Learning & AI Engineering', 'Top IT Courses', 'Supervised Learning, Neural Networks, PyTorch, and Model Deployment'],
      ['UI/UX Design & Figma', 'Design & Creative', 'Creating user interfaces, wireframes, and design systems in Figma'],
      ['Spanish Language & Conversation', 'Languages', 'Conversational Spanish practice, grammar, and vocabulary'],
      ['Digital Marketing & SEO', 'Business & Marketing', 'Search engine optimization, social media strategy, and content marketing'],
      ['System Design & Distributed Systems', 'Top IT Courses', 'Scalability, Load Balancing, Caching, and Microservices Architecture']
    ];

    for (const [name, category, description] of seedSkills) {
      await pool.query(
        `INSERT IGNORE INTO skills (name, category, description) VALUES (?, ?, ?)`,
        [name, category, description]
      );
    }

    // Database tables & migration checks completed successfully.

    // Migrate existing unsplash profile pictures to unique SVG avatars for all users
    try {
      await pool.query(`UPDATE users SET profile_picture = CONCAT('https://api.dicebear.com/7.x/lorelei/svg?seed=', LOWER(REPLACE(name, ' ', '')), '&backgroundColor=b6e3f4,c0aedd') WHERE profile_picture LIKE '%unsplash%' OR profile_picture LIKE '%photo-%' OR profile_picture IS NULL OR profile_picture = ''`);
    } catch(e) {}

    console.log("Database tables & migration checks completed successfully.");
  } catch (err) {
    console.error("Database initialization warning / error:", err.message);
  }
}

module.exports = initDb;
