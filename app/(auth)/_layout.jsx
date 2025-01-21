import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function AuthLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="newUser"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="signIn"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="signUp"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
}
