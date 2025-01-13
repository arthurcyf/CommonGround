import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "react-native-vector-icons";
import { useRouter } from "expo-router";

const UserProfileHeader = () => {
  const router = useRouter();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
      }}
    >
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ marginRight: 10 }}
      >
        <Feather name="chevron-left" size={24} color="#FF6100" />
      </TouchableOpacity>
    </View>
  );
};

export default UserProfileHeader;
