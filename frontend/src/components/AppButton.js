import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';

export default function PurpleButton({ title, style, icon, onPress, fontSize }) {
  return (
    <Pressable color="#883FCE"
      style={({ pressed }) =>
        pressed ?
          [styles.mutualButtonPressed, style] :
          [styles.mutualButton, style]
      }
      onPress={onPress}>
      <View style={styles.row}>
      {icon ? icon : null}
      <Text style={[{ fontSize: fontSize }, styles.mutualButtonText]}>{title}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  mutualButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: '10%',
    paddingVertical: '4%',

    flexDirection: 'row',
    borderRadius: 40,
    elevation: 3,
    backgroundColor: '#883FCE',

    shadowColor: 'black',
    shadowOffset: {
      width: -2,
      height: 4
    },
    shadowOpacity: 0.25,
    shadowRadius: 1,
    elevation: 3
  },
  mutualButtonPressed: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: '10%',
    paddingVertical: '4%',

    flexDirection: 'row',
    borderRadius: 40,
    elevation: 3,
    backgroundColor: '#883FCE',
  },
  row: {
    flexDirection: 'row',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  mutualButtonText: {
    fontFamily: 'LatoBold',
    fontSize: 24,
    letterSpacing: 0.25,
    color: 'white'
  },
});