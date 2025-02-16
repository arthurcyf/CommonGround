import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { fetchFriendsWithDetails } from "../../../service/FriendService";
import { MaterialIcons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";

const AddMembers = () => {
    const [friends, setFriends] = useState([]);
    const [filteredFriends, setFilteredFriends] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    useEffect(() => {
        const loadFriends = async () => {
            const auth = getAuth();
            const currentUser = auth.currentUser;
            if (currentUser) {
                const friendList = await fetchFriendsWithDetails(currentUser.uid);
                setFriends(friendList || []);
                setFilteredFriends(friendList || []);
                setSelectedFriends(friendList.reduce((acc, friend) => ({ ...acc, [friend.userId]: false }), {}));
            }
        };
        loadFriends();
    }, []);

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.trim() === "") {
            setFilteredFriends(friends);
        } else {
            const filtered = friends.filter(friend =>
                friend.username.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredFriends(filtered);
        }
    };

    const toggleFriendSelection = (friendId) => {
        setSelectedFriends((prev) => ({ ...prev, [friendId]: !prev[friendId] }));
    };

    const removeSelectedFriend = (friendId) => {
        setSelectedFriends((prev) => ({ ...prev, [friendId]: false }));
    };

    const handleConfirmSelection = () => {
        const selectedFriendIds = Object.keys(selectedFriends).filter(id => selectedFriends[id]);
        router.push({
            pathname: "/Profile/AddEvents",
            params: { selectedFriends: JSON.stringify(selectedFriendIds) },
        });
    };

    const selectedFriendList = friends.filter(friend => selectedFriends[friend.userId]);

    return (
        <View className="flex-1 p-5 bg-white">
            <Text className="text-lg font-semibold text-orange-600 mb-2">Select Friends</Text>

            {selectedFriendList.length > 0 && (
                <View className="bg-white p-2 rounded-lg mb-2">
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="flex-row flex-wrap max-h-12"
                    >
                        {selectedFriendList.map((friend) => (
                            <View
                                key={friend.userId}
                                className="flex-row items-center bg-orange-500 px-3 py-1 rounded-full mr-2 mb-1"
                            >
                                <Text className="text-white text-sm">{friend.username}</Text>
                                <TouchableOpacity onPress={() => removeSelectedFriend(friend.userId)} className="ml-2">
                                    <MaterialIcons name="close" size={14} color="white" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            )}

            <TextInput
                placeholder="Search for a friend..."
                value={searchQuery}
                onChangeText={handleSearch}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-base text-gray-800 mb-4"
            />

            <FlatList
                data={filteredFriends}
                keyExtractor={(item) => item.userId}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        className="flex-row items-center p-3 border border-orange-300 rounded-lg bg-white mt-2"
                        onPress={() => toggleFriendSelection(item.userId)}
                    >
                        <MaterialIcons
                            name={selectedFriends[item.userId] ? "check-box" : "check-box-outline-blank"}
                            size={24}
                            color={selectedFriends[item.userId] ? "#F97316" : "#ccc"}
                        />
                        <Text className="text-base text-gray-800 ml-3">{item.username}</Text>
                    </TouchableOpacity>
                )}
                ListFooterComponent={
                    <TouchableOpacity
                        className="bg-orange-500 py-3 rounded-lg mt-4 items-center"
                        onPress={handleConfirmSelection}
                    >
                        <Text className="text-lg font-bold text-white">Confirm Selection</Text>
                    </TouchableOpacity>
                }
                contentContainerStyle={{ paddingBottom: 20 }}
                keyboardShouldPersistTaps="handled"
            />
        </View>
    );
};

export default AddMembers;
