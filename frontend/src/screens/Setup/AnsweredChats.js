import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import MatchResponseCard from '../../components/MatchResponseCard';
import { useNavigation } from '@react-navigation/native';

import EvilIcons from 'react-native-vector-icons/EvilIcons';

const somil = require('../../../assets/images/man.png');
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

export default function AnsweredChats() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.topItems}>
                <Text style={styles.header}>Friends you've arranged</Text>
                {/* <View style={styles.searchBar}>
                    <EvilIcons name='search' color={'#777777'} size={30} />
                    <Text style={styles.searchText}>Search</Text>
                </View> */}
            </View>
            <ScrollView style={styles.chats}>
                <MatchResponseCard
                nameOne="Olivia"
                nameTwo="Nathan"
                prompt="What's a superlative Jake definitely got in high school?"
                imageOne={img_one}
                imageTwo={img_four}
                date="2/4/23"
                />
                <MatchResponseCard
                nameOne="Indiana"
                nameTwo="Reeve"
                imageOne={img_six}
                imageTwo={img_eight}
                prompt="What do you and Jake usually do together?"
                date="2/4/23"
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEFEFE'
    },
    topItems: {
        marginHorizontal: '5%',
    },
    header: {
        marginTop: '18%',
        fontFamily: 'LatoBold',
        fontSize: 25,
        marginBottom: '5%'
    },
    chats: {

    },
    // components
    searchBar: {
        flexDirection: 'row',
        backgroundColor: '#EDEDED',
        alignItems: 'center',
        width: '100%',
        paddingVertical: '2%',
        borderRadius: 5,
        // spacing
        marginVertical: '4%',
    },
    // text
    searchText: {
        fontFamily: 'Lato',
        color: '#777777',
        fontSize: 14
    }
});