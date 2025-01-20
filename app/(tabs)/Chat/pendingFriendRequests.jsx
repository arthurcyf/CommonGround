import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "expo-router";
import BackArrowHeader from "../../../components/BackArrowHeader.jsx";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  fetchPendingFriendRequests,
  updateFriendRequestStatus,
  deleteFriendRequest,
} from "@/service/FriendRequestService";
import { addFriends } from "@/service/FriendService";

const PendingFriendRequests = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const requests = await fetchPendingFriendRequests(user.uid);
      setFriendRequests(requests);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFriendRequest = async (requestId, status, senderId) => {
    try {
      if (status === "accepted") {
        await addFriends(user.uid, senderId); // Add users to each other's friend list
      } else if (status === "rejected") {
        await deleteFriendRequest(requestId); // Remove the friend request
      }

      // Update the friend request status
      await updateFriendRequestStatus(requestId, status);

      // Remove the request from the local state
      setFriendRequests((prev) =>
        prev.filter((request) => request.id !== requestId)
      );
    } catch (error) {
      console.error(`Error handling friend request: ${error.message}`);
    }
  };

  const renderRequest = ({ item }) => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
      }}
    >
      {/* Request Info */}
      <Text style={{ fontSize: 16 }}>{item.senderUsername}</Text>

      {/* Accept & Reject Buttons */}
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#28A745",
            padding: 10,
            borderRadius: 5,
            marginRight: 10,
          }}
          onPress={() =>
            handleFriendRequest(item.id, "accepted", item.senderId)
          }
        >
          <Feather name="check" size={18} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: "#DC3545",
            padding: 10,
            borderRadius: 5,
          }}
          onPress={() =>
            handleFriendRequest(item.id, "rejected", item.senderId)
          }
        >
          <Feather name="x" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <BackArrowHeader />
        <ActivityIndicator size="large" color="#FF6100" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <BackArrowHeader />
      <FlatList
        data={friendRequests}
        keyExtractor={(item) => item.id}
        renderItem={renderRequest}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View style={{ padding: 20, alignItems: "center" }}>
            <Text>No pending friend requests</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default PendingFriendRequests;
