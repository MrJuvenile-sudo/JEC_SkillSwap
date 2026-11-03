const db = require("../config/db");
const { createNotification } = require("../utils/notificationService");

// Helper to safely parse JSON columns (chat_history, shared_resources)
const safeParse = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === "object") return [val];
  if (typeof val === "string") {
    const trimmed = val.trim();
    if (!trimmed || trimmed === "null" || trimmed === "undefined") return [];
    try {
      const parsed = JSON.parse(trimmed);
      return Array.isArray(parsed) ? parsed : (parsed ? [parsed] : []);
    } catch (e) {
      return [];
    }
  }
  return [];
};

// Cached table schemas for TiDB Cloud / MySQL multi-version compatibility
let cachedUserCols = null;
async function getUserColumns() {
  if (cachedUserCols) return cachedUserCols;
  try {
    const [cols] = await db.query("SHOW COLUMNS FROM users");
    const set = new Set();
    for (const c of cols) {
      const name = c.Field || c.field || c.COLUMN_NAME || Object.values(c)[0];
      if (name) set.add(String(name).toLowerCase());
    }
    cachedUserCols = set;
    return cachedUserCols;
  } catch (err) {
    console.warn("Could not inspect users columns:", err.message);
    return new Set(["id", "name", "email", "profile_picture", "bio", "location"]);
  }
}

let cachedSkillCols = null;
async function getSkillColumns() {
  if (cachedSkillCols) return cachedSkillCols;
  try {
    const [cols] = await db.query("SHOW COLUMNS FROM skills");
    const set = new Set();
    for (const c of cols) {
      const name = c.Field || c.field || c.COLUMN_NAME || Object.values(c)[0];
      if (name) set.add(String(name).toLowerCase());
    }
    cachedSkillCols = set;
    return cachedSkillCols;
  } catch (err) {
    console.warn("Could not inspect skills columns:", err.message);
    return new Set(["id", "name", "category", "description"]);
  }
}

let cachedRequestCols = null;
async function getRequestColumns() {
  if (cachedRequestCols) return cachedRequestCols;
  try {
    const [cols] = await db.query("SHOW COLUMNS FROM swap_requests");
    const set = new Set();
    for (const c of cols) {
      const name = c.Field || c.field || c.COLUMN_NAME || Object.values(c)[0];
      if (name) set.add(String(name).toLowerCase());
    }
    cachedRequestCols = set;
    return cachedRequestCols;
  } catch (err) {
    console.warn("Could not inspect swap_requests columns:", err.message);
    return new Set(["id", "requester_id", "receiver_id", "offered_skill_id", "requested_skill_id", "message", "status", "created_at"]);
  }
}

let cachedExchangeCols = null;
async function getExchangeColumns() {
  if (cachedExchangeCols) return cachedExchangeCols;
  try {
    const [cols] = await db.query("SHOW COLUMNS FROM exchanges");
    const set = new Set();
    for (const c of cols) {
      const name = c.Field || c.field || c.COLUMN_NAME || Object.values(c)[0];
      if (name) set.add(String(name).toLowerCase());
    }
    cachedExchangeCols = set;
    return cachedExchangeCols;
  } catch (err) {
    console.warn("Could not inspect exchanges columns:", err.message);
    return new Set(["id", "request_id", "status", "meeting_link", "scheduled_at", "notes", "chat_history", "shared_resources", "created_at", "updated_at"]);
  }
}

// -----------------------------------------------------------------------------
// 1. GET /api/exchanges - Get all exchanges for current user
// -----------------------------------------------------------------------------
exports.getExchanges = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Auto-create exchange records for any swap requests lacking an exchange row
    // Initialized with chat_history = '[]' and shared_resources = '[]'
    try {
      const [unlinked] = await db.query(
        `SELECT sr.id FROM swap_requests sr
         WHERE (sr.requester_id = ? OR sr.receiver_id = ?) 
           AND NOT EXISTS (SELECT 1 FROM exchanges e WHERE e.request_id = sr.id)`,
        [userId, userId]
      );

      for (const reqRow of unlinked) {
        const defaultMeeting = "https://meet.google.com/new";
        try {
          await db.query(
            `INSERT IGNORE INTO exchanges (request_id, status, meeting_link, notes, chat_history, shared_resources)
             VALUES (?, 'scheduled', ?, 'Welcome to your 1-on-1 skill exchange session! Share meeting links, study guides, and session agenda.', '[]', '[]')`,
            [reqRow.id, defaultMeeting]
          );
        } catch (insertErr) {
          console.warn("Auto-create exchange row note for req", reqRow.id, insertErr.message);
        }
      }
    } catch (unlinkedErr) {
      console.warn("Unlinked check warning:", unlinkedErr.message);
    }

    // 2. Dynamically determine which columns are supported across tables
    const userCols = await getUserColumns();
    const skillCols = await getSkillColumns();
    const reqCols = await getRequestColumns();
    const exCols = await getExchangeColumns();

    const hasCity = userCols.has("city");
    const hasLoc = userCols.has("location");
    const selectCity1 = hasCity 
      ? (hasLoc ? "COALESCE(u1.city, u1.location, '')" : "COALESCE(u1.city, '')")
      : (hasLoc ? "COALESCE(u1.location, '')" : "''");
    const selectCity2 = hasCity 
      ? (hasLoc ? "COALESCE(u2.city, u2.location, '')" : "COALESCE(u2.city, '')")
      : (hasLoc ? "COALESCE(u2.location, '')" : "''");

    const selectLoc1 = hasLoc ? "COALESCE(u1.location, '')" : "''";
    const selectLoc2 = hasLoc ? "COALESCE(u2.location, '')" : "''";

    const selectPic1 = userCols.has("profile_picture") 
      ? "COALESCE(u1.profile_picture, '')" 
      : (userCols.has("profile_image") ? "COALESCE(u1.profile_image, '')" : "''");
    const selectPic2 = userCols.has("profile_picture") 
      ? "COALESCE(u2.profile_picture, '')" 
      : (userCols.has("profile_image") ? "COALESCE(u2.profile_image, '')" : "''");

    const selectGender1 = userCols.has("gender") ? "COALESCE(u1.gender, 'other')" : "'other'";
    const selectGender2 = userCols.has("gender") ? "COALESCE(u2.gender, 'other')" : "'other'";

    const selectProf1 = userCols.has("profession") ? "COALESCE(u1.profession, 'SkillSwap Co-Learner')" : "'SkillSwap Co-Learner'";
    const selectProf2 = userCols.has("profession") ? "COALESCE(u2.profession, 'SkillSwap Co-Learner')" : "'SkillSwap Co-Learner'";

    const selectDegree1 = userCols.has("education_degree") ? "COALESCE(u1.education_degree, '')" : "''";
    const selectDegree2 = userCols.has("education_degree") ? "COALESCE(u2.education_degree, '')" : "''";

    const selectInstitute1 = userCols.has("education_institute") ? "COALESCE(u1.education_institute, '')" : "''";
    const selectInstitute2 = userCols.has("education_institute") ? "COALESCE(u2.education_institute, '')" : "''";

    // Dynamic skills category selection
    const hasSkillCat = skillCols.has("category");
    const selectOfferedCat = hasSkillCat ? "COALESCE(os.category, 'Technology & Programming')" : "'Technology & Programming'";
    const selectRequestedCat = hasSkillCat ? "COALESCE(rs.category, 'Technology & Programming')" : "'Technology & Programming'";

    // Dynamic swap_requests requester_id / sender_id column
    const reqColName = reqCols.has("requester_id") ? "requester_id" : (reqCols.has("sender_id") ? "sender_id" : "requester_id");

    // Dynamic exchanges columns
    const selectChatHistory = exCols.has("chat_history") ? "e.chat_history" : "'[]' as chat_history";
    const selectSharedResources = exCols.has("shared_resources") ? "e.shared_resources" : "'[]' as shared_resources";
    const selectMeetingLink = exCols.has("meeting_link") ? "COALESCE(e.meeting_link, 'https://meet.google.com/new') as meeting_link" : "'https://meet.google.com/new' as meeting_link";
    const selectNotes = exCols.has("notes") ? "e.notes" : "'' as notes";
    const selectScheduledAt = exCols.has("scheduled_at") ? "e.scheduled_at" : "NULL as scheduled_at";

    // 3. Main Query: strictly adhering to TiDB exchanges schema:
    // (id, request_id, status, meeting_link, scheduled_at, notes, created_at, updated_at, chat_history, shared_resources)
    // No unaggregated columns in GROUP BY (query uses LEFT JOIN with WHERE filter)
    const sql = `
      SELECT COALESCE(e.id, sr.id) as id,
             ${selectMeetingLink},
             ${selectScheduledAt},
             ${selectNotes},
             ${selectChatHistory},
             ${selectSharedResources},
             60 as duration_min,
             '' as agenda,
             CASE
               WHEN e.status = 'completed' OR sr.status = 'completed' THEN 'completed'
               WHEN sr.status = 'rejected' THEN 'rejected'
               WHEN sr.status = 'cancelled' THEN 'cancelled'
               WHEN sr.status = 'accepted' THEN COALESCE(e.status, 'scheduled')
               ELSE COALESCE(e.status, 'scheduled')
             END as status,
             sr.id as request_id,
             sr.${reqColName} as requester_id,
             sr.receiver_id,
             sr.offered_skill_id,
             sr.requested_skill_id,
             sr.message,
             sr.status as request_status,
             sr.created_at,
             COALESCE(u1.name, 'Swapper') as requester_name,
             u1.email as requester_email,
             ${selectPic1} as requester_picture,
             ${selectGender1} as requester_gender,
             ${selectProf1} as requester_profession,
             ${selectCity1} as requester_city,
             ${selectLoc1} as requester_location,
             ${selectDegree1} as requester_degree,
             ${selectInstitute1} as requester_institute,
             COALESCE(u2.name, 'Swapper') as receiver_name,
             u2.email as receiver_email,
             ${selectPic2} as receiver_picture,
             ${selectGender2} as receiver_gender,
             ${selectProf2} as receiver_profession,
             ${selectCity2} as receiver_city,
             ${selectLoc2} as receiver_location,
             ${selectDegree2} as receiver_degree,
             ${selectInstitute2} as receiver_institute,
             COALESCE(os.name, 'General Skill Barter') as offered_skill_name,
             ${selectOfferedCat} as offered_skill_category,
             COALESCE(rs.name, 'General Skill Learning') as requested_skill_name,
             ${selectRequestedCat} as requested_skill_category
      FROM swap_requests sr
      LEFT JOIN exchanges e ON e.request_id = sr.id
      LEFT JOIN users u1 ON sr.${reqColName} = u1.id
      LEFT JOIN users u2 ON sr.receiver_id = u2.id
      LEFT JOIN skills os ON sr.offered_skill_id = os.id
      LEFT JOIN skills rs ON sr.requested_skill_id = rs.id
      WHERE sr.${reqColName} = ? OR sr.receiver_id = ?
      ORDER BY sr.created_at DESC
    `;

    const [exchanges] = await db.query(sql, [userId, userId]);

    // 4. Safely parse JSON columns for every exchange
    for (const ex of exchanges) {
      ex.chat_history = safeParse(ex.chat_history);
      ex.shared_resources = safeParse(ex.shared_resources);
    }

    // 5. Batch check reviews in ONE query with fallback protection
    try {
      const [userReviews] = await db.query(
        "SELECT exchange_id FROM reviews WHERE reviewer_id = ?",
        [userId]
      );
      const reviewedSet = new Set(userReviews.map((r) => r.exchange_id));
      for (const ex of exchanges) {
        ex.hasReviewed = reviewedSet.has(ex.id) || reviewedSet.has(ex.request_id);
      }
    } catch (revErr) {
      console.warn("Reviews check warning:", revErr.message);
      for (const ex of exchanges) {
        ex.hasReviewed = false;
      }
    }

    res.json({
      success: true,
      exchanges,
    });
  } catch (error) {
    console.error("GetExchanges Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching exchanges",
      error: error.message,
    });
  }
};

// -----------------------------------------------------------------------------
// 2. GET /api/exchanges/:id/messages - Lightweight chat polling endpoint
// -----------------------------------------------------------------------------
exports.getExchangeMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const reqCols = await getRequestColumns();
    const reqColName = reqCols.has("requester_id") ? "requester_id" : (reqCols.has("sender_id") ? "sender_id" : "requester_id");

    let [rows] = await db.query(
      `SELECT e.id, e.request_id, e.chat_history, sr.${reqColName} as requester_id, sr.receiver_id
       FROM exchanges e
       JOIN swap_requests sr ON e.request_id = sr.id
       WHERE e.id = ? OR e.request_id = ?`,
      [id, id]
    );

    // If exchange record does not exist yet, check swap_requests and auto-create
    if (rows.length === 0) {
      const [reqRows] = await db.query(
        `SELECT * FROM swap_requests WHERE id = ? AND (${reqColName} = ? OR receiver_id = ?)`,
        [id, userId, userId]
      );
      if (reqRows.length > 0) {
        try {
          await db.query(
            `INSERT IGNORE INTO exchanges (request_id, status, meeting_link, notes, chat_history, shared_resources)
             VALUES (?, 'scheduled', 'https://meet.google.com/new', 'Welcome to your 1-on-1 skill exchange session!', '[]', '[]')`,
            [id]
          );
          [rows] = await db.query(
            `SELECT e.id, e.request_id, e.chat_history, sr.${reqColName} as requester_id, sr.receiver_id
             FROM exchanges e
             JOIN swap_requests sr ON e.request_id = sr.id
             WHERE e.request_id = ?`,
            [id]
          );
        } catch (insErr) {
          console.warn("Auto-create exchange in getMessages warning:", insErr.message);
        }
      }
    }

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Exchange not found", messages: [] });
    }

    const row = rows[0];
    if (Number(row.requester_id) !== Number(userId) && Number(row.receiver_id) !== Number(userId)) {
      return res.status(403).json({ success: false, message: "Unauthorized", messages: [] });
    }

    res.json({
      success: true,
      exchangeId: row.id,
      requestId: row.request_id,
      messages: safeParse(row.chat_history),
    });
  } catch (error) {
    console.error("GetExchangeMessages Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching messages",
      error: error.message,
    });
  }
};

// -----------------------------------------------------------------------------
// 3. POST /api/exchanges/:id/messages - Direct message append endpoint
// -----------------------------------------------------------------------------
exports.sendExchangeMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { text, sticker } = req.body;

    if ((!text || !text.trim()) && !sticker) {
      return res.status(400).json({ success: false, message: "Message text or sticker is required" });
    }

    const reqCols = await getRequestColumns();
    const reqColName = reqCols.has("requester_id") ? "requester_id" : (reqCols.has("sender_id") ? "sender_id" : "requester_id");

    let [rows] = await db.query(
      `SELECT e.id, e.request_id, e.chat_history, sr.${reqColName} as requester_id, sr.receiver_id
       FROM exchanges e
       JOIN swap_requests sr ON e.request_id = sr.id
       WHERE e.id = ? OR e.request_id = ?`,
      [id, id]
    );

    if (rows.length === 0) {
      // Auto create exchange if row does not exist yet
      const [reqRow] = await db.query(
        `SELECT * FROM swap_requests WHERE id = ? AND (${reqColName} = ? OR receiver_id = ?)`,
        [id, userId, userId]
      );
      if (reqRow.length > 0) {
        try {
          await db.query(
            `INSERT IGNORE INTO exchanges (request_id, status, meeting_link, notes, chat_history, shared_resources)
             VALUES (?, 'scheduled', 'https://meet.google.com/new', 'Skill exchange session.', '[]', '[]')`,
            [id]
          );
          [rows] = await db.query(
            `SELECT e.id, e.request_id, e.chat_history, sr.${reqColName} as requester_id, sr.receiver_id
             FROM exchanges e
             JOIN swap_requests sr ON e.request_id = sr.id
             WHERE e.request_id = ?`,
            [id]
          );
        } catch (insErr) {
          console.warn("Auto-create exchange on send warning:", insErr.message);
        }
      }
    }

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Exchange session not found" });
    }

    const row = rows[0];
    if (Number(row.requester_id) !== Number(userId) && Number(row.receiver_id) !== Number(userId)) {
      return res.status(403).json({ success: false, message: "Unauthorized to send messages in this exchange" });
    }

    const existingChat = safeParse(row.chat_history);
    const newMsgObj = {
      id: Date.now(),
      sender: req.user.name || "You",
      senderId: Number(userId),
      sender_id: Number(userId),
      text: (text || "").trim(),
      sticker: sticker || null,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      timestamp: Date.now(),
      status: "sent",
    };

    const updatedChatList = [...existingChat, newMsgObj];

    await db.query(
      "UPDATE exchanges SET chat_history = ? WHERE id = ?",
      [JSON.stringify(updatedChatList), row.id]
    );

    // Notify recipient
    const recipientId = Number(row.requester_id) === Number(userId) ? row.receiver_id : row.requester_id;
    const senderName = req.user.name || "Your swap partner";
    const preview = newMsgObj.text || (sticker ? `${sticker.emoji} Sticker` : "Sent a message");

    createNotification({
      userId: recipientId,
      senderId: userId,
      type: "message",
      title: `Message from ${senderName}`,
      message: preview,
      link: "/exchanges",
    }).catch((e) => console.warn("Notif error:", e.message));

    res.json({
      success: true,
      message: "Message sent successfully",
      newMessage: newMsgObj,
      chat_history: updatedChatList,
    });
  } catch (error) {
    console.error("SendExchangeMessage Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error sending message",
      error: error.message,
    });
  }
};

// -----------------------------------------------------------------------------
// 4. PUT /api/exchanges/:id - Update session details (meeting_link, notes, etc.)
// -----------------------------------------------------------------------------
exports.updateExchange = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { meeting_link, scheduled_at, notes, status, chat_history, shared_resources } = req.body;

    const reqCols = await getRequestColumns();
    const reqColName = reqCols.has("requester_id") ? "requester_id" : (reqCols.has("sender_id") ? "sender_id" : "requester_id");

    // Search by exchange id OR request_id
    let [exchanges] = await db.query(
      `SELECT e.*, sr.${reqColName} as requester_id, sr.receiver_id
       FROM exchanges e
       JOIN swap_requests sr ON e.request_id = sr.id
       WHERE e.id = ? OR e.request_id = ?`,
      [id, id]
    );

    // If exchange record does not exist yet for this request, create it automatically
    if (exchanges.length === 0) {
      const [reqRow] = await db.query(
        `SELECT * FROM swap_requests WHERE id = ? AND (${reqColName} = ? OR receiver_id = ?)`,
        [id, userId, userId]
      );
      if (reqRow.length > 0) {
        const defaultMeeting = meeting_link || "https://meet.google.com/new";
        try {
          await db.query(
            `INSERT IGNORE INTO exchanges (request_id, status, meeting_link, notes, chat_history, shared_resources)
             VALUES (?, 'scheduled', ?, ?, '[]', '[]')`,
            [id, defaultMeeting, notes || "Skill exchange session created."]
          );
        } catch (insErr) {
          console.warn("Auto-insert exchange warning:", insErr.message);
        }
        [exchanges] = await db.query(
          `SELECT e.*, sr.${reqColName} as requester_id, sr.receiver_id
           FROM exchanges e
           JOIN swap_requests sr ON e.request_id = sr.id
           WHERE e.request_id = ?`,
          [id]
        );
      }
    }

    if (exchanges.length === 0) {
      return res.status(404).json({ success: false, message: "Exchange session not found" });
    }

    const ex = exchanges[0];
    const actualExchangeId = ex.id;
    if (Number(ex.requester_id) !== Number(userId) && Number(ex.receiver_id) !== Number(userId)) {
      return res.status(403).json({ success: false, message: "Unauthorized to update this exchange session" });
    }

    let formattedScheduledAt = scheduled_at;
    if (scheduled_at) {
      try {
        const d = new Date(scheduled_at);
        if (!isNaN(d.getTime())) {
          formattedScheduledAt = d.toISOString().slice(0, 19).replace("T", " ");
        }
      } catch (e) {}
    }

    // Safely format JSON columns for TiDB
    let formattedChat = chat_history;
    if (chat_history !== undefined) {
      formattedChat = typeof chat_history === "string" ? chat_history : JSON.stringify(chat_history);
    }

    let formattedResources = shared_resources;
    if (shared_resources !== undefined) {
      formattedResources = typeof shared_resources === "string" ? shared_resources : JSON.stringify(shared_resources);
    }

    // Exact TiDB columns: meeting_link, scheduled_at, notes, status, chat_history, shared_resources
    // (duration_min and agenda removed because they do not exist in TiDB)
    await db.query(
      `UPDATE exchanges
       SET meeting_link = COALESCE(?, meeting_link),
           scheduled_at = COALESCE(?, scheduled_at),
           notes = COALESCE(?, notes),
           status = COALESCE(?, status),
           chat_history = COALESCE(?, chat_history),
           shared_resources = COALESCE(?, shared_resources)
       WHERE id = ?`,
      [meeting_link, formattedScheduledAt, notes, status, formattedChat, formattedResources, actualExchangeId]
    );

    // Trigger Notification for Recipient
    const recipientId = Number(ex.requester_id) === Number(userId) ? ex.receiver_id : ex.requester_id;
    const senderName = req.user.name || "Your partner";

    if (formattedChat) {
      try {
        const chatArray = safeParse(formattedChat);
        if (chatArray.length > 0) {
          const latestMsg = chatArray[chatArray.length - 1];
          if (latestMsg && (Number(latestMsg.senderId) === Number(userId) || Number(latestMsg.sender_id) === Number(userId) || latestMsg.isReceived === false)) {
            const preview = latestMsg.text || (latestMsg.sticker ? `${latestMsg.sticker.emoji} Sticker` : "Sent a message");
            createNotification({
              userId: recipientId,
              senderId: userId,
              type: "message",
              title: `Message from ${senderName}`,
              message: preview,
              link: "/exchanges",
            }).catch((e) => console.warn("Notif error:", e.message));
          }
        }
      } catch (parseErr) {}
    }

    if (meeting_link && meeting_link !== ex.meeting_link) {
      createNotification({
        userId: recipientId,
        senderId: userId,
        type: "session_scheduled",
        title: "Session Meeting Link Updated",
        message: `${senderName} added a video call meeting link for your 1-on-1 session.`,
        link: "/exchanges",
      }).catch((e) => console.warn("Notif error:", e.message));
    }

    res.json({
      success: true,
      message: "Exchange session updated successfully",
      exchangeId: actualExchangeId,
    });
  } catch (error) {
    console.error("UpdateExchange Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating exchange",
      error: error.message,
    });
  }
};

// -----------------------------------------------------------------------------
// 5. PUT /api/exchanges/:id/complete - Mark exchange as complete
// -----------------------------------------------------------------------------
exports.completeExchange = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const reqCols = await getRequestColumns();
    const reqColName = reqCols.has("requester_id") ? "requester_id" : (reqCols.has("sender_id") ? "sender_id" : "requester_id");

    const [exchanges] = await db.query(
      `SELECT e.*, sr.id as request_id, sr.${reqColName} as requester_id, sr.receiver_id
       FROM exchanges e
       JOIN swap_requests sr ON e.request_id = sr.id
       WHERE e.id = ? OR e.request_id = ?`,
      [id, id]
    );

    if (exchanges.length === 0) {
      const [reqRow] = await db.query(
        `SELECT * FROM swap_requests WHERE id = ? AND (${reqColName} = ? OR receiver_id = ?)`,
        [id, userId, userId]
      );
      if (reqRow.length > 0) {
        await db.query("UPDATE swap_requests SET status = 'completed' WHERE id = ?", [id]);
        return res.json({ success: true, message: "Exchange marked as completed! You can now leave a review." });
      }
      return res.status(404).json({ success: false, message: "Exchange not found" });
    }

    const ex = exchanges[0];
    if (Number(ex.requester_id) !== Number(userId) && Number(ex.receiver_id) !== Number(userId)) {
      return res.status(403).json({ success: false, message: "Unauthorized to mark this exchange complete" });
    }

    await db.query("UPDATE exchanges SET status = 'completed' WHERE id = ?", [ex.id]);
    await db.query("UPDATE swap_requests SET status = 'completed' WHERE id = ?", [ex.request_id]);

    res.json({
      success: true,
      message: "Exchange marked as completed! You can now leave a review.",
    });
  } catch (error) {
    console.error("CompleteExchange Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error marking exchange complete",
      error: error.message,
    });
  }
};
