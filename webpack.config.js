const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTemplate = require('html-webpack-template');
const path = require('path');

const config = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: 'bundle.js',
	},
	devtool: 'cheap-module-source-map',
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				use: 'babel-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
			},
		],
	},
	resolve: {
		extensions: ['.js', '.jsx'],
	},
	plugins: [
		new HtmlWebpackPlugin({
			inject: false,
			template: HtmlWebpackTemplate,
			appMountId: 'app',
		}),
	],
};

module.exports = config;