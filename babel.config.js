module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo", "@babel/preset-typescript"],
    plugins: [
      ["inline-import", { extensions: [".sql"] }],
      "react-native-paper/babel",
    ],
  };
};
