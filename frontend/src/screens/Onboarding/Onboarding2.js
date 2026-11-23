import React, { useContext, useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable, VirtualizedList } from 'react-native';
import CheckboxQuestion from '../../components/CheckboxQuestion';
import TextQuestion from '../../components/TextQuestion';
import { AuthContext } from '../../context/AuthContext';
import { ScrollView } from 'react-native-gesture-handler';
import DropdownQuestion from '../../components/DropdownQuestion';
import WordQuestion from '../../components/WordQuestion';
import QualityQuestion from '../../components/QualityQuestion';
import { OnboardContext } from '../../context/OnboardContext';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../../components/BackButton';
import AppButton from '../../components/AppButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const right = <MaterialCommunityIcons style={{
    marginRight: '5%'
}} name="chevron-right" size={30} color="white" />

export default function Onboarding2({ updateAuthState, setToken }) {
    const {
        state: auth,
        set_age
    } = useContext(AuthContext);
    const navigation = useNavigation();
    const [isVisible, setIsVisible] = useState(false);
    const {
        state: onboard,
        setHometown,
        setWork,
        setJobTitle,
        setSchool,
        setWord1,
        setWord2,
        setWord3,
        setQuality1,
        setQuality2,
        setEthnicity,
        setOnlyMatchmake
    } = useContext(OnboardContext);

    const handlePress = () => {
        setIsVisible(true);
    }

    const setAge = () => {
        // Parse the date of birth string into a Date object
        const dob = new Date(onboard.birthday);

        // Get the current date
        const now = new Date();

        // Calculate the difference between the two dates in milliseconds
        const diffMs = now - dob;

        // Convert the difference to years
        const age = Math.floor(diffMs / 1000 / 60 / 60 / 24 / 365);

        return age;
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
                        }}>Step 2: About You</Text>
                        <WordQuestion setToken={setToken} setWords={{ setWord1, setWord2, setWord3 }} title={'What are three words you would use to describe yourself?'} />
                        <QualityQuestion setToken={setToken} setQualities={{ setQuality1, setQuality2 }} title={'What are two qualities you\'d love in a partner/date?'} />
                        <DropdownQuestion setToken={setToken} setField={setEthnicity} title={'What\'s your ethnicity?'} options={[
                            {label: 'Hispanic', value: 0},
                            {label: 'White', value: 1},
                            {label: 'Black', value: 2},
                            {label: 'American Indian or Alaska Native', value: 3},
                            {label: 'Asian', value: 4},
                            {label: 'South Asian', value: 5},
                            {label: 'Southeast Asian', value: 6},
                            {label: 'Native Hawaiian or Pacific Islander', value: 7},
                            {label: 'Other', value: 8},
                            {label: 'Multiracial', value: 9}
                        ]} />
                        <TextQuestion setToken={setToken} setField={setHometown} title={'Where is your hometown?'} placeholder={'Search city, state, or zip code'} type={'addressCityAndState'} search={true}/>
                        <TextQuestion setToken={setToken} setField={setWork} title={'Where do you work?'} placeholder={'Enter company name'} />
                        <TextQuestion setToken={setToken} setField={setJobTitle} title={'What is your job title?'} placeholder={'Enter job title'} />
                        <TextQuestion setToken={setToken} setField={setSchool} title={'Where did/do you go to school?'} placeholder={'Enter school name'} />
                        <DropdownQuestion setToken={setToken} setField={setOnlyMatchmake} title={'Do you only want to matchmake?'} options={[
                            {label: 'No', value: 0},
                            {label: 'Yes', value: 1},
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
                                if(onboard.hometown == null ||
                                    onboard.work == null ||
                                    onboard.jobTitle == null ||
                                    onboard.school == null ||
                                    onboard.word1 == null ||
                                    onboard.word2 == null ||
                                    onboard.word3 == null ||
                                    onboard.quality1 == null ||
                                    onboard.quality2 == null ||
                                    onboard.ethnicity == null ||
                                    onboard.setOnlyMatchmake)
                                {
                                    handlePress();
                                }
                                else
                                {
                                    age = setAge();
                                    set_age(age);
                                    navigation.navigate("Onboarding3", {})
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