const path = require('path');
const webpack = require('webpack');
const NpmInstallPlugin = require('npm-install-webpack-plugin');
const HappyPack = require('happypack');

export default function makeWebpackConfig({
  watch = true,
  sourcemaps = false,
  debug = false
}) {
  return {
    context: path.resolve(__dirname, 'source'), // указываем относительно какой папки будет идти сборка (контекст запуска)
    // точки входа
    entry: {
      app: './js/app',
      common: './js/common'
    },
    watch,
    debug,
    bail: false,
    profile: true,
    // выходные параметры
    output: {
      path: path.resolve('build'),
      filename: 'js/[name].js',
      chunkFilename: 'js/[id].chunk.js',
      publicPath: ''  // значение где на сервере будут расположены выходные файлы(т.е. относительно чего будут строится пути)
    },
    devtool: sourcemaps ? 'source-map' : null,
    resolve: {
      modulesDirectories: [
        'node_modules'
      ],
      extensions: ['.js', '']
    },
    module: {
      loaders: [{
        test: /\.js$/,
        loader: path.resolve(__dirname, './node_modules/happypack/loader.js'),
        exclude: /node_modules/
      }].filter(loader => loader)
    },
    plugins: [
      new HappyPack({
        loaders: ['babel?presets[]=es2015'],
        threads: 4,
        verbose: false,
        cache: true
      }),
      // провайд плагин
      new webpack.ProvidePlugin({
        '$': 'jquery'
      }),
      // для оптимизации указываем точку входа для общих модулей
      new webpack.optimize.CommonsChunkPlugin({
        name: 'common',
        minChunks: 3
      }),
      new webpack.DefinePlugin({
        NODE_ENV: JSON.stringify((debug) ? 'develop' : 'production'),
      })
    ].concat(debug ? [
        new NpmInstallPlugin({saveDev: true}),
        new webpack.HotModuleReplacementPlugin()
      ] : [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}, output: {comments: false}})
      ])
  };
}