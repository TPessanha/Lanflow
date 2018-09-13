/**
 * Build config for electron 'Main Process' file
 */

const merge = require("webpack-merge");
const baseConfig = require("./webpack.config.base");
const appPaths = require("./appPaths");

module.exports = merge(baseConfig, {
	devtool: "source-map",
	entry: { "app.min": appPaths.appSrcMain },
	plugins: [],
	output: {
		filename: "[name].js",
		chunkFilename: "[id].chunk.js"
	},
	target: "electron-main"
});
