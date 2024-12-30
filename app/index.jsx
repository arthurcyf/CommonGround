import "../gesture-handler";
import { FIREBASE_APP, FIREBASE_AUTH, FIRESTORE_DB } from "../firebaseConfig";

import { View, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { router } from "expo-router";

const App = () => {
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("./(tabs)/home");
      } else {
        router.replace("/(auth)/new-user");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return null;
};

export default App;
