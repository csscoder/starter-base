const build = './build';
const src = './source';

module.exports = {
  build: build,
  src: src,

  img: {
    src: [src + '/img/**/*'],
    dest: build + '/img'
  },

  fonts: {
    src: src + '/fonts/**/*',
    dest: build + '/fonts'
  },

  js: {
    src: src + '/js/**/*.js',
    dest: build + '/js'
  },

  html: {
    src: src + '/templates/*.nunj',
    watch: src + '/templates/**/*.nunj',
    dest: build
  },

  toRoot: {
    src: [src + '/toRoot/**/*', src + '/img/favicon/favicon.ico'],
    dest: build
  },

  sass: {
    src: src + '/sass/*.scss',
    watch: src + '/sass/**/*.scss',
    vendor: src + '/vendor/**/*.scss',
    check: [src + '/sass/**/*.scss'],
    dest: build + '/css'
  },
  autoprefixer: ['> 1%', 'last 2 versions', 'Firefox ESR', 'ie >= 9', 'Opera 12.1', 'iOS 7']
};
