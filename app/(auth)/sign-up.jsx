import { ScrollView, Text, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import { Image } from "react-native";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { Link } from "expo-router";
import { FIREBASE_AUTH } from "../../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { KeyboardAvoidingView } from "react-native";

const SignUp = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const auth = FIREBASE_AUTH;
  const signUpWithFirebase = async () => {
    setIsSubmitting(true);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      console.log(response);
      alert("Check your email!");
    } catch (error) {
      console.log(error);
      alert("Registration failed: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-background h-full">
      <KeyboardAvoidingView behavior="padding">
        <ScrollView>
          <View className="w-full justify-center min-h-[85vh] px-4 my-6">
            <View className="flex-row items-center">
              <Image
                source={images.transparent_splash}
                className="w-[80px] h-[80px]"
                resizeMode="contain"
              />

              <Text className="text-4xl text-white">CommonGround</Text>
            </View>
            <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">
              Sign up to CommonGround
            </Text>

            <FormField
              title="Username"
              value={form.username}
              handleChangeText={(e) => setForm({ ...form, username: e })}
              otherStyles="mt-7"
            />

            <FormField
              title="Email"
              value={form.email}
              handleChangeText={(e) => setForm({ ...form, email: e })}
              otherStyles="mt-7"
              keyboardType="email-address"
            />

            <FormField
              title="Password"
              value={form.password}
              handleChangeText={(e) => setForm({ ...form, password: e })}
              otherStyles="mt-7"
            />

            <CustomButton
              title="Sign Up"
              handlePress={() => signUpWithFirebase()}
              containerStyles="mt-7"
              isLoading={isSubmitting}
            />

            <View className="justify-center pt-5 flex-row gap-2">
              <Text className="text-lg text-gray-100 font-pregular">
                Already have an account?
              </Text>
              <Link
                href="/sign-in"
                className="text-lg font-psemibold text-primary"
              >
                Sign in
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;
