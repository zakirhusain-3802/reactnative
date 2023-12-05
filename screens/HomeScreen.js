import { View, Text ,Platform,Dimensions,TouchableOpacity} from 'react-native'
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import commonStyle from '../syles/style'
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import UserHome from '../userScreen/UserHome';
import useAuth from "../hooks/useAuth";
const Stack = createNativeStackNavigator();

import {
  doc,
  setDoc,
  collection,
  getFirestore,
  getDocs,
  getDoc,
} from "firebase/firestore";

const windowWidth = Dimensions.get('window').width;

export default function HomeScreen() {

 
  const handlelogout = async()=>{
    await signOut(auth);
  }
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="UserHome"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="UserHome" component={UserHome} />
       
      </Stack.Navigator>
    </NavigationContainer>
  );
}