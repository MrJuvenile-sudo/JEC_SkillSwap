-- SkillSwap Database Schema
CREATE DATABASE IF NOT EXISTS skillswap;
USE skillswap;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  bio TEXT,
  location VARCHAR(100),
  profile_picture VARCHAR(500) DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Master Skills Table
CREATE TABLE IF NOT EXISTS skills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. User Skills (Offered and Wanted)
CREATE TABLE IF NOT EXISTS user_skills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  skill_id INT NOT NULL,
  type ENUM('offered', 'wanted') NOT NULL,
  experience_level ENUM('beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'intermediate',
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_skill_type (user_id, skill_id, type)
);

-- 4. Swap Requests Table
CREATE TABLE IF NOT EXISTS swap_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  requester_id INT NOT NULL,
  receiver_id INT NOT NULL,
  offered_skill_id INT NOT NULL,
  requested_skill_id INT NOT NULL,
  message TEXT,
  status ENUM('pending', 'accepted', 'rejected', 'cancelled', 'completed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (offered_skill_id) REFERENCES skills(id) ON DELETE CASCADE,
  FOREIGN KEY (requested_skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- 5. Exchanges / Sessions Table
CREATE TABLE IF NOT EXISTS exchanges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  request_id INT NOT NULL UNIQUE,
  status ENUM('scheduled', 'in_progress', 'completed', 'cancelled') DEFAULT 'scheduled',
  meeting_link VARCHAR(500),
  scheduled_at DATETIME,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (request_id) REFERENCES swap_requests(id) ON DELETE CASCADE
);

-- 6. Reviews & Ratings Table
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  exchange_id INT NOT NULL,
  reviewer_id INT NOT NULL,
  reviewee_id INT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (exchange_id) REFERENCES exchanges(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewee_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert Default Seed Skills
INSERT IGNORE INTO skills (id, name, category, description) VALUES
(1, 'React.js Frontend Development', 'Technology & Programming', 'Building modern single-page web applications with React'),
(2, 'Node.js & Express Backend', 'Technology & Programming', 'Developing scalable REST APIs with Node.js and Express'),
(3, 'Python & Data Analysis', 'Technology & Programming', 'Data manipulation, automation, and machine learning with Python'),
(4, 'UI/UX Design & Figma', 'Design & Creative', 'Creating user interfaces, wireframes, and design systems in Figma'),
(5, 'Graphic Design & Photoshop', 'Design & Creative', 'Visual design, branding, logo creation, and photo editing'),
(6, 'Spanish Language & Conversation', 'Languages', 'Conversational Spanish practice, grammar, and vocabulary'),
(7, 'Digital Marketing & SEO', 'Business & Marketing', 'Search engine optimization, social media strategy, and content marketing'),
(8, 'Acoustic & Electric Guitar', 'Music & Audio', 'Guitar fundamentals, chords, music theory, and song practice'),
(9, 'Public Speaking & Communication', 'Personal Development', 'Confidence building, speech writing, and effective presentation skills'),
(10, 'Video Editing & Premiere Pro', 'Design & Creative', 'Cutting, color grading, and audio syncing for video production'),
(11, 'French Language & Grammar', 'Languages', 'French vocabulary, pronunciation, and writing skills'),
(12, 'Financial Planning & Investing', 'Business & Marketing', 'Personal finance management, budgeting, and investment strategies');
