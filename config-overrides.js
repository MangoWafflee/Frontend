const {
  override,
  addWebpackAlias,
} = require('customize-cra');
const path = require('path');

module.exports = override(
  addWebpackAlias({
    fs: path.resolve(__dirname, 'src/empty-module.js'),
  })
);
