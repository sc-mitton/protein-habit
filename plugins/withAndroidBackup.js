const {
  withAndroidManifest,
  withDangerousMod,
} = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

const withAndroidBackup = (config) => {
  // Modify AndroidManifest.xml
  config = withAndroidManifest(config, async (config) => {
    const manifest = config.modResults;
    const application = manifest.manifest.application?.[0];

    if (!application) {
      throw new Error("AndroidManifest.xml is missing <application> tag");
    }

    // Ensure attributes object exists
    application.$ = application.$ || {};

    // Set attributes using Object.assign
    Object.assign(application.$, {
      "android:allowBackup": "true",
      "android:fullBackupContent": "@xml/backup_rules",
    });

    return config;
  });

  // Create backup_rules.xml
  config = withDangerousMod(config, [
    "android",
    async (config) => {
      const backupRulesPath = path.join(
        config.modRequest.platformProjectRoot,
        "app/src/main/res/xml/backup_rules.xml",
      );

      const backupRulesContent = `<?xml version="1.0" encoding="utf-8"?>
<data-extraction-rules>
  <cloud-backup>
    <include domain="sharedpref" path="."/>
    <exclude domain="sharedpref" path="device.xml"/>
  </cloud-backup>
</data-extraction-rules>`;

      // Ensure the directory exists
      const dir = path.dirname(backupRulesPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Write the backup_rules.xml file
      fs.writeFileSync(backupRulesPath, backupRulesContent);

      return config;
    },
  ]);

  return config;
};

module.exports = withAndroidBackup;
