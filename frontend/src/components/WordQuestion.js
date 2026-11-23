import React, { useState, useContext } from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { Context as AuthContext } from '../context/AuthContext';
import { Icon } from 'react-native-elements'

export default function WordQuestion({ updateAuthState, setToken, title, type, required, search }) {
    const { state, signout } = useContext(AuthContext);
    const [w1, onChangeW1] = useState('');
    const [w2, onChangeW2] = useState('');
    const [w3, onChangeW3] = useState('');

    return (
        <View styles={styles.container}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.questionTitle}>{title}</Text>
                <Text style={required ? {color: 'red'} : {color: 'white'}}>*</Text>
            </View>
            <View style={styles.wordText}>
                <TextInput
                        style={styles.input}
                        onChangeText={onChangeW1}
                        value={w1}
                        placeholder={'Word 1'}
                        textContentType={type}
                />
            </View>
            <View style={styles.wordText}>
                <TextInput
                        style={styles.input}
                        onChangeText={onChangeW2}
                        value={w2}
                        placeholder={'Word 2'}
                        textContentType={type}
                />
            </View>
            <View style={styles.wordText}>
                <TextInput
                        style={styles.input}
                        onChangeText={onChangeW3}
                        value={w3}
                        placeholder={'Word 3'}
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