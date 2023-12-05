import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  StatusBar,
  Dimensions,
  Platform,
} from "react-native";
const windowWidth = Dimensions.get("window").width;
const commonStyle = {
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "#F3F4F6",
    color: "#4B5563",
    borderRadius: 20,
    marginBottom: 10,
    alignSelf: "center",

    width: Platform.OS === "web" ? 250 : windowWidth - 32,
  },

  comText: {
    color: "#4B5563",
    marginLeft: 16,
    marginTop: 5,
    marginBottom: 2,
    
  },
  socicon:{
    padding: 16,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
   
  },
  usetext:{
    color: "#4B5563",
    marginLeft: 15,
    marginTop: 20,
    marginBottom: 2,
    fontSize: 17,
    fontWeight: "bold",
  }
};

export default commonStyle;
