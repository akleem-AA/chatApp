// src/ChatScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import io from 'socket.io-client';

const socket = io('http://your-server-url'); // Replace with your actual server URL

const ChatScreen = ({ route }) => {
  const { friend } = route?.params || {name:'testing'};

  const [messages, setMessages] = useState([
    { id: 1, text: "Hey, how's it going?", fromMe: false, timestamp: new Date() },
    { id: 2, text: "Not bad! What about you?", fromMe: true, timestamp: new Date() },
    { id: 3, text: "I'm doing well, thanks!", fromMe: false, timestamp: new Date() },
    { id: 10, text: "Hey, how's it going?", fromMe: true, timestamp: new Date() },
    { id: 20, text: "Not bad! What abouyugygygyugyufgyu7fgtufgftyfyt you?", fromMe: false, timestamp: new Date() },
  ]);

  const [message, setMessage] = useState('');
  const flatListRef = useRef(null);

  useEffect(() => {
    // Listen for incoming messages
    socket.on('message', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // Scroll to the bottom when a new message arrives
      flatListRef.current.scrollToEnd({ animated: true });
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    // Check if the message is empty
    if (!message.trim()) {
      return;
    }

    const newMessage = {
      id: Date.now(),
      text: message,
      fromMe: true,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessage('');

    // Emit the message to the server
    socket.emit('message', newMessage);

    // Scroll to the bottom after sending a message
    flatListRef.current.scrollToEnd({ animated: true });
  };

  const renderMessage = ({ item }) => (
    <View style={item.fromMe ? styles.messageFromMe : styles.messageFromFriend}>
      <Text style={[styles.messageText,!item.fromMe &&{color:'black'}]}>{item.text}</Text>
      <Text style={styles.timestampText}>{formatTimestamp(item.timestamp)}</Text>
    </View>
  );

  const formatTimestamp = (timestamp) => {
    const options = { hour: 'numeric', minute: '2-digit', hour12: true };
    return new Intl.DateTimeFormat('en-US', options).format(timestamp);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.userInfo}>
          <TouchableOpacity>
            <Icon name="account-circle" size={30} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerText}>{friend?.name|| 'My Friend'}</Text>
        </View>
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageContainer}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message"
          value={message}
          onChangeText={(text) => setMessage(text)}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    backgroundColor: '#075e54',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  headerText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  messageContainer: {
    padding: 10,
  },
  messageFromMe: {
    alignSelf: 'flex-end',
    backgroundColor: '#075e54',
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    maxWidth: '80%',
  },
  messageFromFriend: {
    alignSelf: 'flex-start',
    backgroundColor: '#ece5dd',
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    maxWidth: '80%',
  },
  messageText: {
    color: '#ffffff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: '#bdc3c7',
    backgroundColor: '#ffffff',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 8,
    marginRight: 10,
    paddingHorizontal: 10,
  },
  sendButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#075e54',
  },
  sendButtonText: {
    color: '#ffffff',
  },
  timestampText: {
    fontSize: 12,
    color: '#777',
    marginTop: 5,
  },
  header: {
    backgroundColor: '#075e54',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  headerText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default ChatScreen;
