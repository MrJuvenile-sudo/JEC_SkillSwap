const db = require("../config/db");
const { createNotification } = require("../utils/notificationService");

// Create swap request
exports.createRequest = async (req, res) => {
  try {
    const requester_id = req.user.id;
    let { receiver_id, offered_skill_id, requested_skill_id, message } = req.body;

    if (!receiver_id) {
      return res.status(400).json({
        success: false,
        message: "Receiver user is required",
      });
    }

    if (Number(requester_id) === Number(receiver_id)) {
      return res.status(400).json({
        success: false,
        message: "You cannot send a swap request to yourself",
      });
    }

    // Default skill IDs (HTML / React) if not explicitly supplied or empty
    const cleanOfferedId = (offered_skill_id && !isNaN(offered_skill_id)) ? parseInt(offered_skill_id) : 1;
    const cleanRequestedId = (requested_skill_id && !isNaN(requested_skill_id)) ? parseInt(requested_skill_id) : 4;

    // Check existing pending request
    const [existing] = await db.query(
      `SELECT id FROM swap_requests 
       WHERE requester_id = ? AND receiver_id = ? AND status = 'pending'`,
      [requester_id, receiver_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "You already have an active pending swap request with this user",
      });
    }

    const [result] = await db.query(
      `INSERT INTO swap_requests (requester_id, receiver_id, offered_skill_id, requested_skill_id, message)
       VALUES (?, ?, ?, ?, ?)`,
      [requester_id, receiver_id, cleanOfferedId, cleanRequestedId, message || "Hi! I would love to exchange skills with you."]
    );

    const newRequestId = result.insertId;

    // Automatically create the 1-on-1 virtual classroom/exchange record so it immediately appears in Chat List & Sessions
    const defaultMeeting = "https://meet.google.com/new";
    try {
      await db.query(
        `INSERT INTO exchanges (request_id, status, meeting_link, notes)
         VALUES (?, 'scheduled', ?, 'Welcome to your 1-on-1 skill exchange session! Share meeting links, study guides, and session agenda.')`,
        [newRequestId, defaultMeeting]
      );
    } catch (exErr) {
      console.warn("Could not auto-create exchange for new request:", exErr.message);
    }

    // Notify receiver
    createNotification({
      userId: receiver_id,
      senderId: requester_id,
      type: "swap_request",
      title: "New Swap Request",
      message: `${req.user.name || "A learner"} connected and sent you a 1-on-1 swap proposal!`,
      link: "/requests"
    }).catch(e => console.warn("Notif error:", e.message));

    res.status(201).json({
      success: true,
      message: "Connected! Swap proposal sent successfully. Your 1-on-1 session is now in your Chat and Sessions.",
      requestId: newRequestId,
      request: { id: newRequestId },
    });
  } catch (error) {
    console.error("CreateRequest Error:", error);
    res.status(500).json({ success: false, message: "Server error creating swap request" });
  }
};

// Get requests for current user (sent & received)
exports.getRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    // Incoming requests (where current user is receiver)
    const [received] = await db.query(
      `SELECT sr.*,
              COALESCE(u.name, 'Swapper') as requester_name, u.email as requester_email, u.profile_picture as requester_picture, u.location as requester_location, u.city as requester_city, u.profession as requester_profession, u.education_degree as requester_degree, u.education_institute as requester_institute,
              COALESCE(os.name, 'General Skill Barter') as offered_skill_name, os.category as offered_skill_category,
              COALESCE(rs.name, 'General Skill Learning') as requested_skill_name, rs.category as requested_skill_category
       FROM swap_requests sr
       LEFT JOIN users u ON sr.requester_id = u.id
       LEFT JOIN skills os ON sr.offered_skill_id = os.id
       LEFT JOIN skills rs ON sr.requested_skill_id = rs.id
       WHERE sr.receiver_id = ?
       ORDER BY sr.created_at DESC`,
      [userId]
    );

    // Outgoing requests (where current user is requester)
    const [sent] = await db.query(
      `SELECT sr.*,
              COALESCE(u.name, 'Swapper') as receiver_name, u.email as receiver_email, u.profile_picture as receiver_picture, u.location as receiver_location, u.city as receiver_city, u.profession as receiver_profession, u.education_degree as receiver_degree, u.education_institute as receiver_institute,
              COALESCE(os.name, 'General Skill Barter') as offered_skill_name, os.category as offered_skill_category,
              COALESCE(rs.name, 'General Skill Learning') as requested_skill_name, rs.category as requested_skill_category
       FROM swap_requests sr
       LEFT JOIN users u ON sr.receiver_id = u.id
       LEFT JOIN skills os ON sr.offered_skill_id = os.id
       LEFT JOIN skills rs ON sr.requested_skill_id = rs.id
       WHERE sr.requester_id = ?
       ORDER BY sr.created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      received,
      sent,
    });
  } catch (error) {
    console.error("GetRequests Error:", error);
    res.status(500).json({ success: false, message: "Server error fetching swap requests" });
  }
};

// Update request status (accept, reject, cancel, completed)
exports.updateRequestStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { status } = req.body;

    if (!['accepted', 'rejected', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const [requests] = await db.query("SELECT * FROM swap_requests WHERE id = ?", [id]);
    if (requests.length === 0) {
      return res.status(404).json({ success: false, message: "Swap request not found" });
    }

    const request = requests[0];

    // Authorization check
    if (status === 'accepted' || status === 'rejected') {
      if (Number(request.receiver_id) !== Number(userId)) {
        return res.status(403).json({ success: false, message: "Only the recipient can accept or reject requests" });
      }
    } else if (status === 'cancelled') {
      if (Number(request.requester_id) !== Number(userId)) {
        return res.status(403).json({ success: false, message: "Only the requester can cancel their request" });
      }
    }

    await db.query("UPDATE swap_requests SET status = ? WHERE id = ?", [status, id]);

    // If accepted, automatically ensure an exchange record exists and is active
    if (status === 'accepted') {
      const defaultMeeting = "https://meet.google.com/new";
      try {
        const [existingExchange] = await db.query("SELECT id FROM exchanges WHERE request_id = ?", [id]);
        if (existingExchange.length === 0) {
          await db.query(
            `INSERT INTO exchanges (request_id, status, meeting_link, notes)
             VALUES (?, 'scheduled', ?, 'Initial skill exchange session created. Schedule your time & connect!')
             ON DUPLICATE KEY UPDATE status = 'scheduled'`,
            [id, defaultMeeting]
          );
        } else {
          await db.query("UPDATE exchanges SET status = 'scheduled' WHERE request_id = ? AND status != 'completed'", [id]);
        }
      } catch (exErr) {
        console.warn("Auto-create exchange on accept warning:", exErr.message);
      }
    } else if (status === 'rejected' || status === 'cancelled') {
      try {
        await db.query("UPDATE exchanges SET status = ? WHERE request_id = ? AND status != 'completed'", [status, id]);
      } catch (exErr) {
        console.warn("Update exchange on decline warning:", exErr.message);
      }
    } else if (status === 'completed') {
      try {
        await db.query("UPDATE exchanges SET status = 'completed' WHERE request_id = ?", [id]);
      } catch (exErr) {
        console.warn("Update exchange on complete warning:", exErr.message);
      }
    }

    // Notify the other party about acceptance or rejection
    if (status === 'accepted') {
      createNotification({
        userId: request.requester_id,
        senderId: userId,
        type: "swap_accepted",
        title: "Swap Request Accepted! 🎉",
        message: `${req.user.name || "Your partner"} accepted your swap request! Your 1-on-1 session is ready.`,
        link: "/exchanges"
      }).catch(e => console.warn("Notif error:", e.message));
    } else if (status === 'rejected') {
      createNotification({
        userId: request.requester_id,
        senderId: userId,
        type: "swap_declined",
        title: "Swap Request Declined",
        message: `${req.user.name || "Your partner"} was unable to accept your swap request at this time.`,
        link: "/requests"
      }).catch(e => console.warn("Notif error:", e.message));
    }

    res.json({
      success: true,
      message: `Request status updated to ${status}`,
    });
  } catch (error) {
    console.error("UpdateRequestStatus Error:", error);
    res.status(500).json({ success: false, message: "Server error updating request status" });
  }
};
