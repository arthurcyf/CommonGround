import pool from "../utils/db.js"; 

// Create a new entry in the user_events table
async function addUserToEvent(userId, eventId, organizerId) {
  try {
    const result = await pool.query(
      `
      INSERT INTO user_events (user_id, event_id, organizer_id)
      VALUES ($1, $2, $3)
      ON CONFLICT DO NOTHING
      RETURNING *;
      `,
      [userId, eventId, organizerId]
    );
    return result.rows[0]; // Return the inserted row
  } catch (error) {
    console.error("Error adding user to event:", error);
    throw error;
  }
}

// Read all events a user is participating in
async function getUserEvents(userId) {
  try {
    const result = await pool.query(
      `
      SELECT event_id, organizer_id, joined_at
      FROM user_events
      WHERE user_id = $1;
      `,
      [userId]
    );
    return result.rows;
  } catch (error) {
    console.error("Error fetching user events:", error);
    throw error;
  }
}

// Read all users participating in a specific event
async function getEventParticipants(eventId) {
  try {
    const result = await pool.query(
      `
      SELECT user_id, organizer_id, joined_at
      FROM user_events
      WHERE event_id = $1;
      `,
      [eventId]
    );
    return result.rows;
  } catch (error) {
    console.error("Error fetching event participants:", error);
    throw error;
  }
}

// Read all events organized by a specific user
async function getEventsByOrganizer(organizerId) {
  try {
    const result = await pool.query(
      `
      SELECT event_id, joined_at
      FROM user_events
      WHERE organizer_id = $1;
      `,
      [organizerId]
    );
    return result.rows;
  } catch (error) {
    console.error("Error fetching events by organizer:", error);
    throw error;
  }
}

// Delete a user from an event
async function removeUserFromEvent(userId, eventId) {
  try {
    await pool.query(
      `
      DELETE FROM user_events
      WHERE user_id = $1 AND event_id = $2;
      `,
      [userId, eventId]
    );
    return { success: true, message: "User removed from event" };
  } catch (error) {
    console.error("Error removing user from event:", error);
    throw error;
  }
}

export {
  addUserToEvent,
  getUserEvents,
  getEventParticipants,
  getEventsByOrganizer,
  removeUserFromEvent,
};
