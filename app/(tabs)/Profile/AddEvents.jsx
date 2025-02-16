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

const PLACES_MAPS_API_KEY = googleConfig.apiKey;

const AddEvents = () => {
    const [eventName, setEventName] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [eventLocation, setEventLocation] = useState("");
    const [eventDetails, setEventDetails] = useState("");
    const [eventState, setEventState] = useState("Anyone Can Join");
    const [eventPrivacy, setEventPrivacy] = useState("Public");
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [friends, setFriends] = useState([]);
    const { selectedFriends: selectedFriendsParam } = useLocalSearchParams();
    const [selectedFriends, setSelectedFriends] = useState([]);

    const router = useRouter();

    useEffect(() => {
        if (selectedFriendsParam) {
            setSelectedFriends(JSON.parse(selectedFriendsParam));
        }
    }, [selectedFriendsParam]);

    useEffect(() => {
        const loadFriends = async () => {
            const auth = getAuth();
            const currentUser = auth.currentUser;
            if (currentUser) {
                const friendList = await fetchFriendsWithDetails(currentUser.uid);
                setFriends(friendList || []);
                setSelectedFriends(friendList.reduce((acc, friend) => ({ ...acc, [friend.userId]: false }), {}));
            }
        };
        loadFriends();
    }, []);

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

        if (!currentUser) {
            Alert.alert("Error", "You must be logged in to create an event.");
            return;
        }

        const { data, error } = await supabase.from("events").insert([
            {
                name: eventName,
                date: eventDate,
                location: eventLocation,
                details: eventDetails,
                state: eventState,
                created_by: currentUser.uid,
                created_at: new Date().toISOString(),
            },
        ]).select();

        if (error || !data.length) {
            Alert.alert("Error", "Failed to add event.");
            console.error("Error adding event:", error);
        } else {
            const eventId = data[0].id;
            const selectedFriendIds = Object.keys(selectedFriends).filter(id => selectedFriends[id]);

            // Add selected friends to the event
            await Promise.all(
                selectedFriendIds.map(friendId => addUserToEvent(friendId, eventId))
            );      

            Alert.alert("Success", "Event added successfully!");
            setEventName("");
            setEventDate("");
            setEventLocation("");
            setEventDetails("");
            setSelectedFriends(friends.reduce((acc, friend) => ({ ...acc, [friend.userId]: false }), {}));
            router.push("/events");
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <ScrollView className="flex-1 p-5 bg-white" keyboardShouldPersistTaps="handled">
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
                            onPress={() => router.push("/Profile/AddMembers")}
                        >
                            <Text className="text-lg font-bold text-white">Add Members +</Text>
                        </TouchableOpacity>

                        {selectedFriends.length > 0 && (
                            <View className="bg-white p-2 rounded-lg mb-2">
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row flex-wrap max-h-12">
                                    {selectedFriends.map((friendId) => (
                                        <View key={friendId} className="flex-row items-center bg-orange-500 px-3 py-1 rounded-full mr-2 mb-1">
                                            <Text className="text-white text-sm">{friendId}</Text>
                                            <TouchableOpacity onPress={() => setSelectedFriends(selectedFriends.filter(id => id !== friendId))} className="ml-2">
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
                                    className={`flex-1 p-3 rounded-lg items-center ${eventState === "Anyone Can Join" ? "bg-orange-500" : "bg-gray-300"}`}
                                    onPress={() => setEventState("Anyone Can Join")}
                                >
                                    <Text className="text-white text-base">Anyone Can Join</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className={`flex-1 p-3 rounded-lg items-center ml-2 ${eventState === "Invite Only" ? "bg-orange-500" : "bg-gray-300"}`}
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
                                    className={`flex-1 p-3 rounded-lg items-center ${eventPrivacy === "Public" ? "bg-orange-500" : "bg-gray-300"}`}
                                    onPress={() => setEventPrivacy("Public")}
                                >
                                    <Text className="text-white text-base">Public</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className={`flex-1 p-3 rounded-lg items-center ml-2 ${eventPrivacy === "Private" ? "bg-orange-500" : "bg-gray-300"}`}
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

                        <TouchableOpacity className="bg-orange-500 py-3 rounded-lg mt-4 items-center" onPress={handleAddEvent}>
                            <Text className="text-lg font-bold text-white">Add Event</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </TouchableWithoutFeedback>
    );
};

export default AddEvents;