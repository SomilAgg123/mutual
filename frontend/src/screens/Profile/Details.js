import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from '../../context/AuthContext';

import Feather from 'react-native-vector-icons/Feather';
const backArrow = <Feather name="arrow-left" size={30} color="black" />;
const MUTUAL_PURPLE = "#883FCE";

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

export default function Details({ navigation }) {
    const {
        state: auth,
    } = useContext(AuthContext);
    const [photo, setPhoto] = useState(null);
    // const [photoTwo, setPhotoTwo] = useState(null);
    // const [photoThree, setPhotoThree] = useState(null);
    // const [photoFour, setPhotoFour] = useState(null);
    // const [photoFive, setPhotoFive] = useState(null);
    // const [photoSix, setPhotoSix] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loaded1, setLoaded1] = useState(false);
    const [loaded2, setLoaded2] = useState(false);
    const profile_id = 1;

    async function setProfilePhoto(profile_id, file) {
        const url = `http://127.0.0.1:5000/api/upload/${profile_id}`;
        const formData = new FormData();
        formData.append('photo', file);

        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });

        setPhoto(file);

        const data = await response.text();
        return data;
    }

    async function fetchProfile() {
        const url = 'http://127.0.0.1:5000/api/profile/' + profile_id;
        const response = await fetch(url);
        const json = await response.json();
        setProfile(json);
        setLoaded1(true);
    }

    useEffect(() => {
        if (auth) {
            fetch('http://127.0.0.1:5000/api/photo/profile/' + auth.user_id)
                .then(response => response.blob())
                .then(blob => {
                    const url = URL.createObjectURL(blob);
                    console.log(url)
                    setPhoto(url);
                });
            setLoaded2(true);
        }

    }, [auth]);

    useEffect(() => {
        fetchProfile();
    }, []);

    const selectImage = async (slot) => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            if(slot == 1) {
                setProfilePhoto(auth.user_id, result.assets[0].uri);
            }
            // else if(slot == 2) {
            //     setPhotoTwo(result.assets[0].uri);
            // }
            // else if(slot == 3) {
            //     setPhotoThree(result.assets[0].uri);
            // }
            // else if(slot == 4) {
            //     setPhotoFour(result.assets[0].uri);
            // }
            // else if(slot == 5) {
            //     setPhotoFive(result.assets[0].uri);
            // }
            // else if(slot == 6) {
            //     setPhotoSix(result.assets[0].uri);
            // }
        }
    };
    if (!(loaded1 & loaded2))
    {
        return (<Text>Loading...</Text>)
    }
    return (
        <View style={styles.container}>
            <View style={styles.subContainer}>
                <View style={[styles.row, {
                    paddingHorizontal: '5%'
                }]}>
                    <View style={styles.row}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            {backArrow}
                        </TouchableOpacity>
                        <Text style={styles.headerText}>Profile</Text>
                    </View>
                </View>
                <ScrollView padding={'5%'} showsVerticalScrollIndicator={false}>
                    <Text style={styles.subheader}>Photos</Text>
                    <Text style={styles.instructions}>Tap to replace image.</Text>
                    <View style={styles.imageGallery}>
                        <View style={styles.imageRow}>
                            <TouchableOpacity style={styles.imageBox} onPress={() => selectImage(1)}>
                                <Image source={{ uri: photo }} style={styles.image} />
                            </TouchableOpacity>
                            {/* <TouchableOpacity style={styles.imageBox} onPress={() => selectImage(2)}>
                                <Image source={{ uri: photoTwo }} style={styles.image} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.imageBox} onPress={() => selectImage(3)}>
                                <Image source={{ uri: photoThree }} style={styles.image} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.imageRow}>
                            <TouchableOpacity style={styles.imageBox} onPress={() => selectImage(4)}>
                                <Image source={{ uri: photoFour }} style={styles.image} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.imageBox} onPress={() => selectImage(5)}>
                                <Image source={{ uri: photoFive }} style={styles.image} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.imageBox} onPress={() => selectImage(6)}>
                                <Image source={{ uri: photoSix }} style={styles.image} />
                            </TouchableOpacity> */}
                        </View>
                    </View>
                    <Text style={styles.subheader}>Responses</Text>
                    <Text style={styles.instructions}>Tap to edit.</Text>
                    <TouchableOpacity style={styles.promptContainer}>
                        <Text style={styles.promptQuestion}>
                            I'm a great first date because
                        </Text>
                        <Text style={styles.promptAnswer}>
                            i am the funniest person on earth
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.promptContainer}>
                        <Text style={styles.promptQuestion}>
                            I'm a great first date because
                        </Text>
                        <Text style={styles.promptAnswer}>
                            i am the funniest person on earth
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </View>
    );
}

const IMG_SIZE = 100;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEFEFE',
    },
    subContainer: {
        marginTop: '18%',
        // paddingHorizontal: '5%'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    imageGallery: {

    },
    imageRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: '4%'
    },
    imageBox: {
        borderWidth: 1,
        borderRadius: 10
    },
    promptContainer: {
        // borderWidth: 1,
        borderRadius: 10,
        padding: '5%',
        marginTop: '5%',
        backgroundColor: 'white',

        shadowColor: '#000000',
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
    },
    // components
    image: {
        width: IMG_SIZE,
        height: IMG_SIZE,
        borderRadius: 10
    },
    // text
    headerText: {
        marginLeft: '3%',
        fontFamily: 'LatoBold',
        fontSize: 26
    },
    subheader: {
        marginTop: '3%',
        fontFamily: 'LatoBold',
        fontSize: 20
    },
    instructions: {
        marginTop: '1.5%',
        fontFamily: 'Lato',
        fontSize: 16
    },
    promptQuestion: {
        fontFamily: 'Lato',
        fontSize: 20
    },
    promptAnswer: {
        marginTop: '2%',
        fontFamily: 'LatoBold',
        fontSize: 28
    },
    editText: {
        fontFamily: 'Lato',
        color: MUTUAL_PURPLE
    }
});