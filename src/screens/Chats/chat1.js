import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Alert,
  StatusBar,
  Platform,
 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import io from 'socket.io-client';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ActionSheet from 'react-native-actionsheet';
import { useNavigation } from '@react-navigation/native';
import { TouchableRipple } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const socket = io('http://your-server-url'); // Replace with your actual server URL

const ChatScreen1 = ({ route }) => {
  const navigation = useNavigation();
  const { friend } = route?.params || { name: 'Receiver' };

  const [messages, setMessages] = useState([
    { id: 1, text: "Hey, how's it going?", fromMe: false, timestamp: new Date() },
    { id: 2, text: "Not bad! What about you?", fromMe: true, timestamp: new Date() },
    { id: 3, text: "I'm doing well, thanks!", fromMe: false, timestamp: new Date() },
    {
      id: 4,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2zPJA81k7VuodnK3w4LaZqMJGjVuvedNKU365l2xQQQ&s',
      fromMe: false,
      timestamp: new Date(),
    }, // Dummy image message from receiver
    { id: 10, text: "Hey, how's it going?", fromMe: true, timestamp: new Date() },
    {
      id: 20,
      text: "Not bad! What about you?",
      fromMe: false,
      timestamp: new Date(),
    },
  ]);

  const [message, setMessage] = useState('');
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const flatListRef = useRef(null);
  const actionSheetRef = useRef(null);

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

  const pickImage = () => {
    showBottomSheet();
  };

  const showBottomSheet = () => {
    setBottomSheetVisible(true);
    actionSheetRef.current.show();
  };

  const handleBottomSheetSelection = (index) => {
    setBottomSheetVisible(false);

    if (index === 0) {
      // Take Photo
      handleCameraLaunch();
    } else if (index === 1) {
      // Choose from Gallery
      openImagePicker();
    }
  };


const handleCameraLaunch = async () => {
  if (Platform.OS === 'ios' && !Platform.isPad && !Platform.isTV && !Platform.isMacCatalyst) {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };
    launchCamera(options, (response) => handleImagePickerResponse(response, true));
  } else {
    console.log('Camera is not available in the simulator. Using a placeholder image.');
    const placeholderImage = {
      uri: 'https://via.placeholder.com/200',
      type: 'image/jpeg',
      name: 'placeholder.jpg',
    };
    handleImagePickerResponse({ assets: [placeholderImage] }, true);
  }
};

  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, (response) => handleImagePickerResponse(response, false));
  };

  const handleImagePickerResponse = (response, fromCamera) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else {
      console.log('upload image response', response, fromCamera);
      const selectedImage = {
        uri: response.assets?.[0]?.uri,
        type: fromCamera ? 'image/jpeg' : response.type,
        name: fromCamera ? 'image.jpg' : response.fileName,
      };

      const newMessage = {
        id: Date.now(),
        image: selectedImage.uri,
        fromMe: true,
        timestamp: new Date(),
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // Emit the message to the server
      socket.emit('message', newMessage);

      // Scroll to the bottom after sending a message
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  const renderMessage = ({ item }) => {
    return (
      <TouchableRipple
            style={[styles.feedbackContainer]}
            borderless={false}
            onLongPress={() => handleLongPress(item)}>
            <View style={[item.fromMe ? styles.messageFromMe : styles.messageFromFriend, styles.messageBubble]}>
                {item.image ? (
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: item.image }}
                            style={styles.imageMessage}
                        />
                        <Text style={[styles.timestampText, styles.timestampTextImage]}>{formatTimestamp(item.timestamp)}</Text>
                    </View>
                ) : (
                    <>
                        <Text style={styles.messageText}>{item.text}</Text>
                        <Text style={styles.timestampText}>{formatTimestamp(item.timestamp)}</Text>
                    </>
                )}
            </View>
        </TouchableRipple>
    );
  };

  const handleLongPress = (item) => {
    Alert.alert(
      'Are you sure you want to delete?',
      'Select an option',
      [
        { text: 'Delete Message', onPress: () => handleDeleteMessage(item) },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const handleDeleteMessage = (item) => {
    // Implement logic to delete the message
    setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== item.id));
  };

  const formatTimestamp = (timestamp) => {
    const options = { hour: 'numeric', minute: '2-digit', hour12: true };
    return new Intl.DateTimeFormat('en-US', options).format(timestamp);
  };


  return (
    <>
  
     <SafeAreaView style={styles.safeArea}>
      <StatusBar  barStyle="light-content"/>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity style={{paddingRight:10}} onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
            <View style={styles.userInfo}>
              {friend?.image ? (
                <TouchableOpacity>
                  <Image source={{ uri: friend.image }} style={{ width: 30, height: 30, borderRadius: 15 }} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity  >
                  <Icon name="account-circle" size={30} color="#ffffff" />
                </TouchableOpacity>
              )}
              <Text style={styles.headerText}>{friend?.name || 'My Friend'}</Text>
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
            <TouchableOpacity style={styles.uploadIcon} onPress={pickImage}>
              <Icon name="photo-camera" size={24} color="#000000" />
            </TouchableOpacity>
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
          <ActionSheet
            ref={actionSheetRef}
            title={'Select a photo'}
            options={['Take Photo', 'Choose from Gallery', 'Cancel']}
            cancelButtonIndex={2}
            destructiveButtonIndex={2}
            onPress={handleBottomSheetSelection}
            visible={bottomSheetVisible}
          />
        </View>
  </SafeAreaView>
  </>

  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#075e54',
  },
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
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center'
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
  uploadIcon: {
    marginLeft: 10,
    paddingRight:10,
  },
  sendButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#075e54',
  },
  sendButtonText: {
    color: '#ffffff',
  },
  feedbackContainer: {
    marginVertical: 5,
    // borderWidth:1,
    // maxWidth:'100%'
},
messageBubble: {
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
},
messageFromMe: {
    alignSelf: 'flex-end',
    backgroundColor: '#dcf8c6',
},
messageFromFriend: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    borderColor: '#075e54',
    // borderWidth: 1,
},
messageText: {
    color: '#000000',
},
imageContainer: {
    position: 'relative',
},
imageMessage: {
    width: 200,
    height: 200,
    borderRadius: 8,
},
timestampText: {
    fontSize: 12,
    color: '#777',
    marginTop: 5,
    alignSelf: 'flex-end',
},
timestampTextImage: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    // backgroundColor: 'rgba(255, 255, 255, 255)',
    paddingHorizontal: 5,
    borderRadius: 3,
    color:'white'
},
});
export default ChatScreen1;
