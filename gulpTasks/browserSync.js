import gulp from 'gulp';
import watch from 'gulp-watch';
import runSequence from 'run-sequence';

const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

const config = require('./CONFIG');

// LiveReload
gulp.task('browser', function () {
  browserSync.init(config.browserSync);
});

gulp.task('watch-files', () => {
  global.watch = true;

  // IMAGES
  watch(config.img.src, () => runSequence('img-optymize'));
  watch(config.img.opti, () => runSequence('img-to-build'));
  watch(config.js.src, () => runSequence('jsApp'));
  watch(config.html.watch, () => runSequence('nunjucks'));
  watch(config.scss.watch, () => runSequence('scss'));
  gulp.watch(config.html.dest + '/*.html').on('change', reload);
  gulp.watch(config.html.dest + '/img/**/*').on('change', reload);
  gulp.watch(config.html.dest + '/js/**/*').on('change', reload);
  gulp.watch(config.scss.dest + '/*.css').on('change', reload);

});

