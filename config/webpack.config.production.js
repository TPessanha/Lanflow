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
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");

const smp = new SpeedMeasurePlugin();
//Should we run speed-measure-webpack-plugin
const speedReport = require("minimist")(process.argv.slice(2)).buildSpeedReport;

const webpackConfig = merge(baseConfig, {
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
			maxSize: 220000,
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
				uglifyOptions: {
					parse: {
						// we want uglify-js to parse ecma 8 code. However we want it to output
						// ecma 5 compliant code, to avoid issues with older browsers, this is
						// whey we put `ecma: 5` to the compress and output section
						// https://github.com/facebook/create-react-app/pull/4234
						ecma: 8
					},
					compress: {
						ecma: 5,
						warnings: false,
						// Disabled because of an issue with Uglify breaking seemingly valid code:
						// https://github.com/facebook/create-react-app/issues/2376
						// Pending further investigation:
						// https://github.com/mishoo/UglifyJS2/issues/2011
						comparisons: false
					},
					mangle: {
						safari10: true
					},
					output: {
						ecma: 5,
						comments: false,
						// Turned on because emoji and regex is not minified properly using default
						// https://github.com/facebook/create-react-app/issues/2488
						ascii_only: true
					}
				},
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
						"default-src 'none'; manifest-src 'self'; style-src 'self' data:; img-src 'self' data:; script-src 'self'; connect-src 'self'; font-src 'self'"
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

module.exports = speedReport ? smp.wrap(webpackConfig) : webpackConfig;
