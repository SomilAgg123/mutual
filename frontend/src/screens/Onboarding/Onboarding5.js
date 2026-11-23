import React, { useContext, useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable, VirtualizedList, Touchable, TouchableOpacity } from 'react-native';
import TextQuestion from '../../components/TextQuestion';
import { AuthContext } from '../../context/AuthContext';
import { OnboardContext } from '../../context/OnboardContext';
import { ScrollView } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AppButton from '../../components/AppButton';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../../components/BackButton';

const right = <MaterialCommunityIcons style={{
    marginRight: '5%'
}} name="chevron-right" size={30} color="white" />

export default function Onboarding5({ updateAuthState, setToken }) {
    // const { state } = useContext(AuthContext);
    const { state: auth, signout } = useContext(AuthContext);
    const navigation = useNavigation();
    const [isVisible, setIsVisible] = useState(false);
    const {
        state: onboard,
        setAnswer1,
        setAnswer2,
        makeProfile,
        setEmail
    } = useContext(OnboardContext);

    const handlePress = () => {
        setIsVisible(true);
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.wholePage}>
                    <BackButton
                        style={{
                            position: 'relative',
                            top: '0%',
                        }}
                        onPress={() => navigation.goBack()}
                        hasBackground={true}
                        navigation={navigation}
                    />
                    <View styles={styles.questions}>
                        <Text style={{
                            fontSize: 24,
                            fontFamily: 'LatoBold',
                            marginTop: '8%',
                            marginBottom: '3%'
                        }}>Step 5: What Matchmakers See</Text>
                        <Text style={styles.subtitle}>The following simple questions will be what peolple see on your profile!</Text>
                        <TextQuestion setToken={setToken} setField={setAnswer1} title={'What makes you a great first date?'} placeholder={'Enter answer'}/>
                        <TextQuestion setToken={setToken} setField={setAnswer2} title={'We will vibe if...'} placeholder={'Enter answer'} />
                    </View>
                    {isVisible && <Text style={styles.requiredBottom}>*Fill out the required fields.</Text>}
                    <AppButton
                        style={styles.arrangeButton}
                        title="Next"
                        icon={right}
                        fontSize={24}
                        onPress={() =>
                            {
                                if (onboard.answer1 == null ||
                                    onboard.answer2 == null)
                                {
                                    handlePress();
                                }
                                else
                                {
                                    makeProfile(onboard);
                                }
                            }
                        }
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    wholePage: {
        marginLeft: '6%',
        marginTop: '20%',
        marginRight: '6%'
    },
    topPage: {

    },
    pageTitle: {
        fontFamily: 'LatoBold',
        fontSize: 30,
        marginTop: '4%'
    },
    subtitle: {
        fontFamily: 'Lato',
        fontSize: 18,
        marginTop: '2%'
    },
    questions: {
        flex: 3,
        // marginTop: '80%'
    },
    bottomPage: {
        flex: 1
    },
    required: {
        marginTop: '2%',
        color: 'red',
        fontFamily: 'Lato'
    },
    arrangeButton: {
        marginBottom: '5%',
        marginTop: '5%',
        width: '95%',
        alignSelf: 'center',
        height: '8%',
        backgroundColor: '#883FCE',
        flex: 1
    },
    requiredBottom: {
        marginTop: '4%',
        marginBottom: '0%',
        color: 'red',
        fontFamily: 'Lato'
    },
})