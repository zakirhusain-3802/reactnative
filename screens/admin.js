import {
  View,
  Text,
  Platform,
  Dimensions,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Alert,
  Image,
  Modal,
  TextInput,
} from "react-native";

import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import commonStyle from "../syles/style";
// import DateTimePicker from "@react-native-community/datetimepicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { supabase } from "../lib/supabase";

import { useNavigation } from "@react-navigation/native";
import moment from "moment";

const windowWidth = Dimensions.get("window").width;

export default function Admin() {
  const navigation = useNavigation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dailyrecords, setDailyReocrds] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [formateDate, setFormateDate] = useState(null);

  const [isClockInPickerVisible, setClockInPickerVisible] = useState(false);
  const [isClockOutPickerVisible, setClockOutPickerVisible] = useState(false);
  const [selectedClockInTime, setSelectedClockInTime] = useState(null);
  const [selectedClockOutTime, setSelectedClockOutTime] = useState(null);
  const [selectedTotalhours, setSelectedTotalHours] = useState(null);

  const showClockInPicker = () => {
    console.log("Show colockm in picker");

    if (selectedClockInTime === null) {
      if (modalData) {
        console.log("In if ....");
        setSelectedClockInTime(new Date(`2000-01-20T${modalData?.in_time}Z`));
        setSelectedClockOutTime(new Date(`2000-01-20T${modalData?.out_time}Z`));
      }
    }

    setClockInPickerVisible(true);
  };

  const hideClockInPicker = () => {
    console.log(
      "In hide Picker",
      selectedClockInTime.toLocaleTimeString([], { hour12: false }),
      "  ",
      selectedClockOutTime.toLocaleTimeString([], { hour12: false })
    );
    const thrs = calculateTimeDifference(
      selectedClockInTime.toLocaleTimeString([], { hour12: false }),
      selectedClockOutTime.toLocaleTimeString([], { hour12: false })
    );
    console.log("difff", thrs);
    setSelectedTotalHours(thrs);

    // setSelectedClockInTime()
    setClockInPickerVisible(false);
  };

  const handleClockInConfirm = (date) => {
    console.log("date in conform", date.toLocaleTimeString());
    // Handle the selected date as needed (e.g., format it and update the state)
    setSelectedClockInTime(date);
    hideClockInPicker();
  };

  const showClockOutPicker = () => {
    if (selectedClockOutTime === null) {
      setSelectedClockOutTime(new Date(`2000-01-20T${modalData?.out_time}Z`));
      setSelectedClockInTime(new Date(`2000-01-20T${modalData?.in_time}Z`));
    }

    setClockOutPickerVisible(true);
  };

  const hideClockOutPicker = () => {
    console.log(
      "In hide Picker",
      selectedClockInTime.toLocaleTimeString([], { hour12: false }),
      "  ",
      selectedClockOutTime.toLocaleTimeString([], { hour12: false })
    );
    const thrs = calculateTimeDifference(
      selectedClockInTime.toLocaleTimeString([], { hour12: false }),
      selectedClockOutTime.toLocaleTimeString([], { hour12: false })
    );
    console.log("difff", thrs);
    setSelectedTotalHours(thrs);

    setClockOutPickerVisible(false);
  };

  const handleClockOutConfirm = (date) => {
    setSelectedClockOutTime(date);
    hideClockOutPicker();
    // Handle the selected date as needed (e.g., format it and update the state)
    console.log("date out conform", date.toLocaleTimeString());
  };

  useEffect(() => {
    // Update the current time every second
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);
  useEffect(() => {
    console.log("daliy", dailyrecords.length);
    const checkattendace = async () => {
      try {
        let { data: emp_attendance, error } = await supabase
          .from("emp_attendance")
          .select("*,user_info(user_id,user_name)") // Replace with the actual user ID
          .eq("date", new Date().toISOString().substring(0, 10));

        console.log("Data admin", emp_attendance);
        if (error) {
          console.error("Error fetching data:", error.message);
        } else {
          setDailyReocrds(emp_attendance);
        }
      } catch (error) {
        Alert.alert(error);
      }
    };
    if (dailyrecords.length === 0) {
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
  }, []);

  const handleItemClick = (item) => {
    console.log("Items", item);
    // Navigate to a different screen with the selected item data
    navigation.navigate("Records", { item });
  };

  // const handlelogout = async()=>{
  //   await signOut(auth);}
  //   const [users, setUsers] = useState([]);
  //   useEffect(() => {
  //     const fetchAllUsers = () => {
  //       const usersCollection = collection(db, 'users');

  //       const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
  //         const usersData = [];
  //         snapshot.forEach((userDoc) => {
  //           const userData = userDoc.data();
  //           usersData.push(userData);
  //         });

  //         setUsers(usersData);
  //         console.log('All Users:', usersData);
  //       });

  //       return () => {
  //         // Unsubscribe from the snapshot listener when the component unmounts
  //         unsubscribe();
  //       };
  //     };

  //     fetchAllUsers();
  //   }, []);

  // useEffect(() => {
  //   const fetchAllUsers = async () => {
  //     const usersCollection = collection(db, 'users');

  //     try {
  //       const usersSnapshot = await getDocs(usersCollection);

  //       const usersData = [];
  //       usersSnapshot.forEach((userDoc) => {
  //         const userData = userDoc.data();
  //         usersData.push(userData);
  //       });

  //       setUsers(usersData);
  //       console.log('All Users:', usersData);
  //     } catch (error) {
  //       console.error('Error fetching users data:', error.message);
  //     }
  //   };

  //   fetchAllUsers();
  // }, []);
  const calculateTimeDifference = (timeStr1, timeStr2) => {
    // Parse time strings using moment
    console.log("time Diffresce", timeStr1, "   ", timeStr2);
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

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    console.log(error);
  }

  useEffect(() => {
    console.log(" in Modal Use Effect");

    if (modalData !== null) {
      setModalVisible(!isModalVisible);
      console.log("Modal data", modalData);
      let inputDateStr = modalData.date;

      // Convert the string to a Date object
      let inputDate = new Date(inputDateStr);

      console.log(inputDate.toLocaleDateString());

      // Get the month abbreviation and day
      let monthAbbreviation = new Intl.DateTimeFormat("en-US", {
        month: "short",
      }).format(inputDate);
      let dayOfWeek = new Intl.DateTimeFormat("en-US", {
        weekday: "short",
      }).format(inputDate);

      let day = inputDate.getDate();

      // Format the date as "Dec 15"
      let formattedDate = day + " " + monthAbbreviation;
      setFormateDate(inputDate.toLocaleDateString());

      //
    }
  }, [modalData]);

  const toggleModal = async (item) => {
    // console.log("Click on Modal")

    setModalData(item);
  };

  const updatedata = async (upId) => {

    if(selectedClockInTime && selectedClockOutTime){

   

    const upIn_time=selectedClockInTime.toISOString().substring(11,19);
    const upOut_time=selectedClockOutTime.toISOString().substring(11,19);
    const upTotal_hrs=selectedTotalhours;

    try{
      const { data, error } = await supabase
      .from("emp_attendance")
      .update({ in_time: upIn_time,out_time:upOut_time,total_hrs:upTotal_hrs })
      .eq("id", upId)
      .select();
      if (error) {
        console.error('Error updating record:', error);
      } else {
        console.log('Record updated successfully:', data);
        setSelectedClockInTime(null);
        setSelectedClockOutTime(null);
        setSelectedTotalHours(null);
      }

      }catch (error) {
        console.error('Error updating record:', error.message);
      }
     



    console.log(upId,"  ",selectedClockInTime.toLocaleTimeString()," ",selectedClockOutTime," ",selectedTotalhours);}
    else{
     console.log(" Data not changed");
    }
     


    // 
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#EEF1F6" }}>
      <StatusBar backgroundColor={"white"} barStyle="dark-content" />

      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, flexDirection: "column" }}>
          <Text
            onPress={signOut}
            style={{
              alignSelf: "flex-end",
              padding: 10,
              fontSize: 15,
              color: "midnightblue",
              fontWeight: "600",
            }}
          >
            {" "}
            Logout
          </Text>
          <View
            style={{
              // borderWidth:2,
              paddingBottom: 20,
            }}
          >
            <Text
              style={{
                alignSelf: "center",
                marginTop: 30,
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
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1, flexDirection: "row", marginTop: 10 }}>
              <Text
                style={{
                  fontWeight: "800",
                  alignSelf: "flex-start",
                  fontSize: 16,
                  color: "midnightblue",
                  paddingHorizontal: 10,
                  paddingTop: 5,
                }}
              >
                Today's Attendace
              </Text>
              <Image
                source={require("../assets/images/atendacnce.png")}
                style={{
                  width: 30,
                  height: 30,
                  alignSelf: "flex-start",
                  marginBottom: 5,
                }}
              />
            </View>
          </View>
          <View style={{ flex: 1, borderWidth: 0, marginTop: 15 }}>
            <FlatList
              data={dailyrecords}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => {
                const tin = item.in_time;
                const tout = item.out_time;
                const tmep_in = new Date(`2000-01-01T${tin}Z`);
                const tmep_out = new Date(`2000-01-01T${tout}Z`);
                const time_In = tmep_in.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const time_Out = tmep_out.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <View
                    style={{
                      flex: 1,
                      // alignSelf: "flex-start",
                      // justifyContent: "flex-start",
                      backgroundColor: "white",
                      borderCurve: 200,
                      marginHorizontal: 10,
                      borderRadius: 10,
                      marginVertical: 5,

                      // borderWidth:5,
                    }}
                  >
                    <View
                      style={{
                        // alignSelf: "flex-start",
                        flex: 1,
                        // flexDirection: "row",
                        paddingHorizontal: 10,

                        // alignItems: "flex-start",
                        // justifyContent: "flex-start",
                        paddingVertical: 5,
                      }}
                    >
                      <View></View>
                      {/* <Text
                      style={{
                        // borderBottomWidth:5,
                        paddingRight: 0,
                        alignSelf: "center",
                        // textAlign: item.date ? "flex-start" : "center",
                        paddingVertical: 5,
                      }}
                    >{` ${item.date ? index + 1 : "-"} `}</Text> */}
                      <View
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text
                            onPress={() => handleItemClick(item)}
                            style={{
                              // borderBottomWidth:5,
                              paddingLeft: 10,
                              minWidth: 80,
                              fontSize: 18,
                              alignSelf: "center",
                              fontWeight: "500",
                              // textAlign: item.date ? "flex-start" : "center",
                              paddingVertical: 5,
                            }}
                          >{` ${
                            item.date ? item.user_info.user_name : "-"
                          } `}</Text>
                          <Text
                            style={{
                              minWidth: 80,
                              fontSize: 17,
                              alignSelf: "flex-end",
                              fontWeight: "500",
                              // textAlign: item.total_hrs ? "left" : "center",
                              paddingVertical: 5,
                            }}
                          >{` ${
                            item.total_hrs
                              ? item.total_hrs.toString().substring(0, 5)
                              : " - "
                          } hrs `}</Text>
                        </View>

                        <View style={{ paddingLeft: 10 }}>
                          <View
                            style={{
                              flexDirection: "row",
                              paddingTop: 5,
                              // borderWidth: 5,
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <MaterialCommunityIcons
                                name="arrow-bottom-left"
                                size={25}
                                color="black"
                              />
                              <Text
                                onPress={() => toggleModal(item)}
                                style={{
                                  minWidth: 80,
                                  fontSize: 16,
                                  fontWeight: "500",
                                  // textAlign: item.in_time ? "flex-start" : "center",
                                  // paddingVertical: 5,
                                }}
                              >{` ${item.in_time ? time_In : " - "} `}</Text>
                            </View>

                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                paddingHorizontal: 20,
                              }}
                            >
                              <MaterialCommunityIcons
                                name="arrow-top-right"
                                size={25}
                                color="black"
                              />
                              <Text
                                style={{
                                  minWidth: 80,
                                  fontSize: 16,
                                  fontWeight: "500",
                                  // textAlign: item.out_time ? "left" : "center",
                                  // paddingVertical: 5,
                                }}
                              >{` ${item.out_time ? time_Out : " - "}  `}</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                    {/* <View
                    style={{
                      backgroundColor: "#cccccc",
                      height: 1,
                      width: "100%",
                    }}
                  ></View> */}
                  </View>
                );
              }}
            />
          </View>
        </View>
        <Modal
          transparent={true}
          visible={isModalVisible}
          animationType="slide"
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              // alignItems: "center",
              backgroundColor: "#00000088",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                paddingHorizontal: 20,
                borderRadius: 10,
                paddingVertical: 10,
                marginHorizontal: 20,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ display: "flex", flexDirection: "coloumn" }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "500",
                      color: "midnightblue",
                    }}
                  >
                    {modalData?.user_info.user_name}{" "}
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      paddingHorizontal: 3,
                      justifyContent: "flex-Start",
                      alignItems: "center",
                      borderWidth: 0,
                    }}
                  >
                    <Image
                      source={require("../assets/images/time-left.png")}
                      style={{
                        width: 15,

                        height: 15,

                        alignSelf: "center",
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#4b679f",
                        fontWeight: "500",
                      }}
                    >
                      {" "}
                      {`${
                        selectedTotalhours
                          ? selectedTotalhours.toString().substring(0, 5)
                          : modalData?.total_hrs.substring(0, 5)
                      }`}{" "}
                      hrs
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "500",
                    color: "midnightblue",
                  }}
                >
                  {formateDate ? formateDate : modalData?.date}
                </Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <View>
                  <Text
                    style={{
                      marginHorizontal: 12,
                      marginTop: 12,
                      fontSize: 12,
                    }}
                  >
                    Clock In{" "}
                  </Text>

                  <View
                    style={{
                      height: 35,
                      flexDirection: "row",
                      marginHorizontal: 12,
                      marginTop: 3,
                      borderWidth: 1,
                      paddingHorizontal: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity
                      onPress={showClockInPicker}
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextInput
                        editable={false}
                        style={{
                          // outlineStyle: "none",
                          paddingRight: 10,
                          minWidth: 80,
                          color: "black",
                        }}
                        // onChangeText={onChangeText}

                        value={
                          selectedClockInTime
                            ? selectedClockInTime.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : new Date(
                                `2000-01-20T${modalData?.in_time}Z`
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                        }
                      />

                      <MaterialCommunityIcons
                        name="clock-outline"
                        size={20}
                        color="black"
                      />
                    </TouchableOpacity>
                    {isClockInPickerVisible && (
                      <DateTimePickerModal
                        isVisible={isClockInPickerVisible}
                        mode="time"
                        date={selectedClockInTime}
                        onConfirm={handleClockInConfirm}
                        onCancel={hideClockInPicker}
                      />
                    )}
                  </View>
                </View>
                <View>
                  <Text
                    style={{
                      marginHorizontal: 12,
                      marginTop: 12,
                      fontSize: 12,
                    }}
                  >
                    Clock Out{" "}
                  </Text>
                  <View
                    style={{
                      height: 35,
                      flexDirection: "row",
                      marginHorizontal: 12,
                      marginTop: 3,
                      borderWidth: 1,
                      paddingHorizontal: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity
                      onPress={showClockOutPicker}
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextInput
                        editable={false}
                        style={{
                          // outlineStyle: "none",
                          paddingRight: 10,
                          minWidth: 80,
                          color: "black",
                        }}
                        // onChangeText={onChangeText}
                        value={
                          selectedClockOutTime
                            ? selectedClockOutTime.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : new Date(
                                `2000-01-20T${modalData?.out_time}Z`
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                        }
                      />
                      <MaterialCommunityIcons
                        name="clock-outline"
                        size={20}
                        color="black"
                      />
                    </TouchableOpacity>
                    {isClockOutPickerVisible && (
                      <DateTimePickerModal
                        isVisible={isClockOutPickerVisible}
                        mode="time"
                        date={selectedClockOutTime}
                        onConfirm={handleClockOutConfirm}
                        onCancel={hideClockOutPicker}
                      />
                    )}
                  </View>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  paddingHorizontal: 20,
                  marginTop: 20,
                  marginBottom: 5,
                }}
              >
                <TouchableOpacity
                  style={{
                    marginHorizontal: 20,
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    borderWidth: 1,
                    borderColor: "#aaa",
                    borderRadius: 5,
                    backgroundColor: "white",
                  }}
                  onPress={() => {
                    setClockOutPickerVisible(false);
                    setClockInPickerVisible(false);
                    setSelectedClockInTime(null);
                    setSelectedClockOutTime(null);
                    setSelectedTotalHours(null);
                    setModalVisible(false);
                    setModalData(null);
                  }}
                >
                  <Text
                    style={{
                      color: "black",
                      fontSize: 12,
                      marginHorizontal: 2,
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    updatedata(modalData?.id);
                    setModalVisible(false);
                    setModalData(null);
                  }}
                  style={{
                    backgroundColor: "#192f6a",
                    paddingHorizontal: 10,
                    borderRadius: 5,
                    paddingVertical: 5,
                  }}
                >
                  <Text style={{ color: "white", fontSize: 12 }}>Update</Text>
                </TouchableOpacity>
              </View>

              {/* Button to close the modal */}
              {/* <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setModalData(null);
                }}
              >
                <Text>Cancel</Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}
