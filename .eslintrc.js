module.exports = {
  root: true,
  extends: '@react-native-community',
  overrides: [
    {
      files: ['*.webjs'],
      extends: '@formidable-webview/eslint-config-webjs',
    },
  ],
};
