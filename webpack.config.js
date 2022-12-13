const path = require("path");
const nodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const nodeExternals = require("webpack-node-externals");
const HtmlWebpackPugPlugin = require("html-webpack-pug-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	entry: "./functions/frontpage.js",
	mode: "development",
	target: "web",
	resolve: {
		fallback: {
			"fs": false,
			"net": false,
			"tls": false,
			"async_hooks": false,
			"child_process": false
		}
	},
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, "static/js"),
	},
	plugins: [
		new nodePolyfillPlugin(),
		// new HtmlWebpackPugPlugin(),
		// new HtmlWebpackPlugin({
		// 	template: "./functions/index.pug",
		// 	filename: "index.pug"
		// })
	] 
}