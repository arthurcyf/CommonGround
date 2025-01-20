const express = require("express");
const pool = require("../config/db");
const router = express.Router();

router.get("/:userId", async (req, res) => {
    const { userId } = req.params;
    console.log("Fetching events for user:", userId); // Log the userId
    try {
      const result = await pool.query(
        "SELECT event_id, joined_at FROM user_events WHERE user_id = $1",
        [userId]
      );
      console.log("Query result:", result.rows); // Log the result
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching user events:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

// Add a user to an event
router.post("/", async (req, res) => {
  const { userId, eventId, organizerId } = req.body;
  try {
    const result = await pool.query(
      `
      INSERT INTO user_events (user_id, event_id, organizer_id)
      VALUES ($1, $2, $3) RETURNING *;
      `,
      [userId, eventId, organizerId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error adding user to event:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch all participants for a specific event
router.get("/participants/:eventId", async (req, res) => {
  const { eventId } = req.params;
  try {
    const result = await pool.query(
      "SELECT user_id, joined_at FROM user_events WHERE event_id = $1",
      [eventId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching event participants:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Remove a user from an event
router.delete("/", async (req, res) => {
  const { userId, eventId } = req.body;
  try {
    await pool.query(
      "DELETE FROM user_events WHERE user_id = $1 AND event_id = $2",
      [userId, eventId]
    );
    res.json({ message: "User removed from event" });
  } catch (error) {
    console.error("Error removing user from event:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;