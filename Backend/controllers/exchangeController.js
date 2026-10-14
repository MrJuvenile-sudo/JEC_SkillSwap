const db = require("../config/db");

// Get all exchanges for current user
exports.getExchanges = async (req, res) => {
  try {
    const userId = req.user.id;

    // Auto-create exchange records for any swap requests that lack an exchange row
    const [unlinked] = await db.query(
      `SELECT sr.id FROM swap_requests sr
       WHERE (sr.requester_id = ? OR sr.receiver_id = ?) 
         AND NOT EXISTS (SELECT 1 FROM exchanges e WHERE e.request_id = sr.id)`,
      [userId, userId]
    );

    for (const reqRow of unlinked) {
      const defaultMeeting = "https://meet.google.com/new";
      await db.query(
        `INSERT INTO exchanges (request_id, status, meeting_link, notes)
         VALUES (?, 'scheduled', ?, 'Welcome to your 1-on-1 skill exchange session! Share meeting links, study guides, and session agenda.')`,
        [reqRow.id, defaultMeeting]
      );
    }

    const [exchanges] = await db.query(
      `SELECT COALESCE(e.id, sr.id) as id, COALESCE(e.meeting_link, 'https://meet.google.com/new') as meeting_link, e.scheduled_at, e.notes, e.chat_history, e.shared_resources, e.duration_min, e.agenda, COALESCE(e.status, 'scheduled') as status,
              sr.id as request_id, sr.requester_id, sr.receiver_id, sr.offered_skill_id, sr.requested_skill_id, sr.message, sr.status as request_status, sr.created_at,
              COALESCE(u1.name, 'Swapper') as requester_name, u1.email as requester_email, u1.profile_picture as requester_picture, u1.gender as requester_gender, u1.profession as requester_profession, u1.city as requester_city, u1.location as requester_location, u1.education_degree as requester_degree, u1.education_institute as requester_institute,
              COALESCE(u2.name, 'Swapper') as receiver_name, u2.email as receiver_email, u2.profile_picture as receiver_picture, u2.gender as receiver_gender, u2.profession as receiver_profession, u2.city as receiver_city, u2.location as receiver_location, u2.education_degree as receiver_degree, u2.education_institute as receiver_institute,
              COALESCE(os.name, 'General Skill Barter') as offered_skill_name, os.category as offered_skill_category,
              COALESCE(rs.name, 'General Skill Learning') as requested_skill_name, rs.category as requested_skill_category
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

    // Check if user has already submitted a review for each completed exchange
    for (let ex of exchanges) {
      const [review] = await db.query(
        "SELECT id FROM reviews WHERE exchange_id = ? AND reviewer_id = ?",
        [ex.id, userId]
      );
      ex.hasReviewed = review.length > 0;
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

    const [exchanges] = await db.query(
      `SELECT e.*, sr.requester_id, sr.receiver_id
       FROM exchanges e
       JOIN swap_requests sr ON e.request_id = sr.id
       WHERE e.id = ?`,
      [id]
    );

    if (exchanges.length === 0) {
      return res.status(404).json({ success: false, message: "Exchange session not found" });
    }

    const ex = exchanges[0];
    if (ex.requester_id !== userId && ex.receiver_id !== userId) {
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
      [meeting_link, formattedScheduledAt, notes, status, chat_history, shared_resources, duration_min, agenda, id]
    );

    res.json({
      success: true,
      message: "Exchange session updated successfully",
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
       WHERE e.id = ?`,
      [id]
    );

    if (exchanges.length === 0) {
      return res.status(404).json({ success: false, message: "Exchange not found" });
    }

    const ex = exchanges[0];
    if (ex.requester_id !== userId && ex.receiver_id !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized to mark this exchange complete" });
    }

    await db.query("UPDATE exchanges SET status = 'completed' WHERE id = ?", [id]);
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
