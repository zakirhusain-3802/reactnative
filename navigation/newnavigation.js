import { View, Text, Platform, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import AdminScreen from "../screens/admin";
import AdminWeb from "../screens/AdminWeb";
import UserRecords from "../screens/UserRecodsDetials"
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import UserHome from "../userScreen/UserHome";
import UserMonthly from "../userScreen/UserMonthly";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { supabase } from "../lib/supabase"; // Import your Supabase client
import darkColors from "react-native-elements/dist/config/colorsDark";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  const [role, setRole] = useState(null);
  const [users, setUser] = useState(false);
  const [sessions, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Sessnions", session);
      console.log("Auth email:", session.user.email);
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      console.log("AuthChanged:",session)
      setSession(session);
    });
  }, []);

  useEffect(() => {
    // Check if the user is already logged in
    const checkAuth = async () => {
      console.log("In check auth:", sessions);
      if (sessions) {
        // User is logged in, fetch additional information if needed
        // For example, fetch user role from the database

        setUser(true);
        try {
          let { data: d, error } = await supabase
            .from("user_info")
            .select("*")
            .eq("user_email", sessions.user.email);

          console.log(d);

          if (error) {
            Alert.alert("Error fetching user role:", error.message);
          } else {
            setRole(d[0].role);
            console.log(d[0].role);
          }
        } catch (error) {
          console.error("Error fetching user role:", error.message);
        }
      }
      
    };

    if (sessions) {
      checkAuth();
    }
    else{
      setUser(false);
    }
  }, [sessions]);

  if (users && role!==null) {
    if (role === "admin") {
      if(Platform.OS==='web'){
        console.log("heelo Web  admin");
        // If the user is an admin, navigate to the AdminScreen
        return (
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="AdminWeb"
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen name="AdminWeb" component={AdminScreen} />
              <Stack.Screen name="Records" component={UserRecords}/>
            </Stack.Navigator>
          </NavigationContainer>
        );

      }
      else{
        console.log("heelo admin");
        // If the user is an admin, navigate to the AdminScreen
        return (
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Admin"
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen name="Admin" component={AdminScreen}/>
                <Stack.Screen name="Records" component={UserRecords}/> 
            </Stack.Navigator>
          </NavigationContainer>
        );
      }
     
    } else {
      // If the user is not an admin, navigate to the HomeScreen
      return (
        <NavigationContainer>
          <Tab.Navigator
            initialRouteName="UserHome"
            activeColor="darkblue"
            inactiveColor="#3e2465"
            labeled="false"
            screenOptions={{
              headerShown: false,
              tabBarStyle: { backgroundColor: "white" },
              tabBarLabelStyle: {
                fontSize: 10,
                marginBottom: 5,
                // activeColor: "gold",
              },
              tabBarActiveTintColor: "darkblue",
            }}
          >
            <Tab.Screen
              name="UserHome"
              component={UserHome}
              options={{
                tabBarIcon: ({ focused }) => (
                  <View
                    style={{
                      top: Platform.OS === "ios" ? 10 : 5,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="home"
                      size={25}
                      color={focused ? "darkblue" : "#9594e8"}
                      // activeColor="gold"
                    />
                  </View>
                ),
              }}
            />
            <Tab.Screen
              name="UserMontly"
              component={UserMonthly}
              options={{
                tabBarIcon: ({ focused }) => (
                  <View
                    style={{
                      top: Platform.OS === "ios" ? 10 : 5,
                      color: "#4B5563",
                    }}
                  >
                    <MaterialCommunityIcons
                      name="calendar-blank-outline"
                      size={25}
                      color={focused ? "darkblue" : "#9594e5"}
                    />
                  </View>
                ),
              }}
            />
          </Tab.Navigator>

        </NavigationContainer>
      );
    }
  } else {
    // Return the JSX for the non-logged-in state
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
