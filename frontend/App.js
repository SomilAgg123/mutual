import React, { useEffect, useContext } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { AuthProvider } from './src/context/AuthContext.js';
import { AuthContext } from './src/context/AuthContext';

import { ChatContext } from './src/context/ChatContext.js';
import { ChatProvider } from './src/context/ChatContext.js';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useFonts } from 'expo-font';

// icons
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// screens
import SplashScreen from 'react-native-splash-screen';

import Information1 from './src/screens/Information/Information1.js';
import Information2 from './src/screens/Information/Information2.js';
import Information3 from './src/screens/Information/Information3.js';

import SignIn from './src/screens/SignIn';
import Onboarding1 from './src/screens/Onboarding/Onboarding1';
import Onboarding2 from './src/screens/Onboarding/Onboarding2';
import Onboarding3 from './src/screens/Onboarding/Onboarding3';
import Onboarding4 from './src/screens/Onboarding/Onboarding4';

import SignUp from './src/screens/SignUp/SignUp';
import ConfirmSignUp from './src/screens/SignUp/ConfirmSignUp';

import Search from './src/screens/Search/Search';

import Source from './src/screens/Source/Source';
import Arrange from './src/screens/Arrange/Arrange';
import Arrange2 from './src/screens/Arrange/Arrange2';
import MatchPrompts from './src/screens/Arrange/MatchPrompts';
import ConfirmMatch from './src/screens/Arrange/ConfirmMatch';

import AnsweredChats from './src/screens/Setup/AnsweredChats';
import OpenChat from './src/screens/Setup/OpenChat';

import Stub from './src/screens/Stub/Stub';
import Chat from './src/screens/Chat/Chat';
import Conversation from './src/screens/Chat/Conversation';

import Profile from './src/screens/Profile/Profile';
import Details from './src/screens/Profile/Details';
import PersonalInformation from './src/screens/Profile/PersonalInformation';
import SimilarityProfile from './src/screens/Profile/SimilarityProfile';
import ComplementarityProfile from './src/screens/Profile/ComplementarityProfile';
import HelpCenter from './src/screens/Profile/HelpCenter';
import AccountManagement from './src/screens/Profile/AccountManagement.js';

// logged out stack - show onboarding experience
const AuthenticationStack = createStackNavigator();
// render the logged in experience
const AppStack = createStackNavigator();

// control the root bottom tab screens and nested navigators
const BottomTabs = createBottomTabNavigator();

// search navigator will go here
// TODO: MAKE SEARCH NAVIGATOR
// the primary matchmaking arrange flow
const ArrangeStack = createStackNavigator();
// the conversations two people answer about their mutual/matchmaker
const MatchesMadeStack = createStackNavigator();
// the conversations between two people AFTER having answered prompts
const ChatStack = createStackNavigator();
// the profile page
const ProfileStack = createStackNavigator();

const AuthenticationNavigator = props => {
  return (
    <AuthenticationStack.Navigator>
      <AuthenticationStack.Screen name="SignIn" component={SignIn} options={{
        headerShown: false
      }} />
      <AuthenticationStack.Screen name="SignUp" component={SignUp} options={{
        headerShown: false
      }} />
      <AuthenticationStack.Screen
        name="ConfirmSignUp"
        component={ConfirmSignUp}
        options={{
          headerShown: false
        }}
      />
    </AuthenticationStack.Navigator>
  );
};

const OnboardingNavigator = props => {
  return (
    <OnboardingStack.Navigator screenOptions={{ headerShown: false}}>
      {/* <AuthenticationStack.Screen name="SignUp" component={SignUp} /> */}
      <OnboardingStack.Screen name="Information1" component={Information1} />
      <OnboardingStack.Screen name="Information2" component={Information2} />
      <OnboardingStack.Screen name="Information3" component={Information3} />
      <OnboardingStack.Screen name="Onboarding1" component={Onboarding1} />
      <OnboardingStack.Screen name="Onboarding2" component={Onboarding2} />
      <OnboardingStack.Screen name="Onboarding3" component={Onboarding3} />
      <OnboardingStack.Screen name="Onboarding4" component={Onboarding4} />
      <OnboardingStack.Screen name="Onboarding5" component={Onboarding5} />
    </OnboardingStack.Navigator>
  )
}

const ArrangeNavigator = props => {
  return (
    <ArrangeStack.Navigator screenOptions={{ headerShown: false }}>
      <ArrangeStack.Screen name="Source" component={Source} />
      <ArrangeStack.Screen name="Arrange" component={Arrange} />
      <ArrangeStack.Screen name="Arrange2" component={Arrange2} />
      <ArrangeStack.Screen name="MatchPrompts" component={MatchPrompts} />
      <ArrangeStack.Screen name="ConfirmMatch" component={ConfirmMatch} />
    </ArrangeStack.Navigator>
  )
}

const MatchesMadeNavigator = props => {
  return (
    <MatchesMadeStack.Navigator screenOptions={{ headerShown: false }}>
      <MatchesMadeStack.Screen name="Chat Screen" component={AnsweredChats} />
    </MatchesMadeStack.Navigator>
  )
}

const ChatNavigator = props => {
  return (
    <ChatStack.Navigator screenOptions={{ headerShown: false }}>
      <ChatStack.Screen name="Chat Landing" component={Chat} />
      <ChatStack.Screen name="Conversation" component={Conversation} />
    </ChatStack.Navigator>
  )
}

const ProfileNavigator = props => {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ChatStack.Screen name="Profile Landing" component={Profile} />
      <ChatStack.Screen name="Profile Details" component={Details} />
      <ChatStack.Screen name="Personal" component={PersonalInformation} />
      <ChatStack.Screen name="Similarity" component={SimilarityProfile} />
      <ChatStack.Screen name="Complementarity" component={ComplementarityProfile} />
      <ChatStack.Screen name="Help" component={HelpCenter} />
      <ChatStack.Screen name="Account Management" component={AccountManagement} />
    </ProfileStack.Navigator>
  )
}

const BottomTabNavigator = props => {
  return (
    <BottomTabs.Navigator
      initialRouteName="Main"
      screenOptions={{
        tabBarActiveTintColor: '#883FCE',
        tabBarInactiveTintColor: '#E5D0FA',
        tabBarStyle: {
          alignItems: 'center',
          justifyContent: 'center'
        },
        tabBarShowLabel: false,
        headerShown: false
      }}>
      <AppStack.Screen name="Search" options={{
        tabBarIcon: ({ color, size }) => {
          return (<EvilIcons name='search' color={color} size={size} />)
        },
        headerShown: false
      }} component={Search} />
      <AppStack.Screen name="Matches Made" options={{
        tabBarIcon: ({ color, size }) => {
          return (<Ionicons name='people-sharp' color={color} size={size} />)
        }
      }}>
        {screenProps => (
          <MatchesMadeNavigator {...screenProps} setToken={props.setToken} />
        )}
      </AppStack.Screen>
      <AppStack.Screen name="Main" options={{
        tabBarIcon: ({ color, size }) => {
          // return (<Entypo name='medium' color={color} size={size} />)
          return (
            <View style={{
              flex: 1,
              alignItems: 'center',
            }}>
              <Text
                style={{
                  display: 'flex',
                  fontFamily: 'SeoulHangangBold',
                  fontSize: 40,
                  color: color
                }}>m</Text>
            </View>)
        }
      }} component={Source} />
      <AppStack.Screen name="Chat" options={{
        tabBarIcon: ({ color, size }) => {
          return (<MaterialCommunityIcons name='message-text-outline' color={color} size={size} />)
        }
      }} component={ChatNavigator} />
      <AppStack.Screen name="Profile" options={{
        tabBarIcon: ({ color, size }) => {
          return (<Ionicons name='person' color={color} size={size} />)
        }
      }} component={ProfileNavigator} />
    </BottomTabs.Navigator>
  );
};

const AppNavigator = props => {
  return (
    <AppStack.Navigator screenOptions={{ headerShown: false }}>
      <AppStack.Screen name="BottomTabs" component={BottomTabNavigator} />
      <AppStack.Screen name="Chat Screen" component={AnsweredChats} />
      <AppStack.Screen name="Dialogue" component={OpenChat} />
      <AppStack.Screen name="ArrangeNavigator" component={ArrangeNavigator} />
    </AppStack.Navigator>
  );
}

function App() {
  const { state : authState } = useContext(AuthContext);

  useEffect(() => {
    SplashScreen.hide();
  });

  return (
    <NavigationContainer>
      {
        // authState.token ? <AuthenticationNavigator /> : <AppNavigator />
        // state.token == false ? <AuthenticationNavigator /> : <AppNavigator />
        // onboard.onboard_token == null ? <OnboardingNavigator /> : <AppNavigator />
        <AppNavigator />
        // true ? <InformationNavigator /> : <AppNavigator />

      }
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFEFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default () => {
  const [loaded] = useFonts({
    Lato: require('./assets/fonts/Lato-Regular.ttf'),
    LatoBold: require('./assets/fonts/Lato-Bold.ttf'),
    LatoBlack: require('./assets/fonts/Lato-Black.ttf'),
    LatoItalic: require('./assets/fonts/Lato-Italic.ttf'),
    SeoulHangang: require('./assets/fonts/Lato-Regular.ttf'),
    SeoulHangangBold: require('./assets/fonts/Lato-Bold.ttf'),
  });

  if (!loaded) {
    return null;
  }
  else {
    return (
      <AuthProvider>
        <ChatProvider>
          <App />
        </ChatProvider>
      </AuthProvider>
    )
  }
};