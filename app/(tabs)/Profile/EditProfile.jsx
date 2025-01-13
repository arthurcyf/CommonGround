import { ScrollView, Text, View, Image, TextInput, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import * as ImagePicker from 'expo-image-picker';
import Icon from "react-native-vector-icons/FontAwesome";
import { getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { firestore } from "../../../firebaseConfig"; // Import your Firestore configuration

const EditProfile = () => {
  const [profilePic, setProfilePic] = useState("https://example.com/default-avatar.png");
  const [username, setUsername] = useState("Loading...");
  const [email, setEmail] = useState("Loading...");
  const [interests, setInterests] = useState("Loading...");
  const [description, setDescription] = useState("Loading...");

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        const userId = currentUser.uid;

        try {
          const userDoc = await getDoc(doc(firestore, "users", userId));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setProfilePic(data.profilePic || "https://example.com/default-avatar.png");
            setUsername(data.username || "");
            setEmail(data.email || "");
            setInterests(data.interests || "");
            setDescription(data.description || "");
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      } else {
        console.error("No user is signed in.");
      }
    };

    fetchUserData();
  }, []);

  // Function to pick an image from the gallery
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert("Permission to access the media library is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfilePic(result.uri); // Set the picked image as the profile picture
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

      {/* Interests */}
      <View style={{ width: "100%", marginVertical: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 5 }}>Interests</Text>
        <TextInput
          value={interests}
          onChangeText={setInterests}
          placeholder="Enter your interests"
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

      {/* Profile Description */}
      <View style={{ width: "100%", marginVertical: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 5 }}>Profile Description</Text>
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
        onPress={() => alert("Profile updated!")}
      >
        <Text style={{ color: "#fff", fontSize: 16 }}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditProfile;
