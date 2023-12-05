import {
  View,
  Text,
  Platform,
  Dimensions,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import commonStyle from "../syles/style";
import { signOut } from "firebase/auth";

import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import useAuth from "../hooks/useAuth";
import {
  doc,
  setDoc,
  collection,
  getFirestore,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";

const windowWidth = Dimensions.get("window").width;

export default function Userhome() {
  const handlelogout = async () => {
    await signOut(auth);
  };

  const { user } = useAuth();
  const [role, setRole] = useState(null);
  const [username, setUserName] = useState(" User");

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     if (user) {
  //       const userDocRef = doc(db, "users", user.uid);

  //       try {
  //         const userSnapshot = await getDoc(userDocRef);

  //         if (userSnapshot.exists()) {
  //           const userData = userSnapshot.data();
  //           setRole(userData.role);
  //           setUserName(userData.username);
  //           console.log(username);
  //         } else {
  //           console.log("User data not found.");
  //         }
  //       } catch (error) {
  //         console.error("Error fetching user data:", error.message);
  //       }
  //     }
  //   };

  //   fetchUserData();
  // }, [user]);

  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    // Update the current time every second
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);
  const [showOutputButton, setShowOutputButton] = useState(false);
  const [showInButton, setInOutputButton] = useState(true);

  const handleButtonClick = () => {
    // Toggle the state to show/hide the output button
    // setShowOutputButton(!showOutputButton);
    setShowOutputButton(true);
    setInOutputButton(false);
  };
  const handleoutButtonClick = () => {
    // Toggle the state to show/hide the output button
    // setShowOutputButton(!showOutputButton);
    setInOutputButton(true);
    setShowOutputButton(false);
  };
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar backgroundColor={"white"} barStyle="dark-content" />
      <View style={{ flexDirection: "row" }}>
        <Text style={commonStyle.usetext}>Hii, {username} </Text>
        <Image
          source={require("../assets/images/wave.png")}
          style={{ width: 25, height: 25, marginTop: 20 }}
        />
      </View>
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >
          <Text
            style={{
              alignSelf: "center",
              marginTop: 50,
              fontSize: 35,
              fontWeight: "500",
            }}
          >
            {currentTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
          <Text
            style={{
              alignSelf: "center",
              fontSize: 20,
              fontWeight: "400",
              color: "#757575",
            }}
          >
            {currentTime.toLocaleDateString([], {
              weekday: "long", // 'short', 'long', or 'narrow'

              month: "long",
              day: "numeric",
            })}
          </Text>
          <View>
            {showInButton &&(  
          <TouchableOpacity onPress={handleButtonClick}>
            <LinearGradient
              colors={["#4c669f", "#3b5998", "#192f6a"]}
              style={{
                marginTop: 90,
                paddingVertical: 12,
                marginBottom: 10,

                alignSelf: "center",
                backgroundColor: "#FFD700", // Yellow color
                // marginHorizontal: 16,
                borderRadius: 100,
                width: 175,
                height: 175,
              }}
            >
              <Image
                source={require("../assets/images/tap.png")}
                style={{
                  width: 80,
                  height: 80,
                  marginTop: 22,
                  alignSelf: "center",
                  transform: [{ rotate: "45deg" }],
                }}
              />

              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "#ffffff",
                  alignSelf: "center",
                  marginTop:5,
                  fontWeight:'300'
                }}
              >
                Clock In
              </Text>
            </LinearGradient>
          </TouchableOpacity>
           )}
          {showOutputButton && (
        <TouchableOpacity onPress={handleoutButtonClick}>
           <LinearGradient
              colors={["#C83625","#AA2516", "#711207"]}
              style={{
                marginTop: 90,
                paddingVertical: 12,
                marginBottom: 10,

                alignSelf: "center",
                backgroundColor: "#FFD700", // Yellow color
                // marginHorizontal: 16,
                borderRadius: 100,
                width: 175,
                height: 175,
              }}
            >
              <Image
                source={require("../assets/images/tap.png")}
                style={{
                  width: 80,
                  height: 80,
                  marginTop: 22,
                  alignSelf: "center",
                  transform: [{ rotate: "45deg" }],
                }}
              />

              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "#ffffff",
                  alignSelf: "center",
                  marginTop:5,
                  fontWeight:'300'
                }}
              >
                Clock Out
              </Text>
            </LinearGradient>
        </TouchableOpacity>
      )}
          </View>
          <View style={{
          flex: 1,flexDirection:'row',
          alignItems:'flex-end',
          alignSelf:'center',
        justifyContent:'space-around',
          marginBottom:20
          
          }} >
          <View style={{flex:1,justifyContent:'space-btween',alignItems:'center'}}>
          <Image
          source={require("../assets/images/clockIn.png")}
          style={{ width: 40, height: 40,alignSelf:'center', marginBottom:5 }} />
          <Text style={{fontWeight:'800',alignSelf:'center',fontSize:16}}>9:10 am</Text>
          <Text>Clock In </Text>
           </View>
           <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
          <Image
          source={require("../assets/images/ClockOut.png")}
          style={{ width: 40, height: 40, marginTop: 20, alignSelf:'center',marginBottom:5 }} />
           <Text style={{fontWeight:'800',alignSelf:'center',fontSize:16}}>7:10 pm</Text>
          <Text style={{alignSelf:'center'}}>Clock Out </Text>
           </View>
           <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
          <Image
          source={require("../assets/images/time-left.png")}
          style={{ width: 30, height: 30, marginBottom: 5,alignSelf:'center' }} />
           <Text style={{fontWeight:'800',alignSelf:'center',fontSize:16}}>10:00</Text>
          <Text  style={{}}>Working Hours </Text>
           </View>
        

        </View>
        </View>

        {/* <TouchableOpacity
          onPress={handlelogout}
          style={{
            
            paddingVertical: 12,
            marginBottom: 10,
            alignContent: "space-around",
            alignSelf: "center",
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
              color: "darkblue",
            }}
          >
            Log Out
          </Text>
        </TouchableOpacity> */}
      </SafeAreaView>
    </View>
  );
}
