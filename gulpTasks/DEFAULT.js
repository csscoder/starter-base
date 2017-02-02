import gulp from 'gulp';
import runSequence from 'run-sequence';
const args = require('yargs').argv;

gulp.task('default', () => {

  if (args.dev) {
    return runSequence(
      'img-optymize',
      'img-to-build',
      ['svg-sprites', 'copy'],
      ['scss', 'nunjucks', 'jsApp'],
      'browser',
      'watch-files'
    );
  } else if (args.deploy) {
    // for deploy to SFTP server
    return runSequence(
      'del',
      'img-optymize',
      'img-to-build',
      ['svg-sprites', 'copy'],
      ['scss', 'nunjucks', 'jsApp'],
      'sftp'
    );
  } else {
    // for dev version
    return runSequence(
      'del',
      'img-optymize',
      'img-to-build',
      ['svg-sprites', 'copy'],
      ['scss', 'nunjucks', 'jsApp']
    );
  }

});
