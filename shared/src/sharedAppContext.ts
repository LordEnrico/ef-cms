const { v4: uuidv4 } = require('uuid');

const getCognitoLoginUrl = () => {
  if (process.env.COGNITO) {
    return 'https://auth-dev-flexion-efcms.auth.us-east-1.amazoncognito.com/login?response_type=code&client_id=6tu6j1stv5ugcut7dqsqdurn8q&redirect_uri=http%3A//localhost:1234/log-in';
  } else {
    return (
      process.env.COGNITO_LOGIN_URL ||
      'http://localhost:1234/mock-login?redirect_uri=http%3A//localhost%3A1234/log-in'
    );
  }
};

const getEnvironment = () => ({
  dynamoDbTableName: process.env.DYNAMODB_TABLE_NAME,
  stage: process.env.STAGE || 'local',
});

const getPublicSiteUrl = () => {
  return process.env.PUBLIC_SITE_URL || 'http://localhost:5678';
};

const getUniqueId = () => {
  return uuidv4();
};

const clerkOfCourtNameForSigning = 'Stephanie A. Servoss';

module.exports = {
  ERROR_MAP_429: {
    'advanced-query-limiter': {
      message: 'Please wait 1 minute before trying your search again',
      title: 'Search is experiencing high traffic',
    },
    'ip-limiter': {
      message: 'Please wait 1 minute before trying your search again.',
      title: "You've reached your search limit",
    },
    'user-id-limiter': {
      message: 'Please wait 1 minute before trying your search again',
      title: 'Search is experiencing high traffic',
    },
  },
  clerkOfCourtNameForSigning,
  getCognitoLoginUrl,
  getEnvironment,
  getPublicSiteUrl,
  getUniqueId,
};