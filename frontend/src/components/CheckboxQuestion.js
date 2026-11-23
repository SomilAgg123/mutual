import React, { useContext, useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { Context as AuthContext } from '../context/AuthContext';
import CheckBox from '@react-native-community/checkbox';

export default function CheckboxQuestion({ updateAuthState, setToken, title, options, required }) {
    const { state, signout } = useContext(AuthContext);
    const [men, setMen] = useState(false);
    const [women, setWomen] = useState(false);
    const [nonbinary, setNonbinary] = useState(false);
    const [other, setOther] = useState(false);

    return (
        <View styles={styles.container}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.questionTitle}>{title}</Text>
                <Text style={required ? {color: 'red'} : {color: 'white'}}>*</Text>
            </View>
            <View>
                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: '2%'}}>
                    <CheckBox
                        style={styles.checkbox}
                        disabled={false}
                        value={men}
                        onValueChange={(newValue) => setMen(newValue)}
                        boxType={'square'}
                        onTintColor={'white'}
                    />
                    <Text style={styles.checkboxOptions}>Men</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: '2%'}}>
                    <CheckBox
                        style={styles.checkbox}
                        disabled={false}
                        value={women}
                        onValueChange={(newValue) => setWomen(newValue)}
                        boxType={'square'}
                        onTintColor={'white'}
                    />
                    <Text style={styles.checkboxOptions}>Women</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: '2%'}}>
                    <CheckBox
                        style={styles.checkbox}
                        disabled={false}
                        value={nonbinary}
                        onValueChange={(newValue) => setNonbinary(newValue)}
                        boxType={'square'}
                        onTintColor={'white'}
                    />
                    <Text style={styles.checkboxOptions}>Non-binary</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: '2%'}}>
                    <CheckBox
                        style={styles.checkbox}
                        disabled={false}
                        value={other}
                        onValueChange={(newValue) => setOther(newValue)}
                        boxType={'square'}
                        onTintColor={'white'}
                    />
                    <Text style={styles.checkboxOptions}>Other</Text>
                </View>
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
    checkbox: {
        height: 25,
        width: 25,
    },
    checkboxOptions: {
        paddingLeft: '2%',
        fontFamily: 'Lato',
        fontSize: 18
    }
})