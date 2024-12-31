import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from "react-native";
import React from "react";

const Profile = () => {
  const userData = {
    username: "Arthur",
    userImg: "https://ih1.redbubble.net/image.3234094934.5591/fcp,small,wall_texture,product,750x1000.webp", // Sample image URL
  };

  // Sample upcoming events
  const events = [
    {
      name: "New Year's Eve Party",
      location: "3 Critchon Close",
      date: "2024-12-31",
      details: "Celebrate the New Year with friends and mj!"
    },
    {
      name: "Mahjong session",
      location: "4 Jalan Mas Puteh",
      date: "2024-01-10",
      details: "Win jons money."
    },
    {
      name: "CNY celebrations",
      location: "BT hse",
      date: "2024-01-15",
      details: "Join us to celebrate CNY together."
    },
  ];

  // Sample friends list
  const friends = [
    {
      name: "Brandon",
      profileImg: "https://ih1.redbubble.net/image.3234104650.5841/st,small,507x507-pad,600x600,f8f8f8.jpg",
    },
    {
      name: "Shiru",
      profileImg: "https://ih1.redbubble.net/image.3234104228.5826/bg,f8f8f8-flat,750x,075,f-pad,750x1000,f8f8f8.jpg",
    },
    {
      name: "Jon",
      profileImg: "https://ih1.redbubble.net/image.3226609122.9303/st,large,507x507-pad,600x600,f8f8f8.jpg",
    },
  ];

  // Remove friend function
  const handleRemoveFriend = (friendName) => {
    alert(`${friendName} has been removed from your friends list.`);
  };

  // Chat with friend function
  const handleChatWithFriend = (friendName) => {
    alert(`Starting a chat with ${friendName}.`);
  };

  // View More Button Handlers
  const handleViewMoreEvents = () => {
    alert("Viewing all upcoming events...");
  };

  const handleViewMoreFriends = () => {
    alert("Viewing all friends...");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Picture */}
      <Image 
        source={{ uri: userData.userImg }} 
        style={styles.profilePic} 
      />
      
      {/* Username */}
      <Text style={styles.username}>{userData.username}</Text>

      {/* Upcoming Events Section */}
      <View style={styles.eventsSection}>
        <Text style={styles.eventsHeader}>Upcoming Events</Text>
        <View style={styles.eventsList}>
          {events.slice(0, 3).map((event, index) => (
            <View key={index} style={styles.eventCard}>
              <Text style={styles.eventName}>{event.name}</Text>
              <Text style={styles.eventLocation}>{event.location}</Text>
              <Text style={styles.eventDate}>{event.date}</Text>
              <Text style={styles.eventDetails}>{event.details}</Text>
            </View>
          ))}
        </View>
        {/* View More Button */}
        <TouchableOpacity style={styles.viewMoreBtn} onPress={handleViewMoreEvents}>
          <Text style={styles.viewMoreText}>View More</Text>
        </TouchableOpacity>
      </View>

      {/* Friends Section */}
      <View style={styles.networkSection}>
        <Text style={styles.networkHeader}>Friends</Text>
        <View style={styles.friendsList}>
          {friends.slice(0, 3).map((friend, index) => (
            <View key={index} style={styles.friendCard}>
              <Image 
                source={{ uri: friend.profileImg }} 
                style={styles.friendPic} 
              />
              <Text style={styles.friendName}>{friend.name}</Text>
              <View style={styles.friendActions}>
                <TouchableOpacity 
                  style={styles.friendBtn} 
                  onPress={() => handleChatWithFriend(friend.name)}
                >
                  <Text style={styles.friendBtnText}>Chat</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.friendBtn} 
                  onPress={() => handleRemoveFriend(friend.name)}
                >
                  <Text style={styles.friendBtnText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
        {/* View More Button */}
        <TouchableOpacity style={styles.viewMoreBtn} onPress={handleViewMoreFriends}>
          <Text style={styles.viewMoreText}>View More</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  eventsSection: {
    width: '100%',
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    elevation: 3, 
    shadowColor: '#000', 
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  eventsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  eventsList: {
    maxHeight: 500,
  },
  eventCard: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000', 
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  eventLocation: {
    fontSize: 16,
    color: '#777',
    marginVertical: 5,
  },
  eventDate: {
    fontSize: 16,
    color: '#444',
    marginVertical: 5,
  },
  eventDetails: {
    fontSize: 14,
    color: '#555',
  },
  networkSection: {
    width: '100%',
    marginTop: 30,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  networkHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  friendsList: {
    maxHeight: 3000,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000', 
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  friendPic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  friendName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  friendActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  friendBtn: {
    backgroundColor: '#007BFF',
    padding: 8,
    borderRadius: 5,
    marginLeft: 5,
  },
  friendBtnText: {
    color: '#fff',
    fontSize: 14,
  },
  viewMoreBtn: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewMoreText: {
    color: '#fff',
    fontSize: 16,
  },
});
