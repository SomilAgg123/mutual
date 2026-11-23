import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, Pressable } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { useNavigation } from '@react-navigation/native';

import { Dimensions } from "react-native";

import AppButton from '../../components/AppButton';
import BackButton from '../../components/BackButton';
import ScoreCircle from '../../components/ScoreCircle';
import { ConsoleLogger } from '@aws-amplify/core';
import { AuthContext } from '../../context/AuthContext';

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;

const MUTUAL_PURPLE = "#883FCE"

const locationPin = <Ionicons name="md-location-outline" size={18} color="black" />
const heart = <MaterialCommunityIcons style={{
    marginRight: '5%'
}} name="hand-heart-outline" size={30} color="white" />
const pencil = <FontAwesome5 name="pen" size={18} color={MUTUAL_PURPLE} />

export default function Arrange2({ route }) {
    const navigation = useNavigation();
    const {
        state: auth,
    } = useContext(AuthContext);
    const {
        user1,
        user2,
        similarityScore,
        complementaryScore
    } = route.params;
    const [editing, setEditing] = useState(false);
    const [reasons, setReasons] = useState(null);
    const [scores, setScores] = useState(null);
    const [profile1, setProfile1] = useState(null);
    const [profile2, setProfile2] = useState(null);
    const [loaded1, setLoaded1] = useState(false);
    const [loaded2, setLoaded2] = useState(false);
    const [loaded3, setLoaded3] = useState(false);
    const [loaded4, setLoaded4] = useState(false);
    const [loaded5, setLoaded5] = useState(false);
    const [loaded6, setLoaded6] = useState(false);
    const [loaded7, setLoaded7] = useState(false);
    const [loaded8, setLoaded8] = useState(false);
    const [imageUrl1, setImageUrl1] = useState('');
    const [imageUrl2, setImageUrl2] = useState('');
    const [reason1, setReason1] = useState('');
    const [reason2, setReason2] = useState('');

    //TODO: MAKE FUNCTION THAT CALCULATES AGE BASED ON DOB

    async function fetchScores(profile_id1, profile_id2) {
        const url = 'http://127.0.0.1:5000/api/scores/' + profile_id1 + "/" + profile_id2;
        const response = await fetch(url);
        const json = await response.json();
        setScores(json);
        setLoaded1(true);
    }

    async function fetchReasons(profile_id1, profile_id2) {
        const url = 'http://127.0.0.1:5000/api/scores/reasons/' + profile_id1 + "/" + profile_id2;
        const response = await fetch(url);
        const json = await response.json();
        setReasons(json);
        setLoaded2(true);
        return json;
    }

    async function fetchProfile1(profile_id1) {
        const url = 'http://127.0.0.1:5000/api/profile/' + profile_id1;
        console.log("INSIDE LOADED 3")
        console.log(profile_id1)
        const response = await fetch(url);
        const json = await response.json();
        setProfile1(json);
        setLoaded3(true);
    }

    async function fetchProfile2(profile_id2) {
        const url = 'http://127.0.0.1:5000/api/profile/' + profile_id2;
        const response = await fetch(url);
        const json = await response.json();
        setProfile2(json);
        setLoaded4(true);
    }

    async function fetchReason1Text(proflie_id1, profile_id2, reason1) {
        const url = 'http://127.0.0.1:5000/api/scores/reasons/prompt/' + proflie_id1 + '/' + profile_id2 + '/' + reason1;
        const response = await fetch(url);
        const text = await response.text();
        setReason1(text);
        setLoaded7(true);
    }
    async function fetchReason2Text(proflie_id1, profile_id2, reason2) {
        const url = 'http://127.0.0.1:5000/api/scores/reasons/prompt/' + proflie_id1 + '/' + profile_id2 + '/' + reason2;
        const response = await fetch(url);
        const text = await response.text();
        setReason2(text);
        setLoaded8(true);
    }

    useEffect(() => {
        fetchReasons(user1["id"], user2["id"]);
        fetchScores(user1["id"], user2["id"]);
        fetchProfile1(user1["id"]);
        fetchProfile2(user2["id"]);
        // fetchPFP1(user1["id"]);
        // fetchPFP2(user2["id"]);

        if (user1) {
            fetch('http://127.0.0.1:5000/api/photo/profile/' + user1["id"])
                .then(response => response.blob())
                .then(blob => {
                    const url = URL.createObjectURL(blob);
                    console.log(url)
                    setImageUrl1(url);
                });
            setLoaded5(true);
        }
        if (user2) {
            fetch('http://127.0.0.1:5000/api/photo/profile/' + user2["id"])
                .then(response => response.blob())
                .then(blob => {
                    const url = URL.createObjectURL(blob);
                    console.log(url)
                    setImageUrl2(url);
                });
            setLoaded6(true);
        }
    }, [user1, user2]);

    useEffect(() => {
        if (reasons)
        {
            fetchReason1Text(user1["id"], user2["id"], Object.keys(Object.values(reasons)[0])[0]);
            fetchReason2Text(user1["id"], user2["id"], Object.keys(Object.values(reasons)[1])[0]);
        }
    }, [reasons]);

    console.log("LOADED VALUES")
    console.log(user1)
    console.log(user2)
    console.log(loaded1) //true
    console.log(loaded2) //true
    console.log(loaded3) //false
    console.log(loaded4) //true
    console.log(loaded5) //false
    console.log(loaded6) //false
    console.log(loaded7) //true
    console.log(loaded8) //true

    if (!(loaded1 & loaded2 & loaded3 & loaded4 & loaded5 & loaded6 & loaded7 & loaded8)) {
        return (<Text>Loading...</Text>)
    }
    else {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.imageGalleryContainer}>
                        <View style={styles.imageGallery}>
                            <Image
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: 10
                                }}
                                // temporary change, pfp2[0].PhotoURL
                                source={{uri: imageUrl2}} />
                            <BackButton
                                style={{
                                    position: 'absolute',
                                    top: '4%',
                                    left: '4%'
                                }}
                                onPress={() => navigation.goBack()}
                                hasBackground={true}
                                navigation={navigation}
                            />
                        </View>
                    </View>
                    <View style={styles.demographicInfoContainer}>
                        <View style={styles.demographicInfo}>
                            <Text style={styles.name}>{profile2.firstName}, {22}</Text>
                            <View style={styles.locationRow}>
                                {locationPin}
                                <Text style={styles.location}>{profile2.currentLocation}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.circles}>
                        <ScoreCircle title={"Similarity"} percent={scores["similarity_score"]} color={"#EC6485"} size={75} textShown={true} />
                        <ScoreCircle title={"Complementarity"} percent={scores["complementarity_score"]} color={"#9EDD88"} size={75} textShown={true} />
                    </View>
                    <View style={styles.matchmakerInfoContainer}>
                        <View style={styles.matchmakerInfo}>
                            <View style={styles.reasonsRow}>
                                <Text style={styles.prompt}>{profile1.firstName} & {profile2.firstName} would be a great fit because...</Text>
                                <Pressable style={({ pressed }) =>
                                    pressed ? styles.editButton : [styles.editButton, styles.shadowProp]
                                }
                                    onPress={() => setEditing(!editing)}>
                                    {pencil}
                                </Pressable>
                            </View>
                            {editing ?
                                <Text style={{
                                    fontFamily: 'Lato',
                                    color: MUTUAL_PURPLE,
                                    fontSize: 16,
                                    marginBottom: 5
                                }}>
                                    tap and edit the reasons below!
                                </Text> : null}
                            {!editing ?
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.promptResponse}>1. </Text>
                                    <Text style={styles.promptResponse}>{reason1}</Text>
                                </View>
                                :
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.promptResponse}>1. </Text>
                                    <TextInput
                                        multiline
                                        value={reason1}
                                        onChangeText={(newText) => setReason1(newText)}
                                        style={[styles.promptResponse, {
                                            flex: 1,
                                            alignSelf: 'flex-start',
                                            paddingTop: 0,
                                            paddingBottom: 0,
                                        }]} />
                                </View>
                            }
                            {!editing ?
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.promptResponse}>2. </Text>
                                    <Text style={styles.promptResponse}>{reason2}</Text>
                                </View>
                                :
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.promptResponse}>2. </Text>
                                    <TextInput
                                        multiline
                                        value={reason2}
                                        onChangeText={(newText) => setReason2(newText)}
                                        style={[styles.promptResponse, {
                                            flex: 1,
                                            alignSelf: 'flex-start',
                                            paddingTop: 0,
                                            paddingBottom: 0,
                                        }]} />
                                </View>
                            }
                        </View>
                    </View>
                </ScrollView>
                <AppButton
                    style={styles.arrangeButton}
                    title="Create mutual"
                    icon={heart}
                    fontSize={24}
                    onPress={() => navigation.navigate("MatchPrompts", {
                        user1: user1,
                        user2: user2,
                        reason1: reason1,
                        reason2: reason2
                    })} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    // containers
    container: {
        flex: 1, // occupy whole container
        backgroundColor: '#FEFEFE',
        justifyContent: 'flex-start',
        paddingHorizontal: '6.15%',
    },
    imageGalleryContainer: {
        marginTop: 50,
        // borderColor: 'red',
        // borderWidth: '1px'
    },
    demographicInfoContainer: {
        // borderColor: 'red',
        // borderWidth: '1px'
    },
    matchmakerInfoContainer: {
        // borderColor: 'red',
        // borderWidth: 1,
    },
    // components
    imageGallery: {
        height: SCREEN_HEIGHT * 0.4,
        width: SCREEN_HEIGHT * 0.4,
        // borderColor: 'black',
        // borderWidth: '1px',
        marginBottom: 20,
    },
    matchmakerInfo: {
        // borderColor: 'blue',
        // borderWidth: 5
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    reasonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    circles: {
        flexDirection: "row",
        justifyContent: 'space-evenly',
        marginTop: '7%',
        // borderWidth: 1
    },
    // text components
    name: {
        fontFamily: 'LatoBold',
        fontSize: 34,
        marginBottom: 5
    },
    location: {
        fontFamily: 'Lato',
        fontSize: 16
    },
    prompt: {
        fontFamily: 'Lato',
        fontSize: 20,
        marginBottom: 12,
        width: '80%'
    },
    promptResponse: {
        fontFamily: 'LatoBold',
        fontSize: 28,
        marginBottom: '3%',
        flexShrink: 1,
        flexWrap: 'wrap'
    },
    // buttons
    arrangeButton: {
        marginBottom: '5%',
        width: '95%',
        alignSelf: 'center',
        height: '8%'
    },
    editButton: {
        height: 45,
        width: 45,
        alignItems: 'center',
        justifyContent: 'center',
        // paddingHorizontal: '4%',
        // paddingVertical: '4%',
        borderRadius: 100,
        elevation: 3,
        backgroundColor: "#FEFEFE",
    },
    shadowProp: {
        shadowColor: 'black',
        shadowOffset: {
            width: 2.05,
            height: 4.1
        },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 3
    }
});
