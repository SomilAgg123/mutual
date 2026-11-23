import React from 'react';
import { View, Text, Image, StyleSheet, Pressable, VirtualizedList } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import NextButton from '../../components/NextButton'
import { LinearGradient } from 'expo-linear-gradient';

const right = <MaterialCommunityIcons style={{
    marginRight: '5%'
}} name="chevron-right" size={30} color="#883FCE" />

export default function Information3({ }) {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['rgba(83, 63, 206, 1)', 'rgba(210, 133, 222, 1)']}
                style={styles.linearGradient}>
                <View style={styles.wholePage}>
                    <View style={styles.topPage}>
                        <Text style={styles.emoji}>⚠️</Text>
                        <Text style={styles.pageTitle}>Important notice</Text>
                        <Text style={styles.subtitle}>To get started, we'll ask you to tell us a bit about yourself. This process should take about 5-10 minutes.</Text>
                        <Text style={styles.subtitle}>You won't be able to edit your responses after submitting, so please fill out the following pages carefully!</Text>
                    </View>
                    <NextButton
                            style={{
                                position: 'relative',
                                top: '13%',
                                left: '75%'
                            }}
                            onPress={() => navigation.navigate("Onboarding1", {})}
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