const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
	output: {
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/dist/',
		filename: '[name].js',
		chunkFilename: '[id].chunk.js',
	},
	context: __dirname,
	resolve: {
		modules: ['node_modules', path.join(__dirname, 'src')],
	},
	stats: {
		errorDetails: true,
		colors: true,
		reasons: true,
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				include: [path.join(__dirname, 'src')],
				use: [
					{
						loader: 'babel-loader',
						options: {
							plugins: ['react-hot-loader/babel'],
						},
					},
				],
			},
			{
				test: /\.(css|scss)$/,
				loader: ['style-loader', 'css-loader', 'sass-loader'],
			},
			{ test: /\.html$/, use: 'html-loader' },
			{ test: /\.woff(2)?(\?v=[0-9].[0-9].[0-9])?$/, loader: 'url-loader?mimetype=application/font-woff' },
			{ test: /\.(ttf|eot|svg)(\?v=[0-9].[0-9].[0-9])?$/, loader: 'file-loader?name=[name].[ext]' },
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index-bundle-test.html',
			chunksSortMode: 'dependency',
			inject: false,
		}),
		new CopyWebpackPlugin([{ from: './src/fonts', to: 'fonts/' }]),
	],
};
