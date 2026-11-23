import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useToken() {
    const getToken = async () => {
        try {
            const tokenString = await AsyncStorage.getItem('token');
            if (tokenString != null) {
                return JSON.parse(tokenString);
            }
        }
        catch (error) {
            // console.log("useToken error: " + error);
        }
    };

    const [ token, setToken ] = useState(getToken());

    const saveToken = async userToken => {
        try {
            if(userToken != null) {
                await AsyncStorage.setItem('token', JSON.stringify(userToken));
                setToken(userToken);
            }
        }
        catch (error) {
            console.log("Error saving user token: " + error)
        }
    };

    return {
        setToken: saveToken,
        token
    }
}