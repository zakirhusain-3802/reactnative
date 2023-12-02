import React, {Component} from 'react';
import { StatusBar } from 'expo-status-bar';

import { StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native';



class Btn extends Component {
  state={
    count: 0,
  };
  onPress =()=>{
    this.setState({
      count : this.state.count + 1,
      
    });
  };
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.onPress}>
          <Text>Click me</Text>
        </TouchableOpacity>
        <View>
        <Text>Murtuza kalwani {this.state.count} </Text></View>
        <Text style={styles.container1}> Kalwani</Text>
       
      </View>
    );
  }
}
  


export default function Home()  {
  
   return <Btn/>;
   
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container1: {
    backgroundColor: '#d3d3d3',
    alignItems: 'center',
    justifyContent: 'center',
    padding:10
  },
});


