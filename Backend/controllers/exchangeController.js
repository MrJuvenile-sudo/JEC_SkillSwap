const db = require("../config/db");
const { createNotification } = require("../utils/notificationService");

// Get all exchanges for current user
exports.getExchanges = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Auto-create exchange records for any swap requests that lack an exchange row
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
            `INSERT INTO exchanges (request_id, status, meeting_link, notes)
             VALUES (?, 'scheduled', ?, 'Welcome to your 1-on-1 skill exchange session! Share meeting links, study guides, and session agenda.')
             ON DUPLICATE KEY UPDATE status = VALUES(status)`,
            [reqRow.id, defaultMeeting]
          );
        } catch (insertErr) {
          console.warn("Auto-create exchange row note for req", reqRow.id, insertErr.message);
        }
      }
    } catch (unlinkedErr) {
      console.warn("Unlinked check warning:", unlinkedErr.message);
    }

    // 2. Fetch all exchanges with clean partner and status info
    const [exchanges] = await db.query(
      `SELECT COALESCE(e.id, sr.id) as id,
              COALESCE(e.meeting_link, 'https://meet.google.com/new') as meeting_link,
              e.scheduled_at,
              e.notes,
              e.chat_history,
              e.shared_resources,
              e.duration_min,
              e.agenda,
              CASE
                WHEN e.status = 'completed' OR sr.status = 'completed' THEN 'completed'
                WHEN sr.status = 'rejected' THEN 'rejected'
                WHEN sr.status = 'cancelled' THEN 'cancelled'
                WHEN sr.status = 'accepted' THEN COALESCE(e.status, 'scheduled')
                ELSE COALESCE(e.status, 'scheduled')
              END as status,
              sr.id as request_id,
              sr.requester_id,
              sr.receiver_id,
              sr.offered_skill_id,
              sr.requested_skill_id,
              sr.message,
              sr.status as request_status,
              sr.created_at,
              COALESCE(u1.name, 'Swapper') as requester_name,
              u1.email as requester_email,
              u1.profile_picture as requester_picture,
              u1.gender as requester_gender,
              u1.profession as requester_profession,
              u1.city as requester_city,
              u1.location as requester_location,
              u1.education_degree as requester_degree,
              u1.education_institute as requester_institute,
              COALESCE(u2.name, 'Swapper') as receiver_name,
              u2.email as receiver_email,
              u2.profile_picture as receiver_picture,
              u2.gender as receiver_gender,
              u2.profession as receiver_profession,
              u2.city as receiver_city,
              u2.location as receiver_location,
              u2.education_degree as receiver_degree,
              u2.education_institute as receiver_institute,
              COALESCE(os.name, 'General Skill Barter') as offered_skill_name,
              os.category as offered_skill_category,
              COALESCE(rs.name, 'General Skill Learning') as requested_skill_name,
              rs.category as requested_skill_category
       FROM swap_requests sr
       LEFT JOIN exchanges e ON e.request_id = sr.id
       LEFT JOIN users u1 ON sr.requester_id = u1.id
       LEFT JOIN users u2 ON sr.receiver_id = u2.id
       LEFT JOIN skills os ON sr.offered_skill_id = os.id
       LEFT JOIN skills rs ON sr.requested_skill_id = rs.id
       WHERE sr.requester_id = ? OR sr.receiver_id = ?
       ORDER BY sr.created_at DESC`,
      [userId, userId]
    );

    // 3. Batch check reviews in ONE fast query instead of a loop
    try {
      const [userReviews] = await db.query(
        "SELECT exchange_id FROM reviews WHERE reviewer_id = ?",
        [userId]
      );
      const reviewedSet = new Set(userReviews.map(r => r.exchange_id));
      for (let ex of exchanges) {
        ex.hasReviewed = reviewedSet.has(ex.id) || reviewedSet.has(ex.request_id);
      }
    } catch (revErr) {
      console.warn("Reviews check warning:", revErr.message);
      for (let ex of exchanges) {
        ex.hasReviewed = false;
      }
    }

    res.json({
      success: true,
      exchanges,
    });
  } catch (error) {
    console.error("GetExchanges Error:", error);
    res.status(500).json({ success: false, message: "Server error fetching exchanges" });
  }
};

// Update exchange session details
exports.updateExchange = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { meeting_link, scheduled_at, notes, status, chat_history, shared_resources, duration_min, agenda } = req.body;

    // Search by exchange id OR request_id
    let [exchanges] = await db.query(
      `SELECT e.*, sr.requester_id, sr.receiver_id
       FROM exchanges e
       JOIN swap_requests sr ON e.request_id = sr.id
       WHERE e.id = ? OR e.request_id = ?`,
      [id, id]
    );

    // If exchange record does not exist yet for this request, create it automatically
    if (exchanges.length === 0) {
      const [reqRow] = await db.query(
        "SELECT * FROM swap_requests WHERE id = ? AND (requester_id = ? OR receiver_id = ?)",
        [id, userId, userId]
      );
      if (reqRow.length > 0) {
        const defaultMeeting = meeting_link || "https://meet.google.com/new";
        try {
          await db.query(
            `INSERT INTO exchanges (request_id, status, meeting_link, notes)
             VALUES (?, 'scheduled', ?, ?)
             ON DUPLICATE KEY UPDATE status = 'scheduled'`,
            [id, defaultMeeting, notes || 'Skill exchange session created.']
          );
        } catch (insErr) {
          console.warn("Auto-insert exchange warning:", insErr.message);
        }
        [exchanges] = await db.query(
          `SELECT e.*, sr.requester_id, sr.receiver_id
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
      } catch (e) {
        // keep raw
      }
    }

    await db.query(
      `UPDATE exchanges
       SET meeting_link = COALESCE(?, meeting_link),
           scheduled_at = COALESCE(?, scheduled_at),
           notes = COALESCE(?, notes),
           status = COALESCE(?, status),
           chat_history = COALESCE(?, chat_history),
           shared_resources = COALESCE(?, shared_resources),
           duration_min = COALESCE(?, duration_min),
           agenda = COALESCE(?, agenda)
       WHERE id = ?`,
      [meeting_link, formattedScheduledAt, notes, status, chat_history, shared_resources, duration_min, agenda, actualExchangeId]
    );

    // Trigger Notification for Recipient
    const recipientId = (Number(ex.requester_id) === Number(userId)) ? ex.receiver_id : ex.requester_id;
    const senderName = req.user.name || "Your partner";

    if (chat_history) {
      try {
        const chatArray = typeof chat_history === "string" ? JSON.parse(chat_history) : chat_history;
        if (Array.isArray(chatArray) && chatArray.length > 0) {
          const latestMsg = chatArray[chatArray.length - 1];
          if (latestMsg && (latestMsg.senderId === userId || latestMsg.isReceived === false)) {
            const preview = latestMsg.text || (latestMsg.sticker ? `${latestMsg.sticker.emoji} Sticker` : "Sent a message");
            createNotification({
              userId: recipientId,
              senderId: userId,
              type: "message",
              title: `Message from ${senderName}`,
              message: preview,
              link: "/exchanges"
            }).catch(e => console.warn("Notif error:", e.message));
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
        link: "/exchanges"
      }).catch(e => console.warn("Notif error:", e.message));
    }

    res.json({
      success: true,
      message: "Exchange session updated successfully",
      exchangeId: actualExchangeId
    });
  } catch (error) {
    console.error("UpdateExchange Error:", error);
    res.status(500).json({ success: false, message: "Server error updating exchange" });
  }
};

// Mark exchange complete
exports.completeExchange = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const [exchanges] = await db.query(
      `SELECT e.*, sr.id as request_id, sr.requester_id, sr.receiver_id
       FROM exchanges e
       JOIN swap_requests sr ON e.request_id = sr.id
       WHERE e.id = ? OR e.request_id = ?`,
      [id, id]
    );

    if (exchanges.length === 0) {
      const [reqRow] = await db.query(
        "SELECT * FROM swap_requests WHERE id = ? AND (requester_id = ? OR receiver_id = ?)",
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
    res.status(500).json({ success: false, message: "Server error marking exchange complete" });
  }
};
