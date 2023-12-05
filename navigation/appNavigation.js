import { View, Text ,Platform} from "react-native";
import React, { useEffect ,useState} from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import AdminScreen from "../screens/admin"; // Import your AdminScreen component
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import UserHome from '../userScreen/UserHome';
import UserMonthly from '../userScreen/UserMonthly';
import useAuth from "../hooks/useAuth";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import  MaterialCommunityIcons  from 'react-native-vector-icons/MaterialCommunityIcons';
const Tab = createBottomTabNavigator();

import {
  doc,
  setDoc,
  collection,
  getFirestore,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  const { user } = useAuth();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);

        try {
          const userSnapshot = await getDoc(userDocRef);

          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            setRole(userData.role);
          } else {
            console.log("User data not found.");
          }
        } catch (error) {
          console.error("Error fetching user data:", error.message);
        }
      }
    };

    fetchUserData();
  }, [user]);

 
  if (user) {
    // Assuming you have a 'role' field in your user data
   

    if (role === "admin") {
      // If the user is an admin, navigate to the AdminScreen
      return (
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Admin"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Admin" component={AdminScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    } else {
      // If the user is not an admin, navigate to the HomeScreen
      return (
        <NavigationContainer>
        <Tab.Navigator   initialRouteName="UserHome"
        activeColor="darkblue"
        inactiveColor="#3e2465"
        labeled ='false'
        
        screenOptions={{
          headerShown:false,
           tabBarStyle :{ backgroundColor: 'white'},
           tabBarLabelStyle :{ fontSize:10,marginBottom:5, activeColor:'gold'},
           tabBarActiveTintColor:'darkblue'
          
        }}
        
  
        
        >
          <Tab.Screen
            name="UserHome"
            component={UserHome}
            options={{
              tabBarIcon: ({focused}) => (
                <View
                  style={{
                    top: Platform.OS === 'ios' ? 10 : 5,
                  }}>
                  <MaterialCommunityIcons
                    name="home"
                    size={25}
                    color={focused ? 'darkblue' : '#9594e8'}
                    activeColor='gold'
                   
                  />
                </View>
              ),
            }}

          />
          <Tab.Screen
            name="UserMontly"
            component={UserMonthly}
            options={{
              tabBarIcon: ({focused}) => (
                <View
                  style={{
                    top: Platform.OS === 'ios' ? 10 : 5,
                    color :'#4B5563'
                  }}>
                  <MaterialCommunityIcons
                    name="calendar-blank-outline"
                    size={25}
                    color={focused ? 'darkblue' : '#9594e5'}
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
