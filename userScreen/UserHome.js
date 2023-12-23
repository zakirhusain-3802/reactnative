import {
  View,
  Text,
  Platform,
  Dimensions,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
} from "react-native";
import React, { useState, useEffect, Fragment } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import commonStyle from "../syles/style";

import * as Location from "expo-location";

import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Geolocation from "react-native-geolocation-service";
import moment from "moment";



import { supabase } from "../lib/supabase";

const windowWidth = Dimensions.get("window").width;

export default function Userhome() {
 


  const [userId, setUserId] = useState(null);
  const [username, setUserName] = useState(" User");
  const [clockIn, setClockIn] = useState("0:00");
  const [ClockOut, setClockOut] = useState("0:00");

  const [clockInTime, setClockInTime] = useState(null);
  const [totalHours, setTotalHours] = useState("0:00");

  const [showAlert, setShowAlert] = useState(false);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [inButtonsDisabled, setInButtonsDisabled] = useState(false);
  const [sessions, setSession] = useState(null);

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
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Sessnions", session);
      console.log("Auth email:", session.user.email);
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      console.log("AuthChanged:", session);
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

        try {
          let { data: d, error } = await supabase
            .from("user_info")
            .select("*")
            .eq("user_email", sessions.user.email);

          console.log("User Home User Data", d);

          if (error) {
            Alert.alert("Error fetching user role:", error.message);
          } else {
            setUserId(d[0].user_id);
            setUserName(d[0].user_name);
            console.log(d[0].user_name);
            console.log(d[0].user_id);
          }
        } catch (error) {
          console.error("Error fetching user role:", error.message);
        }
      }
    };

    if (sessions && userId === null) {
      checkAuth();
    } else {
    }
  }, [sessions]);

  useEffect(() => {
    // Update the current time every second
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);



  useEffect(()=>{
    
    const checkattendace = async ()=>{
      try {
        let { data: emp_attendance, error } = await supabase
          .from("emp_attendance")
          .select("in_time,date,out_time,total_hrs")
          .eq("user_id", userId) // Replace with the actual user ID
          .eq("date", new Date().toISOString().substring(0, 10));

        console.log("Data", emp_attendance);
        if (emp_attendance.length === 0) {

          setInOutputButton(true);
          setShowOutputButton(false);
          setButtonsDisabled(false);
          setClockIn("0:00");
          setClockOut("0:00")
          setTotalHours("0:00")

          
        } else {
          // Alert.alert("You are already  Clockin");
          const time1 = emp_attendance[0].in_time;

          console.log("ClockIn Time", emp_attendance[0].in_time);
          const tmep_in = new Date(`2000-01-01T${time1}Z`);
          console.log("temClockIn", tmep_in.toLocaleTimeString());

          setShowOutputButton(true);
          setInOutputButton(false);
          
          // setButtonsDisabled(true);

          setClockIn(
            tmep_in.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          );

          if (emp_attendance[0].out_time !== null) {
            const time2 = emp_attendance[0].out_time;

            console.log("ClockOut TIme", emp_attendance[0].out_time);
            const tmep_out = new Date(`2000-01-01T${time2}Z`);
            console.log("temClockOut", tmep_out.toLocaleTimeString());
            setButtonsDisabled(true);
            // setShowAlert(false);

            setClockOut(
              tmep_out.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            );
            setTotalHours(emp_attendance[0].total_hrs);
           
          }
        }
      } catch {}


    }
    if(userId!==null){
      checkattendace();
    }

    const channels = supabase
    .channel("custom-all-channel")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "emp_attendance" },
      (payload) => {
        console.log("Change received!", payload);

        checkattendace();
      }
    )
    .subscribe();

  return () => {
    channels.unsubscribe();
  };

    

  },[userId])

  const [showOutputButton, setShowOutputButton] = useState(false);
  const [showInButton, setInOutputButton] = useState(true);

  const handleButtonClick = async () => {
    // Toggle the state to show/hide the output button
    // setShowOutputButton(!showOutputButton);

    if (isInDesiredArea && showInButton) {
   
     
          try {
            const { data, error } = await supabase
              .from("emp_attendance")
              .insert([
                {
                  created_at: new Date().toISOString(),
                  in_time: new Date().toISOString().substring(11, 19),
                  user_id: userId,
                  date: new Date().toISOString().substring(0, 10),
                },
              ]);

            if (error) {
              console.error("Error inserting data:", error.message);
              // Handle the error as needed, e.g., show an alert
              Alert.alert("Error", "Failed to insert attendance data.");
            } else {
              console.log("Data inserted successfully:", data);
              setShowOutputButton(true);
              setInOutputButton(false);
              // setButtonsDisabled(true);
              setClockIn(
                currentTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              );
              setClockInTime(new Date());

              // Handle success, if needed
            }
          } catch (error) {
            console.error("Error inserting data:", error.message);
            // Handle unexpected errors, e.g., show an alert
            Alert.alert("Error", "An unexpected error occurred.");
          }
        
           
    
    } else {
      alert("Your are not in Desider Area");
    }
  };
  const handleoutButtonClick = async () => {
    // Toggle the state to show/hide the output button
    // setShowOutputButton(!showOutputButton);
    // setInOutputButton(true);
    // setShowOutputButton(false);
    try {
      let { data: emp_attendance, error } = await supabase
        .from("emp_attendance")
        .select("in_time,date")
        .eq("user_id", userId) // Replace with the actual user ID
        .eq("date", new Date().toISOString().substring(0, 10));
      console.log(emp_attendance);

      const dates = emp_attendance[0].date;
      console.log("dates", dates);

      const inTimeString = emp_attendance[0].in_time;
      const parsedTime = new Date(inTimeString);
      console.log("paresTime", inTimeString);
      const currentTime = new Date().toISOString().substring(11, 19);
      console.log("Currrentime", currentTime);

      const hoursdiff = calculateTimeDifference(inTimeString, currentTime);
      console.log("hoursfiff", hoursdiff);

      setShowAlert(true);
    } catch {}
  };

  const calculateTimeDifference = (timeStr1, timeStr2) => {
    // Parse time strings using moment
    const startTime = moment(timeStr1, "HH:mm:ss");
    const endTime = moment(timeStr2, "HH:mm:ss");

    // Calculate the duration
    const duration = moment.duration(endTime.diff(startTime));

    // Format the duration
    const hours = Math.floor(duration.asHours());
    const minutes = Math.floor(duration.asMinutes()) % 60;
    const seconds = Math.floor(duration.asSeconds()) % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  const handleConfirmation = async () => {
    try {
      let { data: emp_attendance, error } = await supabase
        .from("emp_attendance")
        .select("in_time")
        .eq("user_id", userId) // Replace with the actual user ID
        .eq("date", new Date().toISOString().substring(0, 10));

      const inTimeString = emp_attendance[0].in_time;
      console.log("paresTime", inTimeString);
      const currentTime1 = new Date().toISOString().substring(11, 19);
      console.log("Currrentime", currentTime1);
      const hoursdiff = calculateTimeDifference(inTimeString, currentTime1);
      console.log("hoursfiffInYes:", hoursdiff);

      // Convert time difference to hours

      // Update total hours
      setTotalHours(hoursdiff);

      if (isInDesiredArea) {
        try {
          const { data, error } = await supabase
            .from("emp_attendance")
            .update({
              out_time: new Date().toISOString().substring(11, 19),
              total_hrs: hoursdiff,
            })
            .eq("user_id", userId) // Replace with the actual user ID
            .eq("date", new Date().toISOString().substring(0, 10)); // Replace with the specific date

          if (error) {
            console.error("Error updating data:", error.message);
            Alert.alert("Error", "Failed to update attendance data.");
          } else {
            console.log("Data updated successfully:", data);
            setButtonsDisabled(true);
            setShowAlert(false);
            setClockOut(
              currentTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            );

            // Update total hours
            // setTotalHours(totalHours + updatedHoursDifference);
          }
        } catch (error) {
          console.error("Error updating data:", error.message);
          Alert.alert("Error", "An unexpected error occurred.");
        }
      } else {
        setShowAlert(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const [userLocation, setUserLocation] = useState(null);
  const [isInDesiredArea, setIsInDesiredArea] = useState(false);

  // geo location code
  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status === "granted") {
          const watcher = await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.High,
              timeInterval: 3000,
              distanceInterval: 1,
            },
            (location) => {
              setUserLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              });

              checkIfInDesiredArea(
                location.coords.latitude,
                location.coords.longitude
              );
            }
          );

          setLocationWatcher(watcher);
        } else {
          console.log("Location permission denied");
        }
      } catch (error) {
        console.log("Error requesting location permission:", error);
      }
    };

    requestLocationPermission();

    // Cleanup locationWatcher when the component is unmounted
    return () => {
      // if (locationWatcher) {
      //   locationWatcher.remove();
      //   console.log(" removed");
      // }
    };
  }, []);

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      console.log(location);

      // Call the function to check if the user is in the desired area
      checkIfInDesiredArea(location.coords.latitude, location.coords.longitude);
    } catch (error) {
      console.log("Error getting location:", error);
    }
  };

  const checkIfInDesiredArea = (latitude, longitude) => {
    //yasma_#7214
    // const desiredAreaLatitude = 16.8551827; // Replace with your desired area coordinates
    // const desiredAreaLongitude = 74.5911111;
    // Your logic to check if the user is in the desired area
    // For example, you might have predefined coordinates for the desired area
    const desiredAreaLatitude = 16.855300; // Replace with your desired area coordinates
    const desiredAreaLongitude = 74.591100;
    const maxDistance = 5;

    // 16.855247776756112, 74.59110887621621

    //16.856805839510443, 74.59205447246742
    //16.855283045638167, 74.59114117670214
    //street
    // 16.855182782949097, 74.59111116454247
    // Calculate the distance between the user's location and the desired area
    const distance = calculateDistance(
      latitude,
      longitude,
      desiredAreaLatitude,
      desiredAreaLongitude
    );

    // Set isInDesiredArea based on your criteria (e.g., distance threshold)
    setIsInDesiredArea(distance < maxDistance); // Assuming 1 unit of distance (adjust as needed)
    // console.log("Deside area", isInDesiredArea);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceInMeters = R * c * 1000;

    return distanceInMeters;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        Alert.alert("Sign-out Error", error.message);
      } else {
        // Sign-out successful
        console.log("User signed out successfully");
        // You may want to navigate to the login screen or update the UI accordingly
      }
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <Fragment>
      {showAlert && (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            zIndex: 2000,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.3)", // Use a semi-transparent background to see if it's centered
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 10,
            }}
          >
            <Text
              style={{ fontSize: 17, fontWeight: "500", paddingHorizontal: 5 }}
            >
              Are you sure you want to Clock Out?
            </Text>
            <TouchableOpacity onPress={handleConfirmation}>
              <Text
                style={{
                  padding: 5,
                  color: "blue",
                  marginTop: 10,
                  alignSelf: "center",
                  fontSize: 17,
                }}
              >
                Yes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowAlert(false)}>
              <Text style={{ color: "red", alignSelf: "center", fontSize: 17 }}>
                No
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <View style={{ flex: 1, backgroundColor: "#EEF1F6" }}>
        <StatusBar backgroundColor={"#EEF1F6"} barStyle="dark-content" />

        <View style={{ flexDirection: "row",borderWidth:0,justifyContent:'space-between' }}>
          <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',marginHorizontal:10,marginTop:10}}>

         
          <Text style={{fontSize:18,fontWeight:'500'}}>Hii, {username} </Text>
          <Image
            source={require("../assets/images/wave.png")}
            style={{ width: 25, height: 25, marginTop: 0 }}
          />
           </View>

          <TouchableOpacity  onPress={handleSignOut}
            style={{ marginRight: 10,flexDirection:'row',justifyContent:'flex-end',alignItems:'center' }}>
              
          <Text
           style={{fontSize:16,color:'midnightblue',fontWeight:'500'}}
          >
            Logout
          </Text>
          <Image
            source={require("../assets/images/logout.png")}
            style={{ width: 15, height: 15, paddingHorizontal:5 ,marginLeft:5}}
          />
          </TouchableOpacity>
          
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
            <Text style={{ alignSelf: "center" }}>
              User Location:{" "}
              {userLocation
                ? `${userLocation.latitude}, ${userLocation.longitude}`
                : "Loading..."}
            </Text>
            <Text style={{ alignSelf: "center" }}>
              {" "}
              In Location: {isInDesiredArea ? "Yes" : "No"}
            </Text>

            <View>
              {showInButton && (
                <TouchableOpacity
                  onPress={handleButtonClick}
                  disabled={inButtonsDisabled}
                >
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
                      opacity: isInDesiredArea ? 1 : 0.5,
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
                        marginTop: 5,
                        fontWeight: "300",
                      }}
                    >
                      Clock In
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
              {showOutputButton && (
                <TouchableOpacity
                  onPress={handleoutButtonClick}
                  disabled={buttonsDisabled}
                >
                  <LinearGradient
                    colors={["#C83625", "#AA2516", "#711207"]}
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
                      opacity: buttonsDisabled ? 0.5 : 1,
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
                        marginTop: 5,
                        fontWeight: "300",
                      }}
                    >
                      Clock Out
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "flex-end",
                alignSelf: "center",
                justifyContent: "space-around",
                marginBottom: 20,
              }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "space-btween",
                  alignItems: "center",
                }}
              >
                <Image
                  source={require("../assets/images/clockIn.png")}
                  style={{
                    width: 40,
                    height: 40,
                    alignSelf: "center",
                    marginBottom: 5,
                  }}
                />
                <Text
                  style={{
                    fontWeight: "800",
                    alignSelf: "center",
                    fontSize: 16,
                  }}
                >
                  {clockIn}
                </Text>
                <Text>Clock In </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={require("../assets/images/ClockOut.png")}
                  style={{
                    width: 40,
                    height: 40,
                    marginTop: 20,
                    alignSelf: "center",
                    marginBottom: 5,
                  }}
                />
                <Text
                  style={{
                    fontWeight: "800",
                    alignSelf: "center",
                    fontSize: 16,
                  }}
                >
                  {ClockOut}
                </Text>
                <Text style={{ alignSelf: "center" }}>Clock Out </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={require("../assets/images/time-left.png")}
                  style={{
                    width: 30,
                    height: 30,
                    marginBottom: 6,
                    alignSelf: "center",
                  }}
                />
                <Text
                  style={{
                    fontWeight: "800",
                    alignSelf: "center",
                    fontSize: 16,
                  }}
                >
                  {totalHours}
                </Text>
                <Text style={{}}>Working Hours </Text>
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
    </Fragment>
  );
}
