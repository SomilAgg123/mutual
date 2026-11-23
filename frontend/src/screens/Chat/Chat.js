// The main landing page on fourth tab
import React, { useContext, useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, TouchableOpacity, ScrollView, Image, Text, StyleSheet } from 'react-native';

// Contexts for state management
import { AuthContext } from '../../context/AuthContext';

// UI component to render a row representing a message with another user
import ChatRow from '../../components/ChatRow';

// importing sockets for realtime transmission
import socket from '../../utils/socket';

// bringing in hooks
import useSid from '../../effects/useSid';

const img_one = require('../../../assets/images/beanie.png');

const MUTUAL_PURPLE = "#883FCE";
export default function Chat() {
    // navigation hooks
    const navigation = useNavigation();

    // bring in global state variables
    const { state: authState } = useContext(AuthContext);
    const { sid, setSid } = useSid();

    // variables to store conversations
    const [unanswered, setUnanswered] = useState([]);
    const [answered, setAnswered] = useState([]);

    // variables to store the profiles of people in relationship with the user
    const [profilesUnanswered, setProfilesUnanswered] = useState([]);
    const [profilesAnswered, setProfilesAnswered] = useState([]);

    // loader variables
    const [loadingUnanswered, setLoadingUnanswered] = useState(true);
    const [loadingAnswered, setLoadingAnswered] = useState(true);
    const [loadingProfilesUnanswered, setLoadingProfilesUnanswered] = useState(true);
    const [loadingProfilesAnswered, setLoadingProfilesAnswered] = useState(true);

    const userOne = authState.uid;

    const getUnanswered = async () => {
        const response = await fetch('http://127.0.0.1:5000/api/conversations/unanswered/' + authState.uid,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        const data = await response.json();
        return data;
    }

    const getConversations = async () => {
        const response = await fetch('http://127.0.0.1:5000/api/conversations/answered/' + authState.uid,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        const data = await response.json();
        return data;
    }

    const getUnansweredProfiles = async () => {
        const conversations = [];
        // for every row in the unanswered conversations
        for (const convo of unanswered) {
            // find the other participant and get their profile data, storing it
            const other_uid = convo.participant_one != userOne ? convo.participant_one : convo.participant_two;
            try {
                const response = await fetch(`http://127.0.0.1:5000/api/user/credentials/${other_uid}/email`);
                const profileData = await response.json();

                // create an object with the profile id and data and push it into the processed array
                const otherUserObj = {
                    id: convo.id,
                    uid: other_uid,
                    data: profileData
                }
                conversations.push(otherUserObj);
            } catch (error) {
                console.error(error);
            }
        }
        // store a mapping of conversation IDs to profile objects for all conversations the current user has not replied to
        const profileMap = {};
        const finalProcessed = [];
        for (const profileObj of conversations) {
            try {
                const response_profile = await fetch(`http://127.0.0.1:5000/api/profile/email/${profileObj.data}`);
                const profile_data = await response_profile.json();
                finalProcessed.push(profile_data);

                const data_with_uid = {
                    other_uid: profileObj.uid,
                    data: profile_data
                }
                profileMap[profileObj.id] = data_with_uid;
            }
            catch (error) {
                console.log(error);
            }
        }
        return profileMap;
    }

    const getAnsweredProfiles = async () => {
        const answeredConversationMap = {};
        // for every row in the unanswered conversations
        for (const prof of Object.values(answered)) {

            const conversation_id = prof["conversation_id"];

            try {
                // TODO: this is currently a lot of latency to compute, need to fix, urgent patch for MVP release

                // get the other user uid
                const otherUid = await fetch(`http://127.0.0.1:5000/api/conversations/${conversation_id}/${userOne}`);
                const otherUidResult = await otherUid.json();

                // get the other user email
                const email = await fetch(`http://127.0.0.1:5000/api/user/credentials/${otherUidResult}/email`);
                const emailResult = await email.json();

                const profile = await fetch(`http://127.0.0.1:5000/api/profile/email/${emailResult}`);
                const profileResult = await profile.json();

                // create an object with the conversation id and data and push it into the processed array
                const answeredConversation = {
                    uid: otherUidResult,
                    data: profileResult
                }

                answeredConversationMap[conversation_id] = answeredConversation;
            } catch (error) {
                console.error(error);
            }
        }
        return answeredConversationMap;
    }
    const updateLastMessage = async (data) => {
        const message_content = data["content"];

        // convert dateTime to appropriate format
        const date = new Date(message_content["createdAt"]);
        const formattedDateStr = date.toUTCString();

        // conversation save
        const convo_id = data["conversation_id"];

        // construct the new last message
        const new_last_message = {
            updated_at: formattedDateStr,
            content: message_content["text"],
            conversation_id: convo_id,
            user_id: message_content["user"]["_id"]
        };

        // rewrite the answered array appropriately
        setAnswered(prevState => {
            return { ...prevState, [convo_id]: new_last_message }
        });
    }

    // update conversation type
    const updateConversationType = async (conversationId, data) => {
        // find the unanswered conversation
        const convoRespondedTo = unanswered.find((c) => c.id === conversationId);
        if (convoRespondedTo) {
            const filteredUnanswered = unanswered.filter((c) => c.id !== conversationId);
            setUnanswered(filteredUnanswered);
            // update the unanswered profiles
            setLoadingProfilesUnanswered(true);
            await getUnansweredProfiles();
            setLoadingProfilesUnanswered(false);

            // add conversation to answered
            const updatedAnswered = { ...answered };
            updatedAnswered[conversationId] = convoRespondedTo;
            setAnswered(updatedAnswered);
            // update the answered profiles
            setLoadingProfilesAnswered(true);
            const updatedProfilesAnswered = await getAnsweredProfiles();
            setProfilesAnswered(updatedProfilesAnswered);
            setLoadingProfilesAnswered(false);

            // finally, update the last messages
            await updateLastMessage(data);
        }
    };

    useEffect(() => {
        const unans = async () => {
            const unans_res = await getUnanswered();
            setUnanswered(unans_res);
            setLoadingUnanswered(false);
        };
        unans();

        const ans = async () => {
            const ans_res = await getConversations();
            setAnswered(ans_res);
            setLoadingAnswered(false);
        }

        ans();
    }, []);

    useEffect(() => {
        if (Object.keys(answered).length != 0 || unanswered.length != 0) {
            const profUnans = async () => {
                const prof_map_res = await getUnansweredProfiles();
                setProfilesUnanswered(prof_map_res);
                setLoadingProfilesUnanswered(false);
            };
            profUnans();
        }
    }, [loadingAnswered, loadingUnanswered]);

    useEffect(() => {
        if (Object.keys(answered).length != 0 || unanswered.length != 0) {
            const profAns = async () => {
                const prof_map_res_ans = await getAnsweredProfiles();
                setProfilesAnswered(prof_map_res_ans);
                setLoadingProfilesAnswered(false);
            }
            profAns();
        }
    }, [loadingAnswered, loadingUnanswered]);

    useEffect(() => {
        socket.on("connect", () => {
            console.log('Socket connected!');

            // join each conversation in answered
            answered.forEach((last_msg) => {
                socket.emit('join_room', { "user": currentUser.name, "room": last_msg["conversation_id"] });
            });
        });

        socket.on("disconnected", () => {
            console.log('Socket disconnected!');
        });

        // on receipt of a new message, update the order of messages
        socket.on("message", () => {
            console.log("Client has received a new message!");
        });

        socket.on("update_last_msg", (data) => {
            updateLastMessage(data);
        });

        // listener to mark a relevant message as a "replied-to" message
        socket.on("mark_unreplied_replied", (msgInfo) => {
            updateConversationType(msgInfo["conversation_id"], msgInfo);
        });

        socket.on("session_id", (session_id) => {
            // receiving this means that the client is fully connected and the server acknowledges
            setSid(session_id);
        });

        socket.on("connect_error", (error) => {
            console.log("connection error", error);
            socket.connect();
        });
    }, [answered, socket]);

    const markRead = async (conversationId) => {
        // make an API call to set the status of the conversation to read
        const response = await fetch(`http://127.0.0.1:5000/api/conversations/${conversationId}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        const data = await response.json();
        return data;
    }

    const openChat = async (conversationId, userTwo, hasAnsweredPreviously) => {
        // set the conversation selected to a "read" status
        await markRead(conversationId);

        // navigate to the conversation screen
        navigation.navigate("Conversation", {
            userOne,
            userTwo,
            conversationId,
            hasAnsweredPreviously
        });
    }

    if (loadingAnswered || loadingUnanswered || loadingProfilesUnanswered || loadingProfilesAnswered) {
        return (
            <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
            }}>
                <Text style={{
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    Getting your conversations ready for you...
                </Text>
            </View>
        )
    }
    else {
        // console.log("unanswered: ", unanswered);
        // console.log("answered: ", answered);
        // console.log("profiles unanswered: ", profilesUnanswered);
        // console.log("profiles answered:", profilesAnswered);
        return (
            <View style={styles.container}>
                <View style={styles.subcontainer}>
                    <Text style={styles.header}>Mutuals</Text>
                    <View style={styles.topSection}>
                        <Text style={[styles.subheader, {
                            marginBottom: '1%'
                        }]}>Unanswered Prompts</Text>
                        {
                            !unanswered.length ? (
                                <Text style={styles.greyText}>
                                    Mutuals awaiting your response will appear here.
                                </Text>
                            ) : (
                                <ScrollView showsHorizontalScrollIndicator={false} horizontal style={[styles.unansweredChats, {
                                    marginTop: '2%'
                                }]}>
                                    {
                                        Object.values(unanswered).map((convo, index) => {
                                            const p1 = convo["participant_one"];
                                            const p2 = convo["participant_two"];

                                            const roomId = convo["id"];

                                            const otherUid = p1 === userOne ? p2 : p1;
                                            const otherProfile = profilesUnanswered[roomId];

                                            const name = otherProfile.data.firstName;
                                            return (
                                                <TouchableOpacity
                                                    key={index}
                                                    style={{ alignItems: 'center', marginRight: 9 }}
                                                    onPress={() => {
                                                        openChat(roomId, otherUid, false);
                                                    }}
                                                >
                                                    <Image style={styles.imageStyle} source={img_one} />
                                                    <Text style={styles.nameTop}>{name}</Text>
                                                </TouchableOpacity>
                                            )
                                        })
                                    }
                                </ScrollView>
                            )
                        }
                    </View>
                </View>
                <View style={styles.conversations}>
                    <Text style={[styles.subheader, {
                        marginHorizontal: '5%',
                        marginBottom: '1%'
                    }]}>Messages</Text>
                    {
                        !Object.values(answered).length ? (
                            <View>
                                <Text style={[styles.greyText, {
                                    marginHorizontal: '5%'
                                }]}>
                                    Looks like you haven't started chatting with anyone
                                    yet. Respond to a match above or start matching some mutuals!
                                </Text>
                                <Image
                                    style={{
                                        width: 450,
                                        height: 450,
                                        alignSelf: 'center',
                                    }}
                                    source={require('../../../assets/images/empty_chats.png')
                                    } />
                            </View>
                        ) : (
                            <ScrollView>
                                {
                                    Object.entries(answered).map(([conversation_id, message], index) => {
                                        const otherProfile = profilesAnswered[conversation_id];
                                        if (!otherProfile || !otherProfile["data"]) {
                                            return null; // or handle the missing data in another way
                                        }
                                        const otherProfileData = otherProfile["data"];
                                        const userTwo = otherProfile["uid"];
                                        const lastText = message["content"];
                                        const date = new Date(message["updated_at"]);
                                        const converted = date.toLocaleDateString();
                                        const hasBeenRead = message["read"];
                                        return (
                                            <ChatRow
                                                key={index}
                                                firstName={otherProfileData["firstName"]}
                                                onPress={() => openChat(conversation_id, userTwo, true)}
                                                user={message["user_id"]}
                                                date_last_msg={converted}
                                                last_msg={lastText}
                                                read={hasBeenRead}
                                            />
                                        )
                                    })
                                }
                            </ScrollView>
                        )
                    }
                </View>
            </View>
        );
    }
}

const IMG_SIZE = 73;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEFEFE',
    },
    subcontainer: {
        flex: 2,
        marginHorizontal: '5%'
    },
    topSection: {
        flex: 1
    },
    unansweredChats: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    conversations: {
        flex: 4.5,
        width: '100%'
    },
    // components
    imageStyle: {
        width: IMG_SIZE,
        height: IMG_SIZE,
        borderRadius: 100
    },
    // text
    header: {
        marginTop: '18%',
        fontFamily: 'LatoBold',
        fontSize: 30,
        marginBottom: '5%'
    },
    subheader: {
        fontFamily: 'LatoBold',
        fontSize: 16,
        color: MUTUAL_PURPLE
    },
    nameTop: {
        fontFamily: 'LatoBold',
        fontSize: 16,
        marginTop: 4
    },
    greyText: {
        fontFamily: 'Lato',
        fontSize: 14,
        color: "#777777",
        lineHeight: 28
    }
});