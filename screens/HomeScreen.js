import { View, Text ,Platform,Dimensions,TouchableOpacity} from 'react-native'
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import commonStyle from '../syles/style';
import UserHome from '../userScreen/UserHome';
const Stack = createNativeStackNavigator();



const windowWidth = Dimensions.get('window').width;

export default function HomeScreen() {

 
  
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