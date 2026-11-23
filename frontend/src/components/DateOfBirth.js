import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { Icon } from 'react-native-elements'
import { onChange } from 'react-native-reanimated';

export default function DateOfBirth({ setField, title, placeholder, type, required, search }) {
    const [text, setText] = React.useState('');
    // const onChangeText = async (text) => {
    //     // Call function to set state
    //     setText(text);

    //     // Call function to update context state
    //     setField(text);
    // }
    const onChangeText = async (text) => {
        // Format the input as the user types
        const formattedText = text.replace(/[^0-9]/g, '');

        // Format the input as the user types
        if (formattedText.length <= 2) {
            setText(formattedText);
            setField(formattedText);
        } else if (formattedText.length <= 4) {
            const s = `${formattedText.slice(0, 2)}/${formattedText.slice(2)}`;
            setText(s);
            setField(s);
        } else {
            const s = `${formattedText.slice(0, 2)}/${formattedText.slice(2, 4)}/${formattedText.slice(4, 8)}`;
            setText(s);
            setField(s);
        }
    }

    return (
        <View styles={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.questionTitle}>{title}</Text>
                <Text style={[required ? { color: 'red' } : { color: 'white' }, {
                    fontFamily: 'Lato',
                    fontSize: 18
                }]}>*</Text>
            </View>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#F6F6F6',
                borderRadius: 40,
                marginTop: '2%'
            }}>
                {
                    search ? <Icon name='search' size={23} paddingLeft={10} color='#883FCE' /> : ''
                }
                <TextInput
                    style={styles.input}
                    // onChangeText={(text) => {setField(text); setText(text)} }
                    placeholder="Date of birth (MM/DD/YYYY)"
                    onChangeText={onChangeText}
                    value={text}
                    keyboardType="numeric"
                    maxLength={10}
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
    }
})