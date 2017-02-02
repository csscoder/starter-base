import del from 'del';
import gulp from 'gulp';
import cache from 'gulp-cache';
import runSequence from 'run-sequence';

const config = require('./CONFIG');

gulp.task('remove-files', function (cb) {
  return del([config.build, config.img.opti, config.src+'/scss/common/svg-sprite-template.scss'], cb);
});

gulp.task('clear-cache', function (done) {
  return cache.clearAll(done);
});

gulp.task('del', () => {
  return runSequence(
    [
      'remove-files',
      'clear-cache'
    ]
  );
});
