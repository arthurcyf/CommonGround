import { Stack } from "expo-router";

export default function StackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="chatMenu" />
      <Stack.Screen
        name="findUser"
        options={{ tabBarStyle: { display: "none" } }}
      />
      <Stack.Screen
        name="chatRoom"
        options={{ tabBarStyle: { display: "none" } }}
      />
      <Stack.Screen
        name="pendingFriendRequests"
        options={{ tabBarStyle: { display: "none" } }}
      />
    </Stack>
  );
}
