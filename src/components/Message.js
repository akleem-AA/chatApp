import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { TouchableRipple } from 'react-native-paper';

const Message = ({ item }) => {

    const formatTimestamp = (timestamp) => {
        const options = { hour: 'numeric', minute: '2-digit', hour12: true };
        return new Intl.DateTimeFormat('en-US', options).format(timestamp);
    };

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

export default Message;

const styles = StyleSheet.create({
    feedbackContainer: {
        marginVertical: 5,
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
