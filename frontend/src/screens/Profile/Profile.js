import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { OnboardContext } from '../../context/OnboardContext';
import { AuthContext } from '../../context/AuthContext';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';

const MUTUAL_PURPLE = "#883FCE";
const LIGHT_GREY = "#EDEDED";

const pencil = <FontAwesome5 name="pen" size={25} color={MUTUAL_PURPLE} />
const backArrow = <Feather name="arrow-left" size={30} color="black" />;

const img_eight = require('../../../assets/images/man_looking_off.png');

const ProfileOption = ({ style, onPress, navigation, optionName }) => {
    return (
        <View>
            <TouchableOpacity onPress={onPress} style={[styles.optionBox, style]}>
                <Text style={styles.optionName}>
                    {optionName}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [loaded1, setLoaded1] = useState(false);
    const [loaded2, setLoaded2] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const { state:auth } = useContext(AuthContext);

    useEffect(() => {
        if (auth) {
            fetch('http://127.0.0.1:5000/api/photo/profile/' + auth.user_id)
                .then(response => response.blob())
                .then(blob => {
                    const url = URL.createObjectURL(blob);
                    console.log(url)
                    setImageUrl(url);
                });
            setLoaded2(true);
        }

    }, [auth]);

    async function fetchProfile(profile_id) {
        const url = 'http://127.0.0.1:5000/api/profile/' + profile_id;
        const response = await(fetch(url));
        const json = await response.json();
        setProfile(json);
        setLoaded1(true);
    }

    useEffect(() => {
        fetchProfile(auth.user_id);
    }, [auth])

    const navigation = useNavigation();

    const logOut = () => {
        Alert.alert('Log out?', 'Are you sure you want to sign out?', [
            {text: 'Yes', onPress: () => console.log('Yes button clicked')},
            {text: 'No', onPress: () => console.log('No button clicked'), style: 'cancel'},
          ],
          {
            cancelable: true
          });
    }
    if (!(loaded1 & loaded2)) {
        return (<Text>Loading...</Text>)
    }
    else {
        return (
            <View style={styles.container}>
                <View style={styles.subContainer}>
                    <Text style={styles.header}>Settings</Text>
                    <View style={styles.topSection}>
                        <Image style={styles.image} source={{ uri: imageUrl}} />
                        <View style={styles.row}>
                            <Text style={styles.name}>{profile["firstName"]}</Text>
                            <TouchableOpacity onPress={() => navigation.navigate("Profile Details")}>
                                {pencil}
                            </TouchableOpacity>
                        </View>
                    </View>
                    <ProfileOption
                    onPress={() => navigation.navigate("Personal")}
                    optionName="Personal Information" />
                    {/* <ProfileOption
                    onPress={() => navigation.navigate("Similarity")}
                    optionName="Similarity Profile" />
                    <ProfileOption
                    onPress={() => navigation.navigate("Complementarity")}
                    optionName="Complementarity Profile" /> */}
                    <ProfileOption
                    onPress={() => navigation.navigate("Help")}
                    optionName="Help Center"/>
                    <ProfileOption
                    onPress={() => navigation.navigate("Account Management")}
                    optionName="Account Management"/>
                    <ProfileOption
                    onPress={() => logOut()}
                    style={{
                        borderBottomWidth: 1,
                        borderBottomColor: LIGHT_GREY
                    }}
                    optionName="Log Out" />

                </View>
            </View>
        );
    }
}

const IMG_SIZE = 134;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEFEFE',
    },
    subContainer: {
        flex: 1,
        paddingHorizontal: '5%',
        marginVertical: '18%'
    },
    topSection: {
        marginTop: '10%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '10%',
    },
    row: {
        marginTop: '3%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    // components
    image: {
        width: IMG_SIZE,
        height: IMG_SIZE,
        borderRadius: 100
    },
    optionBox: {
        borderTopColor: LIGHT_GREY,
        borderTopWidth: 1,
    },
    // text
    header: {
        fontFamily: 'LatoBold',
        fontSize: 30
    },
    name: {
        fontFamily: 'LatoBold',
        fontSize: 28,
        marginRight: '3%'
    },
    optionName: {
        fontFamily: 'LatoBold',
        fontSize: 18,
        padding: '5%'
    }
});