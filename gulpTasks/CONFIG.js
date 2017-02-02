const build = './build';
const src = './source';

module.exports = {
  build: build,
  src: src,

  img: {
    src: [src + '/img-source/**/*.png', src + '/img-source/**/*.jpg', src + '/img-source/**/*.svg'],
    dest: build + '/img',
    opti: src + '/img/',
    optiSrc: [src + '/img/**/*', `!${src}/img/sprite/**/*`, `!${src}/img/svgSprite/**/*`],
  },

  fonts: {
    src: src + '/fonts/**/*',
    dest: build + '/fonts'
  },

  js: {
    src: src + '/js/**/*.js',
    dest: build + '/js',
    watch:  build + '/js/*.js'
  },

  browserSync: {
    server: {
      baseDir: build
    },
    port: 1981
  },

  svgSprite: {
    svg: src + '/img/svgSprite/*.svg',
    js: src + '/img-source/svgSprite/svg-sprite-template.js',
    scss: src + '/img-source/svgSprite/svg-sprite-template.scss'
  },

  html: {
    src: src + '/templates/*.nunj',
    watch: src + '/templates/**/*.nunj',
    dest: build
  },

  toRoot: {
    src: [src + '/toRoot/**/*', src + '/img-source/favicon/favicon.ico'],
    dest: build
  },

  scss: {
    src: src + '/scss/*.scss',
    watch: src + '/scss/**/*.scss',
    vendor: src + '/vendor/**/*.scss',
    check: [src + '/scss/main.scss'],
    dest: build + '/css'
  },
  autoprefixer: ['last 2 versions', 'ie >= 9','Android >= 4.1', 'Safari >= 8', 'iOS >= 7']
};
