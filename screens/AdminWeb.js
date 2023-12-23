import { View, Text ,Platform,Dimensions,TouchableOpacity,FlatList} from 'react-native'

import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context'
import commonStyle from '../syles/style'
import { supabase } from "../lib/supabase";


const windowWidth = Dimensions.get('window').width;

export default function Admin() {
  const [platform, setPlatform] = useState(null);

  useEffect(() => {
    // Set the platform when the component mounts
    setPlatform(Platform.OS);
  }, []);

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
  
  async function signOut() {
    const { error } = await supabase.auth.signOut();
    console.log(error)
  }
  

  
  return (
    <View  style={{ flex: 1,flexDirection:'row',justifyContent:'center' ,alignItems:'center'}} >
      <SafeAreaView>
      {/* <FlatList
          data={users}
          keyExtractor={(item) => item.uid}
          renderItem={({ item }) => (
            <View>
              <Text>{`Username: ${item.username}, Role: ${item.role}, Email: ${item.email}`}</Text>
            </View>

          )}
        /> */}
        <Text style={commonStyle.input}>Admin Screen</Text>
 <TouchableOpacity
          onPress={signOut}
            style={{
              paddingVertical: 12,
                  backgroundColor: '#FFD700', // Yellow color
                  // marginHorizontal: 16,
                  borderRadius: 8,
                  width: Platform.OS === 'web' ? 200 : windowWidth - 32, 
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
              Web Admin
            </Text>
          </TouchableOpacity>
          </SafeAreaView>

    
    </View>
  )
}