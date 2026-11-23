import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

const locationPin = <Ionicons name="md-location-outline" size={15} color="#777777" />

export default function SearchResult({ item }) {
    return (
        <View style={styles.searchResult}>
            <Image style={styles.imageStyle} source={item.image} />
            <View style={styles.userInfo}>
                <Text style={styles.name}>{item.name}, {item.age}</Text>
                <View style={styles.locationRow}>
                    {locationPin}
                    <Text style={styles.location}>{item.location}</Text>
                </View>
            </View>
        </View>
    );
}

const IMG_SIZE = 48;
const styles = StyleSheet.create({
    searchResult: {
        flexDirection: 'row',
        paddingVertical: '3%',
        borderBottomWidth: 1,
        borderBottomColor: '#EDEDED'
    },
    locationRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageStyle: {
        width: IMG_SIZE,
        height: IMG_SIZE,
        borderRadius: 100,
    },
    userInfo: {
        flexDirection: 'column',
        justifyContent: 'center',
        marginLeft: '3%'
    },
    name: {
        fontFamily: 'LatoBold',
        fontSize: 18,
        marginBottom: '3%'
    },
    location: {
        fontFamily: 'Lato',
        fontSize: 14,
        color: "#777777"
    }

});