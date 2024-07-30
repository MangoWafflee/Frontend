const { override, addWebpackAlias } = require("customize-cra");
const path = require("path");
const WorkboxPlugin = require('workbox-webpack-plugin');

const addWorkbox = () => config => {
  config.plugins.push(
    new WorkboxPlugin.InjectManifest({
      swSrc: './src/service-worker.js', // 서비스 워커 파일의 경로
      swDest: 'service-worker.js',
    })
  );
  return config;
};

module.exports = override(
  addWorkbox()
);