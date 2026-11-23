// Fixed window dimensions for each 374 × 844 content viewport in the capture.
export * from 'react-native-web';
export const Dimensions = {
  get: () => ({ width: 374, height: 844, scale: 1, fontScale: 1 }),
  addEventListener: () => ({ remove() {} }),
};
