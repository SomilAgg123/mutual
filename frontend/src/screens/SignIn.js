import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {Context as AuthContext} from '../context/AuthContext';

import AppTextInput from '../components/AppTextInput';
import AppButton from '../components/AppButton';

export default function SignIn({ navigation, setToken, setUser, setUid }) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const {state, signin} = useContext(AuthContext);
  const [validPassword, setValidPassword] = useState(false);
  const [loaded, setLoaded] = useState(false);

  async function verifyPassword(email, password) {
    url = 'http://127.0.0.1:5000/api/verify/' + email + '/' + password;
    const response = await fetch(url);
    const json = await response.json();
    setValidPassword(json);
    setLoaded(true);
  }

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Sign in to your account</Text>
        <AppTextInput
          value={email}
          onChangeText={text => setEmail(text)}
          leftIcon="account"
          placeholder="Enter email"
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
        <AppButton title="Login" onPress={() => signin({
          email, password
          })} />
        <View style={styles.footerButtonContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.forgotPasswordButtonText}>
              Don't have an account? Sign Up
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