import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, Pressable, VirtualizedList } from 'react-native';
import CheckboxQuestion from '../../components/CheckboxQuestion';
import TextQuestion from '../../components/TextQuestion';
import { AuthContext } from '../../context/AuthContext';
import { ScrollView } from 'react-native-gesture-handler';
import DropdownQuestion from '../../components/DropdownQuestion';
import WordQuestion from '../../components/WordQuestion';
import QualityQuestion from '../../components/QualityQuestion';
import { Icon } from 'react-native-elements'
import { OnboardContext } from '../../context/OnboardContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AppButton from '../../components/AppButton';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../../components/BackButton';

const right = <MaterialCommunityIcons style={{
    marginRight: '5%'
}} name="chevron-right" size={30} color="white" />

export default function Onboarding4({ updateAuthState, setToken }) {
    const { state: auth, signout } = useContext(AuthContext);
    const navigation = useNavigation();
    const {
        state: onboard,
        makeProfile,
        setEmail,
        setMB,
        setPersonalityType,
        setDecisive,
        setOpinionated,
        setZodiac,
        setGiveLoveLanguage,
        setReceiveLoveLanguage
    } = useContext(OnboardContext);

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.wholePage}>
                    <View styles={styles.questions}>
                        <BackButton
                            style={{
                                position: 'relative',
                                top: '0%',
                            }}
                            onPress={() => navigation.goBack()}
                            hasBackground={true}
                            navigation={navigation}
                        />
                        <Text style={{
                            fontSize: 24,
                            fontFamily: 'LatoBold',
                            marginTop: '8%',
                            marginBottom: '3%'
                        }}>Step 4: Complementarity Profile</Text>
                        <Text style={styles.subtitle}>We'll use your responses to calculate your complementarity with your mutuals.</Text>
                        <View style={{flex: 1}}>
                            <View style={{
                                flexDirection: 'row',
                                borderBottomColor: "#883FCE",
                                borderBottomWidth: 1,
                                alignItems: 'center',
                                marginTop: '4%',
                                width: '66%'
                                }}>
                                <Text style={styles.skipText}>Skip to next step and fill out later</Text>
                                <Icon name='arrow-right' size={28} color='#883FCE'/>
                            </View>
                        </View>
                        <TextQuestion setToken={setToken} setField={setMB} title={'What is your Myers-Briggs personality type?'} placeholder={'Select'}/>
                        <DropdownQuestion setToken={setToken} setField={setPersonalityType} title={'Would you consider yourself more of a Type A or a Type B personality?'} options={[
                            {label: 'Type A', value: 0},
                            {label: 'Type B', value: 1},
                        ]} />
                        <DropdownQuestion setToken={setToken} setField={setDecisive} title={'Are you, generally speaking, a decisive person?'} options={[
                            {label: 'Yes', value: 2},
                            {label: 'Sometimes', value: 1},
                            {label: 'No', value: 0},
                        ]} />
                        <DropdownQuestion setToken={setToken} setField={setOpinionated} title={'Do you consider yourself an opinionated person?'} options={[
                            {label: 'Yes', value: 2},
                            {label: 'Sometimes', value: 1},
                            {label: 'No', value: 0},
                        ]} />
                        <DropdownQuestion setToken={setToken} setField={setZodiac} title={'What is your zodiac sign?'} options={[
                            {label: 'Aries', value: 0},
                            {label: 'Leo', value: 1},
                            {label: 'Sagittarius', value: 2},
                            {label: 'Taurus', value: 3},
                            {label: 'Virgo', value: 4},
                            {label: 'Capricorn', value: 5},
                            {label: 'Gemini', value: 6},
                            {label: 'Libra', value: 7},
                            {label: 'Aquarius', value: 8},
                            {label: 'Cancer', value: 9},
                            {label: 'Scorpio', value: 10},
                            {label: 'Pisces', value: 11},
                        ]} />
                        <DropdownQuestion setToken={setToken} setField={setGiveLoveLanguage} title={'What is the love language you like to give most?'} options={[
                            {label: 'Words of affirmation', value: 0},
                            {label: 'Acts of service', value: 1},
                            {label: 'Gifts', value: 2},
                            {label: 'Quality time', value: 3},
                            {label: 'Physical touch', value: 4},
                        ]} />
                        <DropdownQuestion setToken={setToken} setField={setReceiveLoveLanguage} title={'What is the love language you like to receive most?'} options={[
                            {label: 'Words of affirmation', value: 0},
                            {label: 'Acts of service', value: 1},
                            {label: 'Gifts', value: 2},
                            {label: 'Quality time', value: 3},
                            {label: 'Physical touch', value: 4},
                        ]} />
                    </View>
                    <AppButton
                        style={styles.arrangeButton}
                        title="Next"
                        icon={right}
                        fontSize={24}
                        onPress={() => navigation.navigate("Onboarding5", {})}
                            // setEmail(auth.email);
                            // makeProfile(onboard);
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
    skipText: {
        color: '#883FCE',
        fontFamily: 'LatoBold',
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
})