const { src, dest, parallel, watch, series } = require('gulp');
const path = require('path');
const gulpif = require('gulp-if');
const fs = require('fs');
const sourcemaps = require('gulp-sourcemaps');
const data = require('gulp-data');
const browser = require('browser-sync').create();
const gulpSCSS = require('gulp-sass');
const postcssGulp = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const mqpacker = require('css-mqpacker');
const lost = require('lost');
const cssnano = require('cssnano');
const beautify = require('gulp-jsbeautifier');
const include = require("gulp-include");
const nunjucksRender = require('gulp-nunjucks-render');
const rename = require('gulp-rename');
const svgstore = require('gulp-svgstore');
const svgmin = require('gulp-svgmin');
const del = require('del');

const PATH_CONFIG = require('./config/config-path.json');
const TASK_CONFIG = require('./config/config-tasks.json');
const PRODUCTION = (process.env.NODE_ENV === 'production') ? true : false;

// helpers
const projectPath = require('./config/lib/projectPath');
const extend = require('./config/lib/extend');
const pkg = require(projectPath('package.json'));
const moment = require('moment-timezone');
const timeUpdate = moment().tz(pkg.clientTimeZone).format('DD MMM YYYY, HH:mm');

// Start SCSS
// ******************************************
const postCSSConf = [
  lost,
  autoprefixer(TASK_CONFIG.scss.autoPrefixer)
];

//Check allow media Queries pack
if (PRODUCTION && TASK_CONFIG.scss.mediaQueriesPack) {
  postCSSConf.push(mqpacker({ sort: true }));
}
//Check allow minify css
if (PRODUCTION && TASK_CONFIG.scss.minify) {
  postCSSConf.push(cssnano());
}

function scss() {
  return src(projectPath(PATH_CONFIG.src, PATH_CONFIG.scss.src, 'style.scss'))
    .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
    .pipe(gulpSCSS())
    .pipe(postcssGulp(postCSSConf))
    .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
    .pipe(gulpif(PRODUCTION && TASK_CONFIG.scss.beauty, beautify(TASK_CONFIG.scss.beautifyOptions)))
    .pipe(dest(projectPath(PATH_CONFIG.dest, PATH_CONFIG.scss.dest)))
    .pipe(gulpif(!PRODUCTION, browser.stream()));
}

exports.scss = scss;

// END SCSS
// ******************************************

// Start JS
// ******************************************

function js() {

  return src(projectPath(PATH_CONFIG.src, PATH_CONFIG.js.src, PATH_CONFIG.js.app))
    .pipe(include({
      includePaths: [
        projectPath(PATH_CONFIG.src, PATH_CONFIG.js.src),
        projectPath(PATH_CONFIG.src, PATH_CONFIG.blocks),
      ]
    }))
    .on('error', console.log)
    .pipe(gulpif(PRODUCTION && TASK_CONFIG.js.beauty, beautify(TASK_CONFIG.js.beautifyOptions)))
    .pipe(dest(projectPath(PATH_CONFIG.dest, PATH_CONFIG.js.dest)));
}

exports.js = js;

// End JS
// ******************************************


// Start server
// ******************************************

function server() {
  let config = {
    server: PATH_CONFIG.dest,
    injectChanges: true,
    serveStatic: [PATH_CONFIG.dest],
    port: 7777
  };
  browser.init(config);
}

// End server
// ******************************************

// Copy
// ******************************************
function copyStatic() {
  return src(projectPath(PATH_CONFIG.src, PATH_CONFIG.static.src, '**/*'))
    .pipe(dest(projectPath(PATH_CONFIG.dest, PATH_CONFIG.static.dest)));
}

exports.copyStatic = copyStatic;

function copyFonts() {
  return src(projectPath(PATH_CONFIG.src, PATH_CONFIG.fonts.src, '**/*'))
    .pipe(dest(projectPath(PATH_CONFIG.dest, PATH_CONFIG.fonts.dest)));
}

exports.copyFonts = copyFonts;

function copyImg() {
  return src(projectPath(PATH_CONFIG.src, PATH_CONFIG.img.src, '**/*'))
    .pipe(dest(projectPath(PATH_CONFIG.dest, PATH_CONFIG.img.dest)));
}

exports.copyImg = copyImg;

function copyVendor() {
  return src(projectPath(PATH_CONFIG.src, PATH_CONFIG.vendor.src, '**/*'))
    .pipe(dest(projectPath(PATH_CONFIG.dest, PATH_CONFIG.vendor.dest)));
}

exports.copyVendor = copyVendor;

// End copy
// ******************************************


// Start HTML
// ******************************************
function html() {

  const dataFunction = function () {
    const dataPath = projectPath(PATH_CONFIG.src, PATH_CONFIG.html.dataGlobalFile);
    let dataFromFiles = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    let dataForInfoPage = {
      globalTimeBuild: timeUpdate,
      globalTimeZone: pkg.clientTimeZone,
      globalTitle: pkg.title,
      globalStartDate: pkg.startDate
    };
    return extend(dataFromFiles, dataForInfoPage);
  };

  return src(projectPath(PATH_CONFIG.src, PATH_CONFIG.html.src, '*.nunj.html'))
    .pipe(data(dataFunction))
    .pipe(nunjucksRender({
      path: [
        projectPath(PATH_CONFIG.src, PATH_CONFIG.blocks),
        projectPath(PATH_CONFIG.src, PATH_CONFIG.html.src)
      ]
    }))
    .pipe(gulpif(PRODUCTION, beautify(TASK_CONFIG.html.beautifyOptions)))
    .pipe(rename(function (path) {
      path.basename = path.basename.replace('.nunj', '');
    }))
    .pipe(dest(projectPath(PATH_CONFIG.dest)));
}

exports.html = html;
// End HTML
// ******************************************

// SVG sprite
// ******************************************
function svgSprite() {
  return src(projectPath(PATH_CONFIG.src, PATH_CONFIG.svgSprite.src, '*.svg'))
    .pipe(svgmin(function getOptions(file) {
      let prefix = path.basename(file.relative, path.extname(file.relative));
      return {
        plugins: [{
          cleanupIDs: {
            prefix: prefix + '-',
            minify: true
          }
        }]
      }
    }))
    .pipe(svgstore())
    .pipe(dest(projectPath(PATH_CONFIG.dest, PATH_CONFIG.svgSprite.dest)));
}

exports.svgSprite = svgSprite;
// End SVG sprite
// ******************************************


// Watch
// ******************************************
if (!PRODUCTION) {
  watch([
    PATH_CONFIG.src + PATH_CONFIG.scss.src + '**/*.scss',
    PATH_CONFIG.src + PATH_CONFIG.blocks + '**/*.scss',
  ], { events: ['change', 'add'], delay: 100 }, scss);

  watch([
    PATH_CONFIG.src + PATH_CONFIG.js.src + '*.js',
    PATH_CONFIG.src + PATH_CONFIG.blocks + '**/*.js',
  ], { events: ['change', 'add'], delay: 100 }, js);

  watch([
    PATH_CONFIG.src + PATH_CONFIG.html.src + '*.nunj.html',
    PATH_CONFIG.src + PATH_CONFIG.blocks + '**/*.nunj.html',
  ], { events: ['change', 'add'], delay: 100 }, html);

  watch([
    PATH_CONFIG.dest + PATH_CONFIG.js.dest + '*.js',
    PATH_CONFIG.dest + PATH_CONFIG.html.dest + '*.html',
  ]).on('change', () => browser.reload());
}
// End Watch
// ******************************************

// Clear directory
// ******************************************
function clearBuildDir() {
  return del([
    projectPath(PATH_CONFIG.dest,'**/*')
  ]);
}
exports.clearBuildDir = clearBuildDir;
// End clear directory
// ******************************************

// Complex tasks
// ******************************************
exports.default = series(parallel(html, scss, js, copyStatic, copyVendor, copyFonts, copyImg, svgSprite), server);
exports.build = series( parallel(scss, js, html, copyStatic, copyVendor, copyFonts, copyImg, svgSprite));
