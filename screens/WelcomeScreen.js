import React from 'react';
import { View, Text, Image, TouchableOpacity, Platform,Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { themeColors } from '../theme';
import { useNavigation } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;

export default function WelcomeScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ backgroundColor: themeColors.bg, flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'space-around', marginVertical: 16 }}>
        <Text style={{ textAlign: 'center', fontSize: 24, fontWeight: 'bold' }}>
          Let's Get Started!
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Image
            source={require('../assets/images/welcome.png')}
            style={{ width: 350, height: 350 }}
          />
        </View>
        <View style={{ marginVertical: 16, alignItems:'center' }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('SignUp')}
            style={[
                {
                  paddingVertical: 12,
                  backgroundColor: '#FFD700', // Yellow color
                  marginHorizontal: 16,
                  borderRadius: 8,
                  width: Platform.OS === 'web' ? 200 : windowWidth - 32, // Full width on mobile
              
                  
                },
                
              ]}
           >
            <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: '#474747' }}>
              Sign Up
            </Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 8 }}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={{ fontWeight: 'bold', color: '#FFD700' }}> Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
