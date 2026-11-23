import React, { useContext, useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable, VirtualizedList, Touchable, TouchableOpacity } from 'react-native';
import CheckboxQuestion from '../../components/CheckboxQuestion';
import TextQuestion from '../../components/TextQuestion';
import DateOfBirth from '../../components/DateOfBirth';
import { AuthContext } from '../../context/AuthContext';
import { OnboardContext } from '../../context/OnboardContext';
import { ScrollView } from 'react-native-gesture-handler';
import DropdownQuestion from '../../components/DropdownQuestion';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AppButton from '../../components/AppButton';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../../components/BackButton';
import { Auth } from 'aws-amplify';
import { setStatusBarNetworkActivityIndicatorVisible } from 'expo-status-bar';

const right = <MaterialCommunityIcons style={{
    marginRight: '5%'
}} name="chevron-right" size={30} color="white" />

export default function Onboarding1({ updateAuthState, setToken }) {
    // const { state } = useContext(AuthContext);
    const navigation = useNavigation();
    const [isVisible, setIsVisible] = useState(false);
    const { state: auth } = useContext(AuthContext);
    const {
        state: onboard,
        setBirthday,
        setPhoneNum,
        setFirstName,
        setLastName,
        setCurrentLocation,
        setGender,
        setSexuality,
        setDateOutOfRace,
        setMen,
        setWomen,
        setNonbinary,
        setOther,
        setEmail
    } = useContext(OnboardContext);

    const handlePress = () => {
        setIsVisible(true);
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.wholePage}>
                    <View style={styles.topPage}>
                        <BackButton
                            style={{
                                position: 'relative',
                                top: '4%',
                            }}
                            onPress={() => navigation.goBack()}
                            hasBackground={true}
                            navigation={navigation}
                        />
                        <Image style={{position: 'absolute', top: '40%', right: '2%'}}
                            source={require('../../../assets/icons/Logo.png')}/>
                        <Text style={styles.pageTitle}>Welcome to Mutual!</Text>
                        <Text style={styles.subtitle}>We're so happy to have you. Please follow the steps below to complete your profile.</Text>
                        <Text style={styles.required}>*Required</Text>
                    </View>
                    <View styles={styles.questions}>
                        <Text style={{
                            fontSize: 24,
                            fontFamily: 'LatoBold',
                            marginTop: '8%',
                            marginBottom: '3%'
                        }}>Step 1: Basic Info</Text>
                        <DateOfBirth setField={setBirthday} title={'Date of birth'} required={true}/>
                        <TextQuestion setToken={setToken} setField={setPhoneNum} title={'Phone'} placeholder={'Enter your phone number'} type={'telephoneNumber'} required={true}/>
                        <TextQuestion setToken={setToken} setField={setFirstName} title={'First name'} placeholder={'Enter your first name'} type={'givenName'} required={true}/>
                        <TextQuestion setToken={setToken} setField={setLastName} title={'Last name'} placeholder={'Enter your last name'} type={'givenName'} required={true}/>
                        {/* going to have to input DOB separately, can also extract earlier as an age verification */}
                        <DropdownQuestion setToken={setToken} setField={setGender} title={'What gender best describes you?'} options={[
                            {label: 'Male', value: 0},
                            {label: 'Female', value: 1},
                            {label: 'Non-binary', value: 2},
                            {label: 'Other', value: 3}
                        ]} required={true} />
                        <DropdownQuestion setToken={setToken} setField={setSexuality} title={'What is your sexuality?'} options={[
                            {label: 'Prefer not to say', value: 7},
                            {label: 'Heterosexual', value: 0},
                            {label: 'Homosexual', value: 1},
                            {label: 'Bisexual', value: 2},
                            {label: 'Allosexual', value: 3},
                            {label: 'Androsexual', value: 4},
                            {label: 'Pansexual', value: 5},
                            {label: 'Asexual', value: 6}
                        ]} required={true} />
                        <CheckboxQuestion setToken={setToken} setFields={{ setMen, setWomen, setNonbinary, setOther }} title={'Who would you prefer to date?'} options={['Men', 'Women', 'Non-binary people', 'Anyone']} required={true} />
                        <TextQuestion setToken={setToken} setField={setCurrentLocation} title={'What is your current location?'} placeholder={'Search city, state, or zip code'} type={'addressCityAndState'} required={true} search={true}/>
                        <DropdownQuestion setToken={setToken} setField={setDateOutOfRace} title={'Do you want to be matched outside of your race?'} options={[
                            {label: 'Yes', value: 1},
                            {label: 'No', value: 0},
                        ]} />
                    </View>
                    {/* <TouchableOpacity
                        style={styles.arrangeButton}
                            title="Next"
                            icon={right}
                            fontSize={24}
                            onPress={() => navigation.navigate("Onboarding2", {})}
                        /> */}
                    {isVisible && <Text style={styles.requiredBottom}>*Fill out the required fields.</Text>}
                    <AppButton
                        style={styles.arrangeButton}
                        title="Next"
                        icon={right}
                        fontSize={24}
                        onPress={() =>
                            {
                                if (onboard.birthday == null ||
                                    onboard.phoneNum == null ||
                                    onboard.firstName == null ||
                                    onboard.lastName == null ||
                                    onboard.currentLocation == null ||
                                    onboard.gender == null ||
                                    onboard.sexuality == null ||
                                    onboard.dateOutOfRace == null ||
                                    (onboard.men == null &&
                                    onboard.women == null &&
                                    onboard.nonbinary == null &&
                                    onboard.other == null))
                                {
                                    handlePress();
                                }
                                else
                                {
                                    setEmail(auth.email);
                                    navigation.navigate("Onboarding2", {})
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
        marginTop: '6%'
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
    requiredBottom: {
        marginTop: '4%',
        color: 'red',
        fontFamily: 'Lato'
    },
    arrangeButton: {
        marginTop: '5%',
        marginBottom: '5%',
        width: '95%',
        alignSelf: 'center',
        height: '8%',
        backgroundColor: '#883FCE',
        flex: 1
    },
})