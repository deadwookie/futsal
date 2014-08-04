var gulp = require('gulp');
var gutil = require('gulp-util');
var prettyHrtime = require('pretty-hrtime');
var browserify = require('browserify');
var watchify = require('watchify');
var vinyl = require('vinyl-source-stream');

var taskname = require('path').basename(__filename, '.js');
var config = gulp.config.get(taskname);

gulp.task(taskname, function() {
  var to = config.dest.split('/'),
    toFile = to.pop(),
    toDir = to.join('/');

  var bundleMethod = config.watch ? watchify : browserify;

  var bundler = bundleMethod({
    // Specify the entry point of your app
    entries: [config.src],
    // Add file extentions to make optional in your requires
    extensions: config.extentions,
    // Enable source maps!
    debug: config.debug
  });

  var bundle = function(files) {
    var startTime = process.hrtime();
    gutil.log('Browserify build', files ? 'due to changes in ' + gutil.colors.magenta(files) : '...');

    return bundler
      .bundle()
      // Report compile errors
      .on('error', function() {
        gutil.log(gutil.colors.red('Browserify Error'), arguments);
      })
      // Use vinyl-source-stream to make the
      // stream gulp compatible. Specifiy the
      // desired output filename here.
      .pipe(vinyl(toFile))
      // Specify the output destination
      .pipe(gulp.dest(toDir))
      // Log when bundling completes!
      // .on('end', bundleLogger.end);
      .on('end', function() {
        var taskTime = prettyHrtime(process.hrtime(startTime));
        gutil.log('Browserify build is done in', gutil.colors.cyan(taskTime));
      });
  };

  if (config.watch) {
    // Rebundle with watchify on changes.
    bundler.on('update', bundle);
  }

  return bundle();
});
