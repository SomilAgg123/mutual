import React from 'react';
import { createRoot } from 'react-dom/client';
import { View } from 'react-native';
import { profiles, matches } from '../scripts/review/fixtures';
import Source from '../frontend/src/screens/Source/Source';
import Arrange from '../frontend/src/screens/Arrange/Arrange';
import Compare from '../frontend/src/screens/Arrange/Arrange2';
import MatchPrompts from '../frontend/src/screens/Arrange/MatchPrompts';
import Introductions from '../frontend/src/screens/Setup/AnsweredChats';
import Profile from '../frontend/src/screens/Profile/Profile';
import Details from '../frontend/src/screens/Profile/Details';

const pair = { user1: profiles[0], user2: profiles[1] };
const screens = {
  browse: [Source, {}],
  matches: [Arrange, { route: { params: { card: profiles[0] } } }],
  compare: [Compare, { route: { params: { ...pair, similarityScore: matches[0].similarity_score, complementaryScore: matches[0].complementarity_score } } }],
  icebreaker: [MatchPrompts, { route: { params: pair } }],
  introductions: [Introductions, {}],
  profile: [Profile, {}],
  responses: [Details, { navigation: { goBack() {} } }],
};
const name = new URLSearchParams(window.location.search).get('screen');
const [Component, props] = screens[name] || screens.browse;
createRoot(document.getElementById('preview')).render(<View style={{ flex: 1, width: '100%', height: '100%' }}><Component {...props} /></View>);
document.documentElement.dataset.screen = Object.hasOwn(screens, name) ? name : 'browse';
