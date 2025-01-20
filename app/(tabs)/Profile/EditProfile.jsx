import {
  ScrollView,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { getDoc, doc, collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { FIRESTORE_DB } from "../../../firebaseConfig";
import { setDoc } from "firebase/firestore";
import Icon from "react-native-vector-icons/FontAwesome";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from "@react-native-picker/picker";

const EditProfile = () => {
  const [profilePic, setProfilePic] = useState(
    "https://example.com/default-avatar.png"
  );
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(""); // Stores the selected date
  const [gender, setGender] = useState(""); // Updated for gender dropdown
  const [interests, setInterests] = useState([]);
  const [description, setDescription] = useState("");
  const [availableInterests, setAvailableInterests] = useState([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false); // Controls date picker visibility

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        const userId = currentUser.uid;
        try {
          setEmail(currentUser.email || "");

          const userDoc = await getDoc(doc(FIRESTORE_DB, "users", userId));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setProfilePic(
              data.profilePicture || "https://example.com/default-avatar.png"
            );
            setUsername(data.username || "");
            setDateOfBirth(data.dateOfBirth || "");
            setGender(data.gender || "");
            setInterests(data.interests || []);
            setDescription(data.description || "");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        console.error("No user is signed in.");
      }
    };

    const fetchAvailableInterests = async () => {
      try {
        const interestsCollection = collection(FIRESTORE_DB, "interests");
        const querySnapshot = await getDocs(interestsCollection);
        const interestsList = querySnapshot.docs.map((doc) => doc.data().name);
        setAvailableInterests(interestsList);
      } catch (error) {
        console.error("Error fetching available interests:", error);
      }
    };

    fetchUserData();
    fetchAvailableInterests();
  }, []);

  const toggleInterest = (interest) => {
    if (interests.includes(interest)) {
      setInterests((prev) => prev.filter((item) => item !== interest));
    } else {
      setInterests((prev) => [...prev, interest]);
    }
  };

  const saveChanges = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      const userId = currentUser.uid;

      try {
        // Update the email in Firebase Authentication
        if (email && email !== currentUser.email) {
          await currentUser.updateEmail(email);
          console.log("Email updated in Firebase Authentication");
        }

        // Update other user details in Firestore
        await setDoc(
          doc(FIRESTORE_DB, "users", userId),
          {
            profilePicture: profilePic,
            username: username.toLowerCase(),
            dateOfBirth,
            gender,
            interests,
            description,
          },
          { merge: true }
        );

        alert("Profile updated successfully!");
      } catch (error) {
        console.error("Error updating profile: ", error);
        alert(
          "An error occurred while updating your profile. Please try again."
        );
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

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const formattedDate = date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
    setDateOfBirth(formattedDate);
    hideDatePicker();
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: "center",
        padding: 20,
        backgroundColor: "#fff",
        paddingTop: 40,
        paddingBottom: 100,
      }}
    >
      {/* Profile Picture */}
      <View style={{ alignItems: "center", marginVertical: 20 }}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={{ uri: profilePic }}
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              marginBottom: 10,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={pickImage}
          style={{
            backgroundColor: "#FF6100",
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 50,
            marginTop: 10,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16, textAlign: "center" }}>
            Change Profile Picture
          </Text>
        </TouchableOpacity>
      </View>

      {/* Username */}
      <View style={{ width: "100%", marginVertical: 10 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "#333",
            marginBottom: 5,
          }}
        >
          Username
        </Text>
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
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "#333",
            marginBottom: 5,
          }}
        >
          Email
        </Text>
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
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "#333",
            marginBottom: 5,
          }}
        >
          Date of Birth
        </Text>
        <TouchableOpacity
          onPress={showDatePicker}
          style={{
            height: 50,
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 8,
            justifyContent: "center",
            paddingHorizontal: 10,
          }}
        >
          <Text style={{ fontSize: 16, color: dateOfBirth ? "#000" : "#aaa" }}>
            {dateOfBirth || "Select Date of Birth"}
          </Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      </View>

      {/* Gender */}
      <View style={{ width: "100%", marginVertical: 10 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "#333",
            marginBottom: 5,
          }}
        >
          Gender
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 10,
          }}
        >
          {/* Male Button */}
          <TouchableOpacity
            onPress={() => setGender("Male")}
            style={{
              backgroundColor: gender === "Male" ? "#FF6100" : "#E0E0E0",
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                color: gender === "Male" ? "#fff" : "#333",
                fontSize: 16,
              }}
            >
              Male
            </Text>
          </TouchableOpacity>

          {/* Female Button */}
          <TouchableOpacity
            onPress={() => setGender("Female")}
            style={{
              backgroundColor: gender === "Female" ? "#FF6100" : "#E0E0E0",
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                color: gender === "Female" ? "#fff" : "#333",
                fontSize: 16,
              }}
            >
              Female
            </Text>
          </TouchableOpacity>

          {/* Others Button */}
          <TouchableOpacity
            onPress={() => setGender("Others")}
            style={{
              backgroundColor: gender === "Others" ? "#FF6100" : "#E0E0E0",
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                color: gender === "Others" ? "#fff" : "#333",
                fontSize: 16,
              }}
            >
              Others
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Interests */}
      <View style={{ width: "100%", marginVertical: 10 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "#333",
            marginBottom: 5,
          }}
        >
          Interests
        </Text>
        <View style={{ flexWrap: "wrap", flexDirection: "row", marginTop: 5 }}>
          {availableInterests.map((interest, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => toggleInterest(interest)}
              style={{
                backgroundColor: interests.includes(interest)
                  ? "#FF6100"
                  : "#E0E0E0",
                paddingHorizontal: 15,
                paddingVertical: 8,
                borderRadius: 20,
                margin: 5,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: interests.includes(interest) ? "#fff" : "#333",
                  fontSize: 14,
                  marginRight: 8,
                }}
              >
                {interest}
              </Text>
              {interests.includes(interest) && (
                <TouchableOpacity onPress={() => toggleInterest(interest)}>
                  <Icon name="times" size={14} color="#fff" />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Description */}
      <View style={{ width: "100%", marginVertical: 10 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "#333",
            marginBottom: 5,
          }}
        >
          Description
        </Text>
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
          padding: 15,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FF6100",
          borderRadius: 50,
          width: "15%",
        }}
        onPress={saveChanges}
      >
        <Icon name="save" size={20} color="#fff" />
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditProfile;
