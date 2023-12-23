// App.js
import * as React from 'react';

import Nav from './navigation/appNavigation'
import NewNav from './navigation/newnavigation'
import Admin from './screens/admin'
import Userhome from './userScreen/UserHome';
import Signup from './screens/SignUpScreen';
import UserMontly from './userScreen/UserMonthly';
import { SafeAreaProvider } from 'react-native-safe-area-context';




function App(){
  return(
    // 
    <SafeAreaProvider>
      {/* <Signup/> */}
      <NewNav/>
      {/* <UserMontly/> */}
    </SafeAreaProvider>
    // <Userhome/>
  )

}
export default App;
