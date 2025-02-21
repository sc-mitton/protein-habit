const { withInfoPlist } = require("@expo/config-plugins");

module.exports = function withNoIPadSupport(config) {
  return withInfoPlist(config, (config) => {
    config.modResults["UISupportedInterfaceOrientations~ipad"] = [];
    return config;
  });
};
