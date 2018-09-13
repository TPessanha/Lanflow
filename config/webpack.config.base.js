/**
 * Base webpack config used across other specific configs
 */

const appPaths = require("./appPaths");
// Plugins
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const NODE_ENV = process.env.NODE_ENV || "production";

module.exports = {
	mode: NODE_ENV,
	devtool: "source-map",
	bail: true,
	//stats: {  },
	resolve: {
		extensions: [
			".ts",
			".tsx",
			".js",
			".jsx",
			".web.ts",
			".web.tsx",
			".web.js",
			".web.jsx",
			".json"
		],
		alias: {
			// Support React Native Web
			// https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
			"react-native": "react-native-web"
		},
		modules: [appPaths.appNodeModules]
	},
	output: {
		path: appPaths.appDist,
		filename: "static/js/[name].[chunkhash:8].js",
		chunkFilename: "static/js/[name].[chunkhash:8].chunk.js",
		libraryTarget: "commonjs2"
	},
	module: {
		rules: [
			{
				oneOf: [
					{
						test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
						use: {
							loader: require.resolve("url-loader"),
							options: {
								limit: 10000,
								mimetype: "application/font-woff"
							}
						}
					},
					{
						test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
						use: {
							loader: require.resolve("url-loader"),
							options: {
								limit: 10000,
								mimetype: "application/octet-stream"
							}
						}
					},
					{
						test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
						use: {
							loader: require.resolve("url-loader"),
							options: {
								limit: 10000,
								mimetype: "image/svg+xml",
								name: "static/media/[name].[hash:8].[ext]"
							}
						}
					},
					{
						test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
						use: {
							loader: require.resolve("url-loader"),
							options: {
								limit: 10000,
								name: "static/media/[name].[hash:8].[ext]"
							}
						}
					},
					{
						test: /\.json$/,
						loader: require.resolve("json-loader"),
						include: appPaths.appSrc
					},
					{
						test: /\.tsx?$/,
						use: [
							{
								loader: require.resolve("ts-loader"),
								options: {
									transpileOnly: true,
									compilerOptions: {
										noEmit: false
									}
								}
							}
						],
						include: appPaths.appSrc
					},
					{
						test: /\.jsx?$/,
						use: [
							{
								loader: require.resolve("babel-loader"),
								options: {
									compact: true
								}
							}
						],
						include: appPaths.appSrc
					},
					{
						test: /\.(scss|sass|css|less)$/,
						use: [
							// Ceates a separate CSS file
							NODE_ENV === "production"
								? MiniCssExtractPlugin.loader
								: require.resolve("style-loader"),
							{
								loader: require.resolve("css-loader"),
								options: {
									minimize:
										NODE_ENV === "production"
											? true
											: false,
									sourceMap: true
								}
							},
							{
								loader: require.resolve("postcss-loader"),
								options: {
									plugins: () => [require("autoprefixer")],
									sourceMap: true
								}
							},
							{
								// Turns Sass into CSS
								loader: require.resolve("sass-loader"),
								options: {
									sourceMap: true
								}
							}
						],
						include: appPaths.appSrc
					},
					//HAS TO BE LAST
					// "file" loader makes sure those assets get served by WebpackDevServer.
					// When you `import` an asset, you get its (virtual) filename.
					// In production, they would get copied to the `build` folder.
					// This loader doesn't use a "test" so it will catch all modules
					// that fall through the other loaders.
					{
						loader: require.resolve("file-loader"),
						// Exclude `js` files to keep "css" loader working as it injects
						// it's runtime that would otherwise processed through "file" loader.
						// Also exclude `html` and `json` extensions so they get processed
						// by webpacks internal loaders.
						exclude: [
							/\.(js|jsx|ts|tsx|mjs|html|json|ejs|scss|less|sass|css)$/
						],
						options: {
							name: "static/media/[name].[hash:8].[ext]"
						}
					}
				]
			}
		]
	},
	performance: {
		hints: NODE_ENV === "production" ? "error" : false,
		assetFilter: function(assetFilename) {
			return (
				assetFilename.endsWith(".js") || assetFilename.endsWith(".css")
			);
		}
	},
	node: {
		__dirname: false,
		__filename: false
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: "static/css/[name].[contenthash:8].css",
			chunkFilename: "static/css/[id].[contenthash:8].css"
		})
	]
};
