import { View, ActivityIndicator, Alert } from "react-native";
import React, { useEffect } from "react";
import ChatHeader from "../../../components/ChatHeader.jsx";
import ChatList from "../../../components/ChatList.jsx";
import { useState } from "react";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "@/context/AuthContext.jsx";
import { getDocs, query, where } from "firebase/firestore";
import { usersRef } from "@/firebaseConfig.js";
import { router } from "expo-router";

const ChatMenu = () => {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (user?.uid) getUsers();
  }, [user?.uid]);

  const getUsers = async () => {
    const q = query(usersRef, where("userId", "!=", user?.uid));

    const querySnapshot = await getDocs(q);

    let data = [];
    querySnapshot.forEach((doc) => {
      data.push({ userId: doc.id, ...doc.data() });
    });

    setUsers(data);
  };

  const handleAddChat = () => {
    router.push("/(tabs)/Chat/findUser");
  };

  return (
    <View style={{ flex: 1 }}>
      <ChatHeader onAddChat={handleAddChat} />
      <StatusBar style="light" />

      {users.length > 0 ? (
        <ChatList users={users} currentUser={user} />
      ) : (
        <View className="flex items-center" style={{ top: hp(30) }}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );
};

export default ChatMenu;
