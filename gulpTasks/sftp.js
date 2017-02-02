// SFTP deploy
//******************************************
import gulp from 'gulp';
const access = require('../.ftpaccess.json');
const pkg = require('../package.json');
import sftp from 'gulp-sftp';

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
