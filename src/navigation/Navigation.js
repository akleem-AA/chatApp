import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

import FriendsListScreen from '../screens/Chats/FriendsListScreen';
import ChatScreen from '../screens/Chats/ChatScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatScreen1 from '../screens/Chats/chat1';
import VideoCallScreen from '../screens/Chats/VideoCallScreen';

const Navigation = () => {

  const Stack = createNativeStackNavigator();
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="chatList" component={FriendsListScreen} options={{ headerShown: false }} />
          <Stack.Screen name="chatScreen" component={ChatScreen1} options={{ headerShown: false }} />
          <Stack.Screen name="VideoCallScreen" component={VideoCallScreen} options={{ headerShown: false }} />

          {/* <Stack.Screen name="chatScreen" component={ChatScreen}  options={{ headerShown: false }}/> */}

          {/* <Stack.Screen name="Profile" component={ProfileScreen} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default Navigation;

const styles = StyleSheet.create({});
