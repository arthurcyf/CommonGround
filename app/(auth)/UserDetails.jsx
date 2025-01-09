import React, { useState } from "react";
import { Text, TextInput, View, TouchableOpacity, Alert, Keyboard, TouchableWithoutFeedback, Image } from "react-native";
import { useRouter } from "expo-router";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { Picker } from "@react-native-picker/picker";
import { Button } from "react-native-paper"; // Import from react-native-paper
import { KeyboardAvoidingView, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker"; // Import image picker
import { createUser } from "../service/UserService";  // Adjust the path to your file

const UserDetails = () => {
    const router = useRouter();

    const [dateOfBirth, setDateOfBirth] = useState("");
    const [gender, setGender] = useState("");
    const [interests, setInterests] = useState([]);
    const [description, setDescription] = useState("");
    const [profilePicture, setProfilePicture] = useState(null); // State for profile picture
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [showGenderPicker, setShowGenderPicker] = useState(false);

    const defaultProfilePicture = "https://t3.ftcdn.net/jpg/00/64/67/80/360_F_64678017_zUpiZFjj04cnLri7oADnyMH0XBYyQghG.jpg"; // Replace with your default image URL

    const handleSubmit = async () => {
        // Ensure that all required fields are filled before submitting
        if (!dateOfBirth || !gender || !interests.length) {
            Alert.alert(
                "Error",
                "Please complete all required fields before submitting."
            );
            return;
        }

        // Use the default profile picture if none is selected
        const userProfilePicture = profilePicture || defaultProfilePicture;

        // Prepare the user data to be sent to the backend
        const userData = {
            dateOfBirth,
            gender,
            interests,
            description,
            profilePicture: userProfilePicture,
        };

        try {
            // Call the createUser function from userService
            await createUser(userData);

            // After successful user creation, navigate to the home page or show a success message
            Alert.alert("Success", "Your profile has been created!");
            console.log("this is the " + userData);
            router.push("/home");
        } catch (error) {
            Alert.alert("Error", "An error occurred while creating your profile.");
            console.error("Error creating user:", error);
        }
    };


    const handleNext = () => {
        if (currentStep === 4) {
            if (!dateOfBirth || !gender || !interests.length) {
                Alert.alert(
                    "Error",
                    "Please complete all required fields before submitting."
                );
                return;
            }
            router.push("/home");
        } else {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const onChangeDate = (date) => {
        setShowDatePicker(false);
        setDateOfBirth(moment(date).format("YYYY-MM-DD"));
    };

    const renderStepIndicator = () => {
        const steps = ["•", "•", "•", "•", "•"]; // Added another dot for the new step
        steps[currentStep] = <Text style={{ fontWeight: "bold", fontSize: 24 }}>•</Text>;
        return steps.map((dot, index) => (
            <Text key={index} style={{ fontSize: 24, marginHorizontal: 5 }}>
                {dot}
            </Text>
        ));
    };

    const interestsList = [
        "Cycling", "Sports", "Gaming", "Photography", "Food", "Traveling",
        "Shopping", "Karaoke", "Hiking", "Nature", "Movies", "Volunteering",
        "Crafting", "DIY", "Cafes", "Boardgames", "Painting", "Knitting",
        "Gardening", "Dancing", "Mahjong", "Others"
    ];

    const toggleInterest = (interest) => {
        setInterests((prevInterests) => {
            if (prevInterests.includes(interest)) {
                return prevInterests.filter((item) => item !== interest);
            } else {
                return [...prevInterests, interest];
            }
        });
    };

    const pickImage = async () => {
        // Ask for permission to access the camera roll
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert("Permission required", "We need permission to access your photos.");
            return;
        }

        // Open the image picker
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!pickerResult.canceled) {
            setProfilePicture(pickerResult.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        // Ask for permission to access the camera
        let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert("Permission required", "We need permission to use your camera.");
            return;
        }

        // Take a photo
        let cameraResult = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!cameraResult.canceled) {
            setProfilePicture(cameraResult.assets[0].uri);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={{ flex: 1, padding: 20, justifyContent: "center", alignItems: "center" }}>
                    <View
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            flexGrow: 1,
                            width: "100%",
                        }}
                    >
                        {/* Title */}
                        <Text className="text-3xl font-bold text-[#FF6100] text-center mb-5">
                            Tell Us About Yourself!
                        </Text>

                        {/* Step Content */}
                        <View style={{ width: "100%", maxWidth: 400 }}>
                            {currentStep === 0 && (
                                <View className="mb-5">
                                    <Text style={{ fontWeight: 'bold', textAlign: 'center' }} className="text-lg mb-2">
                                        Date of Birth
                                    </Text>
                                    <TouchableOpacity
                                        className="border border-gray-300 rounded-lg p-3 text-lg w-full"
                                        onPress={() => setShowDatePicker(true)}
                                    >
                                        <Text className="text-gray-700 text-center">
                                            {dateOfBirth || "Select Date"}
                                        </Text>
                                    </TouchableOpacity>

                                    {showDatePicker && (
                                        <DateTimePickerModal
                                            isVisible={showDatePicker}
                                            mode="date"
                                            onConfirm={onChangeDate}
                                            onCancel={() => setShowDatePicker(false)}
                                        />
                                    )}
                                </View>
                            )}

                            {currentStep === 1 && (
                                <View className="mb-5">
                                    <Text style={{ fontWeight: 'bold', textAlign: 'center' }} className="text-lg mb-2">
                                        Gender
                                    </Text>
                                    <TouchableOpacity
                                        style={{
                                            borderWidth: 1,
                                            borderColor: 'gray',
                                            borderRadius: 5,
                                            padding: 10,
                                            width: "100%",
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginBottom: 10, // Space between the gender box and the button
                                        }}
                                        onPress={() => setShowGenderPicker(true)}
                                    >
                                        <Text style={{ color: gender ? 'black' : 'gray' }}>
                                            {gender || "Select Gender"}
                                        </Text>
                                    </TouchableOpacity>

                                    {showGenderPicker && (
                                        <View
                                            style={{
                                                position: 'absolute',
                                                top: 90, // Moves the picker upwards to cover the box
                                                left: 0,
                                                right: 0,
                                                zIndex: 1,
                                                backgroundColor: "white",
                                                borderRadius: 10,
                                                padding: 10,
                                            }}
                                        >
                                            <Picker
                                                selectedValue={gender}
                                                onValueChange={(itemValue) => {
                                                    setGender(itemValue);
                                                    setShowGenderPicker(false); // Hide picker after selection
                                                }}
                                                style={{
                                                    width: "100%",
                                                    height: 150, // Adjust the height as needed to make it more spacious
                                                }}
                                            >
                                                <Picker.Item label="Select Gender" value="" />
                                                <Picker.Item label="Male" value="Male" />
                                                <Picker.Item label="Female" value="Female" />
                                                <Picker.Item label="Others" value="Others" />
                                            </Picker>
                                        </View>
                                    )}
                                </View>
                            )}

                            {currentStep === 2 && (
                                <View className="mb-5">
                                    <Text style={{ fontWeight: 'bold', textAlign: 'center' }} className="text-lg mb-2">
                                        Select Your Interests
                                    </Text>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            flexWrap: "wrap",
                                            justifyContent: "center", // Centers the interests items
                                        }}
                                    >
                                        {interestsList.map((interest, index) => (
                                            <TouchableOpacity
                                                key={index}
                                                style={{
                                                    backgroundColor: interests.includes(interest) ? '#FF6100' : '#F3F4F6',
                                                    paddingVertical: 10,
                                                    paddingHorizontal: 20,
                                                    borderRadius: 5,
                                                    marginVertical: 5,
                                                    marginHorizontal: 5,
                                                    alignItems: "center",
                                                }}
                                                onPress={() => toggleInterest(interest)}
                                            >
                                                <Text style={{ color: interests.includes(interest) ? 'white' : 'black' }}>
                                                    {interest}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            )}

                            {currentStep === 3 && (
                                <View className="mb-5">
                                    <Text style={{ fontWeight: 'bold', textAlign: 'center' }} className="text-lg mb-2">
                                        Description
                                    </Text>
                                    <TextInput
                                        className="border border-gray-300 rounded-lg p-3 text-lg h-24 text-top w-full"
                                        placeholder="Write a short description about yourself"
                                        value={description}
                                        onChangeText={setDescription}
                                        multiline
                                    />
                                </View>
                            )}

                            {/* New Step for Profile Picture */}
                            {currentStep === 4 && (
                                <View className="mb-5">
                                    <Text style={{ fontWeight: 'bold', textAlign: 'center' }} className="text-lg mb-2">
                                        Profile Picture
                                    </Text>

                                    {profilePicture ? (
                                        <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
                                            <Image
                                                source={{ uri: profilePicture }}
                                                style={{
                                                    width: 100,
                                                    height: 100,
                                                    borderRadius: 50,
                                                    marginBottom: 10,
                                                }}
                                            />
                                        </View>
                                    ) : (
                                        <Text>No profile picture selected</Text> // make this center
                                    )}

                                    <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 10 }}>
                                        <Button
                                            mode="outlined"
                                            onPress={pickImage}
                                            style={{
                                                marginHorizontal: 10,
                                                borderColor: "#FF6100", // Orange border
                                                backgroundColor: "#FF6100", // Orange background
                                            }}
                                            labelStyle={{
                                                color: "white", // White text color
                                            }}
                                        >
                                            From Gallery
                                        </Button>

                                        <Button
                                            mode="outlined"
                                            onPress={takePhoto}
                                            style={{
                                                marginHorizontal: 10,
                                                borderColor: "#FF6100", // Orange border
                                                backgroundColor: "#FF6100", // Orange background
                                            }}
                                            labelStyle={{
                                                color: "white", // White text color
                                            }}
                                        >
                                            Take a Photo
                                        </Button>


                                    </View>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Step Indicator */}
                    <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 20 }}>
                        {renderStepIndicator()}
                    </View>

                    {/* Grouped Navigation Buttons */}
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 20,
                            marginBottom: 20,
                        }}
                    >
                        {currentStep > 0 && (
                            <Button
                                onPress={handlePrev}
                                mode="contained"
                                style={{
                                    backgroundColor: "#FF6100",
                                    marginHorizontal: 10,
                                }}
                            >
                                Prev
                            </Button>
                        )}

                        <Button
                            onPress={currentStep === 4 ? handleSubmit : handleNext} // Call handleSubmit on the last step
                            mode="contained"
                            style={{
                                backgroundColor: "#FF6100",
                                marginHorizontal: 10,
                            }}
                        >
                            {currentStep === 4 ? "Submit" : "Next"}
                        </Button>

                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default UserDetails;
