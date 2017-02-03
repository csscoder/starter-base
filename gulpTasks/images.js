// images
const config = require('./CONFIG');

import gulp from 'gulp';
import newer from 'gulp-newer';
import cache from 'gulp-cache';
import imagemin from 'gulp-imagemin';
import pngquant from 'imagemin-pngquant';
import jpegoptim from 'imagemin-jpegoptim';
import debug from 'gulp-debug';


gulp.task('img-optymize', function () {
  return gulp.src(config.img.src)
    .pipe(newer(config.img.opti))
    .pipe(debug({'title':' image'}))
    .pipe(cache(imagemin({
      removeViewBox: true,
      cleanupAttrs: true,
      addAttributesToSVGElement: true,
      progressive: true,
      verbose: true,
      interlaced: true,
      optimizationLevel: 4,
      use: [
        pngquant({quality: '97', speed: 4}),
        jpegoptim({ progressive: true, max: 80 })
      ]
    })))
    .pipe(gulp.dest(config.img.opti));
});

gulp.task('img-to-build', function() {
  return gulp.src(config.img.optiSrc)
    .pipe(gulp.dest(config.img.dest));
});