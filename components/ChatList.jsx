import { FlatList } from "react-native";
import React from "react";
import ChatCard from "./ChatCard";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const ChatList = ({ users, currentUser }) => {
  return (
    <SafeAreaView className="flex-1" edges={["bottom"]}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.userId}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <ChatCard
            item={item}
            router={router}
            index={index}
            currentUser={currentUser}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default ChatList;
