import { build } from 'esbuild';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

// Shared by review captures and the public walkthrough. Native services stay offline.
export function bundlePreview(entry, options = {}) {
  return build({
    entryPoints: [entry], bundle: true, write: false, format: 'iife',
    loader: { '.js': 'jsx', '.png': 'dataurl' }, nodePaths: [join(here, 'node_modules')],
    define: { 'process.env.NODE_ENV': '"production"', '__DEV__': 'false' },
    plugins: [{ name: 'offline-native-adapters', setup(builder) {
      builder.onResolve({ filter: /^(react-native|react-native-gesture-handler|react-native-animatable)$/ }, () => ({ path: join(here, 'native.jsx') }));
      builder.onResolve({ filter: /^(react-native-vector-icons\/|react-native-elements$|@react-navigation\/native$|expo-linear-gradient$|expo-image-picker$|aws-amplify$|@aws-amplify\/core$)/ }, () => ({ path: join(here, 'adapters.jsx') }));
      builder.onResolve({ filter: /context\/(Auth|Onboard)Context$/ }, () => ({ path: join(here, 'adapters.jsx') }));
    }}],
    ...options,
  });
}
