import React from 'react';
import { createRoot } from 'react-dom/client';
import { View } from 'react-native';
import { profiles, matches } from './fixtures';
import Welcome from '../../frontend/src/screens/Information/Information1';
import Search from '../../frontend/src/screens/Search/Search';
import Introductions from '../../frontend/src/screens/Setup/AnsweredChats';
import Source from '../../frontend/src/screens/Source/Source';
import Arrange from '../../frontend/src/screens/Arrange/Arrange';
import Compare from '../../frontend/src/screens/Arrange/Arrange2';
import Profile from '../../frontend/src/screens/Profile/Profile';
import Details from '../../frontend/src/screens/Profile/Details';

const screens = [
  ['welcome', Welcome, {}], ['search', Search, {}], ['introductions', Introductions, {}],
  ['profile-card', Source, {}], ['recommendations', Arrange, { route: { params: { card: profiles[0] } } }],
  ['comparison', Compare, { route: { params: { user1: profiles[0], user2: profiles[1], similarityScore: matches[0].similarity_score, complementaryScore: matches[0].complementarity_score } } }],
  ['settings', Profile, {}], ['profile-editor', Details, { navigation: { goBack() {} } }],
];
for (const [id, Component, props] of screens) {
  const target = document.getElementById(id);
  if (target) createRoot(target).render(<View style={{ flex: 1, width: '100%', height: '100%' }}><Component {...props} /></View>);
}
document.documentElement.dataset.preview = 'rendered';
