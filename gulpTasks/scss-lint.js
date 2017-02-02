// check code
//******************************************
const mainConfig = require('./CONFIG');

const stylelintConfig = require('../.stylelintConfig.js');
const listSelectorPlugin = require('list-selectors').plugin;
import gulp from 'gulp';
import sass from 'gulp-sass';

import stylelint from 'stylelint';
import reporter from 'postcss-reporter';
import sassGlob from 'gulp-sass-glob';

import postcssGulp from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import runSequence from 'run-sequence';
import lost from 'lost';
import customProperties from 'postcss-custom-properties';

import jsonfile from 'jsonfile';


let postCSS = [lost, autoprefixer({browsers: mainConfig.autoprefixer}), customProperties() , listSelectorPlugin({include: ['ids','selectors', 'classes']}, selectorsToConsole)];

gulp.task('scss-selectors', () => {

  return gulp.src(mainConfig.scss.check)
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(postcssGulp(postCSS));
});

function selectorsToConsole(selectors) {
  jsonfile.writeFile('./source/lint-result/list-selectors.json', selectors, {spaces: 2}, function(err) {
    console.error(err);
  });
}

let checkConfig = [
  lost,
  autoprefixer({browsers: mainConfig.autoprefixer}),
  stylelint(stylelintConfig),
  reporter({
    clearReportedMessages: true,
    clearAllMessages: true
  })
];

gulp.task('scss-lint', () => {
  return gulp.src(mainConfig.scss.check)
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(postcssGulp(checkConfig))
    .pipe(gulp.dest('./source/lint-result/'));
});

gulp.task('css-lint', () => {
  return runSequence(
    [
      'scss-selectors',
      'scss-lint'
    ]
  );
});

