var gulp = require('gulp');
var gutil = require('gulp-util');
var nodemon = require('gulp-nodemon');

var taskname = require('path').basename(__filename, '.js');
var config = gulp.config.get(taskname);

gulp.task(taskname, function() {
  return nodemon(config)
    // .on('change', function() {
    //   // Do you want to compile something?
    // })
    .on('restart', function (files) {
      gutil.log('Restart node', files ? 'to changes in ' + gutil.colors.magenta(files) : '');
    });
});
