import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

import { ListItem, SearchBar } from "react-native-elements";

import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SearchResult from '../../components/SearchResult';

const img_one = require('../../../assets/images/beanie.png');
const img_two = require('../../../assets/images/blazer_woman.png');
const img_three = require('../../../assets/images/blue.png');
const img_four = require('../../../assets/images/confetti.png');
const img_five = require('../../../assets/images/hoodie.png');
const img_six = require('../../../assets/images/laughing.png');
const img_seven = require('../../../assets/images/man_looking_off.png');
const img_eight = require('../../../assets/images/sunshine.png');
const img_nine = require('../../../assets/images/woman_balcony.png');
const img_ten = require('../../../assets/images/man.png');

const locationPin = <Ionicons name="md-location-outline" size={15} color="#777777" />

const DATA = [
    {
        "id": 1,
        "name": "Olivia",
        "image": img_one,
        "age": 21,
        "location": "Seattle, WA"
    },
    {
        "id": 2,
        "name": "Natalie",
        "image": img_two,
        "age": 22,
        "location": "Ithaca, NY"
    },
    {
        "id": 3,
        "name": "Sophia",
        "image": img_three,
        "age": 20,
        "location": "Ithaca, NY"
    },
    {
        "id": 4,
        "name": "Nathan",
        "image": img_four,
        "age": 23,
        "location": "New York, NY"
    },
    {
        "id": 5,
        "name": "Irina",
        "image": img_five,
        "age": 20,
        "location": "Boston, MA"
    },
    {
        "id": 6,
        "name": "Indiana",
        "image": img_six,
        "age": 19,
        "location": "Ithaca, NY"
    },
    {
        "id": 7,
        "name": "Jakob",
        "image": img_seven,
        "age": 20,
        "location": "Seattle, WA"
    },
    {
        "id": 8,
        "name": "Reeve",
        "image": img_eight,
        "age": 22,
        "location": "Atlanta, GA"
    }
]

export default function Search() {
    const [data, setData] = useState(DATA);
    const [searchValue, setSearchValue] = useState("");

    const searchFunction = (text) => {
        var updatedData = DATA;
        if (text !== "") {
            updatedData = data.filter((item) => {
                const item_data = `${item.name.toUpperCase()})`;
                const text_data = text.toUpperCase();
                return item_data.indexOf(text_data) > -1;
            });
        }
        setData(updatedData);
        setSearchValue(text);
    };

    const renderItem = ({ item }) => <SearchResult item={item} />;

    return (
        <View style={styles.container}>
            <View style={styles.pageTop}>
                <Text style={styles.headerText}>Have someone in mind?</Text>
                <SearchBar
                searchIcon={<EvilIcons name='search' color={'#777777'} size={20} />}
                containerStyle={styles.searchBar}
                inputContainerStyle={{
                    backgroundColor:"#EDEDED",
                    height: '50%',
                }}
                inputStyle={styles.searchText}
                placeholder="Search for someone to match"
                value={searchValue}
                onChangeText={(text) => searchFunction(text)}
                onClear={() => setData(DATA)}
                autoCorrect={false}
                />
            </View>
            <Text style={styles.subheaderText}>Your friends</Text>
            <View style={styles.searchBody}>
                <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                removeClippedSubviews={true}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEFEFE'
    },
    pageTop: {
        flex: 1,
        marginHorizontal: '5%',
        marginTop: '18%'
    },
    searchBody: {
        flex: 7,
        marginHorizontal: '5%',
        marginTop: '1%'
    },
    searchResult: {
        flexDirection: 'row',
        paddingVertical: '3%',
        borderBottomWidth: 1,
        borderBottomColor: '#EDEDED'
    },
    // components
    searchBar: {
        backgroundColor: '#EDEDED',
        alignItems: 'center',
        borderRadius: 5,
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent',
        height: '50%'
    },
    // text
    headerText: {
        fontFamily: 'LatoBold',
        fontSize: 25,
        marginBottom: '3%'
    },
    subheaderText: {
        fontFamily: 'LatoBold',
        fontSize: 18,
        marginHorizontal: '5%',
        marginTop: '5%'
    },
    searchText: {
        fontFamily: 'Lato',
        color: '#777777',
        fontSize: 14,
        marginLeft: '1%'
    },
});