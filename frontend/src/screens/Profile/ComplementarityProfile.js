import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function ComplementarityProfile() {
    return (
        <View style={styles.container}>
            <Text>This screen will contain some other text</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEFEFE',
        alignItems: 'center',
        justifyContent: 'center'
    }
});