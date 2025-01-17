import { View, ActivityIndicator, Text } from "react-native";
import React, { useEffect, useState } from "react";
import ChatHeader from "../../../components/ChatHeader.jsx";
import ChatList from "../../../components/ChatList.jsx";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "@/context/AuthContext.jsx";
import {
  getDocs,
  doc,
  getDoc,
  query,
  where,
  collection,
} from "firebase/firestore";
import { usersRef, FIRESTORE_DB } from "@/firebaseConfig.js";
import { router } from "expo-router";

const ChatMenu = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) fetchChatConnections();
  }, [user?.uid]);

  const fetchChatConnections = async () => {
    try {
      setLoading(true);

      // Fetch friends
      const friendsRef = doc(FIRESTORE_DB, "friends", user.uid);
      const friendsDoc = await getDoc(friendsRef);
      const friendIds = friendsDoc.exists()
        ? Object.keys(friendsDoc.data())
        : [];

      // Fetch users from chatRooms
      const chatRoomsRef = collection(FIRESTORE_DB, "rooms");
      const chatQuery = query(
        chatRoomsRef,
        where("participants", "array-contains", user.uid)
      );
      const chatRoomsSnapshot = await getDocs(chatQuery);

      const chatUserIds = chatRoomsSnapshot.docs.flatMap(
        (doc) => doc.data()?.participants.filter((id) => id !== user.uid) || []
      );

      // Combine and deduplicate user IDs
      const uniqueUserIds = [...new Set([...friendIds, ...chatUserIds])];

      // Fetch user details
      const userDetails = await Promise.all(
        uniqueUserIds.map(async (id) => {
          const userDoc = await getDoc(doc(usersRef, id));
          return { userId: id, ...userDoc.data() };
        })
      );

      setUsers(userDetails);
    } catch (error) {
      console.error("Error fetching chat connections:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddChat = () => {
    router.push("/(tabs)/Chat/findUser");
  };

  return (
    <View style={{ flex: 1 }}>
      <ChatHeader onAddChat={handleAddChat} />
      <StatusBar style="light" />

      {loading ? (
        <View className="flex items-center" style={{ top: hp(30) }}>
          <ActivityIndicator size="large" />
        </View>
      ) : users.length > 0 ? (
        <ChatList users={users} currentUser={user} />
      ) : (
        <View className="flex items-center" style={{ top: hp(30) }}>
          <Text>No connections found.</Text>
        </View>
      )}
    </View>
  );
};

export default ChatMenu;
