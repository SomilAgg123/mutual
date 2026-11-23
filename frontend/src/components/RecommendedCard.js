import React, { useContext, useState, useEffect } from 'react';
import { View, Pressable, StyleSheet, Text, Image, ImageBackground } from 'react-native';
import { Context as AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

import ScoreCircle from './ScoreCircle';

export default function RecommendedCard({ user1, user2, similarityScore, complementaryScore }) {
	const navigation = useNavigation();
	const [imageUrl, setImageUrl] = useState('');
    const [loaded, setLoaded] = useState(false);
	useEffect(() => {
        if (user2) {
            fetch('http://127.0.0.1:5000/api/photo/profile/' + user2["id"])
                .then(response => response.blob())
                .then(blob => {
                    const url = URL.createObjectURL(blob);
                    setImageUrl(url);
                });
            setLoaded(true);
        }
    }, [user2]);

	if (!(loaded)) {
        return (<Text>Loading...</Text>)
    }
    else {
		return (
			<Pressable style={[styles.container]} onPress={() => navigation.navigate("Arrange2", {
				user1: user1,
				user2: user2,
				similarityScore: similarityScore,
				complementaryScore: complementaryScore
			})}>
				<View style={[styles.wholeCard, styles.shadowProp]}>
					<ImageBackground
						imageStyle={{
							borderTopLeftRadius: 10,
							borderTopRightRadius: 10,
						}}
						style={{
							flex: 5,
							shadowColor: '#000000',
							shadowOffset: { width: -2, height: -4 },
							shadowOpacity: 0.25,
							shadowRadius: 6,
						}}
						source={{uri: imageUrl}}>

						<Text style={{
							position: 'absolute',
							// justifyContent: 'flex-end',
							// alignItems: 'center',
							// alignSelf: 'flex-end',
							left: 10,
							right: 0,
							bottom: 5,
							color: 'white',
							fontFamily: 'Lato',
							fontSize: 22
						}}>{user2.first_name}, {user2.age}</Text>
					</ImageBackground>

					<View style={styles.circles}>
						<ScoreCircle size={60} color={"#EC6485"} percent={similarityScore} />
						<ScoreCircle size={60} color={"#9EDD88"} percent={complementaryScore} />
					</View>
				</View>
			</Pressable>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	circles: {
		flex: 2,
		flexDirection: "row",
		justifyContent: 'space-evenly',
		marginTop: '7%',
		marginBottom: '11%',
	},
	wholeCard: {
		width: '80%',
		height: '90%',
		justifyContent: 'center',
		borderRadius: 20,
		backgroundColor: 'white',

	},
	shadowProp: {
		shadowColor: '#000000',
		shadowOffset: { width: -2, height: 4 },
		shadowOpacity: 0.25,
		shadowRadius: 6,
	},
});