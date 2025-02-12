const { withInfoPlist } = require("@expo/config-plugins");

const withAsyncStorageBackup = (config) => {
  return withInfoPlist(config, (config) => {
    config.modResults.RCTAsyncStorageExcludeFromBackup = false;
    return config;
  });
};

module.exports = withAsyncStorageBackup;
