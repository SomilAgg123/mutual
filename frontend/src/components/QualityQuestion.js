import React, { useState, useContext } from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { AuthContext } from '../context/AuthContext';
import { Icon } from 'react-native-elements'

export default function QualityQuestion({ updateAuthState, setToken, setQualities, title, type, required, search }) {
    const { state, signout } = useContext(AuthContext);
    const [q1, onChangeQ1] = useState('');
    const [q2, onChangeQ2] = useState('');
    const { setQuality1, setQuality2 } = setQualities;
    const onChangeTextQ1 = async (text) => {
        onChangeQ1(text);
        setQuality1(text);
    }
    const onChangeTextQ2 = async (text) => {
        onChangeQ2(text);
        setQuality2(text);
    }

    return (
        <View styles={styles.container}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.questionTitle}>{title}</Text>
                <Text style={required ? {color: 'red'} : {color: 'white'}}>*</Text>
            </View>
            <View style={styles.wordText}>
                <TextInput
                        style={styles.input}
                        onChangeText={onChangeTextQ1}
                        value={q1}
                        placeholder={'Quality 1'}
                        textContentType={type}
                />
            </View>
            <View style={styles.wordText}>
                <TextInput
                        style={styles.input}
                        onChangeText={onChangeTextQ2}
                        value={q2}
                        placeholder={'Quality 2'}
                        textContentType={type}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    questionTitle: {
        fontFamily: 'LatoBold',
        fontSize: 18,
        marginTop: '7%'
    },
    input: {
        flex: 1,
        fontFamily: 'Lato',
        fontSize: 20,
        backgroundColor: '#F6F6F6',
        placeholderTextColor: '#777777',
        // marginTop: '2%',
        padding: '2%',
        borderRadius: 40,
        paddingLeft: '4%'
    },
    wordText: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F6F6F6',
        borderRadius: 40,
        marginTop: '2%'
    }
})