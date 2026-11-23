import React from 'react';
import { createRoot } from 'react-dom/client';
import { View } from 'react-native';
import Welcome from '../../frontend/src/screens/Information/Information1';
import Search from '../../frontend/src/screens/Search/Search';
import Introductions from '../../frontend/src/screens/Setup/AnsweredChats';

for (const [id, Component] of [['welcome', Welcome], ['search', Search], ['introductions', Introductions]]) {
  createRoot(document.getElementById(id)).render(<View style={{ flex: 1, width: '100%', height: '100%' }}><Component /></View>);
}
document.documentElement.dataset.preview = 'rendered';
