const path = require("path");
const nodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
	entry: {
		main: "./functions/js/landing.js"
	},
	mode: "development",
	target: "web",
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