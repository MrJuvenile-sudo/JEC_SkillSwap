const db = require("../config/db");

// Google Meet URL Validator
function isValidGoogleMeetUrl(url) {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  // Standard formats:
  // https://meet.google.com/xxx-yyyy-zzz
  // https://meet.google.com/lookup/...
  // meet.google.com/xxx-yyyy-zzz
  try {
    const withProtocol = trimmed.startsWith("http://") || trimmed.startsWith("https://")
      ? trimmed
      : `https://${trimmed}`;
    const parsed = new URL(withProtocol);
    const hostname = parsed.hostname.toLowerCase();
    
    // Strict domain check: meet.google.com
    if (hostname !== "meet.google.com") return false;
    
    // Path must not be empty or root
    const path = parsed.pathname.replace(/^\/+|\/+$/g, "");
    if (!path || path.length < 3) return false;

    return true;
  } catch (err) {
    return false;
  }
}

// Normalize to https://meet.google.com/...
function normalizeGoogleMeetUrl(url) {
  if (!url) return null;
  const trimmed = url.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

// ----------------------------------------------------------------------
// 1. CREATE LIVE CLASS (Host only, auth required)
// ----------------------------------------------------------------------
exports.createSession = async (req, res) => {
  try {
    const host_id = req.user.id;
    const {
      title,
      skill_topic,
      category = "General",
      description = "",
      session_date,
      start_time,
      duration_minutes = 60,
      max_participants = 10,
      meeting_url,
      visibility = "public",
      status = "published",
    } = req.body;

    // Validation
    if (!title || title.trim().length < 3) {
      return res.status(400).json({ success: false, message: "Class title must be at least 3 characters." });
    }
    if (!skill_topic || skill_topic.trim().length === 0) {
      return res.status(400).json({ success: false, message: "Skill / Topic is required." });
    }
    if (!session_date) {
      return res.status(400).json({ success: false, message: "Session date is required." });
    }
    if (!start_time) {
      return res.status(400).json({ success: false, message: "Start time is required." });
    }

    // Google Meet Link Validation
    if (status !== "draft") {
      if (!meeting_url || !isValidGoogleMeetUrl(meeting_url)) {
        return res.status(400).json({
          success: false,
          message: "A valid Google Meet link is required (e.g. https://meet.google.com/abc-defg-hij).",
        });
      }
    }

    const cleanMeetingUrl = meeting_url ? normalizeGoogleMeetUrl(meeting_url) : null;
    const cleanDuration = Math.max(15, Math.min(360, parseInt(duration_minutes) || 60));
    const cleanMax = Math.max(2, Math.min(200, parseInt(max_participants) || 10));

    const [result] = await db.query(
      `INSERT INTO live_sessions 
      (host_id, title, skill_topic, category, description, session_date, start_time, duration_minutes, max_participants, meeting_provider, meeting_url, visibility, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'GOOGLE_MEET', ?, ?, ?)`,
      [
        host_id,
        title.trim(),
        skill_topic.trim(),
        category.trim(),
        description ? description.trim() : "",
        session_date,
        start_time,
        cleanDuration,
        cleanMax,
        cleanMeetingUrl,
        visibility === "private" ? "private" : "public",
        status === "draft" ? "draft" : "published",
      ]
    );

    const [newSession] = await db.query("SELECT * FROM live_sessions WHERE id = ?", [result.insertId]);

    return res.status(201).json({
      success: true,
      message: "Live class created successfully!",
      session: newSession[0],
    });
  } catch (error) {
    console.error("Error creating live session:", error);
    return res.status(500).json({ success: false, message: "Failed to create live class", error: error.message });
  }
};

// ----------------------------------------------------------------------
// 2. DISCOVER CLASSES (Public, with optional auth)
// ----------------------------------------------------------------------
exports.getDiscoverSessions = async (req, res) => {
  try {
    const currentUserId = req.user ? req.user.id : null;
    const { search = "", category = "", timeframe = "all", status = "published" } = req.query;

    let query = `
      SELECT 
        s.id,
        s.host_id,
        s.title,
        s.skill_topic,
        s.category,
        s.description,
        s.session_date,
        s.start_time,
        s.duration_minutes,
        s.max_participants,
        s.meeting_provider,
        s.visibility,
        s.status,
        s.created_at,
        u.name AS host_name,
        u.profile_picture AS host_avatar,
        u.profession AS host_profession,
        u.city AS host_city,
        (SELECT COUNT(*) FROM session_registrations sr WHERE sr.session_id = s.id AND sr.status IN ('registered', 'attended')) AS registered_count
        ${currentUserId ? `, (SELECT COUNT(*) FROM session_registrations sr WHERE sr.session_id = s.id AND sr.user_id = ? AND sr.status IN ('registered', 'attended')) AS is_registered` : ", 0 AS is_registered"}
        ${currentUserId ? `, s.meeting_url` : ""}
      FROM live_sessions s
      JOIN users u ON s.host_id = u.id
      WHERE s.visibility = 'public'
    `;

    const params = [];
    if (currentUserId) {
      params.push(currentUserId);
    }

    if (status) {
      query += ` AND s.status = ?`;
      params.push(status);
    } else {
      query += ` AND s.status != 'cancelled'`;
    }

    if (category && category !== "All") {
      query += ` AND s.category = ?`;
      params.push(category);
    }

    if (search.trim()) {
      const q = `%${search.trim().toLowerCase()}%`;
      query += ` AND (LOWER(s.title) LIKE ? OR LOWER(s.skill_topic) LIKE ? OR LOWER(s.description) LIKE ? OR LOWER(u.name) LIKE ?)`;
      params.push(q, q, q, q);
    }

    if (timeframe === "today") {
      query += ` AND s.session_date = CURDATE()`;
    } else if (timeframe === "upcoming") {
      query += ` AND s.session_date >= CURDATE()`;
    }

    query += ` ORDER BY s.session_date ASC, s.start_time ASC LIMIT 100`;

    const [rows] = await db.query(query, params);

    // Sanitize protected Google Meet link:
    // Only reveal meeting_url if caller is the host or registered!
    const sanitized = rows.map((session) => {
      const isHost = currentUserId && session.host_id === currentUserId;
      const isRegistered = Boolean(session.is_registered > 0);
      const canJoin = (isHost || isRegistered) && session.status !== "cancelled";

      const sessionObj = {
        ...session,
        is_host: isHost,
        is_registered: isRegistered,
        can_join: canJoin,
        seats_left: Math.max(0, session.max_participants - session.registered_count),
        is_full: session.registered_count >= session.max_participants,
      };

      // Mask meeting_url for unauthorized visitors
      if (!canJoin) {
        delete sessionObj.meeting_url;
      }

      return sessionObj;
    });

    return res.json({
      success: true,
      sessions: sanitized,
      count: sanitized.length,
    });
  } catch (error) {
    console.error("Error fetching discover sessions:", error);
    return res.status(500).json({ success: false, message: "Failed to load live sessions", error: error.message });
  }
};

// ----------------------------------------------------------------------
// 3. GET SESSION DETAILS (Public, with optional auth)
// ----------------------------------------------------------------------
exports.getSessionDetails = async (req, res) => {
  try {
    const sessionId = req.params.id;
    const currentUserId = req.user ? req.user.id : null;

    const [sessions] = await db.query(
      `SELECT 
        s.*,
        u.name AS host_name,
        u.email AS host_email,
        u.profile_picture AS host_avatar,
        u.profession AS host_profession,
        u.bio AS host_bio,
        u.city AS host_city,
        u.github_url AS host_github,
        u.linkedin_url AS host_linkedin
      FROM live_sessions s
      JOIN users u ON s.host_id = u.id
      WHERE s.id = ?`,
      [sessionId]
    );

    if (sessions.length === 0) {
      return res.status(404).json({ success: false, message: "Live session not found" });
    }

    const session = sessions[0];

    // Fetch registered participants
    const [registrations] = await db.query(
      `SELECT 
        sr.id AS registration_id,
        sr.user_id,
        sr.status,
        sr.registered_at,
        u.name,
        u.profile_picture,
        u.profession,
        u.city
      FROM session_registrations sr
      JOIN users u ON sr.user_id = u.id
      WHERE sr.session_id = ? AND sr.status IN ('registered', 'attended')
      ORDER BY sr.registered_at ASC`,
      [sessionId]
    );

    // Fetch feedback & ratings
    const [feedbackRows] = await db.query(
      `SELECT 
        sa.id,
        sa.user_id,
        sa.rating,
        sa.feedback,
        sa.attended,
        sa.created_at,
        u.name,
        u.profile_picture
      FROM session_attendances sa
      JOIN users u ON sa.user_id = u.id
      WHERE sa.session_id = ? AND sa.rating IS NOT NULL
      ORDER BY sa.created_at DESC`,
      [sessionId]
    );

    const isHost = currentUserId && session.host_id === currentUserId;
    const isRegistered = currentUserId && registrations.some((r) => r.user_id === currentUserId);
    const canJoin = (isHost || isRegistered) && session.status !== "cancelled";

    const responseSession = {
      ...session,
      registered_count: registrations.length,
      seats_left: Math.max(0, session.max_participants - registrations.length),
      is_full: registrations.length >= session.max_participants,
      is_host: isHost,
      is_registered: isRegistered,
      can_join: canJoin,
    };

    // Protect Google Meet link: Only expose if host or registered learner!
    if (!canJoin) {
      delete responseSession.meeting_url;
    }

    return res.json({
      success: true,
      session: responseSession,
      participants: registrations,
      feedback: feedbackRows,
    });
  } catch (error) {
    console.error("Error fetching session details:", error);
    return res.status(500).json({ success: false, message: "Failed to load session details", error: error.message });
  }
};

// ----------------------------------------------------------------------
// 4. UPDATE LIVE CLASS (Host only, auth required)
// ----------------------------------------------------------------------
exports.updateSession = async (req, res) => {
  try {
    const sessionId = req.params.id;
    const host_id = req.user.id;

    const [existing] = await db.query("SELECT * FROM live_sessions WHERE id = ?", [sessionId]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    if (existing[0].host_id !== host_id) {
      return res.status(403).json({ success: false, message: "Unauthorized. Only the host can edit this session." });
    }

    const {
      title,
      skill_topic,
      category,
      description,
      session_date,
      start_time,
      duration_minutes,
      max_participants,
      meeting_url,
      visibility,
      status,
    } = req.body;

    // Validate Google Meet URL if provided
    let cleanMeetingUrl = existing[0].meeting_url;
    if (meeting_url !== undefined && meeting_url !== null) {
      if (meeting_url && !isValidGoogleMeetUrl(meeting_url)) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid Google Meet link (e.g. https://meet.google.com/abc-defg-hij).",
        });
      }
      cleanMeetingUrl = meeting_url ? normalizeGoogleMeetUrl(meeting_url) : null;
    }

    await db.query(
      `UPDATE live_sessions SET
        title = COALESCE(?, title),
        skill_topic = COALESCE(?, skill_topic),
        category = COALESCE(?, category),
        description = COALESCE(?, description),
        session_date = COALESCE(?, session_date),
        start_time = COALESCE(?, start_time),
        duration_minutes = COALESCE(?, duration_minutes),
        max_participants = COALESCE(?, max_participants),
        meeting_url = COALESCE(?, meeting_url),
        visibility = COALESCE(?, visibility),
        status = COALESCE(?, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [
        title ? title.trim() : null,
        skill_topic ? skill_topic.trim() : null,
        category ? category.trim() : null,
        description !== undefined ? description.trim() : null,
        session_date || null,
        start_time || null,
        duration_minutes ? parseInt(duration_minutes) : null,
        max_participants ? parseInt(max_participants) : null,
        cleanMeetingUrl,
        visibility || null,
        status || null,
        sessionId,
      ]
    );

    const [updated] = await db.query("SELECT * FROM live_sessions WHERE id = ?", [sessionId]);
    return res.json({
      success: true,
      message: "Session updated successfully",
      session: updated[0],
    });
  } catch (error) {
    console.error("Error updating session:", error);
    return res.status(500).json({ success: false, message: "Failed to update session", error: error.message });
  }
};

// ----------------------------------------------------------------------
// 5. REGISTER FOR SEAT (Learner, auth required)
// ----------------------------------------------------------------------
exports.registerForSeat = async (req, res) => {
  try {
    const sessionId = req.params.id;
    const userId = req.user.id;

    const [sessions] = await db.query("SELECT * FROM live_sessions WHERE id = ?", [sessionId]);
    if (sessions.length === 0) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    const session = sessions[0];

    // Cannot register for own class
    if (session.host_id === userId) {
      return res.status(400).json({ success: false, message: "You are the host of this class." });
    }

    // Must be published
    if (session.status !== "published") {
      return res.status(400).json({ success: false, message: "This class is not open for registration." });
    }

    // Capacity check
    const [regs] = await db.query(
      "SELECT COUNT(*) AS count FROM session_registrations WHERE session_id = ? AND status IN ('registered', 'attended')",
      [sessionId]
    );
    if (regs[0].count >= session.max_participants) {
      return res.status(400).json({ success: false, message: "Class is at maximum capacity." });
    }

    // Check existing registration
    const [existing] = await db.query(
      "SELECT * FROM session_registrations WHERE session_id = ? AND user_id = ?",
      [sessionId, userId]
    );

    if (existing.length > 0) {
      if (existing[0].status === "registered" || existing[0].status === "attended") {
        return res.json({
          success: true,
          message: "You are already registered for this session!",
          meeting_url: session.meeting_url,
        });
      } else {
        // Reactivate cancelled registration
        await db.query(
          "UPDATE session_registrations SET status = 'registered', updated_at = CURRENT_TIMESTAMP WHERE id = ?",
          [existing[0].id]
        );
      }
    } else {
      await db.query(
        "INSERT INTO session_registrations (session_id, user_id, status) VALUES (?, ?, 'registered')",
        [sessionId, userId]
      );
    }

    return res.json({
      success: true,
      message: "Seat confirmed! You have registered for this live class.",
      meeting_url: session.meeting_url,
    });
  } catch (error) {
    console.error("Error registering for session:", error);
    return res.status(500).json({ success: false, message: "Failed to register for session", error: error.message });
  }
};

// ----------------------------------------------------------------------
// 6. CANCEL REGISTRATION (Learner, auth required)
// ----------------------------------------------------------------------
exports.cancelRegistration = async (req, res) => {
  try {
    const sessionId = req.params.id;
    const userId = req.user.id;

    const [existing] = await db.query(
      "SELECT * FROM session_registrations WHERE session_id = ? AND user_id = ?",
      [sessionId, userId]
    );

    if (existing.length === 0 || existing[0].status === "cancelled") {
      return res.status(400).json({ success: false, message: "No active registration found for this class." });
    }

    await db.query(
      "UPDATE session_registrations SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [existing[0].id]
    );

    return res.json({
      success: true,
      message: "Registration cancelled successfully. Your seat has been released.",
    });
  } catch (error) {
    console.error("Error cancelling registration:", error);
    return res.status(500).json({ success: false, message: "Failed to cancel registration", error: error.message });
  }
};

// ----------------------------------------------------------------------
// 7. CANCEL CLASS (Host only, auth required)
// ----------------------------------------------------------------------
exports.cancelSession = async (req, res) => {
  try {
    const sessionId = req.params.id;
    const host_id = req.user.id;

    const [sessions] = await db.query("SELECT * FROM live_sessions WHERE id = ?", [sessionId]);
    if (sessions.length === 0) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    if (sessions[0].host_id !== host_id) {
      return res.status(403).json({ success: false, message: "Unauthorized. Only the host can cancel this class." });
    }

    await db.query(
      "UPDATE live_sessions SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [sessionId]
    );

    return res.json({
      success: true,
      message: "Live class cancelled successfully.",
    });
  } catch (error) {
    console.error("Error cancelling session:", error);
    return res.status(500).json({ success: false, message: "Failed to cancel session", error: error.message });
  }
};

// ----------------------------------------------------------------------
// 8. VIEW HOSTED & REGISTERED CLASSES (My Classes, auth required)
// ----------------------------------------------------------------------
exports.getMySessions = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Classes hosted by user (includes meeting_url)
    const [hosted] = await db.query(
      `SELECT 
        s.*,
        (SELECT COUNT(*) FROM session_registrations sr WHERE sr.session_id = s.id AND sr.status IN ('registered', 'attended')) AS registered_count
      FROM live_sessions s
      WHERE s.host_id = ?
      ORDER BY s.session_date DESC, s.start_time DESC`,
      [userId]
    );

    // 2. Classes registered by user (includes meeting_url)
    const [registered] = await db.query(
      `SELECT 
        s.*,
        sr.status AS registration_status,
        sr.registered_at,
        u.name AS host_name,
        u.profile_picture AS host_avatar,
        u.profession AS host_profession,
        (SELECT COUNT(*) FROM session_registrations sr2 WHERE sr2.session_id = s.id AND sr2.status IN ('registered', 'attended')) AS registered_count
      FROM session_registrations sr
      JOIN live_sessions s ON sr.session_id = s.id
      JOIN users u ON s.host_id = u.id
      WHERE sr.user_id = ? AND sr.status IN ('registered', 'attended')
      ORDER BY s.session_date DESC, s.start_time DESC`,
      [userId]
    );

    return res.json({
      success: true,
      hosted,
      registered,
    });
  } catch (error) {
    console.error("Error fetching my sessions:", error);
    return res.status(500).json({ success: false, message: "Failed to load your sessions", error: error.message });
  }
};

// ----------------------------------------------------------------------
// 9. RECORD ATTENDANCE & FEEDBACK (Host or Learner)
// ----------------------------------------------------------------------
exports.recordAttendanceAndFeedback = async (req, res) => {
  try {
    const sessionId = req.params.id;
    const userId = req.user.id;
    const { attendees, rating, feedback } = req.body;

    const [sessions] = await db.query("SELECT * FROM live_sessions WHERE id = ?", [sessionId]);
    if (sessions.length === 0) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    const session = sessions[0];
    const isHost = session.host_id === userId;

    // HOST PATH: Mark attendee attendance
    if (isHost && Array.isArray(attendees)) {
      for (const att of attendees) {
        if (!att.user_id) continue;
        const attended = Boolean(att.attended);

        // Update registration status
        if (attended) {
          await db.query(
            "UPDATE session_registrations SET status = 'attended' WHERE session_id = ? AND user_id = ?",
            [sessionId, att.user_id]
          );
        }

        // Insert or update attendance record
        await db.query(
          `INSERT INTO session_attendances (session_id, user_id, attended, marked_by_host_id)
           VALUES (?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE attended = VALUES(attended), marked_by_host_id = VALUES(marked_by_host_id)`,
          [sessionId, att.user_id, attended, userId]
        );
      }

      return res.json({
        success: true,
        message: "Attendance records updated successfully.",
      });
    }

    // LEARNER PATH: Submit rating & feedback
    if (rating !== undefined && rating !== null) {
      const numericRating = Math.max(1, Math.min(5, parseInt(rating) || 5));
      const cleanFeedback = feedback ? feedback.trim() : "";

      // Ensure user is registered
      const [reg] = await db.query(
        "SELECT * FROM session_registrations WHERE session_id = ? AND user_id = ? AND status IN ('registered', 'attended')",
        [sessionId, userId]
      );

      if (reg.length === 0) {
        return res.status(403).json({ success: false, message: "You must be registered for this session to leave feedback." });
      }

      await db.query(
        `INSERT INTO session_attendances (session_id, user_id, attended, rating, feedback)
         VALUES (?, ?, TRUE, ?, ?)
         ON DUPLICATE KEY UPDATE rating = VALUES(rating), feedback = VALUES(feedback)`,
        [sessionId, userId, numericRating, cleanFeedback]
      );

      return res.json({
        success: true,
        message: "Thank you! Your rating and feedback have been submitted.",
      });
    }

    return res.status(400).json({ success: false, message: "No valid attendance or feedback payload provided." });
  } catch (error) {
    console.error("Error recording attendance/feedback:", error);
    return res.status(500).json({ success: false, message: "Failed to record attendance or feedback", error: error.message });
  }
};
