import React, { useContext, useState } from 'react';
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
import { set } from 'lodash';

const right = <MaterialCommunityIcons style={{
    marginRight: '5%'
}} name="chevron-right" size={30} color="white" />

export default function Onboarding3({ updateAuthState, setToken }) {
    const { state: auth, signout } = useContext(AuthContext);
    const navigation = useNavigation();
    const [isVisible, setIsVisible] = useState(false);
    const {
        state: onboard,
        setPoliticalAffiliation,
        setPoliticalImportance,
        setPoliticalFriendImportance,
        setTimeOfDay,
        setDrink,
        setSmoke,
        setDrugs,
        setReligion,
        setReligionImportance,
        setPDAPreference
    } = useContext(OnboardContext);

    const handlePress = () => {
        setIsVisible(true);
    }

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
                        }}>Step 3: Similarity Profile</Text>
                        <Text style={styles.subtitle}>We'll use your responses to calculate your similarity with your mutuals.</Text>
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
                        <DropdownQuestion setToken={setToken} setField={setPoliticalAffiliation} title={'I identify as:'} options={[
                            {label: 'Conservative', value: 2},
                            {label: 'Centrist', value: 1},
                            {label: 'Liberal', value: -2},
                            {label: 'Libertarian', value: -1},
                            {label: 'Other', value: 0}
                        ]} />
                        <DropdownQuestion setToken={setToken} setField={setPoliticalImportance} title={'How important is it to you to have similar political views to a partner?'} options={[
                            {label: 'Extremely important', value: 2},
                            {label: 'Important', value: 1},
                            {label: 'Not important', value: 0},
                        ]} />
                        <DropdownQuestion setToken={setToken} setField={setPoliticalFriendImportance} title={'How important is it to you to have similar political views to a friend?'} options={[
                            {label: 'Extremely important', value: 2},
                            {label: 'Important', value: 1},
                            {label: 'Not important', value: 0},
                        ]} />
                        <DropdownQuestion setToken={setToken} setField={setTimeOfDay} title={'When do you sleep?'} options={[
                            {label: 'Very early', value: -2},
                            {label: 'Early', value: -1},
                            {label: 'Neutral', value: 0},
                            {label: 'Late', value: 1},
                            {label: 'Very late', value: 2},
                        ]} />
                        <DropdownQuestion setToken={setToken} setField={setDrink} title={'How often do you enjoy drinking?'} options={[
                            {label: 'Often', value: 2},
                            {label: 'Sometimes', value: 1},
                            {label: 'Occasionally', value: 0},
                            {label: 'Never', value: -1},
                        ]} />
                        <DropdownQuestion setToken={setToken} setField={setSmoke} title={'How often do you enjoy smoking?'} options={[
                            {label: 'Often', value: 2},
                            {label: 'Sometimes', value: 1},
                            {label: 'Occasionally', value: 0},
                            {label: 'Never', value: -1},
                        ]} />
                        <DropdownQuestion setToken={setToken} setField={setDrugs} title={'How often do you enjoy any other drugs?'} options={[
                            {label: 'Often', value: 2},
                            {label: 'Sometimes', value: 1},
                            {label: 'Occasionally', value: 0},
                            {label: 'Never', value: -1},
                        ]} />
                        <DropdownQuestion setToken={setToken} setField={setReligion} title={'What is your religion?'} options={[
                            {label: 'Agnostic', value: 0},
                            {label: 'Atheist', value: 1},
                            {label: 'Buddhist', value: 2},
                            {label: 'Christian', value: 3},
                            {label: 'Hindu', value: 4},
                            {label: 'Jewish', value: 5},
                            {label: 'Muslim', value: 6},
                            {label: 'Other', value: 7},
                        ]} />
                        <DropdownQuestion setToken={setToken} setField={setReligionImportance} title={'How important is religion to you?'} options={[
                            {label: 'High', value: 2},
                            {label: 'Medium', value: 1},
                            {label: 'Low', value: 0},
                        ]} />
                        <DropdownQuestion setToken={setToken} setField={setPDAPreference} title={'What is your PDA preference?'} options={[
                            {label: 'High', value: 2},
                            {label: 'Medium', value: 1},
                            {label: 'Low', value: 0},
                        ]} />
                    </View>
                    {isVisible && <Text style={styles.requiredBottom}>*Fill out the required fields.</Text>}
                    <AppButton
                        style={styles.arrangeButton}
                        title="Next"
                        icon={right}
                        fontSize={24}
                        onPress={() =>
                            {
                                if(onboard.politicalAffiliation == null ||
                                    onboard.politicalImportance == null ||
                                    onboard.politicalFriendImportance == null ||
                                    onboard.timeOfDay == null ||
                                    onboard.drink == null ||
                                    onboard.smoke == null ||
                                    onboard.drugs == null ||
                                    onboard.religion == null ||
                                    onboard.religionImportance == null ||
                                    onboard.pdaPreference == null)
                                {
                                    handlePress();
                                }
                                else
                                {
                                    console.log("AGE")
                                    console.log(auth.age)
                                    navigation.navigate("Onboarding4", {})
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
    requiredBottom: {
        marginTop: '4%',
        marginBottom: '0%',
        color: 'red',
        fontFamily: 'Lato'
    },
})