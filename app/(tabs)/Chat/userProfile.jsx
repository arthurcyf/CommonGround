import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { usersRef } from "@/firebaseConfig";
import UserProfileHeader from "../../../components/UserProfileHeader.jsx";
import { Feather } from "react-native-vector-icons";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { item } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (item) {
      fetchUser();
    }
  }, [item]);

  const fetchUser = async () => {
    try {
      const parsedItem = JSON.parse(item);
      const userDoc = await getDoc(doc(usersRef, parsedItem?.id));
      if (userDoc.exists()) {
        setUser(userDoc.data());
      } else {
        console.error("User not found");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendFriendRequest = () => {
    // Logic for sending a friend request
    alert("Friend request sent!");
  };

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color="#FF6100" />
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <UserProfileHeader />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>User not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <UserProfileHeader />
      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: 20, alignItems: "center" }}>
          {/* Profile Picture */}
          <Image
            source={require("../../../assets/icons/avatar.png")}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              marginBottom: 20,
              backgroundColor: "#ccc",
            }}
          />

          {/* Username */}
          <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
            @{user.username || "Unknown User"}
          </Text>

          {/* Action Buttons */}
          <View style={{ flexDirection: "row", marginBottom: 20 }}>
            {/* Message Button */}
            <TouchableOpacity
              style={{
                backgroundColor: "#FF6100",
                padding: 10,
                borderRadius: 50,
                marginRight: 15,
              }}
              onPress={() => {
                router.push({
                  pathname: "/Chat/chatRoom",
                  params: { item: JSON.stringify(user) },
                });
              }}
            >
              <Feather name="message-circle" size={24} color="#fff" />
            </TouchableOpacity>

            {/* Friend Request Button */}
            <TouchableOpacity
              style={{
                backgroundColor: "#007BFF",
                padding: 10,
                borderRadius: 50,
              }}
              onPress={handleSendFriendRequest}
            >
              <Feather name="user-plus" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* User Description */}
          <View style={{ width: "100%", marginBottom: 20 }}>
            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
            >
              Description
            </Text>
            <Text style={{ fontSize: 16, color: "#555" }}>
              {user.description || "No description available."}
            </Text>
          </View>

          {/* User Interests */}
          <View style={{ width: "100%", marginBottom: 20 }}>
            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
            >
              Interests
            </Text>
            <Text style={{ fontSize: 16, color: "#555" }}>
              {user.interests?.join(", ") || "No interests specified."}
            </Text>
          </View>

          {/* Date of Birth */}
          <View style={{ width: "100%", marginBottom: 20 }}>
            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
            >
              Date of Birth
            </Text>
            <Text style={{ fontSize: 16, color: "#555" }}>
              {user.dateOfBirth || "Date of birth not available."}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserProfile;
