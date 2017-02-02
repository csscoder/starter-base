// Copy
//******************************************
import gulp from 'gulp';
const config = require('./CONFIG');
import runSequence from 'run-sequence';

gulp.task('fonts', () => {
  return gulp.src(config.fonts.src)
    .pipe(gulp.dest(config.fonts.dest));
});

gulp.task('toRoot', () => {
  return gulp.src(config.toRoot.src)
    .pipe(gulp.dest(config.toRoot.dest));
});
gulp.task('toFavicon', () => {
  return gulp.src([config.src + '/img-source/favicon/browserconfig.xml', config.src + '/img-source/favicon/manifest.json'])
    .pipe(gulp.dest(config.build + '/img/favicon/'));
});



gulp.task('copy', () => {
  return runSequence(
    [
      'fonts',
      'toFavicon',
      'toRoot'
    ]
  );
});
