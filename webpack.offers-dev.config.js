const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {
	devtool: 'cheap-module-source-map',
	/**
	 * Entry point for the app
	 */
	entry: {
		offers: [path.join(__dirname, 'src/index.offers.js')],
	},
	output: {
		libraryTarget: 'var',
		library: 'MyOptumOffers',
		path: path.resolve(__dirname, 'dist/develop'),
		publicPath: '/dist/develop',
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('development'),
			},
		}),
		new webpack.LoaderOptionsPlugin({
			minimize: true,
			debug: false,
		}),
		new webpack.optimize.AggressiveMergingPlugin(),
		new webpack.optimize.UglifyJsPlugin({
			sourceMap: true,
			mangle: { keep_fnames: true },
			compress: { dead_code: true, unused: true },
			comments: false,
		}),
		new CopyWebpackPlugin([{ from: './src/mock-data', to: 'mock-data' }]),
	],
});
