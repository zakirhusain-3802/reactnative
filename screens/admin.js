import { View, Text ,Platform,Dimensions,TouchableOpacity,FlatList} from 'react-native'

import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context'
import commonStyle from '../syles/style'
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import {  db } from '../config/firebase';
import {
  doc,
  setDoc,
  collection,
  getFirestore,
  getDocs,
  getDoc,
} from "firebase/firestore";


const windowWidth = Dimensions.get('window').width;

export default function admin() {

  const handlelogout = async()=>{
    await signOut(auth);}
    const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      const usersCollection = collection(db, 'users');

      try {
        const usersSnapshot = await getDocs(usersCollection);

        const usersData = [];
        usersSnapshot.forEach((userDoc) => {
          const userData = userDoc.data();
          usersData.push(userData);
        });

        setUsers(usersData);
        console.log('All Users:', usersData);
      } catch (error) {
        console.error('Error fetching users data:', error.message);
      }
    };

    fetchAllUsers();
  }, []);
  
  return (
    <View  style={{ flex: 1,flexDirection:'row',justifyContent:'center' ,alignItems:'center'}} >
      <SafeAreaView>
      <FlatList
          data={users}
          keyExtractor={(item) => item.uid}
          renderItem={({ item }) => (
            <View>
              <Text>{`Username: ${item.username}, Role: ${item.role}, Email: ${item.email}`}</Text>
            </View>
          )}
        />
        <Text style={commonStyle.input}>Admin Screen</Text>
 <TouchableOpacity
          onPress={handlelogout}
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
              admin
            </Text>
          </TouchableOpacity>
          </SafeAreaView>

    
    </View>
  )
}