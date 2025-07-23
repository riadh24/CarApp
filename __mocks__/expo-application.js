module.exports = {
  getApplicationNameAsync: () => Promise.resolve('Test App'),
  getApplicationIdAsync: () => Promise.resolve('com.test.app'),
  getInstallationTimeAsync: () => Promise.resolve(Date.now()),
  getLastUpdateTimeAsync: () => Promise.resolve(Date.now()),
};
