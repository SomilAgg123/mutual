import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useUser() {
    const getUser = async () => {
        try {
            const userString = await AsyncStorage.getItem('user');
            const usernameJson = JSON.parse(userString);
            if(usernameJson != null) {
                return usernameJson;
            }
        }
        catch (error) {
            // console.log("useUser error: " + error);
        }
    };

    const [ user, setUser ] = useState(getUser());

    const saveUser = username => {
        if(username != null) {
            AsyncStorage.setItem('user', JSON.stringify(username));
            setUser(username);
        }
    };

    return {
        setUser: saveUser,
        user
    }
}