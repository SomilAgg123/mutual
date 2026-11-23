import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function useUid() {
    const getUid = async () => {
        try {
            const uidString = await AsyncStorage.getItem('uid');
            if (uidString != null) {
                return JSON.parse(uidString);
            }
        }
        catch (error) {
            // console.log("useUid error: " + error)
        }
    };

    const [ uid, setUid ] = useState(getUid());

    const saveUid = async userUid => {
        try {
            if(userUid != null) {
                await AsyncStorage.setItem('uid', JSON.stringify(userUid));
                setUid(userUid);
            }
        }
        catch (error) {
            console.log("Error saving user uid: " + error)
        }
    };

    return {
        setUid: saveUid,
        uid
    }
}