import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, Modal, Pressable, TouchableOpacity, FlatList } from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { ListItem, SearchBar } from "react-native-elements";
import { AuthContext } from '../../context/AuthContext';

import Feather from 'react-native-vector-icons/Feather';
import RecommendedCard from '../../components/RecommendedCard';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Octicons from 'react-native-vector-icons/Octicons';

import SearchResult from '../../components/SearchResult';

const backArrow = <Feather name="arrow-left" size={35} color="black" />;
const xIcon = <Octicons name="x" size={20} color="black" />

const SearchModal = (allProfiles, { closeModal }) => {
    const [data, setData] = useState(allProfiles);
    const [searchValue, setSearchValue] = useState("");
    const [friends, setFriends] = useState(null);
    const [loaded, setLoaded] = useState(null);
    const {
        state: auth,
    } = useContext(AuthContext);

    const searchFunction = (text) => {
        var updatedData = allProfiles;
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

    async function fetchFriends(profile_id) {
        const url = 'http://127.0.0.1:5000/api/friend/list/' + profile_id;
        const response = await fetch(url);
        const json = await response.json();
        setFriends(json);
        setLoaded(true);
    }

    useEffect(() => {
        fetchFriends(auth.user_id); // now this data is loaded from the endpoint, pass in the result to the cards
    }, []);

    if(!loaded) {
        return(<Text>Loading...</Text>)
    }
    else {
        return (
            <View style={styles.modalSupercontainer}>
                <View style={styles.pageTop}>
                    <TouchableOpacity style={styles.modalX} onPress={closeModal}>
                        {xIcon}
                    </TouchableOpacity>
                    <Text style={styles.searchSomeoneInMindText}>Have someone in mind?</Text>
                    <SearchBar
                        searchIcon={<EvilIcons name='search' color={'#777777'} size={25} />}
                        containerStyle={styles.searchContainer}
                        inputContainerStyle={styles.searchInputStyle}
                        inputStyle={styles.searchBarText}
                        placeholder="Search for someone to match"
                        value={searchValue}
                        onChangeText={(text) => searchFunction(text)}
                        onClear={() => setData(allProfiles)}
                        autoCorrect={false}
                    />
                </View>
                <Text style={styles.subheaderText}>Your friends</Text>
                <View style={styles.listBody}>
                    <FlatList
                        data={friends}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        removeClippedSubviews={true}
                    />
                </View>
            </View>
        );
    }
}

export default function Arrange({ nav, route }) {
    const navigation = useNavigation();
    const {
        state: auth,
    } = useContext(AuthContext);

    console.log("ROUTES")
    console.log(route)
    const {
        card: card
    } = route.params;

    const [modalVisible, setModalVisible] = useState(false);
    const [profile, setProfile] = useState(null);
    const [allProfiles, setAllProfiles] = useState(null);
    const [loaded1, setLoaded1] = useState(false);
    const [loaded2, setLoaded2] = useState(false);
    const [loaded3, setLoaded3] = useState(false);
    const [recommendations, setRecommendations] = useState(null);

    async function fetchProfile(profile_id) {
        const url = 'http://127.0.0.1:5000/api/profile/' + profile_id;
        const response = await fetch(url);
        const json = await response.json();
        setProfile(json);
        setLoaded1(true);
    }

    async function fetchPotentialArrangeRecommendations(profile_id) {
        const url = 'http://127.0.0.1:5000/api/arrange/recommendations/' + profile_id;
        const response = await fetch(url);
        const json = await response.json();
        setRecommendations(json);
        setLoaded2(true);
    }

    async function fetchAllProfiles() {
        const url = 'http://127.0.0.1:5000/api/profile'
        const response = await fetch(url);
        const json = await response.json()
        setAllProfiles(json);
        setLoaded3(true);
    }

    useEffect(() => {
        console.log("CARD ID")
        console.log(card["id"])
        fetchProfile(card["id"]);
        fetchPotentialArrangeRecommendations(card["id"]);
        fetchAllProfiles();
    }, []);

    console.log(loaded1)
    console.log(loaded2)
    console.log(loaded3)
    if(!(loaded1 & loaded2 & loaded3)) {
        return(<Text>Loading...</Text>)
    }
    else {
        return (
            <View style={[styles.container]}>
                <View style={styles.topScreen}>
                    <View style={{ flexDirection: 'row' }}>
                        <Pressable color="#883FCE" onPress={() => navigation.goBack()}>
                            {backArrow}
                        </Pressable>
                        <Text style={styles.pageTitle}>{profile.first_name}'s best matches</Text>
                    </View>
                    <Text style={styles.headerText}>Select a mutual to see what makes them a great match.</Text>
                    <Text style={styles.headerItalText}>Note: your mutuals won't see your compatibility scores.</Text>
                </View>
                <View style={styles.grid}>
                    <View style={styles.row}>
                        {Object.keys(recommendations).length > 0 ?
                            <RecommendedCard user1={card} user2={recommendations[0]} similarityScore={recommendations[0].similarity_score} complementaryScore={recommendations[0].complementarity_score} />
                            : null
                        }
                        {Object.keys(recommendations).length > 1 ?
                            <RecommendedCard user1={card} user2={recommendations[1]} similarityScore={recommendations[1].similarity_score} complementaryScore={recommendations[1].complementarity_score} />
                            : null
                        }
                    </View>
                    <View style={styles.row}>
                        {Object.keys(recommendations).length > 2 ?
                            <RecommendedCard user1={card} user2={recommendations[2]} similarityScore={recommendations[2].similarity_score} complementaryScore={recommendations[2].complementarity_score} />
                            : null
                        }
                        {Object.keys(recommendations).length > 3 ?
                            <RecommendedCard user1={card} user2={recommendations[3]} similarityScore={recommendations[3].similarity_score} complementaryScore={recommendations[3].complementarity_score} />
                            : null
                        }
                    </View>
                </View>
                <View style={styles.bottomScreen}>
                    <Text style={styles.bottomText}>or</Text>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible);
                        }}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalSubcontainer}>
                                <SearchModal profiles={allProfiles} closeModal={() => setModalVisible(false)} />
                            </View>
                        </View>
                    </Modal>
                    <View style={styles.searchForSomeoneElse}>
                        <TouchableOpacity style={styles.modalPopupButtons}
                        onPress={() => setModalVisible(!modalVisible)}>
                            <Text style={styles.searchText}>have someone in mind?</Text>
                            <Icon name='search' size={18} color='#883FCE' />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    searchContainer: {
        width: '100%',
        backgroundColor: 'transparent',
        borderRadius: 5,
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent',
        padding: 0
    },
    searchInputStyle: {
        backgroundColor: "#EDEDED",
        height: '85%',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalSupercontainer: {
        flex: 1,
        marginHorizontal: '5%'
    },
    modalSubcontainer: {
        flex: 0.75,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 0,
        width: '100%',
        height: '75%',
        // alignItems: 'center',
    },
    listBody: {
        flex: 7,
        marginTop: '1%'
    },
    // components
    row: {
        flex: 1,
        flexDirection: 'row'
    },
    grid: {
        flex: 7
    },
    pageTop: {
        flex: 1,
        marginTop: '5%'
    },
    topScreen: {
        flex: 2,
        justifyContent: 'center',
        marginLeft: '5%',
        marginTop: '11%'
    },
    bottomScreen: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    // text
    pageTitle: {
        fontFamily: 'LatoBold',
        fontSize: 28,
        marginLeft: '2%'
    },
    headerText: {
        fontFamily: 'Lato',
        fontSize: 22,
        marginTop: '2%'
    },
    bottomText: {
        fontFamily: 'Lato',
        fontSize: 22,
    },
    headerItalText: {
        // fontStyle: 'italic',
        fontFamily: 'LatoItalic',
        marginTop: '3%'
    },
    searchText: {
        color: '#883FCE',
        fontFamily: 'LatoBold',
        marginTop: '2%',
        paddingBottom: '1%',
    },
    searchSomeoneInMindText: {
        fontSize: 25,
        fontFamily: 'LatoBold',
        marginBottom: '2.5%',
        marginTop: '2.5%'
    },
    searchBarText: {
        fontFamily: 'Lato',
        color: '#777777',
        fontSize: 14,
        marginLeft: '1%'
    },
    subheaderText: {
        fontFamily: 'LatoBold',
        fontSize: 18,
        marginTop: '15%'
    },
    // buttons
    modalX: {
        alignSelf: 'flex-end'
    },
    searchForSomeoneElse: {
        flexDirection: 'row',
        borderBottomColor: "#883FCE",
        borderBottomWidth: 1,
        alignItems: 'center'
    },
    backButton: {
        marginTop: '10%',
        marginBottom: '5%'
    },
    backButtonPressed: {
        marginTop: '10%',
        marginBottom: '5%'
    },
    modalPopupButtons: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});