import { setAutoFreeze } from 'immer';
import React, { useContext, useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

export default function DropDownQuestion({ setToken, setField, title, options, required }) {
    // const [men, setMen] = useState(false);
    // const [women, setWomen] = useState(false);
    // const [nonbinary, setNonbinary] = useState(false);
    // const [other, setOther] = useState(false);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState(options)
    const onValueSelect = (val) => {
        // Call function to set state
        setValue(val);

        // Call function to update context state
        setField(val);
    }

    // setField(value);
    return (
        <View styles={styles.container}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.questionTitle}>{title}</Text>
                <Text style={required ? {color: 'red'} : {color: 'white'}}>*</Text>
            </View>
            <View style={{zIndex: 1, position: 'relative'}}>
                <DropDownPicker style={styles.dropdown}
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    onChangeValue={() => onValueSelect(value)}
                    placeholder="Select"
                    dropDownDirection='TOP'
                    dropDownContainerStyle={{
                        backgroundColor: 'white'
                    }}
                    labelStyle={{
                        color: '#101010',
                        fontFamily: 'Lato',
                        fontSize: 18,
                        backgroundColor: 'white'
                    }}
                    containerStyle={{
                        position: 'relative'
                    }}
                    listItemContainerStyle={{
                        backgroundColor: 'white',
                        color: 'white',
                        position: 'relative',
                        zIndex: 2
                    }}
                    placeholderStyle={{
                        color: '#777777',
                        fontFamily: 'Lato',
                        fontSize: 20,
                        backgroundColor: 'white'
                    }}
                    listItemLabelStyle={{
                        color: '#101010',
                        fontFamily: 'Lato',
                        fontSize: 18,
                        backgroundColor: 'white',
                        position: 'relative'
                        // zIndex: 2
                    }}
                    selectedItemLabelStyle={{
                        color: '#101010',
                        fontFamily: 'Lato',
                        fontSize: 18,
                        backgroundColor: 'white'
                    }}
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
    dropdown: {
        fontFamily: 'Lato',
        fontSize: 18,
        marginTop: '2%',
        backgroundColor: 'white',
        // position: 'relative',
        zIndex: 2
    }
})