import { collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { FIRESTORE_DB } from "../../firebaseConfig.js"; // Your Firestore configuration
import { getAuth } from "firebase/auth";

// Define the users collection
const usersCollection = collection(FIRESTORE_DB, "users");

// Function to create or update user details
async function createUser(userData) {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error("No authenticated user found.");
    }

    const userId = currentUser.uid; // Use the current user's UID

    // Set or update the user document
    await setDoc(
      doc(FIRESTORE_DB, "users", userId), 
      {
        ...userData,
        createdAt: Timestamp.now(), // Include a timestamp if creating the document
      },
      { merge: true } // Merge: true ensures existing data is not overwritten
    );

    console.log("User created or updated successfully for UID:", userId);
  } catch (error) {
    console.error("Error creating/updating user:", error);
    throw error; // Rethrow error for further handling
  }
}

// Function to read user details
async function readUserDetails() {
  try {
    // Fetch documents from the collection
    const querySnapshot = await getDocs(usersCollection);

    // Map documents to objects
    const users = querySnapshot.docs.map((doc) => ({
      username: doc.data().username,
      userId: doc.data().userId,
      dateOfBirth: doc.data().dateOfBirth,
      profilePicture: doc.data().profilePicture,
      description: doc.data().description,
      interests: doc.data().interests,
      createdAt: doc.data().createdAt?.toDate(), // Convert Firestore Timestamp to Date object
    }));

    console.log("Fetched Users:", users);
    return users; // Return the users array
  } catch (error) {
    console.error("Error reading user details:", error);
    throw error; // Rethrow error for further handling
  }
}

export { createUser, readUserDetails };
