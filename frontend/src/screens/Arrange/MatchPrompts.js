import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import { AuthContext } from '../../context/AuthContext';

// NORMALIZER - EXPERIMENTAL
import { Dimensions } from "react-native";
import { PixelRatio } from 'react-native';
import { random } from 'lodash';
import { select } from 'async';

const questions = [
	"If you could switch lives with any fictional character for a day, who would it be and why?",
	"If you could only eat one food for the rest of your life, what would it be and why?",
	"What's the weirdest dream you've ever had?",
	"If you could have any superpower, what would it be and why?",
	"If you could travel anywhere in the world, where would you go and why?",
	"If you could be any animal for a day, which animal would you choose and why?",
	"What's your favorite hobby or pastime, and how did you get into it?",
	"What's the most embarrassing thing that's ever happened to you?",
	"If you could live in any time period, which one would you choose and why?",
	"If you could learn any skill or talent overnight, what would it be and why?",
	"If you could only communicate in animal noises for a day, which animal noise would you choose to speak in?",
	"If you had to eat a piece of furniture, which one would you choose and why?",
	"If you could turn any object into a sentient being, which object would you choose and what would you name it?",
	"If you had to live the rest of your life in a virtual reality simulation of any movie or TV show, which one would you choose and why?",
	"If you could swap lives with any historical figure for a day, who would it be and why?",
	"If you had to pick one outfit to wear for the rest of your life, what would it be?",
	"If you were a character in a video game, what would be your special power?",
	"If you had to create a new holiday, what would it be called and how would people celebrate it?",
	"If you had to pick one song to listen to on repeat for 24 hours, which one would it be?",
	"If you could have any job in the world, but it had to be completely ridiculous, what would it be?",
	"If you were a flavor of ice cream, what would you be and why?",
	"If you had to trade places with an inanimate object for a day, which object would you choose and why?",
	"If you were a character in a horror movie, what would be your weapon of choice?",
	"If you could only wear one color for the rest of your life, which one would it be and why?",
	"If you could be any mythical creature, which one would you choose and why?",
	"If you could switch lives with any celebrity for a day, who would it be and why?",
	"If you could have any animal as a pet, regardless of its practicality, which one would you choose?",
	"If you could swap bodies with any person, living or dead, for a day, who would it be and why?",
	"If you could only communicate through interpretive dance for a day, what would be your go-to moves?",
	"If you could live in any video game world, which one would you choose and why?"


]

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;

const scale = SCREEN_WIDTH / 375;
const scale_height = SCREEN_HEIGHT / 812;

const normalize = (size, forHeight) => {
	const newSize = size * (forHeight ? scaleHeight : scale);
	return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

const redo = <FontAwesome5 name="redo" size={16} color="#883FCE" />;
const sendMutual = <Feather name="send" size={25} color="white" />;
const backArrow = <Feather name="arrow-left" size={35} color="black" />;

export default function MatchPrompts({ route }) {
	const navigation = useNavigation();
	const {
		state: auth,
	} = useContext(AuthContext);

	const [selectedQuestions, setSelectedQuestions] = useState([]);
	const [selectedButtonIndex, setSelectedButtonIndex] = useState(null);

	const [pressed, setPressed] = useState(false);
	const [profile1, setProfile1] = useState(null);
	const [profile2, setProfile2] = useState(null);
	const [matchmaker, setMatchmaker] = useState(null);
	const [loaded1, setLoaded1] = useState(false);
	const [loaded2, setLoaded2] = useState(false);
	const [loaded3, setLoaded3] = useState(false);

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

	async function fetchMatchmakerProfile(matchmaker_id) {
		url = 'http://127.0.0.1:5000/api/profile/' + matchmaker_id;
		const response = await fetch(url);
		const json = await response.json();
		setMatchmaker(json);
		setLoaded3(true);
	}

	useEffect(() => {
		console.log("INSIDE MATCH PROMPTS")
		console.log(user1["id"])
		console.log(user2["id"])
		console.log(auth.user_id)
		fetchProfile1(user1["id"]);
		fetchProfile2(user2["id"]);
		fetchMatchmakerProfile(auth.user_id);
		handleSelectQuestions();
	}, []);

	const { user1, user2, reason1, reason2 } = route.params;

	const handleSelectQuestions = () => {
		const selected = [];
		while (selected.length < 3) {
			const randomIndex = Math.floor(Math.random() * questions.length);
			const randomQuestion = questions[randomIndex];
			if (!selected.includes(randomQuestion)) {
				selected.push(randomQuestion);
			}
		}
		setSelectedQuestions(selected);
	};

	const handleButtonPress = (buttonIndex) => {
		setSelectedButtonIndex(buttonIndex);
	};

	const handlePressIn = () => {
		setPressed(true);
	};

	const handlePressOut = () => {
		setPressed(false);
	};

	if (!(loaded1 & loaded2 & loaded3)) {
		return (<Text>Loading...</Text>)
	}
	else {
		return (
			<View style={styles.container}>
				<Pressable color="#883FCE"
					style={({ pressed }) =>
						pressed ?
							styles.backButtonPressed :
							styles.backButton
					}
					onPress={() => navigation.goBack()}>
					{backArrow}
				</Pressable>
				<View style={styles.headerTextContainer}>
					<Text style={[styles.genericText, styles.selectQuestion]}>Select a question for</Text>
					<Text style={[styles.genericText, styles.selectedCouple]}>{profile1.firstName} & {profile2.firstName}</Text>
					<Text style={[styles.genericText, styles.selectQuestion]}>to answer</Text>
				</View>
				<View style={styles.promptContainer}>
					{
						selectedQuestions.map((question, index) => (
							<Pressable color="#883FCE"
								key={index}
								index={index}
								style={selectedButtonIndex === index ? styles.buttonActive : styles.buttonInactive}
								onPress={() => handleButtonPress(index)}>
								<Text style={styles.text}>{question.replace("{matchmaker}", `${matchmaker.firstName}`)}</Text>
							</Pressable>
						))
					}
				</View>
				<View style={styles.bottomButtons}>
					<Pressable style={[styles.lineButton, { opacity: pressed ? 0.60 : 1 }]}
						onPressIn={handlePressIn}
						onPressOut={handlePressOut} onPress={() => {
							handleSelectQuestions();
						}}>
						{redo}
						<Text style={[styles.genericText, styles.lineButtonText]}>
							Show me other questions
						</Text>
					</Pressable>
					<Pressable
						style={({ pressed }) =>
							pressed ?
								styles.sendToMutualsInactive :
								styles.sendToMutuals}
						onPress={() => navigation.navigate("ConfirmMatch", {
							user1: user1,
                            user2: user2,
                            prompt: selectedQuestions[selectedButtonIndex]
						})}>
						{sendMutual}
						<Text style={[styles.genericText, styles.sendToMutualText]}>
							Send to mutuals
						</Text>
					</Pressable>
					<Text style={[styles.finalSubmissionReminder]}>
						You can't go back after submitting!
					</Text>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	// containers
	container: {
		flex: 1, // occupy whole container
		backgroundColor: '#FEFEFE',
		justifyContent: 'center',
		paddingHorizontal: '6.5%'
	},
	headerTextContainer: {
		flex: 1
	},
	promptContainer: {
		flex: 2,
		justifyContent: 'space-evenly'
	},
	bottomButtons: {
		flex: 1,
		marginBottom: '15%'
	},
	// text
	genericText: {
		fontFamily: 'Lato'
	},
	selectQuestion: {
		fontSize: 28
	},
	text: {
		fontFamily: 'Lato',
		fontSize: 20
	},
	selectedCouple: {
		fontSize: 34,
		marginVertical: '2%',
		fontFamily: 'LatoBold',
	},
	lineButtonText: {
		color: '#883FCE',
		fontFamily: 'LatoBold',
		fontSize: 16,
		marginLeft: '2.5%'
	},
	sendToMutualText: {
		fontFamily: 'LatoBold',
		fontSize: 24,
		color: 'white',
		marginLeft: '2.5%'
	},
	finalSubmissionReminder: {
		fontFamily: 'LatoItalic',
		alignSelf: 'center',
		marginTop: '5%'
	},
	// buttons
	buttonActive: {
		backgroundColor: '#E5D0FA',
		borderColor: '#883FCE',
		borderWidth: 3,
		borderRadius: 20,
		paddingHorizontal: '4.5%',
		paddingVertical: '4.5%',
		// width: '100%',
	},
	buttonInactive: {
		backgroundColor: '#F1E8FA',
		borderColor: '#883FCE',
		borderRadius: 20,
		paddingHorizontal: '4.5%',
		paddingVertical: '4.5%',
		// width: '100%',
	},
	backButton: {
		marginTop: '10%',
		marginBottom: '5%'
	},
	backButtonPressed: {
		marginTop: '10%',
		marginBottom: '5%'
	},
	lineButton: {
		marginTop: '5%',
		flexDirection: 'row',
		alignSelf: 'center',
		borderBottomColor: '#883FCE',
		paddingBottom: 8,
		borderBottomWidth: 1
	},
	sendToMutuals: {
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		borderRadius: 40,
		elevation: 3,
		backgroundColor: '#883FCE',
		paddingVertical: '5%',
		marginTop: '10%',

		shadowColor: 'black',
		shadowOffset: {
			width: -2,
			height: 4
		},
		shadowOpacity: 0.25,
		shadowRadius: 6,
		elevation: 3
	},
	sendToMutualsInactive: {
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		borderRadius: 40,
		elevation: 3,
		backgroundColor: '#883FCE',
		paddingVertical: '5%',
		marginTop: '10%',
	}
});