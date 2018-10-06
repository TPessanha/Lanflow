/**
 * Build config for electron 'Main Process' file
 */

const merge = require("webpack-merge");
const baseConfig = require("./webpack.config.base");
const appPaths = require("./appPaths");
// Plugins
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");

const smp = new SpeedMeasurePlugin();

//Should we run speed-measure-webpack-plugin
const speedReport = require("minimist")(process.argv.slice(2)).buildSpeedReport;

const webpackConfig = merge(baseConfig, {
	devtool: "source-map",
	entry: { "app.min": appPaths.appSrcMain },
	plugins: [],
	output: {
		filename: "[name].js",
		chunkFilename: "[id].chunk.js"
	},
	target: "electron-main"
});

module.exports = speedReport ? smp.wrap(webpackConfig) : webpackConfig;
