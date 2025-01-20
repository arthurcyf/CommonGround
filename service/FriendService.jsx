import {
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  collection,
  query,
  where,
  setDoc,
} from "firebase/firestore";
import { FIRESTORE_DB } from "@/firebaseConfig";

/**
 * Add two users as friends.
 * @param {string} userId1 - The first user's ID.
 * @param {string} userId2 - The second user's ID.
 * @returns {Promise<void>}
 */
export const addFriends = async (userId1, userId2) => {
  try {
    const user1FriendsRef = doc(FIRESTORE_DB, "friends", userId1);
    const user2FriendsRef = doc(FIRESTORE_DB, "friends", userId2);

    await Promise.all([
      setDoc(user1FriendsRef, { [userId2]: true }, { merge: true }),
      setDoc(user2FriendsRef, { [userId1]: true }, { merge: true }),
    ]);
  } catch (error) {
    console.error("Error adding friends:", error);
    throw error;
  }
};

/**
 * Check if two users are friends.
 * @param {string} currentUserId - Current user's ID.
 * @param {string} targetUserId - Target user's ID.
 * @returns {Promise<boolean>} - Whether the users are friends.
 */
export const isFriend = async (currentUserId, targetUserId) => {
  try {
    const friendsRef = doc(FIRESTORE_DB, "friends", currentUserId);
    const friendsDoc = await getDoc(friendsRef);
    return friendsDoc.exists() && !!friendsDoc.data()[targetUserId];
  } catch (error) {
    console.error("Error checking friendship status:", error);
    throw error;
  }
};

/**
 * Remove a friend for two users and delete any existing friend requests.
 * @param {string} currentUserId - Current user's ID.
 * @param {string} targetUserId - Target user's ID.
 * @returns {Promise<void>}
 */
export const removeFriend = async (currentUserId, targetUserId) => {
  try {
    const currentUserFriendRef = doc(FIRESTORE_DB, "friends", currentUserId);
    const targetUserFriendRef = doc(FIRESTORE_DB, "friends", targetUserId);

    // Delete the friend relationship
    await Promise.all([
      deleteDoc(currentUserFriendRef),
      deleteDoc(targetUserFriendRef),
    ]);

    // Delete any existing friend requests
    const friendRequestsRef = collection(FIRESTORE_DB, "friendRequests");

    // Query for friend requests where the current user is the sender or receiver
    const friendRequestsQuery = query(
      friendRequestsRef,
      where("senderId", "in", [currentUserId, targetUserId]),
      where("receiverId", "in", [currentUserId, targetUserId])
    );

    const requestSnapshot = await getDocs(friendRequestsQuery);

    const deletePromises = requestSnapshot.docs.map((doc) =>
      deleteDoc(doc.ref)
    );

    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error removing friend and friend requests:", error);
    throw error;
  }
};

/**
 * Fetch friends' details for a user.
 * @param {string} userId - The UID of the current user.
 * @returns {Promise<Array>} - An array of friend details.
 */
export const fetchFriendsWithDetails = async (userId) => {
  try {
    const friendsRef = doc(FIRESTORE_DB, "friends", userId);
    const friendsDoc = await getDoc(friendsRef);

    const friendIds = friendsDoc.exists() ? Object.keys(friendsDoc.data()) : [];

    const friendsDetails = await Promise.all(
      friendIds.map(async (id) => {
        const friendDoc = await getDoc(doc(FIRESTORE_DB, "users", id));
        return { userId: id, ...friendDoc.data() };
      })
    );

    return friendsDetails;
  } catch (error) {
    console.error("Error fetching friends with details:", error);
    throw error;
  }
};
