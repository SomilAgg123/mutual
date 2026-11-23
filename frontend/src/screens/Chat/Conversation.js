import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { GiftedChat } from 'react-native-gifted-chat'
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';

//👇🏻 Import socket from the socket.js file in utils folder
import socket from "../../utils/socket";

// context/state management
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';

import useSid from '../../effects/useSid';

const MUTUAL_PURPLE = "#883FCE";
const LIGHT_PURPLE_TWO = "#F1E8FA";
const MEDIUM_GREY = "#C3C3C3";

const LIGHT_PURPLE = "#F1E8FA";
const DARKER_LIGHT_PURPLE = "#E5D0FA";
const TAN = "#EED7BC";
const DARK_GREY = "#777777";
const backArrow = <Feather name="arrow-left" size={30} color="black" />;

const Reasons = ({ name, roomId }) => {
    const [reasonOne, setReasonOne] = useState("");
    const [reasonTwo, setReasonTwo] = useState("");

    const [loadedReasons, setLoadedReasons] = useState(false);

    const getReasons = async (arrangementId) => {
        // note that, for now, the assumption is that an arrangement will be EQUAL to a conversationid
        const response = await fetch(`http://127.0.0.1:5000/api/arrangements/reasons/${arrangementId}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        const data = await response.json();
        return data;
    }

    useEffect(() => {
        const loadReasons = async () => {
            const reasons = await getReasons(roomId);
            setReasonOne(reasons[0]);
            setReasonTwo(reasons[1]);
            setLoadedReasons(true);
        }
        loadReasons();
    })

    if (!loadedReasons) {
        return(
            <View style={{
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Text>Loading reasons</Text>
            </View>
        )
    }
    else {
        return (
            <View style={[styles.bottomContainer, {
                padding: '5%'
            }]}>
                <Text style={styles.because}>Jake thinks you and & {name} would be a great fit because...</Text>
                <View style={styles.reasonBox}>
                    <View style={styles.reasonRow}>
                        <Text style={styles.promptResponse}>1. </Text>
                        <Text style={styles.promptResponse}>{reasonOne}</Text>
                    </View>
                    <View style={styles.reasonRow}>
                        <Text style={styles.promptResponse}>2. </Text>
                        <Text style={styles.promptResponse}>{reasonTwo}</Text>
                    </View>
                </View>
            </View>
        );
    }
}

function ActiveChat({ currentUser, otherUser, roomId, hasAnsweredPreviously }) {
    const [messages, setMessages] = useState([]);
    const [prompt, setPrompt] = useState("");

    const [messagesLoading, setMessagesLoading] = useState(true);
    const [promptLoading, setPromptLoading] = useState(true);
    const [showPrompt, setShowPrompt] = useState(false);

    const flatListRef = useRef(null);

    const { sid, setSid } = useSid();
    const { state: authState } = useContext(AuthContext);

    const getPrompt = async () => {
        const response = await fetch('http://127.0.0.1:5000/api/arrange/prompt/' + roomId,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        const data = await response.json();
        return data;
    }

    const getAllMessages = async () => {
        const response = await fetch('http://127.0.0.1:5000/api/messages/' + roomId,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        const data = await response.json();

        let giftedChatMessages = data.map((chatMessage) => {
            let gcm = {
              _id: chatMessage.id,
              text: chatMessage["content"],
              createdAt: chatMessage["updated_at"],
              user: {
                _id: chatMessage["user_id"],
                name: "default, change",
                avatar: require('../../../assets/images/man_looking_off.png')
              }
            };
            return gcm;
          });

        return giftedChatMessages;
    }

    useEffect(() => {
        const unans = async () => {
            const p = await getPrompt();
            setPrompt(p);
            setPromptLoading(false);
        };
        unans();

        const msgs = async () => {
            const m = await getAllMessages();
            setMessages(m);
            setMessagesLoading(false);
        }
        msgs();
    }, [])

    useEffect(() => {
        socket.on("connect", () => {
            console.log("Connected!");
        })
        socket.on("message", (newMessage) => {
            // Update the chat state with the new message
            setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessage));
        });

        const handleMessage = (event) => {
            console.log('Received message:', event);
        }

        const handleError = (error) => {
            console.error('WebSocket error:', error);
        }

        socket.addEventListener('message', handleMessage);
        socket.addEventListener('error', handleError);

        return () => {
            socket.removeEventListener('message', handleMessage);
            socket.removeEventListener('error', handleError);
        }
    }, [])

    const sendMessage = async (messages, currentUser, otherUser, roomId) => {
        try {
            // console.log(messages)
            console.log(JSON.stringify({ "msg": messages }))
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ "msg": messages })
                // body: JSON.stringify({ messages })
            };

            const response = await fetch(`http://127.0.0.1:5000/api/messages/${roomId}/${currentUser}/${otherUser}`, requestOptions)
                .then(response => response.json())
                .then(data => console.log(data))
                .catch(error => console.error(error));
            return { success: true, response };
        } catch (error) {
            return { success: false, error };
        }
    };

    const onSend = useCallback((newMessages = []) => {
        // add the message to the local state
        setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));

        const latestMessage = newMessages[newMessages.length - 1];
        // notify the server to broadcast the other participant a message has arrived
        var data = {
            "msg": latestMessage,
            "room": roomId,
            "hasRespondedPreviously": hasAnsweredPreviously
        }

        // emit the message event to the backend
        socket.emit("message", data);

        sendMessage(latestMessage["text"], currentUser, otherUser, roomId);

    }, [currentUser, otherUser, roomId]);

    function handleScroll(event) {
        const { contentOffset } = event.nativeEvent;
        const { y } = contentOffset;
        setShowPrompt(y <= 0);
    }

    if (promptLoading || messagesLoading) {
        return(
            <View style={{
                alignSelf: 'center',
                justifyContent: 'center'
            }}>
                <Text>Loading your messages...</Text>
            </View>
        )
    }
    else {
        return (
            <View style={{ flex: 1 }}>
                {!showPrompt && (<Text style={styles.prompt}>{prompt}</Text>)}
                <GiftedChat
                    messages={messages}
                    onSend={messages => onSend(messages)}
                    showUserAvatar
                    user={{
                        _id: currentUser,
                        name: 'Jakob',
                        avatar: require('../../../assets/images/man_looking_off.png')
                    }}
                    listViewProps={{
                        onScroll: handleScroll
                    }}
                />
            </View>
        )
    }
}

const Chat = ({ prompt, userOne, userTwo, roomId, hasAnsweredPreviously }) => {
    return (
        <View style={styles.bottomContainer}>
            <ActiveChat currentUser={userOne} otherUser={userTwo} roomId={roomId} prompt={prompt} hasAnsweredPreviously={hasAnsweredPreviously} />
        </View>
    );
}

export default function Conversation({ route, navigation }) {
    const {
        userOne,
        userTwo,
        conversationId,
        hasAnsweredPreviously
    } = route.params;

    const roomId = conversationId;

    const [chatActive, setChatActive] = useState(true);
    const {
        state: chat,
        createMessage
    } = useContext(ChatContext);

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.topRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        {backArrow}
                    </TouchableOpacity>
                    <Image style={[styles.image, {
                        marginLeft: '2%'
                    }]} source={userOne.image} />
                    <Text style={styles.otherUserName}>{userOne.name}</Text>
                </View>
                <View style={styles.viewSwitchButtonsContainer}>
                    <TouchableOpacity
                        onPress={() => setChatActive(true)}
                        style={chatActive ? styles.viewSwitchButton : styles.viewSwitchButtonInactive}>
                        <Text style={chatActive ? styles.buttonText : [styles.buttonText, styles.buttonTextInactive]}>
                            Chat
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setChatActive(false)}
                        style={chatActive ? styles.viewSwitchButtonInactive : styles.viewSwitchButton}>
                        <Text style={chatActive ? [styles.buttonText, styles.buttonTextInactive] : styles.buttonText}>
                            Reasons
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            {chatActive ?
                <Chat
                    userOne={userOne}
                    userTwo={userTwo}
                    roomId={roomId}
                    hasAnsweredPreviously={hasAnsweredPreviously}
                /> :
                <Reasons
                    name={"NAME HERE"}
                    roomId={roomId}
                />}
        </View>
    );
}

const IMG_DIMENSION = 41;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEFEFE',
        // alignItems: 'center',
    },
    headerContainer: {
        flex: 1,
        backgroundColor: LIGHT_PURPLE_TWO,
        paddingTop: '20%'
    },
    bottomContainer: {
        flex: 5,
    },
    topRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: '3%',
        marginBottom: '5%',
    },
    viewSwitchButtonsContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    reasonBox: {
        marginTop: '5%'
    },
    reasonRow: {
        flexDirection: 'row'
    },
    chatDiv: {
        flexDirection: 'row'
    },
    chatAndName: {
        flex: 1
    },
    messageBox: {
        flex: 1,
        backgroundColor: TAN,
        padding: '3%',
        borderRadius: 10,
        borderTopLeftRadius: 0
    },
    // components
    image: {
        borderRadius: 100,
        width: IMG_DIMENSION,
        height: IMG_DIMENSION,
        marginRight: '2%'
    },
    viewSwitchButton: {
        flex: 1,
        alignItems: 'center',
        padding: '2%',
        borderBottomWidth: 1,
        borderBottomColor: MUTUAL_PURPLE
    },
    viewSwitchButtonInactive: {
        flex: 1,
        alignItems: 'center',
        padding: '2%',
        borderBottomWidth: 1,
        borderBottomColor: MEDIUM_GREY
    },
    singleResponse: {
        flexDirection: 'row',
        paddingTop: '5%',
        width: '100%',
        alignSelf: 'center',
    },
    // text
    mainPrompt: {
        fontFamily: 'LatoBold',
        fontSize: 26
    },
    otherUserName: {
        fontFamily: 'LatoBold',
        fontSize: 26
    },
    buttonText: {
        fontFamily: 'LatoBold',
        color: MUTUAL_PURPLE,
        fontSize: 18
    },
    buttonTextInactive: {
        color: MEDIUM_GREY
    },
    // bottom container text
    // chat text
    prompt: {
        fontFamily: 'LatoBold',
        fontSize: 26,
        lineHeight: 30,
        alignSelf: 'center',
        paddingTop: '4%',
        paddingHorizontal: '3.25%',
    },
    // reasons text
    because: {
        fontFamily: 'Lato',
        fontSize: 20
    },
    promptResponse: {
        fontFamily: 'LatoBold',
        fontSize: 28,
        textTransform: 'lowercase',
        marginBottom: '3%'
    },
    // chat bubble
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
    },
    arrowLeft: {
        borderTopWidth: 0,
        borderRightWidth: 12,
        borderBottomWidth: 12,
        borderLeftWidth: 0,
        borderRadius: 2,
        borderTopColor: 'transparent',
        borderRightColor: TAN,
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
    },
});