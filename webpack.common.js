const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: [
    './src/front/js/index.js'
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(css|scss)$/, use: [{
          loader: "style-loader" // crea nodos de estilo desde cadenas JS
        }, {
          loader: "css-loader" // traduce CSS a CommonJS
        }]
      }, // solo archivos css
      {
        test: /\.(png|svg|jpg|gif|jpeg|webp)$/, use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'images/', // guarda las imágenes en una carpeta llamada 'images'
            publicPath: '/images/' // ruta pública para acceder a las imágenes
          }
        }
      }, // para imágenes
      { test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/, use: ['file-loader'] } // para fuentes
    ]
  },
  resolve: {
    extensions: ['*', '.js']
  },
  plugins: [
    new HtmlWebpackPlugin({
      favicon: '4geeks.ico',
      template: 'template.html',
      filename: 'template.html'
    }),
    new Dotenv({ safe: true, systemvars: true })
  ]
};