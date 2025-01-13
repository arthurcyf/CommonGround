import { TouchableOpacity, View } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

const ChatHeader = ({ onAddChat }) => {
  const { top } = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: top + 10,
        paddingHorizontal: 15,
        alignItems: "flex-end",
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
      }}
    >
      <TouchableOpacity onPress={onAddChat} style={{ padding: 5 }}>
        <Feather name="plus" size={24} color="#FF6100" />
      </TouchableOpacity>
    </View>
  );
};

export default ChatHeader;
