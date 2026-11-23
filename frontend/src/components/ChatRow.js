import React from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';

const MUTUAL_PURPLE = "#883FCE";

export default function ChatRow({
    firstName,
    last_msg,
    date_last_msg,
    read,
    onPress
}) {
    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <Text style={read ? styles.dotRead : styles.dotUnread}>{'\u25CF'}</Text>
            <Image style={styles.imageStyle} source={require('../../assets/images/man_looking_off.png')}/>
            <View style={styles.chatRightContent}>
                <View style={styles.nameAndDate}>
                    <Text style={styles.name}>{firstName}</Text>
                    <Text style={styles.date}>{date_last_msg}</Text>
                </View>
                <Text numberOfLines={2} style={styles.messagePreview}>
                    {last_msg}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const IMG_SIZE = 51;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#EDEDED',
        padding: '3%'
    },
    chatRightContent: {
        flex: 1,
        marginLeft: '3%'
    },
    nameAndDate: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 4
    },
    imageStyle: {
        width: IMG_SIZE,
        height: IMG_SIZE,
        alignSelf: 'center',
        borderRadius: 100
    },
    // text
    dotUnread: {
        fontSize: 14,
        alignSelf: 'center',
        marginRight: '2%',
        color: MUTUAL_PURPLE
    },
    dotRead: {
        fontSize: 14,
        alignSelf: 'center',
        marginRight: '2%',
        color: '#FEFEFE'
    },
    name: {
        fontFamily: 'LatoBold',
        fontSize: 18
    },
    date: {
        fontFamily: 'Lato',
        color: '#777777',
        fontSize: 12
    },
    messagePreview: {
        fontFamily: 'Lato',
        color: '#777777'
    }
});