// html
//******************************************

const mainConfig = require('./CONFIG');

import gulp from 'gulp';
import runSequence from 'run-sequence';
import changed from 'gulp-changed';
import ip from 'ip';
import plumber from 'gulp-plumber';
import gulpif from 'gulp-if';
import notify from 'gulp-notify';
import moment from 'moment-timezone';
import nunjucksRender from 'gulp-nunjucks-render';
import sourcemaps from 'gulp-sourcemaps';
import debug from 'gulp-debug';
import data from 'gulp-data';
const args = require('yargs').argv;
const pkg = require('../package.json');
const time = moment().tz(pkg.clientTimeZone).format('DD MMM YYYY, HH:mm');

const browserSync = require('browser-sync').create();
const reload = browserSync.reload;



gulp.task('nunjucks', () => {

  gulp.src(mainConfig.html.src)
    .pipe(changed(mainConfig.html.dest, {extension: '.html'}))
    .pipe(debug({'title':' NUNJ templage'}))

    .pipe(gulpif(args.dev, plumber({errorHandler: notify.onError('Error: <%= error.message %>')})))
    .pipe(data({
      time: time,
      timeZone: pkg.clientTimeZone,
      project: pkg.title,
      path: '',
      ver: Math.round(+new Date()),
      lang: 'ru',
      urlRepo: pkg.repository.url,
      IP: ip.address(),
      develop: args.dev
    }))
    .pipe(nunjucksRender({
      path: './source/templates'
    }))
    .pipe(gulp.dest(mainConfig.html.dest))
});
