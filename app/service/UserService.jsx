import { collection, getDocs, addDoc, Timestamp } from "firebase/firestore"; // Import required functions
import { FIRESTORE_DB } from "../../firebaseConfig.js"; // Your Firestore configuration

// Define the users collection
const usersCollection = collection(FIRESTORE_DB, "users");

// Function to create user details
async function createUser(userData) {
  try {
    // Add a new document to the users collection with the userData
    const docRef = await addDoc(usersCollection, {
      ...userData,
      createdAt: Timestamp.now(), // Add timestamp when the user is created
    });

    console.log("User created with ID:", docRef.id);
    return docRef.id; // Return the document ID after creation
  } catch (error) {
    console.error("Error creating user:", error);
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
