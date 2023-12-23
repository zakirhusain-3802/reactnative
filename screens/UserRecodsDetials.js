import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  Image,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { supabase } from "../lib/supabase";

import DateTimePickerModal from "react-native-modal-datetime-picker";


import moment from "moment";


const UserRecodsDetials = ({route}) => {
    // console.log("Route",route.params);

  const [userId, setUserId] = useState(null);
  const [sessions, setSession] = useState(null);
  const  userData  = route.params;

  const [isModalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [formateDate,setFormateDate]=useState(null);

  const [isClockInPickerVisible, setClockInPickerVisible] = useState(false);
  const [isClockOutPickerVisible, setClockOutPickerVisible] = useState(false);
  const [selectedClockInTime, setSelectedClockInTime] = useState(null);
  const [selectedClockOutTime, setSelectedClockOutTime] = useState(null);
  const [selectedTotalhours, setSelectedTotalHours] = useState(null);

  const showClockInPicker = () => {
    console.log("Show colockm in picker");

    if (selectedClockInTime === null) {
      if(modalData){
        console.log("In if ....");
      setSelectedClockInTime(new Date(`2000-01-20T${modalData?.in_time}Z`));
      setSelectedClockOutTime(new Date(`2000-01-20T${modalData?.out_time}Z`));
      


     

    }
    
    }

    setClockInPickerVisible(true);
  };

  const hideClockInPicker = () => {
    // selectedClockInTime(selectedTime)
    console.log("In hide Picker",selectedClockInTime.toLocaleTimeString([],{hour12:false,}),"  ",selectedClockOutTime.toLocaleTimeString([],{hour12:false,}));
    const thrs=calculateTimeDifference(selectedClockInTime.toLocaleTimeString([],{hour12:false,}),selectedClockOutTime.toLocaleTimeString([],{hour12:false,}));
    console.log("difff",thrs); 
   setSelectedTotalHours(thrs); 
     
    // setSelectedClockInTime()
    setClockInPickerVisible(false);
 
  };

  const handleClockInConfirm = (date) => {
 
    console.log("date in conform", date);
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
    console.log("In hide Picker",selectedClockInTime.toLocaleTimeString([],{hour12:false,}),"  ",selectedClockOutTime.toLocaleTimeString([],{hour12:false,}));
    const thrs=calculateTimeDifference(selectedClockInTime.toLocaleTimeString([],{hour12:false,}),selectedClockOutTime.toLocaleTimeString([],{hour12:false,}));
    console.log("difff",thrs); setSelectedTotalHours(thrs); 
     
     
     
    setClockOutPickerVisible(false);
  };

  const handleClockOutConfirm = (date) => {
    setSelectedClockOutTime(date); 
    hideClockOutPicker();
    // Handle the selected date as needed (e.g., format it and update the state)
    console.log("date out conform", date.toLocaleTimeString());
    
  };
  
//   setUserId(userData.user_id);
//   console.log("ItemClikc",userData," Id", userData?.item);
  

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Sessnions", session);
      console.log("Auth email:", session.user.email);
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      console.log("AuthChanged:", session);
      // setSession(session);
    });
  }, []);


  // Your component logic here
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [monthDates, setMonthDates] = useState([]);
  const [monthrecords, setMonthReocrds] = useState([]);
  const [totalHours, setTotalHours] = useState(0);

  // useEffect(() => {
  //   // Generate an array of date objects for the specified month and year
  //   const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  //   const monthArray = Array.from({ length: daysInMonth }, (_, index) => {
  //     const dayNumber = index + 1;
  //     console.log('Month Dates:', monthDates);
  //     return {
  //       id: dayNumber.toString(),
  //       date: new Date(currentYear, currentMonth, dayNumber),
  //     };

  //   });

  //   setMonthDates(monthArray);
  // }, [currentYear, currentMonth]);
  useEffect(() => {
    const fetchMonthData = async () => {
      try {
        const daysInMonth = new Date(
          currentYear,
          currentMonth + 1,
          0
        ).getDate();
        console.log("days IN month", daysInMonth);

        console.log(currentYear, currentMonth + 1);
        let { data: emp_attendance, error } = await supabase
          .from("emp_attendance")
          .select("*")
          .eq("user_id",userId )
          .gte(
            "date",
            new Date(`${currentYear}-${currentMonth + 1}-01`)
              .toISOString()
              .substring(0, 10)
          )
          .lte(
            "date",
            new Date(`${currentYear}-${currentMonth + 1}-${daysInMonth}`)
              .toISOString()
              .substring(0, 10)
          ); // Assuming there's a column "user_id" in your table
        // .like("date", `%${currentYear}-${currentMonth + 1}`);
        // let { data: emp_attendance, error } = await supabase
        //   .from("emp_attendance")
        //   .
        if (error) {
          console.error("Error fetching month data:", error.message);
        } else {
          console.log("Total attendace", emp_attendance);

          emp_attendance.sort((a, b) => {
            let dateA = new Date(a.date);
            let dateB = new Date(b.date);

            return dateA - dateB;
          });
          let totalHoursSum = 0;

          // Iterate through the data and accumulate the total hours
          emp_attendance.forEach(item => {
              if (item.total_hrs!==null) {
                  // Assuming the total_hrs is in the format HH:mm:ss
                  let timeComponents = item.total_hrs.split(':');
                  let hours = parseInt(timeComponents[0], 10);
                  let minutes = parseInt(timeComponents[1], 10);
                  let seconds = parseInt(timeComponents[2], 10);
  
                  // Convert total hours to seconds and add to the sum
                  totalHoursSum += hours * 3600 + minutes * 60 + seconds;
              }
          });
          let hours = Math.floor(totalHoursSum / 3600);
          let minutes = Math.floor((totalHoursSum % 3600) / 60);
          let seconds = totalHoursSum % 60;
  
          // Format the result as HH:mm:ss
          const formattedResult = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  
          // Update the state with the formatted result
          setTotalHours(formattedResult);
  
          // Update the state with the total hours sum
          // setTotalHours(totalHoursSum);
          setMonthReocrds(emp_attendance);

          console.log(" MOnth Records", monthrecords);
        }
      } catch (error) {
        console.error("Error fetching month data:", error.message);
      }
    };

    if (userId !== null) {
      fetchMonthData();
    }
    else{
        console.log("UserId",userData?.item.user_id);
        setUserId(userData?.item.user_id);
    }

    const channels = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "emp_attendance" },
        (payload) => {
          console.log("Change received!", payload);

          fetchMonthData();
        }
      )
      .subscribe();

    return () => {
      channels.unsubscribe();
    };
  }, [userId, currentYear, currentMonth]);

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  const calculateTimeDifference = (timeStr1, timeStr2) => {
    // Parse time strings using moment
    console.log("time Diffresce",timeStr1,"   ",timeStr2);
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
  const renderItem = ({ item }) => (
    <View style={styles.dayContainer}>
      <Text>{item.date.getDate()}</Text>
    </View>
  );

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
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, flexDirection: "column" }} >
           
       
        
        <View style={styles.container}>
        <Text style={{alignSelf:"flex-start" ,fontSize:15,fontWeight:'500',color:'midnightblue',  }}>
                {userData?.item.user_info.user_name}'s Details
            </Text>
            <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end'}}>
          <TouchableOpacity onPress={goToPrevMonth}>
            <MaterialCommunityIcons
              name="chevron-left"
              size={25}
              activeColor="gold"
            />
          </TouchableOpacity>
          <Text style={styles.monthYearText}>
            {`${getMonthName(currentMonth)} ${currentYear}`}
          </Text>
          <TouchableOpacity onPress={goToNextMonth}>
            <MaterialCommunityIcons
              name="chevron-right"
              size={25}
              activeColor="gold"
            />
          </TouchableOpacity>
          </View>
        </View>
        {/* <View style={{backgroundColor:'black',height:1,width:'100%'}}>
        </View> */}
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 10,
            paddingVertical: 10,
            justifyContent: "space-evenly",
            alignItems: "center",
            backgroundColor: "#EEF1F6",
          }}
        >
          <Text
            style={{ minWidth: 70, textAlign: "flex-start", fontWeight: "600" }}
          >
            Date{" "}
          </Text>
          <Text
            style={{ minWidth: 70, textAlign: "center", fontWeight: "600" }}
          >
            Clock In{" "}
          </Text>
          <Text
            style={{ minWidth: 70, textAlign: "center", fontWeight: "600" }}
          >
            Clock Out{" "}
          </Text>
          <Text
            style={{ minWidth: 70, textAlign: "center", fontWeight: "600" }}
          >
            Total Hours
          </Text>
        </View>
        {/* <View style={{backgroundColor:'black',height:1,width:'100%'}}>
        </View> */}
        <View style={{ justifyContent: "flex-start" }}>
          <FlatList
            data={monthrecords}
            keyExtractor={(item) => item.uid}
            renderItem={({ item }) => {
              // Input date in string format
              let inputDateStr = item.date;

              // Convert the string to a Date object
              let inputDate = new Date(inputDateStr);

              // Get the month abbreviation and day
              let monthAbbreviation = new Intl.DateTimeFormat("en-US", {
                month: "short",
              }).format(inputDate);
              let dayOfWeek = new Intl.DateTimeFormat("en-US", {
                weekday: "short",
              }).format(inputDate);

              let day = inputDate.getDate();

              // Format the date as "Dec 15"
              let formattedDate = day + " " + dayOfWeek;

              // Log the result
              console.log(formattedDate);

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
                <View style={{ flex: 1, }}>
                  <View
                 onPress={() => toggleModal(item)}
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      paddingHorizontal: 10,
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      paddingVertical: 5,
                    }}
                  >
                    <View></View>
                    <Text
                     onPress={() => toggleModal(item)}
                      style={{
                        // borderBottomWidth:5,
                        paddingRight: 0,
                        minWidth: 80,
                        textAlign: item.date ? "flex-start" : "center",
                        paddingVertical: 5,
                      }}
                    >{` ${item.date ? formattedDate : "-"} `}</Text>
                    <Text
                      style={{
                        minWidth: 80,
                        textAlign: item.in_time ? "flex-start" : "center",
                        paddingVertical: 5,
                      }}
                    >{` ${item.in_time ? time_In : " - "} `}</Text>
                    <Text
                      style={{
                        minWidth: 80,
                        textAlign: item.out_time ? "left" : "center",
                        paddingVertical: 5,
                      }}
                    >{` ${item.out_time ? time_Out : " - "}  `}</Text>
                    <Text
                      style={{
                        minWidth: 80,
                        textAlign: item.total_hrs ? "left" : "center",
                        paddingVertical: 5,
                      }}
                    >{` ${item.total_hrs ? item.total_hrs.toString().substring(0,5) : " - "}  `}</Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: "#cccccc",
                      height: 1,
                      width: "100%",
                    }}
                  ></View>
                </View>
              );
            }}
          />
        </View>
        <View style={{position:'absolute',bottom:0,backgroundColor:"#EEF1F6", width:"100%",paddingVertical:10,flex:1,flexDirection:'row', justifyContent:'flex-end', paddingHorizontal:15}}>
          <Text style={{fontSize:15 ,fontWeight:400}}> Total Working Hours : </Text>
        <Text style={{ fontSize:15,color:'midnightblue', alignSelf:'flex-end', fontWeight:'600'}} >   {totalHours.toString().substring(0,5) } Hr</Text>
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
                <View style={{ display:'flex'  ,flexDirection:'coloumn' ,}}>    
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "500", 
                    color: "midnightblue",
                  }}
                >
                  {userData?.item.user_info.user_name} </Text>

                 <View style={{flexDirection:'row',paddingHorizontal:3   ,justifyContent:'flex-Start' ,alignItems:'center' ,borderWidth:0   }}>  
                 <Image
                  source={require("../assets/images/time-left.png")}
                  style={{
                    width:15,

                    height: 15,
                  
                    alignSelf: "center",
                  }}
                />
                <Text style={{fontSize:14 ,color:'#4b679f' ,fontWeight:'500' }}> {`${selectedTotalhours? selectedTotalhours.toString().substring(0,5 ):   modalData?.total_hrs? modalData?.total_hrs.toString().substring(0,5): 0}`} hrs</Text>
                 </View>
                  
                
                </View>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "500",
                    color: "midnightblue",
                  }}

                  
                >
                  {formateDate ? formateDate: modalData?.date}
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
                            ? selectedClockInTime.toLocaleTimeString([],{
                              hour:"2-digit",
                              minute:"2-digit",
                  

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
                          color:'black',

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
                    setClockInPickerVisible(false);
                    setClockOutPickerVisible(false);
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
                    updatedata(modalData?.id)
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
};
const getMonthName = (monthIndex) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[monthIndex];
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
 
    padding: 10,
    width: "100%",
  },
  monthYearText: {
    fontSize: 17,
    fontWeight: "bold",
    paddingHorizontal: 5,
  },
  dayContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
export default UserRecodsDetials;

//https://hkjhuedmtznwempnlzka.supabase.co url
// api key  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhramh1ZWRtdHpud2VtcG5semthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI1NDE4NTksImV4cCI6MjAxODExNzg1OX0.UvpSAkeg54epY7Wn9a0DMsT1zcm3LY90BVH50jtRn44
