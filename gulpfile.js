// gulp --verbose
// gulp dev
// gulp --compress   (css and js file compress)
// gulp scss-selectors
// gulp scss-lint
// gulp deploy

// core
//******************************************
const gulp = require('gulp');
const data = require('gulp-data');
const fileSize = require('gulp-filesize');
const sourcemaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
const print = require('gulp-print');
const chalk = require('chalk');
const args = require('yargs').argv;
const runSequence = require('run-sequence').use(gulp);
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const sftp = require('gulp-sftp');


const mainConfig = require('./.appConfig');
const pkg = require('./package.json');

// Dev server livereload
//******************************************
const connect = require('gulp-connect');

gulp.task('connect', function () {
  connect.server({
    root: './build',
    port: 1981,
    livereload: true
  });
});

// Clean project
//******************************************
const del = require('del');
gulp.task('del', function (cb) {
  return del([mainConfig.build + '**/*'], cb);
});

// html
//******************************************
//const moment = require('moment');
const moment = require('moment-timezone');
const time = moment().tz(pkg.clientTimeZone).format('DD MMM YYYY, HH:mm');
const swig = require('gulp-swig');
const nunjucksRender = require('gulp-nunjucks-render');

const dataToTemplates = {
  time: time,
  timeZone: pkg.clientTimeZone,
  project: pkg.title,
  path: '',
  ver: Math.round(+new Date()),
  lang: 'ru'
};

gulp.task('nunjucks', () => {
  gulp.src(mainConfig.html.src)
    .pipe(gulpif(args.dev, plumber({errorHandler: notify.onError('Error: <%= error.message %>')})))
    .pipe(data(dataToTemplates))
    .pipe(nunjucksRender({
      path: './source/templates'
    }))
    .pipe(gulp.dest(mainConfig.html.dest))
    .pipe(connect.reload());
});

// compile SASS
//******************************************
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const mqpacker = require('css-mqpacker');
const cssnano = require('cssnano');
const lost = require('lost');

let postCSS = [autoprefixer({browsers: mainConfig.autoprefixer}), lost];
let postCSSCompress = postCSS.concat(mqpacker(), cssnano());

gulp.task('sass', () => {
  gulp.src(mainConfig.sass.src)
    .pipe(gulpif(args.dev, plumber({errorHandler: notify.onError('Error: <%= error.message %>')})))
    .pipe(gulpif(args.dev, sourcemaps.init()))
    .pipe(
      gulpif(
        args.verbose,
        print(function (filePath) {
          return `${chalk.green.bold('Compile file')}  ${chalk.blue.bold(filePath)}`;
        }))
    )
    .pipe(sass())
    .pipe(gulpif(args.compress, postcss(postCSSCompress), postcss(postCSS)))
    .pipe(gulpif(args.dev, sourcemaps.write({sourceRoot: './source/sass/'})))
    .pipe(gulp.dest(mainConfig.sass.dest))
    .pipe(gulpif(args.verbose, fileSize()))
    .pipe(connect.reload());
});

// JavaScripts
//******************************************
const jsLibs = require('./jsLibs.json').libs;
const babel = require('gulp-babel');

gulp.task('jsLibs', () => {
  return gulp.src(jsLibs)
    .pipe(concat('libs.js'))
    .pipe(gulpif(args.compress, uglify()))
    .pipe(gulp.dest(mainConfig.js.dest))
    .pipe(connect.reload());
});

gulp.task('jsApp', () => {
  return gulp.src(mainConfig.js.src)
    .pipe(gulpif(args.dev, plumber({errorHandler: notify.onError('Error: <%= error.message %>')})))
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulpif(args.compress, uglify()))
    .pipe(gulp.dest(mainConfig.js.dest))
    .pipe(connect.reload());
});

// Copy
//******************************************
gulp.task('fonts', () => {
  return gulp.src(mainConfig.fonts.src)
    .pipe(gulp.dest(mainConfig.fonts.dest));
});
gulp.task('img', () => {
  return gulp.src(mainConfig.img.src)
    .pipe(gulp.dest(mainConfig.img.dest));
});
gulp.task('toRoot', () => {
  return gulp.src(mainConfig.toRoot.src)
    .pipe(gulp.dest(mainConfig.toRoot.dest));
});


// dev tasks
//******************************************
gulp.task('watch-files', () => {
  gulp.watch(mainConfig.sass.watch, ['sass']);
  gulp.watch(mainConfig.fonts.src, ['fonts']);
  gulp.watch(mainConfig.img.src, ['img']);
  gulp.watch(mainConfig.js.src, ['jsApp']);
  gulp.watch(mainConfig.toRoot.src, ['toRoot']);
  gulp.watch(mainConfig.html.watch, ['nunjucks']);
});
gulp.task('dev', () => {

  // set to  args.dev
  args.dev = true;
  args.verbose = true;

  return runSequence(
    [
      'nunjucks',
      'fonts',
      'img',
      'toRoot',
      'sass',
      'jsApp',
      'jsLibs'
    ],
    'watch-files',
    'connect'
  );
});

// default task
//******************************************
gulp.task('default', function () {
  args.compress = true;

  return runSequence(
    'del',
    [
      'fonts',
      'img',
      'toRoot',
      'nunjucks',
      'sass',
      'jsLibs',
      'jsApp'
    ]
  );
});

// deploy task
//******************************************
gulp.task('deploy', function () {
  args.compress = true;

  return runSequence(
    'del',
    [
      'fonts',
      'img',
      'toRoot',
      'nunjucks',
      'sass',
      'jsLibs',
      'jsApp'
    ],
    'sftp'
  );
});

// SFTP deploy
//******************************************
const access = require('./.ftpaccess.json');
gulp.task('sftp', function () {
  return gulp.src('./build/**/*')
    .pipe(sftp({
      host: access.host,
      port: access.port,
      user: access.user,
      pass: access.pass,
      remotePath: access.rootPath + pkg.name
    }))
    .on('finish', function () {
      console.log(access.site + pkg.name + '/');
    });
});

// check code
//******************************************
const stylelintConfig = require('./.stylelintConfig.js');
const listSelectorPlugin = require('list-selectors').plugin;
const syntax_scss = require('postcss-scss');
const stylelint = require('stylelint');
const reporter = require('postcss-reporter');
let postCSSSelector = postCSS.concat(listSelectorPlugin(selectorsToConsole));

function selectorsToConsole(selectors) {
  console.log(selectors);
}

gulp.task('scss-selectors', () => {
  return gulp.src(mainConfig.sass.check)
    .pipe(sass())
    .pipe(postcss(postCSSSelector));
});

let checkConfig = [
  stylelint(stylelintConfig),
  reporter({
    clearReportedMessages: true,
    clearAllMessages: true
  })
];

gulp.task('scss-lint', () => {
  return gulp.src(mainConfig.sass.check)
    .pipe(postcss(checkConfig, {syntax: syntax_scss}));
});

