import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, TextInput,Dimensions,Platform,StatusBar} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { themeColors } from "../theme";
import { useNavigation } from "@react-navigation/native";
import commonStyle from "../syles/style";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {auth} from '../config/firebase';
import { doc, setDoc, collection, getFirestore } from 'firebase/firestore';


const windowWidth = Dimensions.get('window').width;

export default function SignUpScreen() {
  const navigation = useNavigation();
  const [username,setUserName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  
  
  const handleSumbit = async () => {
    if (email && password) {
      try {
        const isAdmin = username.toLowerCase().trim() === 'yasma7214'; // Assuming case-insensitive comparison

        // Create user in Firebase Authentication
        const authUser = await createUserWithEmailAndPassword(auth, email, password);

        // Set additi  const db = getFirestore();onal user data in Firestore
        
        const db = getFirestore();
        const usersCollection = collection(db, 'users');
        const userRef = doc(usersCollection, authUser.user.uid);

        await setDoc(userRef, {
          username,
          email,
          role: isAdmin ? 'admin' : 'user',
        
        });

      } catch (err) {
        console.log('Error:', err.message);
      }
    }
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
              marginLeft: 10,
              marginTop:10
            }}
          >
            <ArrowLeftIcon size={20} color="black" />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Image
            source={require("../assets/images/signup.png")}
            style={{ width: 165, height: 110 }}
          />
        </View>
      </SafeAreaView>
      <View
        style={{
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
          alignItems:"center",
          alignSelf:'center',
          backgroundColor: "white",
          padding: 8,
          paddingTop: 20,
          width: Platform.OS === 'web' ? 300 : windowWidth - 2, // Full width on mobile
              
                  
           
                  
        }}
      >
        <View style={{ marginBottom: 20, // Full width on mobile
              
            }}>
          <Text style={commonStyle.comText}>Full Name</Text>
          <TextInput
            style={commonStyle.input}
            placeholder="Enter Name"
            value={username}
            onChangeText={value=> setUserName(value)}
          />
          <Text style={commonStyle.comText}>
            Email Address
          </Text>
          <TextInput
             style={commonStyle.input}
            value={email}
            onChangeText={value=> setEmail(value)}
            placeholder="Enter Email"
          />
          <Text style={commonStyle.comText}>Password</Text>
          <TextInput
            style={commonStyle.input}
            secureTextEntry
            value={password}
            onChangeText={value=> setPassword(value)}
            placeholder="Enter Password"
          />
          <TouchableOpacity
            style={{ 
              marginTop:15,
              paddingVertical: 12,
              alignSelf:'center',
              backgroundColor: '#FFD700', // Yellow color
              // marginHorizontal: 16,
              borderRadius: 8,
              width: Platform.OS === 'web' ? 200 : windowWidth - 32, 
         }}
         onPress={handleSumbit}
            
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                textAlign: "center",
                color: "#4B5563",
              }}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
        <Text
          style={{
            fontSize: 15,
            color: "#4B5563",
            fontWeight: "bold",
            textAlign: "center",
            marginTop: 10,
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
            gap:24
          }}
        >
          <TouchableOpacity
              style={commonStyle.socicon}
          >
            <Image
              source={require("../assets/icons/google.png")}
              style={{ width: 30, height: 30 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={commonStyle.socicon}
          >
            <Image
              source={require("../assets/icons/apple.png")}
              style={{ width: 30, height: 30 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
              style={commonStyle.socicon}
          >
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
            marginTop: 40,
          }}
        >
          <Text style={{ color: "#6B7280", fontWeight: "600" }}>
            Already have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={{ fontWeight: "600", color: "#F59E0B" }}> Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
