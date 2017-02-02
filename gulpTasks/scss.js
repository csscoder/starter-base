// compile SASS
//******************************************

const mainConfig = require('./CONFIG');

import gulp from 'gulp';
import sass from 'gulp-sass';
import sassGlob from 'gulp-sass-glob';
import browserSync from 'browser-sync';
import plumber from 'gulp-plumber';
const args = require('yargs').argv;
import gulpif from 'gulp-if';
import notify from 'gulp-notify';
import sourcemaps from 'gulp-sourcemaps';

import postcssGulp from 'gulp-postcss';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import mqpacker from 'css-mqpacker';
import cssnano from 'cssnano';
import lost from 'lost';
import sprites from 'postcss-sprites';

const spriteOption = {
  stylesheetPath: mainConfig.scss.dest,
  spritePath: mainConfig.img.dest,
  filterBy: function (image) {
    if (!/sprite\/[a-zA-Z\d\S\s]*\.png$/.test(image.url)) {
      return Promise.reject();
    }
    return Promise.resolve();
  },
  retina: true,
  spritesmith: {
    padding: 50
  },
  hooks: {
    onUpdateRule: function (rule, token, image) {
      let backgroundSizeX = (image.spriteWidth / image.coords.width) * 100;
      let backgroundSizeY = (image.spriteHeight / image.coords.height) * 100;
      let backgroundPositionX = (image.coords.x / (image.spriteWidth - image.coords.width)) * 100;
      let backgroundPositionY = (image.coords.y / (image.spriteHeight - image.coords.height)) * 100;

      backgroundSizeX = isNaN(backgroundSizeX) ? 0 : backgroundSizeX;
      backgroundSizeY = isNaN(backgroundSizeY) ? 0 : backgroundSizeY;
      backgroundPositionX = isNaN(backgroundPositionX) ? 0 : backgroundPositionX;
      backgroundPositionY = isNaN(backgroundPositionY) ? 0 : backgroundPositionY;

      let backgroundImage = postcss.decl({
        prop: 'background-image',
        value: 'url(' + image.spriteUrl + ')'
      });

      let backgroundSize = postcss.decl({
        prop: 'background-size',
        value: backgroundSizeX + '% ' + backgroundSizeY + '%'
      });

      let backgroundPosition = postcss.decl({
        prop: 'background-position',
        value: backgroundPositionX + '% ' + backgroundPositionY + '%'
      });

      let backgroundRepeat = postcss.decl({
        prop: 'background-repeat',
        value: 'no-repeat'
      });

      rule.insertAfter(token, backgroundImage);
      rule.insertAfter(backgroundImage, backgroundPosition);
      rule.insertAfter(backgroundPosition, backgroundSize);
      rule.insertAfter(backgroundRepeat, backgroundRepeat);
    }
  }
};

let postCSS = [lost, autoprefixer({browsers: mainConfig.autoprefixer}), sprites(spriteOption)];

let postCSSCompress = postCSS.concat(mqpacker({sort: true}), cssnano());

gulp.task('scss', (cb) => {
  gulp.src(mainConfig.scss.src)
    .pipe(gulpif(args.dev, plumber({errorHandler: notify.onError('Error: <%= error.message %>')})))
    .pipe(gulpif(args.dev, sourcemaps.init()))
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(gulpif(!args.dev, postcssGulp(postCSSCompress), postcssGulp(postCSS)))
    .pipe(gulpif(args.dev, sourcemaps.write({sourceRoot: './source/scss/'})))
    .pipe(gulp.dest(mainConfig.scss.dest))
    .on('end', function () {
      cb();
    })
    .pipe(gulpif(args.dev, browserSync.reload({stream: true})));
});
