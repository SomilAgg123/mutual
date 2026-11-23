import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { Icon } from 'react-native-elements'

export default function TextQuestion({ updateAuthState, setToken, setField, title, placeholder, type, required, search }) {
    const [text, setText] = React.useState('');
    const onChangeText = async (text) => {
        // Call function to set state
        setText(text);

        // Call function to update context state
        setField(text);
    }

    return (
        <View styles={styles.container}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.questionTitle}>{title}</Text>
                <Text style={[required ? {color: 'red'} : {color: 'white'}, {
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
                    search ? <Icon name='search' size={23} paddingLeft={10} color='#883FCE'/> : ''
                }
                <TextInput
                    style={styles.input}
                    // onChangeText={(text) => {setField(text); setText(text)} }
                    onChangeText={onChangeText}
                    value={text}
                    placeholder={placeholder}
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
    }
})