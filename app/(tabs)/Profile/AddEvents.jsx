import React, { useState } from "react";
import {
    View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Keyboard, TouchableWithoutFeedback
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../../supabaseClient";
import { getAuth } from "firebase/auth";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { googleConfig } from "../../../googleConfig";
import 'react-native-get-random-values';

const PLACES_MAPS_API_KEY = googleConfig;

const AddEvents = () => {
    const [eventName, setEventName] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [eventLocation, setEventLocation] = useState("");
    const [eventDetails, setEventDetails] = useState("");
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const router = useRouter();

    // Handle date selection
    const handleConfirmDate = (date) => {
        const formattedDate = date.toISOString().split("T")[0]; // Format YYYY-MM-DD
        setEventDate(formattedDate);
        setDatePickerVisible(false);
    };

    const handleAddEvent = async () => {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (!currentUser) {
            Alert.alert("Error", "You must be logged in to create an event.");
            return;
        }

        const { error } = await supabase.from("events").insert([
            {
                name: eventName,
                date: eventDate,
                location: eventLocation,
                details: eventDetails,
                created_by: currentUser.uid,
                created_at: new Date().toISOString(),
            },
        ]);

        if (error) {
            Alert.alert("Error", "Failed to add event.");
            console.error("Error adding event:", error);
        } else {
            Alert.alert("Success", "Event added successfully!");
            setEventName("");
            setEventDate("");
            setEventLocation("");
            setEventDetails("");
            router.push("/events");
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>

                <View style={styles.formContainer}>
                    <Text style={styles.label}>Event Name</Text>
                    <TextInput
                        placeholder="Enter event name"
                        value={eventName}
                        onChangeText={setEventName}
                        style={styles.input}
                        placeholderTextColor="#999"
                    />

                    <Text style={styles.label}>Date</Text>
                    <TouchableOpacity style={styles.datePicker} onPress={() => setDatePickerVisible(true)}>
                        <Text style={eventDate ? styles.dateText : styles.placeholderText}>
                            {eventDate || "Select event date"}
                        </Text>
                    </TouchableOpacity>

                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirmDate}
                        onCancel={() => setDatePickerVisible(false)}
                    />

                    <Text style={styles.label}>Location</Text>
                    <GooglePlacesAutocomplete
                        placeholder="Search for location"
                        query={{
                            key: PLACES_MAPS_API_KEY,
                            language: "en",
                        }}
                        listViewDisplayed={true} // Forces dropdown to show
                        styles={{
                            textInput: styles.input,
                            listView: {
                                backgroundColor: "white",
                                zIndex: 1000,
                            },
                            container: {
                                marginBottom: 60, // Add extra spacing here
                            },
                        }}
                    />


                    <Text style={styles.label}>Details</Text>
                    <TextInput
                        placeholder="Describe your event"
                        value={eventDetails}
                        onChangeText={setEventDetails}
                        style={[styles.input, styles.textArea]}
                        multiline
                        placeholderTextColor="#999"
                    />

                    <TouchableOpacity style={styles.button} onPress={handleAddEvent}>
                        <Text style={styles.buttonText}>Add Event</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#FFFFFF",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#E65100",
        marginBottom: 20,
        textAlign: "center",
    },
    formContainer: {
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#EF6C00",
        marginBottom: 8,
    },
    input: {
        width: "100%",
        padding: 12,
        borderWidth: 1,
        borderColor: "#FFCC80",
        borderRadius: 8,
        marginBottom: 16,
        backgroundColor: "#FFFFFF",
        fontSize: 16,
        color: "#333",
    },
    textArea: {
        height: 120,
        textAlignVertical: "top",
    },
    datePicker: {
        width: "100%",
        padding: 12,
        borderWidth: 1,
        borderColor: "#FFCC80",
        borderRadius: 8,
        backgroundColor: "#FFF3E0",
        marginBottom: 16,
        alignItems: "center",
    },
    dateText: {
        fontSize: 16,
        color: "#333",
    },
    placeholderText: {
        fontSize: 16,
        color: "#999",
    },
    button: {
        backgroundColor: "#FF9800",
        paddingVertical: 14,
        borderRadius: 8,
        width: "100%",
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
});

export default AddEvents;