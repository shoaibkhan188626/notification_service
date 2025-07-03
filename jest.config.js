export default {
  transform: {
    '^.+\.js$': 'babel-jest',
  },
  testTimeout: 30000, // Set a higher timeout for tests
};
