import React, { useEffect, useState, useRef, useContext } from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

import { Dimensions } from "react-native";
import { AuthContext } from '../../context/AuthContext';

import * as Animatable from 'react-native-animatable';

import FeatherIcon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Auth } from 'aws-amplify';

const heartSlash = <Ionicons name="ios-heart-dislike-outline" size={40} color="black" />
const locationPin = <Ionicons name="md-location-outline" size={18} color="black" />

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;

const Card = ({ card, user, onDiscard, index, navigation }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [loaded, setLoaded] = useState(false);
    const {
        state: auth,
    } = useContext(AuthContext);

    useEffect(() => {
        if (card) {
            fetch('http://127.0.0.1:5000/api/photo/profile/' + card["id"])
                .then(response => response.blob())
                .then(blob => {
                    const url = URL.createObjectURL(blob);
                    console.log(url)
                    setImageUrl(url);
                });
            setLoaded(true);
        }

    }, [card]);

    const scrollRef = useRef();

    const onPressTouch = () => {
        scrollRef.current?.scrollTo({
            y: 0,
            animated: true,
        });
    }

    const discardCard = async (profile_id1, profile_id2, rejected) => {

        async function recordRejection(profile_id1, profile_id2, rejected) {
            return fetch('http://127.0.0.1:5000/api/interaction/' + profile_id1 + '/' + profile_id2 + '/' + rejected, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
        }
        const result = await recordRejection(profile_id1, profile_id2, rejected);
        setIsAnimating(true);
        onPressTouch();
        setTimeout(() => {
            setIsAnimating(false);
            onDiscard();
        }, 1500);
    };
    if (!(loaded)) {
        return (<Text>Loading...</Text>)
    }
    else {
        return (
            <View style={{ flex: 1 }}>
                <Animatable.View
                    animation={isAnimating ? 'fadeOutLeft' : (index == 0 ?
                        null : 'fadeInRight'
                    )}
                    style={{
                        flex: 1,
                    }}>
                    <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
                        <View style={styles.imageGalleryContainer}>
                            <View style={styles.imageGallery}>
                                {console.log("IMAGE URL")}
                                {console.log(imageUrl)}
                                <Image
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: 10
                                    }}
                                    source={{uri: imageUrl}} />
                                {/* // source={card.profile_photo_url} /> */}
                            </View>
                        </View>
                        <View style={styles.demographicInfoContainer}>
                            <View style={styles.demographicInfo}>
                                <Text style={styles.name}>{card.first_name} {card.last_name}</Text>
                                <View style={styles.locationRow}>
                                    {locationPin}
                                    <Text style={styles.location}>{card.current_location}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.matchmakerInfoContainer}>
                            <View style={styles.matchmakerInfo}>
                                <Text style={styles.prompt}>I'm a great first date because</Text>
                                <Text style={styles.promptResponse}>{card.answer1}</Text>
                            </View>
                            <View style={styles.matchmakerInfo}>
                                <Text style={styles.prompt}>We'll vibe if...</Text>
                                <Text style={styles.promptResponse}>{card.answer2}</Text>
                            </View>
                        </View>
                        <View style={{
                            marginBottom: '50%'
                        }}>

                        </View>
                    </ScrollView>
                </Animatable.View>
                <View style={styles.bottomButtons}>
                    <Pressable color="#883FCE"
                        onPress={() => {
                            discardCard(auth.user_id, card["id"], 1)
                        }}
                        style={({ pressed }) =>
                            pressed ?
                                styles.nextButtonPressed :
                                styles.nextButton
                        }>
                        {heartSlash}
                    </Pressable>
                    <Pressable color="#883FCE"
                        style={({ pressed }) =>
                            pressed ?
                                styles.mutualButtonPressed :
                                styles.mutualButton
                        }
                        onPress={() => {
                            discardCard(auth.user_id, card["id"], 0);
                            navigation.navigate("ArrangeNavigator", {
                                screen: 'Arrange',
                                params: {
                                    card: card
                                }
                            })
                        }}>
                        <Text style={styles.mutualButtonText}>Find me a mutual!</Text>
                    </Pressable>
                </View>
            </View>
        );
    }
}

export default function Source() {
    const navigation = useNavigation();
    const {
        state: auth,
        set_user_id
    } = useContext(AuthContext);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [profile, setProfile] = useState(null);
    const [profile_id, setProfileId] = useState(null);
    const [cardStack, setCardStack] = useState(null);
    const [loaded1, setLoaded1] = useState(false);
    const [card, setCard] = useState(null);
    const [loaded2, setLoaded2] = useState(false);
    const [loaded3, setLoaded3] = useState(false);

    // const profile_id = 1; // TODO: CHANGE THIS

    async function fetchCardStack(profile_id) {
        url = 'http://127.0.0.1:5000/api/card/stack/' + profile_id;
        const response = await fetch(url);
        const json = await response.json();
        setCardStack(json);
        setLoaded1(true);
        return json;
    }

    async function fetchCard(profile_id) {
        url = 'http://127.0.0.1:5000/api/card/' + profile_id;
        const response = await fetch(url);
        const json = await response.json();
        setCard(json);
        setLoaded2(true);
    }

    async function fetchProfileFromEmail(email) {
        url = 'http://127.0.0.1:5000/api/profile/email/' + email;
        const response = await fetch(url);
        const json = await response.json()
        setProfile(json);
        setLoaded3(true);
        set_user_id(json["id"]);
        setProfileId(json["id"])
        return json["id"]
    }

    // useEffect(() => {
    //    const getCard = async () => {

    //         const ret_id = await fetchProfileFromEmail(auth.email);
    //         const result = await fetchCardStack(ret_id);
    //         fetchCard(result["0"]["id"]);
    //     }
    //     getCard();
    // }, []);

    useEffect(() => {
        // console.log("AUTH EMAIL");
        // console.log(auth.email)
        fetchProfileFromEmail('demo@example.com');
    }, []);

    useEffect(() => {
        if (profile_id) {
            console.log("PROFILE ID")
            console.log(profile_id)
            fetchCardStack(profile_id)
        }
    }, [profile_id])

    useEffect(() => {
        if (cardStack) {
            console.log("CARDSTACK")
            console.log(cardStack)
            fetchCard(cardStack["0"]["id"])
        }
    }, [cardStack]);

    const discardProfile = async () => {
        if (currentIndex < cardStack.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
        await fetchCard(currentIndex);
    };

    if (!(loaded1 && loaded2 & loaded3)) {
        // if not both objects are loaded
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Text>LOADING</Text>
            </View>
        )
    }
    else {
        // if both loaded
        console.log("CARD")
        console.log(card)
        return (
            <View style={styles.container}>
                <Card card={card} index={currentIndex} user={cardStack[currentIndex]} navigation={navigation} onDiscard={discardProfile} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    // containers
    container: {
        flex: 1, // occupy whole container
        backgroundColor: '#FEFEFE',
        justifyContent: 'flex-start',
        paddingHorizontal: '6.15%'
    },
    imageGalleryContainer: {
        marginTop: 50
    },
    demographicInfoContainer: {
        // borderColor: 'red',
        // borderWidth: '1px'
    },
    matchmakerInfoContainer: {
        // borderColor: 'red',
        // borderWidth: '1px',
    },
    // components
    imageGallery: {
        height: SCREEN_HEIGHT * 0.4,
        width: SCREEN_HEIGHT * 0.4,
        // borderColor: 'black',
        // borderWidth: '1px',
        marginBottom: 20,
        marginTop: 20
    },
    matchmakerInfo: {
        // borderColor: 'blue',
        // borderWidth: '1px',
        marginTop: 37
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center'
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
        marginBottom: 12
    },
    promptResponse: {
        fontFamily: 'LatoBold',
        fontSize: 28,
        textTransform: 'lowercase',
    },
    // buttons
    bottomButtons: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        height: '10%',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(52, 52, 52, 0)'
    },
    mutualButton: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        width: '78%',
        height: 70,
        borderRadius: 40,
        elevation: 3,
        backgroundColor: '#883FCE',

        shadowColor: 'black',
        shadowOffset: {
            width: -2,
            height: 4
        },
        shadowOpacity: 0.25,
        shadowRadius: 1,
        elevation: 3
    },
    mutualButtonPressed: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        width: '78%',
        height: 70,
        borderRadius: 40,

        backgroundColor: '#883FCE',
    },
    mutualButtonText: {
        fontFamily: 'LatoBold',
        fontSize: 24,
        lineHeight: 24,
        letterSpacing: 0.25,
        color: 'white',
        marginLeft: 9.5
    },
    nextButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        elevation: 3,
        backgroundColor: 'white',
        width: 70,
        height: 70,

        shadowColor: 'black',
        shadowOffset: {
            width: -2,
            height: 4
        },
        shadowOpacity: 0.25,
        shadowRadius: 1,
        elevation: 3
    },
    nextButtonPressed: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        elevation: 3,
        backgroundColor: 'white',
        width: 70,
        height: 70,
    },
    nextButtonContent: {
        fontFamily: 'Lato',
        fontSize: 24,
        color: 'black'
    }
});