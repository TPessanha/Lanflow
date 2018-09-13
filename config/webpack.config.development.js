/**
 * Build config for development process that uses Hot-Module-Replacement
 * https://webpack.github.io/docs/hot-module-replacement-with-webpack.html
 */

const webpack = require("webpack");
const merge = require("webpack-merge");
const baseConfig = require("./webpack.config.base");
const appPaths = require("./appPaths");
//plugins
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");

// const smp = new SpeedMeasurePlugin();

module.exports = merge(baseConfig, {
	devtool: "cheap-module-source-map",
	mode: process.env.NODE_ENV || "development",
	entry: {
		index: appPaths.appSrcIndex
	},

	output: {
		filename: "index.js",
		libraryTarget: "var"
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoEmitOnErrorsPlugin(),
		new HardSourceWebpackPlugin(),
		new HtmlWebpackPlugin({
			inject: false,
			template: appPaths.appSrcHtmlTemplateEjs,
			appMountId: "root",
			mobile: true,
			lang: "en-US",
			title: "My App"
		})
	]
});
