import { FlatList, ActivityIndicator, View } from "react-native";
import React, { useEffect, useState } from "react";
import ChatCard from "./ChatCard";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  orderBy,
  limit,
} from "firebase/firestore";
import { FIRESTORE_DB } from "@/firebaseConfig";

const ChatList = ({ currentUser }) => {
  const [sortedUsers, setSortedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser?.uid) fetchChatConnections();
  }, [currentUser?.uid]);

  const fetchChatConnections = async () => {
    setLoading(true);
    try {
      const userDetailsMap = new Map();

      // Fetch friends
      const friendsRef = doc(FIRESTORE_DB, "friends", currentUser.uid);
      const friendsDoc = await getDoc(friendsRef);
      const friendIds = friendsDoc.exists()
        ? Object.keys(friendsDoc.data())
        : [];

      // Fetch chat rooms
      const roomsRef = collection(FIRESTORE_DB, "rooms");
      const roomsQuery = query(
        roomsRef,
        where("participants", "array-contains", currentUser.uid)
      );
      const roomsSnapshot = await getDocs(roomsQuery);

      // Fetch all participants from chat rooms
      const chatRooms = await Promise.all(
        roomsSnapshot.docs.map(async (roomDoc) => {
          const roomData = roomDoc.data();
          const otherUserId = roomData.participants.find(
            (id) => id !== currentUser.uid
          );

          // Fetch latest message in the room
          const messagesRef = collection(roomDoc.ref, "messages");
          const latestMessageQuery = query(
            messagesRef,
            orderBy("createdAt", "desc"),
            limit(1)
          );
          const latestMessageSnapshot = await getDocs(latestMessageQuery);
          const latestMessage = !latestMessageSnapshot.empty
            ? latestMessageSnapshot.docs[0].data()
            : null;

          // Fetch user details for the other participant
          if (!userDetailsMap.has(otherUserId)) {
            const userDoc = await getDoc(
              doc(FIRESTORE_DB, "users", otherUserId)
            );
            if (userDoc.exists()) {
              const userData = userDoc.data();
              userDetailsMap.set(otherUserId, {
                userId: otherUserId,
                username: userData.username, // Add username
                profilePicture: userData.profilePicture, // Add profile picture if available
                latestMessage,
                roomId: roomDoc.id,
              });
            }
          } else {
            // Update the existing entry with the latest message
            const existingEntry = userDetailsMap.get(otherUserId);
            userDetailsMap.set(otherUserId, {
              ...existingEntry,
              latestMessage,
            });
          }

          return otherUserId;
        })
      );

      // Combine friend IDs and chat participant IDs
      const combinedIds = [...new Set([...friendIds, ...chatRooms])];

      // Fetch user details
      await Promise.all(
        combinedIds.map(async (userId) => {
          if (!userDetailsMap.has(userId)) {
            // Fetch user details for friends without chat rooms
            const userDoc = await getDoc(doc(FIRESTORE_DB, "users", userId));
            if (userDoc.exists()) {
              userDetailsMap.set(userId, {
                userId,
                ...userDoc.data(),
              });
            }
          }
        })
      );

      // Convert map to array and sort by latestMessage.createdAt
      const sorted = Array.from(userDetailsMap.values()).sort((a, b) => {
        const aTime = a?.latestMessage?.createdAt?.seconds || 0;
        const bTime = b?.latestMessage?.createdAt?.seconds || 0;
        return bTime - aTime; // Descending order
      });

      setSortedUsers(sorted);
    } catch (error) {
      console.error("Error fetching chat connections:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#FF6100" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1" edges={["bottom"]}>
      <FlatList
        data={sortedUsers}
        keyExtractor={(item) => item.userId}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ChatCard item={item} router={router} currentUser={currentUser} />
        )}
      />
    </SafeAreaView>
  );
};

export default ChatList;
