const { getDefaultConfig } = require('@expo/metro-config');
const { mergeConfig } = require("@react-native/metro-config")
/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    unstable_enablePackageExports: true,
    sourceExts: ['jsx', 'js', 'ts', 'tsx', 'cjs', 'json', 'wasm', 'mjs'],
  }
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);