module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'babel-plugin-inline-import',
      {
        extensions: ['.svg'],
      },
    ],
    ['module:react-native-dotenv'],
    'react-native-reanimated/plugin',
  ],
};
