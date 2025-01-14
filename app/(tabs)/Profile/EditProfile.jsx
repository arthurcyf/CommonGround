import { ScrollView, Text, View, Image, TextInput, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { FIRESTORE_DB } from "../../../firebaseConfig";
import { setDoc } from "firebase/firestore";

const EditProfile = () => {
  const [profilePic, setProfilePic] = useState("https://example.com/default-avatar.png");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [interests, setInterests] = useState([]);
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      console.log("Fetching user data...");
      const auth = getAuth();
      const currentUser = auth.currentUser;
  
      if (currentUser) {
        console.log("Current user found:", currentUser.uid);
        const userId = currentUser.uid;
        try {
          const userDoc = await getDoc(doc(FIRESTORE_DB, "users", userId));
          if (userDoc.exists()) {
            console.log("Document fetched:", userDoc.data());
            const data = userDoc.data();
            setProfilePic(data.profilePicture || "https://example.com/default-avatar.png");
            setUsername(data.username || "");
            setEmail(data.email || "");
            setDateOfBirth(data.dateOfBirth || "");
            setGender(data.gender || "");
            setInterests(data.interests || []);
            setDescription(data.description || "");
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        console.error("No user is signed in.");
      }
    };
  
    fetchUserData();
  }, []);  

  const saveChanges = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      const userId = currentUser.uid;

      try {
        await setDoc(doc(FIRESTORE_DB, "users", userId), {
          profilePicture: profilePic,
          username,
          email,
          dateOfBirth,
          gender,
          interests,
          description,
        }, { merge: true });

        alert("Profile updated successfully!");
      } catch (error) {
        console.error("Error updating profile: ", error);
        alert("An error occurred while updating your profile. Please try again.");
      }
    } else {
      alert("No user is signed in. Please sign in and try again.");
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access the media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePic(result.uri);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: "center", padding: 20, backgroundColor: "#fff", paddingTop: 40 }}>
      {/* Profile Picture */}
      <TouchableOpacity onPress={pickImage}>
        <Image
          source={{ uri: profilePic }}
          style={{ width: 120, height: 120, borderRadius: 60, marginBottom: 10 }}
        />
        <Text style={{ color: "#007BFF", fontSize: 16 }}>Change Profile Picture</Text>
      </TouchableOpacity>

      {/* Username */}
      <View style={{ width: "100%", marginVertical: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 5 }}>Username</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your username"
          style={{
            width: "100%",
            height: 50,
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 8,
            padding: 10,
            fontSize: 16,
          }}
        />
      </View>

      {/* Email */}
      <View style={{ width: "100%", marginVertical: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 5 }}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          style={{
            width: "100%",
            height: 50,
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 8,
            padding: 10,
            fontSize: 16,
          }}
        />
      </View>

      {/* Date of Birth */}
      <View style={{ width: "100%", marginVertical: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 5 }}>Date of Birth</Text>
        <TextInput
          value={dateOfBirth}
          onChangeText={setDateOfBirth}
          placeholder="YYYY-MM-DD"
          style={{
            width: "100%",
            height: 50,
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 8,
            padding: 10,
            fontSize: 16,
          }}
        />
      </View>

      {/* Gender */}
      <View style={{ width: "100%", marginVertical: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 5 }}>Gender</Text>
        <TextInput
          value={gender}
          onChangeText={setGender}
          placeholder="Enter your gender"
          style={{
            width: "100%",
            height: 50,
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 8,
            padding: 10,
            fontSize: 16,
          }}
        />
      </View>

      {/* Interests */}
      <View style={{ width: "100%", marginVertical: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 5 }}>Interests</Text>
        <TextInput
          value={interests.join(", ")}
          onChangeText={(text) => setInterests(text.split(", "))}
          placeholder="Enter your interests (comma-separated)"
          style={{
            width: "100%",
            height: 50,
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 8,
            padding: 10,
            fontSize: 16,
          }}
        />
      </View>

      {/* Description */}
      <View style={{ width: "100%", marginVertical: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 5 }}>Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Write something about yourself"
          style={{
            width: "100%",
            height: 120,
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 8,
            padding: 10,
            textAlignVertical: "top",
            fontSize: 16,
          }}
          multiline
        />
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={{
          marginTop: 20,
          padding: 10,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FF6100",
          borderRadius: 50,
        }}
        onPress={saveChanges}
      >
        <Text style={{ color: "#fff", fontSize: 16 }}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditProfile;
