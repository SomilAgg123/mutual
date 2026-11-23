import React from 'react';
import { View, Text, Image, StyleSheet, Pressable, VirtualizedList } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import NextButton from '../../components/NextButton'
import { LinearGradient } from 'expo-linear-gradient';

const right = <MaterialCommunityIcons style={{
    marginRight: '5%'
}} name="chevron-right" size={30} color="#883FCE" />

export default function Information1({ }) {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['rgba(136, 63, 206, 1)', 'rgba(222, 133, 176, 1)']}
                style={styles.linearGradient}>
                <View style={styles.wholePage}>
                    <View style={styles.topPage}>
                        <Text style={styles.emoji}>🎉</Text>
                        <Text style={styles.pageTitle}>Welcome to Mutual!</Text>
                        <Text style={styles.subtitle}>As one of our handpicked early users, you get first dibs at playing cupid and exploring our app.</Text>
                        <Text style={styles.subtitle}>We can't wait to show you what we have in store!</Text>
                    </View>
                    <NextButton
                            style={{
                                position: 'relative',
                                top: '21%',
                                left: '75%'
                            }}
                            onPress={() => navigation.navigate("Information2", {})}
                            hasBackground={true}
                            navigation={navigation}
                        />
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    emoji: {
        fontSize: 50,
        marginBottom: '11%'
    },
    wholePage: {
        marginLeft: '6%',
        marginTop: '36%',
        marginRight: '6%'
    },
    pageTitle: {
        fontFamily: 'LatoBold',
        fontSize: 40,
        marginTop: '0%',
        color: 'white',
        marginBottom: '11%'
    },
    subtitle: {
        fontFamily: 'Lato',
        fontSize: 24,
        marginTop: '2%',
        color: 'white',
        marginBottom: '11%'
    },
    questions: {
        flex: 3,
        // marginTop: '80%'
    },
    bottomPage: {
        flex: 1
    },
    linearGradient: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
    },
})