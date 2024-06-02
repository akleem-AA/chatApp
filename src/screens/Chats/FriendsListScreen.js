// src/FriendsListScreen.js
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, FlatList, TouchableOpacity, Text, Image, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

const FriendsListScreen = () => {
  const navigation = useNavigation();
  const friends = [
    { id: 1, name: 'Friend 1', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1025px-Cat03.jpg' },
    { id: 2, name: 'Friend 2', image: 'https://placekitten.com/50/51' },
    { id: 3, name: 'Friend 3', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwiJ2OMwkdSSGf3DWJKQl_dqxNabrKZMoaFNw2L0u7ykukSTrTFclxS1mp03McOYTlm9k&usqp=CAU' },
    // Add more friends as needed
  ];

  const navigateToChat = (friend) => {
    navigation.navigate('chatScreen', { friend });
  };

  const renderFriend = ({ item }) => (
    <TouchableOpacity style={styles.friendItem} onPress={() => navigateToChat(item)}>
      <Image source={{ uri: item.image }} style={styles.friendImage} />
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.name}</Text>
        <Text style={styles.lastMessageTime}>{getLastMessageTime()} ago</Text>
        {/* Add additional information like last message, status, etc. if needed */}
      </View>
    </TouchableOpacity>
  );
  const getLastMessageTime = () => {
    // Dummy function to generate a random time for demonstration purposes
    const minutesAgo = Math.floor(Math.random() * 60);
    return `${minutesAgo} min`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
    <StatusBar barStyle="light-content"/>

    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Let's Chat with Friends</Text>
      </View>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderFriend}
      />
      <TouchableOpacity style={styles.chatIcon}>
        <Icon name="chat" size={30} color="#ffffff" />
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#128C7E',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#128C7E',
    paddingVertical: 15,
    alignItems: 'center',
  },
  headerText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#dcdcdc',
  },
  friendImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  lastMessageTime: {
    fontSize: 12,
    color: '#777777',
  },
  chatIcon: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#128C7E',
    borderRadius: 30,
    padding: 15,
  },
  
});



export default FriendsListScreen;
