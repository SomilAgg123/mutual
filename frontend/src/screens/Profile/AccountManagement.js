import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';

import Feather from 'react-native-vector-icons/Feather';
const backArrow = <Feather name="arrow-left" size={30} color="black" />;
const MUTUAL_PURPLE = "#883FCE";

const del = require('../../../assets/graphics/delete.png');

export default function AccountManagement({ navigation }) {
    return (
        <View style={styles.container}>
            <View style={styles.subContainer}>
            <View style={styles.row}>
                    <View style={styles.row}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            {backArrow}
                        </TouchableOpacity>
                        <Text style={styles.headerText}>Account Management</Text>
                    </View>
                </View>
                <Text style={{
                    marginTop: '5%',
                    fontFamily: 'LatoBold',
                    fontSize: 24
                }}>Are you sure?</Text>
                <Text style={{
                    marginTop: '5%',
                    fontFamily: 'Lato',
                    fontSize: 18,
                    lineHeight: 24
                }}>
                    Deleting your account will permamently erase all convos
                    and responses to setups you've arranged.
                </Text>
                <Text style={{
                    marginVertical: '5%',
                    fontSize: 15,
                    fontFamily: 'LatoItalic',
                    lineHeight: 24
                }}>Just want a break? You can pause receiving new matches in your Profile settings.</Text>
                <Image source={del} style={{
                    marginVertical: '10%',
                    alignSelf: 'center'
                }}/>
                <TouchableOpacity style={{
                    backgroundColor: MUTUAL_PURPLE,
                    padding: '5%',
                    alignItems: 'center',
                    borderRadius: 50
                }}>
                    <Text style={{
                        fontFamily: 'LatoBold',
                        color: 'white',
                        fontSize: 25
                    }}>
                        Confirm delete
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEFEFE'
    },
    subContainer: {
        marginTop: '18%',
        paddingHorizontal: '5%'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    // text
    headerText: {
        marginLeft: '3%',
        fontFamily: 'LatoBold',
        fontSize: 26
    },
    editText: {
        fontFamily: 'Lato',
        color: MUTUAL_PURPLE
    }
});