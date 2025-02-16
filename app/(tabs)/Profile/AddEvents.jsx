import React, { useState, useEffect } from "react";
import {
    View, Text, TextInput, TouchableOpacity, Alert, Keyboard, FlatList, TouchableWithoutFeedback, ScrollView
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../../supabaseClient";
import { getAuth } from "firebase/auth";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { googleConfig } from "../../../googleConfig";
import { fetchFriendsWithDetails } from "../../../service/FriendService";
import { addUserToEvent } from "../../../service/UserEventsSupaService";
import 'react-native-get-random-values';
import { useLocalSearchParams } from "expo-router"
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';

const PLACES_MAPS_API_KEY = googleConfig.apiKey;

const AddEvents = () => {
    const [eventName, setEventName] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [eventLocation, setEventLocation] = useState("");
    const [eventDetails, setEventDetails] = useState("");
    const [eventState, setEventState] = useState("Anyone Can Join");
    const [eventPrivacy, setEventPrivacy] = useState("Public");
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [friends] = useState([]);

    const [selectedFriendIds, setSelectedFriendIds] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState([]);

    const router = useRouter();

    const {
        eventName: savedEventName,
        eventDate: savedEventDate,
        eventLocation: savedEventLocation,
        eventDetails: savedEventDetails,
        eventState: savedEventState,
        eventPrivacy: savedEventPrivacy,
        selectedFriends: selectedFriendsParam
    } = useLocalSearchParams();

    useEffect(() => {
        if (savedEventName) setEventName(savedEventName);
        if (savedEventDate) setEventDate(savedEventDate);
        if (savedEventLocation) setEventLocation(savedEventLocation);
        if (savedEventDetails) setEventDetails(savedEventDetails);
        if (savedEventState) setEventState(savedEventState);
        if (savedEventPrivacy) setEventPrivacy(savedEventPrivacy);
    
        if (selectedFriendsParam) {
            const parsedFriends = JSON.parse(selectedFriendsParam);
            setSelectedFriendIds(parsedFriends);
        }
    }, []);

    useEffect(() => {
        const loadSavedEventData = async () => {
            const savedData = await AsyncStorage.getItem("eventData");
            if (savedData) {
                const parsedData = JSON.parse(savedData);
    
                if (parsedData.eventName) setEventName(parsedData.eventName);
                if (parsedData.eventDate) setEventDate(parsedData.eventDate);
                if (parsedData.eventLocation) setEventLocation(parsedData.eventLocation);
                if (parsedData.eventDetails) setEventDetails(parsedData.eventDetails);
                if (parsedData.eventState) setEventState(parsedData.eventState);
                if (parsedData.eventPrivacy) setEventPrivacy(parsedData.eventPrivacy);
                if (parsedData.selectedFriendIds) setSelectedFriendIds(parsedData.selectedFriendIds);
            }
        };
    
        loadSavedEventData();
    }, []);
    

    useEffect(() => {
        if (selectedFriendsParam) {
            const parsedFriends = JSON.parse(selectedFriendsParam);
            setSelectedFriendIds(parsedFriends);
        }
    }, [selectedFriendsParam]);

    useEffect(() => {
        const loadSelectedFriendsDetails = async () => {
            if (selectedFriendIds.length > 0) {
                const auth = getAuth();
                const currentUser = auth.currentUser;
                if (currentUser) {
                    const friendList = await fetchFriendsWithDetails(currentUser.uid);
                    // Ensure proper string comparison
                    const detailedFriends = friendList.filter(friend =>
                        selectedFriendIds.includes(String(friend.userId))
                    );
                    setSelectedFriends(detailedFriends);
                }
            }
        };

        loadSelectedFriendsDetails();
    }, [selectedFriendIds]);

    const handleNavigateToAddMembers = async () => {
        const eventData = {
            eventName,
            eventDate,
            eventLocation,
            eventDetails,
            eventState,
            eventPrivacy,
            selectedFriendIds,
        };
    
        await AsyncStorage.setItem("eventData", JSON.stringify(eventData));
    
        router.push("/Profile/AddMembers");
    };

    const handleConfirmDate = (date) => {
        const formattedDate = date.toISOString().split("T")[0];
        setEventDate(formattedDate);
        setDatePickerVisible(false);
    };

    const toggleFriendSelection = (friendId) => {
        setSelectedFriends((prev) => ({ ...prev, [friendId]: !prev[friendId] }));
    };

    const handleAddEvent = async () => {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        // Check if user is logged in
        if (!currentUser) {
            Alert.alert("Error", "You must be logged in to create an event.");
            return;
        }

        // Validate required fields
        if (!eventName.trim()) {
            Alert.alert("Error", "Event name is required.");
            return;
        }
        if (!eventDate.trim()) {
            Alert.alert("Error", "Event date is required.");
            return;
        }
        if (!eventLocation.trim()) {
            Alert.alert("Error", "Event location is required.");
            return;
        }

        try {
            // Step 1: Add Event to Firestore
            const eventData = {
                name: eventName,
                date: eventDate,
                location: eventLocation,
                state: eventState,
                privacy: eventPrivacy,
                description: eventDetails,
                created_by: currentUser.uid,
                created_at: new Date().toISOString(),
            };

            const eventId = await addEvent(eventData); // Firestore stores the event

            // Step 2: Add users to event in Supabase (User-Event Relationship)
            const allParticipants = [currentUser.uid, ...selectedFriendIds];

            await Promise.all(allParticipants.map(userId => addUserToEvent(userId, eventId)));

            Alert.alert("Success", "Event added successfully!");

            await AsyncStorage.removeItem("eventData");

            // Reset form fields
            setEventName("");
            setEventDate("");
            setEventLocation("");
            setEventDetails("");

            // Redirect to events page
            router.push("/Profile/Events");
        } catch (error) {
            Alert.alert("Error", "Failed to add event.");
            console.error("Error adding event:", error);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <ScrollView className="flex-1 p-5 bg-white" keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 40 }} >
                <View className="flex-1 p-5 bg-white">
                    <View className="w-full bg-white rounded-xl p-5 shadow-md">
                        <Text className="text-lg font-semibold text-orange-600 mb-2">Event Name</Text>
                        <TextInput
                            placeholder="Enter event name"
                            value={eventName}
                            onChangeText={setEventName}
                            className="w-full p-3 border border-orange-300 rounded-lg bg-white text-base text-gray-800"
                        />

                        <Text className="text-lg font-semibold text-orange-600 mt-4">Date</Text>
                        <TouchableOpacity className="w-full p-3 border border-orange-300 rounded-lg bg-orange-100 mt-1 items-center" onPress={() => setDatePickerVisible(true)}>
                            <Text className={eventDate ? "text-base text-gray-800" : "text-base text-gray-500"}>
                                {eventDate || "Select event date"}
                            </Text>
                        </TouchableOpacity>

                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            onConfirm={handleConfirmDate}
                            onCancel={() => setDatePickerVisible(false)}
                        />

                        <Text className="text-lg font-semibold text-orange-600 mt-4">Location</Text>
                        <GooglePlacesAutocomplete
                            placeholder="Search for location"
                            query={{ key: PLACES_MAPS_API_KEY, language: "en" }}
                            onPress={(data, details = null) => setEventLocation(data.description)}
                            fetchDetails={true}
                            styles={{
                                textInput: {
                                    padding: 12,
                                    borderWidth: 1,
                                    borderColor: "#ccc",
                                    borderRadius: 8,
                                    backgroundColor: "white",
                                },
                            }}
                        />

                        {/* Add members Section */}
                        <TouchableOpacity
                            className="bg-orange-500 py-3 rounded-lg mt-4 items-center"
                            onPress={() => router.push({
                                pathname: "/Profile/AddMembers",
                                params: {
                                    eventName,
                                    eventDate,
                                    eventLocation,
                                    eventDetails,
                                    eventState,
                                    eventPrivacy,
                                    selectedFriends: JSON.stringify(selectedFriendIds),
                                },
                            })}>

                        <Text className="text-lg font-bold text-white">Add Members +</Text>
                    </TouchableOpacity>

                    {selectedFriends.length > 0 && (
                        <View className="bg-white p-2 rounded-lg mb-2">
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row flex-wrap max-h-12">
                                {selectedFriends.map((friend) => (
                                    <View key={friend.userId} className="flex-row items-center bg-orange-500 px-3 py-1 rounded-full mr-2 mb-1">
                                        <Text className="text-white text-sm">{friend.username || "Unknown"}</Text>
                                        <TouchableOpacity onPress={() => setSelectedFriends(selectedFriends.filter(f => f.userId !== friend.userId))} className="ml-2">
                                            <MaterialIcons name="close" size={14} color="white" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    {/* Event State */}
                    <View className="mt-4">
                        <Text className="text-lg font-semibold text-orange-600">Event State</Text>
                        <View className="flex-row mt-2">
                            <TouchableOpacity
                                className={flex-1 p-3 rounded-lg items-center ${eventState === "Anyone Can Join" ? "bg-orange-500" : "bg-gray-300"}}
                                onPress={() => setEventState("Anyone Can Join")}
                            >
                                <Text className="text-white text-base">Anyone Can Join</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className={flex-1 p-3 rounded-lg items-center ml-2 ${eventState === "Invite Only" ? "bg-orange-500" : "bg-gray-300"}}
                                onPress={() => setEventState("Invite Only")}
                            >
                                <Text className="text-white text-base">Invite Only</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Privacy Setting Section */}
                    <View className="mt-6">
                        <Text className="text-lg font-semibold text-orange-600">Privacy Setting</Text>
                        <View className="flex-row mt-2">
                            <TouchableOpacity
                                className={flex-1 p-3 rounded-lg items-center ${eventPrivacy === "Public" ? "bg-orange-500" : "bg-gray-300"}}
                                onPress={() => setEventPrivacy("Public")}
                            >
                                <Text className="text-white text-base">Public</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className={flex-1 p-3 rounded-lg items-center ml-2 ${eventPrivacy === "Private" ? "bg-orange-500" : "bg-gray-300"}}
                                onPress={() => setEventPrivacy("Private")}
                            >
                                <Text className="text-white text-base">Private</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Event  Description Section */}
                    <Text className="text-lg font-semibold text-orange-600 mt-4">Event Description</Text>
                    <TextInput
                        placeholder="Describe your event"
                        value={eventDetails}
                        onChangeText={setEventDetails}
                        className="w-full p-3 border border-orange-300 rounded-lg bg-white text-base text-gray-800 h-32"
                        multiline
                    />

                    <TouchableOpacity className="bg-orange-500 py-3 rounded-lg mt-4 items-center mb-5" onPress={handleAddEvent}>
                        <Text className="text-lg font-bold text-white">Add Event</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
        </TouchableWithoutFeedback >
    );
};

export default AddEvents;