const path = require("path");
const nodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
	entry: ["./functions/js/landing.js", "./functions/js/entry.js"],
	mode: "development",
	target: "web",
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, "static/js"), // eslint-disable-line
	},
	plugins: [
		new nodePolyfillPlugin(),
		// new HtmlWebpackPugPlugin(),
		// new HtmlWebpackPlugin({
		// 	template: "./functions/index.pug",
		// 	filename: "index.pug"
		// })
	] 
};