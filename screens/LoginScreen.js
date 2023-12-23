import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  StatusBar,
  Dimensions,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { themeColors } from "../theme";
import { useNavigation } from "@react-navigation/native";
import commonStyle from "../syles/style";
import { supabase } from '../lib/supabase'

const windowWidth = Dimensions.get("window").width;

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  async function signInWithEmail() {
    // setLoading(true)
    const { error,data } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })
    console.log(data)
   

    if (error) Alert.alert(error.message)
    // setLoading(false)
  }
  return (
    <View style={{ flex: 1, backgroundColor: themeColors.bg }}>
      <StatusBar backgroundColor={themeColors.bg} barStyle="dark-content" />

      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              backgroundColor: "#FFD700",
              padding: 5,
              borderRadius: 20,
              marginLeft: 15,
              marginTop: 8,
            }}
          >
            <ArrowLeftIcon size={20} color="black" />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Image
            source={require("../assets/images/login.png")}
            style={{ width: 200, height: 200 }}
          />
        </View>
      </SafeAreaView>
      <View
        style={{
          alignItems: "center",
          alignSelf: "center",

          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
          backgroundColor: "white",
          padding: 8,
          paddingTop: 20,

          width: Platform.OS === "web" ? 300 : windowWidth - 2, // Full width on mobile
        }}
      >
        <View style={{ marginBottom: 20 }}>
          <Text style={commonStyle.comText}>Email Address</Text>
          <TextInput
            style={commonStyle.input}
            placeholder="email"
            value={email}
            onChangeText={(value) => setEmail(value)}
          />
          <Text style={commonStyle.comText}>Password</Text>
          <TextInput
            style={commonStyle.input}
            secureTextEntry
            placeholder="password"
            value={password}
            onChangeText={(value) => setPassword(value)}
          />
          <TouchableOpacity style={{ alignSelf: "flex-end", marginRight: 5 }}>
            <Text style={{ color: "#4B5563", marginBottom: 20 }}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={signInWithEmail}
            style={{
              paddingVertical: 12,
              backgroundColor: "#FFD700", // Yellow color
              // marginHorizontal: 16,
              borderRadius: 8,
              width: Platform.OS === "web" ? 200 : windowWidth - 32,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                textAlign: "center",
                color: "#4B5563",
              }}
            >
              Login
            </Text>
          </TouchableOpacity>
        </View>
        <Text
          style={{
            fontSize: 15,
            color: "#4B5563",
            fontWeight: "bold",
            textAlign: "center",
            marginTop: 3,
          }}
        >
          Or
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginHorizontal: 30,
            marginTop: 20,
            gap: 24,
          }}
        >
          <TouchableOpacity style={commonStyle.socicon}>
            <Image
              source={require("../assets/icons/google.png")}
              style={{ width: 30, height: 30 }}
            />
          </TouchableOpacity>
          <TouchableOpacity style={commonStyle.socicon}>
            <Image
              source={require("../assets/icons/apple.png")}
              style={{ width: 30, height: 30 }}
            />
          </TouchableOpacity>
          <TouchableOpacity style={commonStyle.socicon}>
            <Image
              source={require("../assets/icons/facebook.png")}
              style={{ width: 30, height: 30 }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 30,
            marginBottom: 5,
          }}
        >
          <Text style={{ color: "#6B7280", fontWeight: "600" }}>
            Don't have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={{ fontWeight: "600", color: "#F59E0B" }}>
              {" "}
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
