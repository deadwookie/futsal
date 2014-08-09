var gulp = require('gulp');
var gutil = require('gulp-util');
var prettyHrtime = require('pretty-hrtime');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var exorcist = require('exorcist');
var uglify = require('gulp-uglify');

var taskname = require('path').basename(__filename, '.js');
var config = gulp.config.get(taskname);

gulp.task(taskname, function() {
  var to = config.dest.split('/'),
    filename = to.pop(),
    dirname = to.join('/');

  var bundleMethod = config.watch ? watchify : browserify;
  var logLabel = config.watch ? 'Watchify' : 'Browserify';

  var bundler = bundleMethod({
    entries: config.src,
    extensions: config.extentions,
    debug: config.debug
  });

  config.transform && [].concat(config.transform).forEach(function(tr) {
    bundler.transform(tr);
  });

  var bundle = function(files) {
    var startTime = process.hrtime(),
      stream;
    gutil.log(logLabel + ' build', files ? 'due to changes in ' + gutil.colors.magenta(files) : '...');

    // Note: if you use browserify>5, you don't have to pass debug to .bundle()
    // Otherwise see https://github.com/substack/node-browserify/tree/4.2.3
    stream = bundler.bundle({debug: config.debug})
      .on('error', function() {
        gutil.log(gutil.colors.red(logLabel + ' Error'), arguments);
      });

    if (config.debug && config.sourceMap) {
      stream = stream.pipe(exorcist(config.sourceMap));
    }

    stream = stream.pipe(source(filename));

    if (!config.debug) {
      stream = stream
        .pipe(buffer())
        .pipe(uglify());
    }

    stream = stream.pipe(gulp.dest(dirname))
      .on('end', function() {
        var taskTime = prettyHrtime(process.hrtime(startTime));
        gutil.log(logLabel + ' build is done in', gutil.colors.cyan(taskTime));
      });

    return stream;
  };

  if (config.watch) {
    // Rebundle with watchify on changes.
    bundler.on('update', bundle);
  }

  return bundle();
});
