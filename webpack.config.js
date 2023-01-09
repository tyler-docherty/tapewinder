const path = require("path");
const nodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const autoprefixer = require("autoprefixer");

module.exports = {
	entry: ["./functions/js/landing.js", "./functions/js/entry.js", "./functions/scss/app.scss", "./functions/js/material.js"],
	mode: "production",
	target: "web",
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, "static/js"), // eslint-disable-line no-undef
	},
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: [
					{
						loader: "file-loader",
						options: {
							name: "bundle.css",
							outputPath: "../css"
						},
					},
					{loader: "extract-loader"},
					{loader: "css-loader"},
					{
						loader: "postcss-loader",
						options: {
							postcssOptions: {
								plugins: [
									autoprefixer()
								]
							}
						}
					},
					{
						loader: "sass-loader",
						options: {
							implementation: require("sass"),
							webpackImporter: false,
							sassOptions: {
								includePaths: ["./node_modules"]
							}
						}
					}
				]
			},
			{
				test: /\.js$/,
				loader: "babel-loader",
				options: {
					presets: ["@babel/preset-env"]
				}
			}
		]
	},

	plugins: [
		new nodePolyfillPlugin(),
	] 
};