import React from 'react';
import { StyleSheet, Text, Pressable } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const backArrow = <Feather name="arrow-left" size={30} color="black" />;

const BACKGROUND_COLOR = "#FEFEFE";

export default function BackButton({
    style,
    onPress,
    hasBackground,
    navigation
}) {
    return (
        <Pressable color={BACKGROUND_COLOR}
            style={({ pressed }) =>
                hasBackground ? (
                    pressed ? [styles.unpressed, style] : [style, styles.unpressed, styles.shadowProp]
                ) : (
                    [styles.unpressed, style]
                )
            }
            onPress={onPress}>
            {backArrow}
        </Pressable>
    );
}

const BUTTON_SIZE = 60;

const styles = StyleSheet.create({
    unpressed: {
        height: BUTTON_SIZE,
        width: BUTTON_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: '4%',
        paddingVertical: '4%',
        borderRadius: 100,
        elevation: 3,
        backgroundColor: BACKGROUND_COLOR,
    },
    shadowProp: {
        shadowColor: 'black',
        shadowOffset: {
            width: -2,
            height: 4
        },
        shadowOpacity: 0.25,
        shadowRadius: 1,
        elevation: 3
    }
});