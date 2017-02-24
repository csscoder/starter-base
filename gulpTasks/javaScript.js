// JavaScripts
//******************************************
import gulp from 'gulp';
import path from 'path';
import gulpif from 'gulp-if';
import gutil from 'gulp-util';

import webpack from 'webpack';
import gulpWebpack from 'webpack-stream';
import plumber from 'gulp-plumber';
const notify = require('gulp-notify');
const named = require('vinyl-named');
const uglify = require('gulp-uglify');

const args = require('yargs').argv;

gulp.task('jsApp', function (callback) {

  let firstBuildReady = false;
  let flagCallback = true;

  function done(err, stats) {
    firstBuildReady = true;
    if (err) {
      return;
    }
    console.log('DONE-run');
    gutil.log(stats.hasErrors() ? 'error' : 'info','Hi', stats.toString({colors: true}));
  }

  let options = {
    watch: args.dev,
    output: {
      publicPath: 'js/',
    },
    resolve: {
      modules: [
        'node_modules'
      ]
    },
    devtool: (args.dev) ? 'cheap-module-eval-source-map' : false,
    output: {
      filename: '[name].js',
      chunkFilename: '[id].chunk.js',
      publicPath: ''
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          include: [
            path.resolve(__dirname, '../source/js/')
          ],
          exclude: [
            path.resolve(__dirname, '../node_modules/')
          ],
          loader: 'babel-loader',
          options: {
            presets: ['es2015']
          }
        }
      ]
    },
    plugins: [
      new webpack.ProvidePlugin({
        '$': 'jquery',
        'jQuery': 'jquery',
        'window.jQuery': 'jquery'
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'common',
        minChunks: 3
      }),
      new webpack.DefinePlugin({
        NODE_ENV: JSON.stringify((args.dev) ? 'develop' : 'production')
      }),
      new webpack.NoEmitOnErrorsPlugin()
    ]
  };

  return gulp.src(['./source/js/app.js','./source/js/common.js'])
    .pipe(plumber({
      errorHandler: notify.onError(err => ({
        title: 'Webpack',
        message: err.message
      }))
    }))
    .pipe(named())
    .pipe(gulpWebpack(options, webpack, done))
    .pipe(gulpif(!args.dev, uglify()))
    .pipe(gulp.dest('./build/js/'))
    .on('data', function () {
      if (firstBuildReady && flagCallback && args.dev) {
        flagCallback = false;
        callback();
      }
    });
});
