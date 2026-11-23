import React, { useState, useEffect, useContext } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { LinearGradient } from 'expo-linear-gradient';
import AppButton from '../../components/AppButton';
import { Auth } from 'aws-amplify';
import { AuthContext } from '../../context/AuthContext';

export default function ConfirmMatch({ route }) {
    const navigation = useNavigation();
    const {
        state: auth
    } = useContext(AuthContext);
    const { user1, user2, prompt } = route.params;

    const [profile1, setProfile1] = useState(null);
    const [profile2, setProfile2] = useState(null);
    const [imageUrl1, setImageUrl1] = useState(null);
    const [imageUrl2, setImageUrl2] = useState(null);
    const [loaded1, setLoaded1] = useState(false);
    const [loaded2, setLoaded2] = useState(false);
    const [loaded3, setLoaded3] = useState(false);
    const [loaded4, setLoaded4] = useState(false);

    //TODO: MAKE FUNCTION THAT CALCULATES AGE BASED ON DOB

    async function recordArrangement(json) {
        return fetch('http://127.0.0.1:5000/api/arrange', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(json)
        })
    }
    json = {
        "prompt" : prompt,
        "matchmaker_id" : auth.user_id,
        'user1_id' : user1["id"],
        'user2_id' : user2["id"]
    }
    // const result = await recordArrangement(json);

    async function fetchProfile1(profile_id1) {
        url = 'http://127.0.0.1:5000/api/profile/' + profile_id1;
        const response = await fetch(url);
        const json = await response.json();
        setProfile1(json);
        setLoaded1(true);
    }

    async function fetchProfile2(profile_id2) {
        url = 'http://127.0.0.1:5000/api/profile/' + profile_id2;
        const response = await fetch(url);
        const json = await response.json();
        setProfile2(json);
        setLoaded2(true);
    }

    useEffect(() => {
        fetchProfile1(user1["id"]);
        fetchProfile2(user2["id"]);
        if (user1) {
            fetch('http://127.0.0.1:5000/api/photo/profile/' + user1["id"])
                .then(response => response.blob())
                .then(blob => {
                    const url = URL.createObjectURL(blob);
                    setImageUrl1(url);
                });
            setLoaded3(true);
        }
        if (user2) {
            fetch('http://127.0.0.1:5000/api/photo/profile/' + user2["id"])
                .then(response => response.blob())
                .then(blob => {
                    const url = URL.createObjectURL(blob);
                    setImageUrl2(url);
                });
            setLoaded4(true);
        }
    }, [user1, user2]);

    useEffect(() => {
        if (json)
        {
            recordArrangement(json);
        }
    }, [json])

    if(!(loaded1 & loaded2 & loaded3 & loaded4))
    {
        return(<Text>Loading...</Text>)
    }
    else {
        return (
            <View style={styles.container}>
                <LinearGradient
                    colors={['rgba(209, 169, 248, 0.9)', 'rgba(216, 182, 192, 0.9)', 'rgba(238, 215, 188, 0.9)']}
                    style={styles.linearGradient}>
                    <View style={styles.content}>
                        <View style={styles.mutualCreatedContainer}>
                            <Text style={styles.mutualCreated}>Mutual created!</Text>
                        </View>
                        <View style={styles.images}>
                            <Image
                                style={styles.image}
                                source={{uri: imageUrl1}} />
                            <Image
                                style={styles.image}
                                source={{uri: imageUrl2}} />
                        </View>
                        <View style={styles.middleTextContainer}>
                            <Text style={styles.names}>{profile1["firstName"]} & {profile2["firstName"]}</Text>
                            <Text style={styles.notified}>have been notified — it's in their hands now!</Text>
                        </View>
                        <View style={styles.footer}>
                            <Text style={styles.patBack}>Sit back, pat yourself on the back, or</Text>
                            <AppButton title="Keep matching mutuals" style={{
                                alignItems: 'center',
                                justifyContent: 'flex-start'
                            }} fontSize={24}
                            onPress={() => navigation.navigate("BottomTabs", {
                                screen: "Main"
                            })}
                            />
                        </View>

                    </View>
                </LinearGradient>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    // containers
    container: {
        flex: 1
    },
    content: {
        flex: 1,
        height: '100%',
        alignItems: 'center'
    },
    mutualCreatedContainer: {
        marginTop: '40%',
        marginBottom: '10%'
    },
    images: {
        flexDirection: 'row',
        marginBottom: '8%'
    },
    middleTextContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    footer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: '10%'
    },
    // imageComponents
    image: {
        width: 150,
        height: 150,
        borderRadius: 100,
        marginHorizontal: 10
    },
    names: {
        fontFamily: 'LatoBold',
        fontSize: 28,
        marginBottom: '3%'
    },
    // text
    mutualCreated: {
        fontFamily: 'LatoBold',
        fontSize: 34
    },
    title: {
        fontSize: 20,
        color: '#202020',
        fontWeight: '500'
    },
    notified: {
        fontFamily: 'Lato',
        fontSize: 18
    },
    patBack: {
        fontFamily: 'Lato',
        fontSize: 18,
        marginBottom: '5%'
    },
    // background
    linearGradient: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
});