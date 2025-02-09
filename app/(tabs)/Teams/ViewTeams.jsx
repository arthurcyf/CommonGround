import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
// import { fetchUserTeams } from "@/service/TeamService"; // Fetch teams from Firestore

const TeamsScreen = () => {
  const router = useRouter();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      // const userTeams = await fetchUserTeams(); // Fetch the teams
      // setTeams(userTeams);
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderTeam = ({ item }) => (
    <TouchableOpacity
      style={{
        padding: 15,
        backgroundColor: "#FFE5D0", // Light orange background
        borderRadius: 10,
        marginVertical: 8,
        marginHorizontal: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3,
        elevation: 3, // Android shadow
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
      onPress={() => router.push(`/teams/${item.id}`)} // Navigate to team details
    >
      <View>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "#FF6100", // Dark orange
          }}
        >
          {item.name}
        </Text>
        <Text style={{ fontSize: 14, color: "#444", marginTop: 5 }}>
          {item.isLeader ? "Team Leader" : "Team Member"}
        </Text>
      </View>
      <Feather name="chevron-right" size={20} color="#FF6100" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Your Teams
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#FF6100" />
      ) : teams.length > 0 ? (
        <FlatList
          data={teams}
          renderItem={renderTeam}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text>No teams found.</Text>
      )}

      {/* Manage/Create Team Button */}
      <TouchableOpacity
        style={{
          marginTop: 20,
          padding: 15,
          backgroundColor: "#FF6100",
          borderRadius: 10,
          alignItems: "center",
        }}
        onPress={() => router.push("/Teams/ManageTeams")}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          Manage / Create Team
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default TeamsScreen;
