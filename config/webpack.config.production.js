/**
 * Build config for electron 'Renderer Process' file
 */

const appPaths = require("./appPaths");
const merge = require("webpack-merge");
const baseConfig = require("./webpack.config.base");
// Plugins
const HtmlWebpackPlugin = require("html-webpack-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
	.BundleAnalyzerPlugin;

module.exports = merge(baseConfig, {
	target: "electron-renderer",
	entry: { index: appPaths.appSrcIndex },
	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/,
				enforce: "pre",
				loader: require.resolve("tslint-loader"),
				options: {
					typeCheck: true,
					emitErrors: true
				},
				include: appPaths.appSrc
			},
			{
				test: /\.(js|jsx)$/,
				enforce: "pre",
				loader: require.resolve("eslint-loader"),
				options: {
					typeCheck: true,
					emitErrors: true
				},
				include: appPaths.appSrc
			}
		]
	},
	optimization: {
		splitChunks: {
			chunks: "all",
			minSize: 30000,
			maxSize: 140000,
			minChunks: 1,
			maxAsyncRequests: 5,
			maxInitialRequests: 3,
			automaticNameDelimiter: "~",
			name: true,
			cacheGroups: {
				vendors: {
					test: /[\\/]node_modules[\\/]/,
					priority: -10
				},
				default: {
					minChunks: 2,
					priority: -20,
					reuseExistingChunk: true
				}
			}
		},
		minimizer: [
			new UglifyJSPlugin({
				parallel: true,
				sourceMap: true,
				cache: true
			})
		]
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

		new BundleAnalyzerPlugin({
			analyzerMode: "static",
			openAnalyzer: false
		})
	]
});
