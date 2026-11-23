import React, { useState, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';

import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { Context as AuthContext } from '../context/AuthContext';

const MUTUAL_PURPLE = "#883FCE";
const DARK_GREY = "#777777";

const AWAITING = "Waiting for response to \"";
const RESPONDED = "Responded to \""

export default function MatchResponseCard({
    nameOne,
    nameTwo,
    imageOne,
    imageTwo,
    prompt,
    date
}) {
    const [ opened, setOpened ] = useState(false);
    const navigation = useNavigation();

    return (
        <Pressable color={opened ? DARK_GREY : MUTUAL_PURPLE}
            style={styles.container}
            onPress={() => {
                setOpened(!opened);
                navigation.navigate('Dialogue', {
                    nameOne: nameOne,
                    nameTwo: nameTwo,
                    imageOne: imageOne,
                    imageTwo: imageTwo,
                    prompt: prompt,
                    date: date
                })
            }}>
            <View style={styles.subcontainer}>
            <Text style={opened ? styles.notifRead : styles.notifActive}>{'\u25CF'}</Text>
                <View style={styles.images}>
                    <Image
                    style={opened ? styles.imageRead : styles.imageUnread}
                    source={imageOne}/>
                    <Image
                    style={[opened ? styles.imageRead : styles.imageUnread, {
                        position: 'absolute',
                        left: '37.5%'
                    }]}
                    source={imageTwo}/>
                </View>
                <View style={styles.textComponents}>
                    <View style={styles.horizontalText}>
                        <Text style={styles.names}>{nameOne} & {nameTwo}</Text>
                        <Text style={styles.date}>{date}</Text>
                    </View>
                    <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={opened ? styles.textRead : styles.textUnread}>
                        {opened ? (AWAITING + prompt) : (RESPONDED + prompt) }
                    </Text>
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
         borderBottomWidth: 1,
        borderColor: '#EDEDED'
    },
    subcontainer: {
        flexDirection: 'row',
        marginRight: '5%',
        paddingVertical: '3.5%'
    },
    images: {
        flex: 1,
        alignSelf: 'center',
        flexDirection: 'row',
        marginRight: '2%'
    },
    textComponents: {
        flex: 3
    },
    // components
    imageRead: {
        width: 51,
        height: 51,
        borderRadius: 100
    },
    imageUnread: {
        width: 51,
        height: 51,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: MUTUAL_PURPLE
    },
    horizontalText: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    notifActive: {
        fontSize: 18,
        alignSelf: 'center',
        marginHorizontal: '2%',
        color: MUTUAL_PURPLE
    },
    notifRead: {
        fontSize: 18,
        alignSelf: 'center',
        marginHorizontal: '2%',
        color: "#FEFEFE"
    },
    // text
    names: {
        fontFamily: 'LatoBold',
        fontSize: 18
    },
    textRead: {
        fontFamily: 'LatoBold',
        fontSize: 14,
        color: DARK_GREY
    },
    textUnread: {
        fontFamily: 'LatoBold',
        fontSize: 14,
        color: MUTUAL_PURPLE
    },
    date: {
        fontFamily: 'Lato',
        fontSize: 15,
        color: '#777777'
    }
});