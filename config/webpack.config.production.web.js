/**
 * Build config for electron 'Renderer Process' file
 */
const appPaths = require("./appPaths");
const merge = require("webpack-merge");
const productionConfig = require("./webpack.config.production");
// Plugins
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const SWPrecacheWebpackPlugin = require("sw-precache-webpack-plugin");

module.exports = merge(productionConfig, {
	target: "web",
	output: {
		libraryTarget: "var"
	},
	module: {
		rules: []
	},
	plugins: [
		new HtmlWebpackPlugin({
			inject: false,
			template: appPaths.appSrcHtmlTemplateEjs,
			appMountId: "root",
			mobile: true,
			lang: "en-US",
			title: "My App",
			meta: [
				{
					"http-equiv": "Content-Security-Policy",
					content:
						"default-src 'none'; manifest-src 'self'; style-src 'self' data:; img-src 'self' data:; script-src 'self'; connect-src 'self'; font-src 'self' https://cdn.joinhoney.com;"
				}
			],
			links: [
				{
					href: "/manifest.json",
					rel: "manifest"
				},
				{
					href: "/favicon.ico",
					rel: "shortcut icon"
				}
			],
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeRedundantAttributes: true,
				useShortDoctype: true,
				removeEmptyAttributes: true,
				removeStyleLinkTypeAttributes: true,
				keepClosingSlash: true,
				minifyJS: true,
				minifyCSS: true,
				minifyURLs: true
			}
		}),
		new ManifestPlugin({
			fileName: "asset-manifest.json"
		}),
		new CopyWebpackPlugin([
			{
				from: appPaths.resources + "/*.ico",
				to: appPaths.appDist,
				flatten: true
			},
			{
				from: appPaths.resources + "/*.json",
				to: appPaths.appDist,
				flatten: true
			},
			{
				from: appPaths.resources + "/*.png",
				to: appPaths.appDist,
				flatten: true
			}
		]),

		new SWPrecacheWebpackPlugin({
			cacheId: "tp.ElectronBoilerplate",
			dontCacheBustUrlsMatching: /\.\w{8}\./,
			filename: "service-worker.js",
			minify: true,
			navigateFallback: "./index.html",
			staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/]
		})
	]
});
