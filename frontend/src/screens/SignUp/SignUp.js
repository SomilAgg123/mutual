import React, { useState, useContext } from 'react';

import {Context as AuthContext} from '../../context/AuthContext';

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppTextInput from '../../components/AppTextInput';
import AppButton from '../../components/AppButton';

export default function SignUp({ navigation, setToken, setUser, setUid }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const { state, signup } = useContext(AuthContext);
  const [validEmail, setValidEmail] = useState(false);
  const [loaded, setLoaded] = useState(false);

  //TODO: IMPLEMENT THIS FOR SIGN UP
  async function verifyEmail(email) {
    url = 'http://127.0.0.1:5000/api/user/' + email;
    const response = await fetch(url);
    const json = await response.json();
    setValidEmail(true);
    setLoaded(true);
  }

  useEffect(() => {
    verifyEmail();
  }, []);

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Create a new account</Text>
        <AppTextInput
          value={username}
          onChangeText={text => setUsername(text)}
          leftIcon="account"
          placeholder="Enter username"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
        />
        <AppTextInput
          value={password}
          onChangeText={text => setPassword(text)}
          leftIcon="lock"
          placeholder="Enter password"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
          textContentType="password"
        />
        <AppTextInput
          value={email}
          onChangeText={text => setEmail(text)}
          leftIcon="email"
          placeholder="Enter email"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
        />
        {/* TODO: ON PRESS GO TO SIGN UP AND THEN HANDLE SUBMIT FROM THERE IF
                  CONFIRMATION IS CORRECT */}
        <AppButton title="Sign Up" onPress={signup} />
        <View style={styles.footerButtonContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={styles.forgotPasswordButtonText}>
              Already have an account? Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: 'white'
  },
  container: {
    flex: 1,
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    color: '#883FCE',
    fontWeight: '500',
    marginVertical: 15
  },
  footerButtonContainer: {
    marginVertical: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  forgotPasswordButtonText: {
    color: '#883FCE',
    fontSize: 18,
    fontWeight: '600'
  }
});