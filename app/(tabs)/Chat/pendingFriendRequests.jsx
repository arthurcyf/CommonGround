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
import {
  collection,
  deleteDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { FIRESTORE_DB } from "@/firebaseConfig";
import BackArrowHeader from "../../../components/BackArrowHeader.jsx";
import { SafeAreaView } from "react-native-safe-area-context";

const PendingFriendRequests = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchFriendRequests();
  }, []);

  const fetchFriendRequests = async () => {
    try {
      setLoading(true);
      const friendRequestsRef = collection(FIRESTORE_DB, "friendRequests");
      const q = query(
        friendRequestsRef,
        where("receiverId", "==", user.uid),
        where("status", "==", "pending")
      );

      const querySnapshot = await getDocs(q);

      const requests = await Promise.all(
        querySnapshot.docs.map(async (requestDoc) => {
          const requestData = requestDoc.data();

          const senderRef = doc(FIRESTORE_DB, "users", requestData.senderId);
          const senderDoc = await getDoc(senderRef);

          const senderUsername = senderDoc.exists()
            ? senderDoc.data().username
            : "Unknown User";

          return {
            id: requestDoc.id,
            ...requestData,
            senderUsername,
          };
        })
      );

      setFriendRequests(requests);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFriendRequest = async (requestId, status, senderId) => {
    try {
      const friendRequestRef = doc(FIRESTORE_DB, "friendRequests", requestId);

      // Update the status of the friend request
      await updateDoc(friendRequestRef, { status });

      if (status === "accepted") {
        // Add both users to each other's friend lists
        const userFriendsRef = doc(FIRESTORE_DB, "friends", user.uid);
        const senderFriendsRef = doc(FIRESTORE_DB, "friends", senderId);

        await Promise.all([
          setDoc(userFriendsRef, { [senderId]: true }, { merge: true }),
          setDoc(senderFriendsRef, { [user.uid]: true }, { merge: true }),
        ]);
      } else if (status === "rejected") {
        // Remove the friend request from the collection
        await deleteDoc(friendRequestRef);
      }

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
