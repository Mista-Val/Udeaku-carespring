const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    mode: isProduction ? 'production' : 'development',
    target: 'web',
    entry: {
      main: './public/js/main.js',
    },
    output: {
      filename: 'js/[name].bundle.js',
      path: path.resolve(__dirname, 'public'),
      clean: false, // Don't clean to preserve existing CSS
      publicPath: '/',
      chunkFormat: 'array-push',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.css$/i,
          use: [
            isProduction ? 'style-loader' : 'style-loader', // Keep using style-loader for now
            'css-loader',
          ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'images/[name][ext]',
          },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: 'index.html',
        chunks: ['main'],
      }),
      new HtmlWebpackPlugin({
        template: './public/about.html',
        filename: 'about.html',
        chunks: ['main'],
      }),
      new HtmlWebpackPlugin({
        template: './public/projects.html',
        filename: 'projects.html',
        chunks: ['main'],
      }),
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
      },
      compress: true,
      port: 3001,
      hot: true,
      historyApiFallback: true,
      proxy: [
        {
          context: ['/api'],
          target: 'http://localhost:5001',
          secure: false,
          changeOrigin: true
        }
      ],
      headers: {
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://maps.googleapis.com https://www.youtube.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data: https:; connect-src 'self' https://api.udeakucarespringsupportfoundation.org http://localhost:5001; frame-src 'self' https://www.google.com https://maps.google.com https://www.youtube.com https://player.vimeo.com;"
      }
    },
    devtool: isProduction ? false : 'source-map',
  };
};
