import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  StatusBar,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { supabase } from "../lib/supabase";

const UserMontly = () => {
  const [userId, setUserId] = useState(null);
  const [sessions, setSession] = useState(null);

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

  useEffect(() => {
    // Check if the user is already logged in
    const checkAuth = async () => {
      console.log("In check auth:", sessions);
      if (sessions) {
        // User is logged in, fetch additional information if needed
        // For example, fetch user role from the database

        // setUser(true);
        try {
          let { data: d, error } = await supabase
            .from("user_info")
            .select("*")
            .eq("user_email", sessions.user.email);

          console.log(d);

          if (error) {
            Alert.alert("Error fetching user role:", error.message);
          } else {
            setUserId(d[0].user_id);
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
      // setUser(false);
    }
  }, [sessions]);

  // Your component logic here
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [monthDates, setMonthDates] = useState([]);
  const [monthrecords, setMonthReocrds] = useState([]);
  const [totalHours, setTotalHours] = useState(0);
  const [isData,setIsData]=useState(false);

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
          .eq("user_id", userId)
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

          console.log(" MOnth Records", emp_attendance.length);

          if(emp_attendance.length===0){
            setIsData(false);
          }
          else{
            setIsData(true);
          }
        }
      } catch (error) {
        console.error("Error fetching month data:", error.message);
      }
    };

    if (userId !== null) {
      fetchMonthData();
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
  const renderItem = ({ item }) => (
    <View style={styles.dayContainer}>
      <Text>{item.date.getDate()}</Text>
    </View>
  );
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
         <StatusBar backgroundColor={"white"} barStyle="dark-content" />

      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <TouchableOpacity onPress={goToPrevMonth}>
            <MaterialCommunityIcons
              name="chevron-left"
              size={25}
              // activeColor="gold"
            />
          </TouchableOpacity>
          <Text style={styles.monthYearText}>
            {`${getMonthName(currentMonth)} ${currentYear}`}
          </Text>
          <TouchableOpacity onPress={goToNextMonth}>
            <MaterialCommunityIcons
              name="chevron-right"
              size={25}
              // activeColor="gold"
            />
          </TouchableOpacity>
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
            style={{ minWidth: 70, textAlign: "left", fontWeight: "600" }}
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
          {isData && 
          <FlatList
            data={monthrecords}
            keyExtractor={(item) => item.id}
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
                      style={{
                        // borderBottomWidth:5,
                        paddingRight: 0,
                        minWidth: 80,
                        textAlign: item.date ? "left" : "center",
                        paddingVertical: 5,
                      }}
                    >{` ${item.date ? formattedDate : "-"} `}</Text>
                    <Text
                      style={{
                        minWidth: 80,
                        textAlign: item.in_time ? "left" : "center",
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
          />}

          {
            !isData && 
             <Image
            source={require("../assets/nodata.png")}
            style={{ marginTop: 100,alignSelf:'center',height:200,width:250 }}
          />
           
          }
          
        </View>
        
        <View style={{position:'absolute',bottom:0,backgroundColor:"#EEF1F6", width:"100%",paddingVertical:10,flex:1,flexDirection:'row', justifyContent:'flex-end', paddingHorizontal:15}}>
          <Text style={{fontSize:15 ,fontWeight:400}}> Total Working Hours : </Text>
        <Text style={{ fontSize:15,color:'midnightblue', alignSelf:'flex-end', fontWeight:'600'}} >   {totalHours.toString().substring(0,5) } Hr</Text>
        </View>

       
       
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
    alignItems: "flex-start",
    justifyContent: "flex-end",

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
export default UserMontly;

//https://hkjhuedmtznwempnlzka.supabase.co url
// api key  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhramh1ZWRtdHpud2VtcG5semthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI1NDE4NTksImV4cCI6MjAxODExNzg1OX0.UvpSAkeg54epY7Wn9a0DMsT1zcm3LY90BVH50jtRn44
