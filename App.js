import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ChatScreen from './src/screens/Chats/ChatScreen'
import FriendsListScreen from './src/screens/Chats/FriendsListScreen'

const App = () => {
  console.log('star the app')
  return (
    <View style={{flex:1}}>
      {/* <FriendsListScreen /> */}
      <ChatScreen />
    </View>

  )
}

export default App

const styles = StyleSheet.create({})