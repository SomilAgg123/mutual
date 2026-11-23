// Browser-only adapters for native dependencies in read-only source previews.
import React from 'react';
import { View, Text, TextInput } from 'react-native';

export const useNavigation = () => ({ navigate() {}, goBack() {} });
export const Context = React.createContext({ state: { user_id: 1, uid: 1, email: 'demo@example.com' }, set_user_id() {}, set_age() {} });
export const AuthContext = Context;
export const OnboardContext = Context;
export const Auth = { signOut: async () => {} };
export class ConsoleLogger {}
export const MediaTypeOptions = { All: 'All' };
export const launchImageLibraryAsync = async () => ({ canceled: true });
export const ListItem = View;
export function SearchBar({ containerStyle, inputContainerStyle, inputStyle, placeholder, value, onChangeText, searchIcon }) {
  return <View style={containerStyle}><View style={[{ flexDirection: 'row', alignItems: 'center', width: '100%', paddingHorizontal: 8 }, inputContainerStyle]}>{searchIcon}<TextInput style={[{ flex: 1 }, inputStyle]} placeholder={placeholder} value={value} onChangeText={onChangeText} /></View></View>;
}
export function LinearGradient({ colors, style, children }) {
  return <View style={[style, { backgroundImage: `linear-gradient(${colors.join(',')})` }]}>{children}</View>;
}
export default function Icon({ name, size = 24, color = '#777', style }) {
  const glyph = name.includes('chevron') ? '›' : name.includes('arrow-left') ? '‹' : name.includes('search') ? '⌕' : name.includes('location') ? '⌖' : name.includes('heart') ? '♡' : name.includes('pen') ? '✎' : '·';
  return <Text style={[{ fontSize: size, color }, style]}>{glyph}</Text>;
}
export { Icon };
