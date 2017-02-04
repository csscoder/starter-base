// SVG Symbols
//******************************************
const config = require('./CONFIG');
import gulp from 'gulp';
import svgSymbols from 'gulp-svg-symbols';
import path from 'path';
import filter from 'gulp-filter';
import babel from 'gulp-babel';

gulp.task('svg-sprites', function () {

  const jsFilter = filter('*.js', {restore: true});
  const scssFilter = filter('*.scss');

  return gulp.src(config.svgSprite.svg)
    .pipe(svgSymbols({
      svgClassname: 'svg-sprite',
      className: '.svg-%f',
      id: 'svg-%f',
      templates: [
        path.join(__dirname, '../'+config.svgSprite.scss),
        path.join(__dirname, '../'+config.svgSprite.js)
      ]
    }))
    .pipe(jsFilter)
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest(config.js.dest))
    .pipe(jsFilter.restore)
    .pipe(scssFilter)
    .pipe(gulp.dest(config.src+'/scss/common/'));
});
