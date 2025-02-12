const { AndroidConfig, withAndroidManifest } = require("@expo/config-plugins");

const withAndroidBackup = (config) => {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults;

    // Find <application> and modify it
    const application =
      AndroidConfig.Manifest.getMainApplicationOrThrow(manifest);
    application.$["android:allowBackup"] = "true"; // Change to "false" to disable backup
    application.$["android:fullBackupContent"] = "@xml/backup_rules"; // Points to custom rules

    return config;
  });
};

module.exports = withAndroidBackup;
