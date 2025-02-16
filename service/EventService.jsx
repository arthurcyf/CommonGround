import { FIRESTORE_DB } from "../firebaseConfig.js";
import {
  collection,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";

/**
 * Get all events
 * @returns {Promise<Array>} List of all events
 */
export const getAllEvents = async () => {
  try {
    const eventCollection = collection(FIRESTORE_DB, "events");
    const snapshot = await getDocs(eventCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

/**
 * Get a single event by ID
 * @param {string} id - Event document ID
 * @returns {Promise<Object>} Event data
 */
export const getEventById = async (id) => {
  try {
    const eventDoc = doc(FIRESTORE_DB, "events", id);
    const snapshot = await getDoc(eventDoc);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() };
    } else {
      throw new Error("Event not found");
    }
  } catch (error) {
    console.error("Error fetching event:", error);
    throw error;
  }
};

/**
 * Add a new event
 * @param {Object} eventData - Event data to save
 * @returns {Promise<string>} ID of the created event
 */
export const addEvent = async (eventData) => {
  try {
    const eventCollection = collection(FIRESTORE_DB, "events");
    const docRef = await addDoc(eventCollection, eventData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding event:", error);
    throw error;
  }
};

/**
 * Update an existing event
 * @param {string} id - Event document ID
 * @param {Object} updatedData - Data to update
 * @returns {Promise<void>}
 */
export const updateEvent = async (id, updatedData) => {
  try {
    const eventDoc = doc(FIRESTORE_DB, "events", id);
    await updateDoc(eventDoc, updatedData);
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};

/**
 * Delete an event
 * @param {string} id - Event document ID
 * @returns {Promise<void>}
 */
export const deleteEvent = async (id) => {
  try {
    const eventDoc = doc(FIRESTORE_DB, "events", id);
    await deleteDoc(eventDoc);
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

/**
 * Get an event attribute by ID
 * @param {string} eventId - The ID of the event
 * @param {string} attribute - The attribute to retrieve
 * @returns {Promise<string|null>} The requested attribute or null if not found
 */
const getEventAttributeById = async (eventId, attribute) => {
  try {
    const eventDoc = doc(FIRESTORE_DB, "events", eventId);
    const snapshot = await getDoc(eventDoc);
    return snapshot.exists() ? snapshot.data()[attribute] || null : null;
  } catch (error) {
    console.error(`Error getting event ${attribute} by ID:`, error);
    throw error;
  }
};

// Wrapper functions for specific attributes
export const getEventNameById = async (eventId) => getEventAttributeById(eventId, "name");
export const getEventDateById = async (eventId) => getEventAttributeById(eventId, "date");
export const getEventLocationById = async (eventId) => getEventAttributeById(eventId, "location");
export const getEventDetailsById = async (eventId) => getEventAttributeById(eventId, "details");

/**
 * Get event state by ID
 * @param {string} eventId - The ID of the event
 * @returns {Promise<string|null>} The event state or null if not found
 */
export const getEventStateById = async (eventId) => getEventAttributeById(eventId, "state");

/**
 * Get event privacy setting by ID
 * @param {string} eventId - The ID of the event
 * @returns {Promise<string|null>} The event privacy or null if not found
 */
export const getEventPrivacyById = async (eventId) => getEventAttributeById(eventId, "privacy");

/**
 * Update an event state
 * @param {string} eventId - Event document ID
 * @param {string} state - New state ("Public" or "Invite Only")
 * @returns {Promise<void>}
 */
export const updateEventState = async (eventId, state) => {
  try {
    const eventDoc = doc(FIRESTORE_DB, "events", eventId);
    await updateDoc(eventDoc, { state });
  } catch (error) {
    console.error("Error updating event state:", error);
    throw error;
  }
};

/**
 * Update event privacy setting
 * @param {string} eventId - Event document ID
 * @param {string} privacy - New privacy setting ("Public" or "Private")
 * @returns {Promise<void>}
 */
export const updateEventPrivacy = async (eventId, privacy) => {
  try {
    const eventDoc = doc(FIRESTORE_DB, "events", eventId);
    await updateDoc(eventDoc, { privacy });
  } catch (error) {
    console.error("Error updating event privacy:", error);
    throw error;
  }
};

/**
 * Get the ID of an event
 * @param {string} eventId - The ID of the event
 * @returns {string} The event ID
 */
export const getEventId = (eventId) => {
  return eventId; 
};
