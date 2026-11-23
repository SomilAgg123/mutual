import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';

// icon import
import Feather from 'react-native-vector-icons/Feather';

const LIGHT_PURPLE = "#F1E8FA";
const DARKER_LIGHT_PURPLE = "#E5D0FA";
const TAN = "#EED7BC";
const DARK_GREY = "#777777";

const backArrow = <Feather name="arrow-left" size={35} color="black" />;

const somil = require('../../../assets/images/man.png');
const img_one = require('../../../assets/images/beanie.png');
const img_two = require('../../../assets/images/blazer_woman.png');
const img_three = require('../../../assets/images/blue.png');
const img_four = require('../../../assets/images/confetti.png');
const img_five = require('../../../assets/images/hoodie.png');
const img_six = require('../../../assets/images/laughing.png');
const img_seven = require('../../../assets/images/man_looking_off.png');
const img_eight = require('../../../assets/images/sunshine.png');
const img_nine = require('../../../assets/images/woman_balcony.png');
const img_ten = require('../../../assets/images/man.png');

export default function OpenChat({ route }) {
    const navigation = useNavigation();

    const {
        nameOne,
        nameTwo,
        imageOne,
        imageTwo,
        prompt,
        date
    } = route.params;

    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <View style={styles.topRow}>
                    <Pressable onPress={() => navigation.goBack()}>
                        {backArrow}
                    </Pressable>
                    <Text style={styles.names}>{nameOne} & {nameTwo}</Text>
                </View>
                <Text style={styles.prompt}>
                    {prompt}
                </Text>
            </View>
            <View style={styles.responses}>
                <View style={styles.singleResponse}>
                    <Image style={styles.image} source={imageOne} />
                    <View style={styles.chatAndName}>
                        <Text style={styles.name}>{nameOne}</Text>
                        <View style={styles.chatDiv}>
                            <View style={[styles.triangle, styles.arrowLeft]} />
                            <View style={styles.messageBox}>
                                <Text style={styles.message}>
                                Jake was definitely class clown. He has a talent for making his closest friends laugh, and he's always the life of any party!
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.singleResponse}>
                    <Image style={styles.image} source={imageTwo} />
                    <View style={styles.chatAndName}>
                        <Text style={styles.name}>{nameTwo}</Text>
                        <View style={styles.chatDiv}>
                            <View style={[styles.triangle, styles.arrowLeft, {
                                borderRightColor: DARKER_LIGHT_PURPLE
                            }]} />
                            <View style={[styles.messageBox, {
                                backgroundColor: DARKER_LIGHT_PURPLE
                            }]}>
                                <Text style={styles.message}>
                                He had to have won best at sneaking food into class. He has such a talent for smuggling in snacks and never gets caught!
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEFEFE'
    },
    topContainer: {
        backgroundColor: LIGHT_PURPLE,
        padding: '5%'
    },
    responses: {
        flex: 5
    },
    singleResponse: {
        flexDirection: 'row',
        paddingTop: '5%',
        width: '92%',
        alignSelf: 'center',
        alignItems: 'flex-start'
    },
    topRow: {
        marginTop: '15%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: '5%'
    },
    chatDiv: {
        flexDirection: 'row'
    },
    chatAndName: {
        flex: 1
    },
    messageBox: {
        flex: 1,
        backgroundColor: TAN,
        padding: '3%',
        borderRadius: 10,
        borderTopLeftRadius: 0
    },
    // components
    image: {
        width: 50,
        height: 50,
        borderRadius: 100,
        marginRight: '2.5%'
    },
    // text
    names: {
        fontFamily: 'LatoBold',
        fontSize: 30,
        marginLeft: '3%'
    },
    prompt: {
        fontFamily: 'LatoBold',
        fontSize: 26
    },
    name: {
        fontFamily: 'LatoBold',
        fontSize: 14,
        color: DARK_GREY,
        marginBottom: 5
    },
    message: {
        fontFamily: 'Lato',
        fontSize: 16
    },
    // chat bubble
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
    },
    arrowLeft: {
        borderTopWidth: 0,
        borderRightWidth: 12,
        borderBottomWidth: 12,
        borderLeftWidth: 0,
        borderRadius: 2,
        borderTopColor: 'transparent',
        borderRightColor: TAN,
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
    },
});