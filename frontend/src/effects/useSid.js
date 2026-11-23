import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function useSid() {
    const getSid = async () => {
        try {
            const sidString = await AsyncStorage.getItem('sid');
            if (sidString != null) {
                return JSON.parse(sidString);
            }
        }
        catch (error) {
            // console.log("useUid error: " + error)
        }
    };

    const [ sid, setSid ] = useState(getSid());

    const saveSid = async userSid => {
        try {
            if(userSid != null) {
                await AsyncStorage.setItem('uid', JSON.stringify(userSid));
                setSid(userSid);
            }
        }
        catch (error) {
            console.log("Error saving user sid: " + error)
        }
    };

    return {
        setSid: saveSid,
        sid
    }
}