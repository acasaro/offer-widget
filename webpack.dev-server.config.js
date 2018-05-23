const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
	devtool: 'eval',
	/**
	 * Entry point for the app
	 */
	entry: {
		bundle: [
			'babel-polyfill',
			'webpack-dev-server/client?http://localhost:8080', // WebpackDevServer host and port
			path.join(__dirname, 'src/index.js'),
		],
	},
	devServer: {
		historyApiFallback: true,
		contentBase: './src',
		port: 9090,
		host: 'localhost',
	},
});
