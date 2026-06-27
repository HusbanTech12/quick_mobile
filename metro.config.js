const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && moduleName === '@stripe/stripe-react-native') {
    return {
      type: 'sourceFile',
      filePath: path.join(__dirname, 'stripe-web-mock.js'),
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
