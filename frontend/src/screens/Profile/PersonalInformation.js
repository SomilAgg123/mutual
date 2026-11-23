import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import TextQuestion from '../../components/TextQuestion';

import Feather from 'react-native-vector-icons/Feather';
const backArrow = <Feather name="arrow-left" size={30} color="black" />;
const MUTUAL_PURPLE = "#883FCE";

export default function PersonalInformation({ navigation }) {
return (
        <View style={styles.container}>
            <View style={styles.subContainer}>
                <View style={styles.row}>
                    <View style={styles.row}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            {backArrow}
                        </TouchableOpacity>
                        <Text style={styles.headerText}>Account Info</Text>
                    </View>
                    <TouchableOpacity>
                        <Text style={styles.editText}>Done</Text>
                    </TouchableOpacity>
                </View>
                <TextQuestion title="Phone" placeholder={"+1 202 555 0100"}/>
                <TextQuestion title="E-mail" placeholder={"demo@example.com"}/>
                <TextQuestion title="First name" placeholder={"Nalu"}/>
                <TextQuestion title="Last name" placeholder={"Concepcion"}/>
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