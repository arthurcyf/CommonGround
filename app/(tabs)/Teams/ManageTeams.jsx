import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
// import { createTeam, fetchUserTeams } from "@/service/TeamService";
import BackArrowHeader from "../../../components/BackArrowHeader.jsx";

const ManageTeams = () => {
  const router = useRouter();
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateTeam = async () => {
    if (!teamName) return;
    setLoading(true);
    try {
      // await createTeam(teamName);
      alert("Team created successfully!");
      setTeamName("");
    } catch (error) {
      console.error("Error creating team:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <BackArrowHeader />
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
          Manage Your Teams
        </Text>

        {/* Create Team Input */}
        <TextInput
          placeholder="Enter Team Name"
          value={teamName}
          onChangeText={setTeamName}
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 10,
            borderRadius: 8,
            marginBottom: 15,
          }}
        />
        <TouchableOpacity
          style={{
            backgroundColor: "#FF6100",
            padding: 15,
            borderRadius: 8,
            alignItems: "center",
          }}
          onPress={handleCreateTeam}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={{ color: "white", fontWeight: "bold" }}>
              Create Team
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ManageTeams;
