import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { formatTime, getRoomId } from "../utils/common.js";
import { listenToLatestMessages } from "@/service/MessageService";

export default function ChatCard({ item, router, currentUser }) {
  const [lastMessage, setLastMessage] = useState(undefined);

  useEffect(() => {
    let roomId = getRoomId(currentUser?.uid, item?.userId);
    const unsubscribe = listenToLatestMessages(roomId, setLastMessage);

    return unsubscribe; // Cleanup listener on component unmount
  }, []);

  const openChatRoom = () => {
    router.push({
      pathname: "/Chat/chatRoom",
      params: { item: JSON.stringify(item) },
    });
  };

  const renderLastMessage = () => {
    if (typeof lastMessage === "undefined") return "Loading...";
    if (lastMessage) {
      return currentUser?.uid === lastMessage?.userId
        ? `You: ${lastMessage?.text}`
        : lastMessage?.text;
    }
    return "Say Hi! 👋";
  };

  const renderTime = () => {
    if (lastMessage) {
      const date = lastMessage?.createdAt;
      return formatTime(new Date(date?.seconds * 1000));
    }
  };

  return (
    <TouchableOpacity
      className="flex-row items-center p-4 bg-white border-b border-gray-200"
      onPress={openChatRoom}
    >
      {/* Profile Image */}
      <Image
        source={require("../assets/icons/avatar.png")}
        style={{ height: hp(6), aspectRatio: 1 }}
        className="w-12 h-12 rounded-full mr-4"
      />
      <View className="flex-1 gap-1">
        <Text className="text-lg font-bold text-gray-800" numberOfLines={1}>
          {item.username}
        </Text>
        <Text className="text-sm text-gray-500 mt-1" numberOfLines={1}>
          {renderLastMessage()}
        </Text>
      </View>
      <View className="items-end pb-2">
        <Text className="text-xs text-gray-400">{renderTime()}</Text>
        <Feather
          name="chevron-right"
          size={20}
          color="#bbb"
          style={{ marginTop: 5 }}
        />
      </View>
    </TouchableOpacity>
  );
}
